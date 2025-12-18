/**
 * import_songs.js – FINAL VERSION
 * Usage:
 * node import_songs.js "Taylor Swift" 5 "love,folklore" <USER_ID>
 */

import axios from "axios";
import dotenv from "dotenv";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

/* ======================================================
   SUPABASE CLIENT (SERVICE ROLE – BYPASS RLS)
====================================================== */
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
);

/* ======================================================
   UTILS
====================================================== */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const genId = (input) =>
    crypto.createHash("sha1").update(String(input)).digest("hex");

/* ======================================================
   STORAGE UPLOAD
====================================================== */
async function uploadFile(bucket, path, buffer, contentType) {
    const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
        contentType,
        upsert: true,
    });

    if (error) {
        console.error(`❌ Upload failed ${bucket}/${path}`, error.message);
        return null;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
}

/* ======================================================
   LYRICS
====================================================== */
async function fetchLyrics(artist, title) {
    try {
        const { data } = await axios.get("https://lrclib.net/api/get", {
            params: { artist_name: artist, track_name: title },
        });
        return {
            plain: data.plainLyrics || "",
            synced: data.syncedLyrics || "",
        };
    } catch {
        return { plain: "", synced: "" };
    }
}

/* ======================================================
   ITUNES SEARCH
====================================================== */
async function searchItunes(term, limit = 5) {
    const { data } = await axios.get("https://itunes.apple.com/search", {
        params: { term, media: "music", entity: "song", limit },
    });

    return data.results
        .map((i) => ({
            title: i.trackName,
            artist: i.artistName,
            album: i.collectionName || "Single",
            image_url: (i.artworkUrl100 || "").replace("100x100", "512x512"),
            audio_url: i.previewUrl,
            duration_ms: i.trackTimeMillis || 0,
            genre: i.primaryGenreName || "Unknown",
        }))
        .filter((s) => s.audio_url);
}

/* ======================================================
   DB UPSERT
====================================================== */
async function upsertGenre(name) {
    const id = genId(name);
    await supabase.from("genres").upsert({ id, name });
    return id;
}

async function upsertArtist(name, avatar = null, user_id = null) {
    const id = genId(name);
    await supabase.from("artists").upsert({
        id,
        name,
        avatar,
        user_id,
    });
    return id;
}

async function upsertAlbum(title, artistId, coverUrl = null) {
    const id = genId(`${artistId}|${title}`);
    await supabase.from("albums").upsert({
        id,
        title,
        artist_id: artistId,
        cover_url: coverUrl,
    });
    return id;
}

async function upsertSong(song, ids, urls, lyrics, uploadedBy) {
    const id = genId(`${ids.artist}|${song.title}|${ids.album}`);

    const { error } = await supabase.from("songs").upsert({
        id,
        title: song.title,
        artist_id: ids.artist,
        album_id: ids.album,
        genre_id: ids.genre,
        uploaded_by: uploadedBy,
        image_url: urls.cover,
        audio_url: urls.audio,
        duration_ms: song.duration_ms,
        lyrics_plain: lyrics.plain,
        lyrics_synced: lyrics.synced,
    });

    if (error) console.error("❌ Song insert error:", error.message);
}

/* ======================================================
   IMPORT LOGIC
====================================================== */
async function importSongs(songs, uploadedBy, keywords = []) {
    console.log(`⏳ Importing ${songs.length} song(s)...`);

    for (const s of songs) {
        const text = `${s.title} ${s.artist} ${s.album} ${s.genre}`.toLowerCase();
        if (keywords.length && !keywords.some((k) => text.includes(k))) continue;

        console.log(`🎵 ${s.artist} - ${s.title}`);

        try {
            const lyrics = await fetchLyrics(s.artist, s.title);
            await sleep(150);

            /* Upload cover */
            let coverUrl = null;
            if (s.image_url) {
                const coverBuf = (
                    await axios.get(s.image_url, { responseType: "arraybuffer" })
                ).data;

                coverUrl = await uploadFile(
                    "covers",
                    `covers/${genId(s.artist)}_${Date.now()}.jpg`,
                    coverBuf,
                    "image/jpeg"
                );
            }

            /* Upload audio */
            const audioBuf = (
                await axios.get(s.audio_url, { responseType: "arraybuffer" })
            ).data;

            const audioUrl = await uploadFile(
                "songs",
                `songs/${genId(s.artist + s.title)}_${Date.now()}.mp3`,
                audioBuf,
                "audio/mpeg"
            );

            if (!audioUrl) {
                console.warn("⚠️ Skip song (audio upload failed)");
                continue;
            }

            /* DB */
            const genreId = await upsertGenre(s.genre);
            const artistId = await upsertArtist(s.artist, coverUrl);
            const albumId = await upsertAlbum(s.album, artistId, coverUrl);

            await upsertSong(
                s,
                { genre: genreId, artist: artistId, album: albumId },
                { cover: coverUrl, audio: audioUrl },
                lyrics,
                uploadedBy
            );

            await sleep(100);
        } catch (err) {
            console.error("❌ Import error:", err.message);
        }
    }

    console.log("🎉 IMPORT DONE");
}

/* ======================================================
   RUN
====================================================== */
(async () => {
    try {
        const term = process.argv[2] || "lofi";
        const limit = parseInt(process.argv[3] || "5", 10);
        const uploadedBy = process.argv[4] || null;
        const keywords =
            (process.argv[5] || term)
                .split(",")
                .map((k) => k.trim().toLowerCase()) || [];

        console.log(`🔍 Search: "${term}" | Limit: ${limit}`);
        console.log(`🔑 Keywords: ${keywords.join(", ")}`);
        console.log(`👤 Uploaded by: ${uploadedBy}\n`);

        const songs = await searchItunes(term, limit);
        if (!songs.length) {
            console.log("❌ No songs found");
            process.exit(0);
        }

        await importSongs(songs, uploadedBy, keywords);
        process.exit(0);
    } catch (err) {
        console.error("🔥 FATAL ERROR:", err);
        process.exit(1);
    }
})();
