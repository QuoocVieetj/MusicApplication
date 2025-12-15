// import_songs.js — FULL VERSION for Supabase Music App
//node import_songs.js itunes "Hepihepi" 1 

import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";
import supabase from "./config/supabase.esm.js";

dotenv.config();

// ======================================================================
//  Utility
// ======================================================================
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const normalizeId = (str) =>
    String(str || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");

// ======================================================================
//  Lyrics Fetch
// ======================================================================
async function fetchLyrics(artist, title) {
    try {
        const { data } = await axios.get("https://lrclib.net/api/get", {
            params: { artist_name: artist, track_name: title },
        });

        return {
            plain: data.plainLyrics ?? "",
            synced: data.syncedLyrics ?? "",
        };
    } catch {
        console.log(`⚠ Lyrics not found: ${artist} - ${title}`);
        return { plain: "", synced: "" };
    }
}

// ======================================================================
//  Search iTunes API
// ======================================================================
async function searchItunes(term, limit = 25) {
    const { data } = await axios.get("https://itunes.apple.com/search", {
        params: { term, media: "music", entity: "song", limit },
    });

    return data.results
        .map((i) => ({
            source: "itunes",
            source_id: String(i.trackId),
            title: i.trackName ?? "",
            artist: i.artistName ?? "",
            album: i.collectionName ?? "",
            image_url: (i.artworkUrl100 || "").replace("100x100", "512x512"),
            audio_url: i.previewUrl || "",
            duration_ms: i.trackTimeMillis ?? 0,
            genre: i.primaryGenreName ?? "",
        }))
        .filter((s) => !!s.audio_url);
}

// ======================================================================
//  Upload to Storage
// ======================================================================
async function uploadFile(bucket, storagePath, buffer, contentType) {
    console.log(`⬆ Uploading to ${bucket}/${storagePath} ...`);

    const { error } = await supabase.storage
        .from(bucket)
        .upload(storagePath, buffer, {
            contentType,
            upsert: true,
        });

    if (error) {
        console.error("❌ Upload FAILED:", error.message);
        return null;
    }

    return storagePath; // return path only
}

// ======================================================================
//  Upsert Database
// ======================================================================
async function upsertArtist(song) {
    const id = normalizeId(song.artist);
    await supabase.from("artists").upsert({
        id,
        name: song.artist,
        avatar_path: null,
        created_at: new Date().toISOString(),
    });
}

async function upsertGenre(song) {
    const id = normalizeId(song.genre);
    await supabase.from("genres").upsert({
        id,
        name: song.genre,
        created_at: new Date().toISOString(),
    });
}

async function upsertAlbum(song, coverPath) {
    const id = normalizeId(`${song.artist}_${song.album}`);

    await supabase.from("albums").upsert({
        id,
        title: song.album || "Single",
        artist_id: normalizeId(song.artist),
        cover_path: coverPath,
        created_at: new Date().toISOString(),
    });
}

async function upsertSong(song, lyrics, audioPath, coverPath) {
    const id = `${song.source}_${song.source_id}`;

    await supabase.from("songs").upsert({
        id,
        title: song.title,
        artist_id: normalizeId(song.artist),
        album_id: normalizeId(`${song.artist}_${song.album}`),
        genre_id: normalizeId(song.genre),
        audio_path: audioPath,
        cover_path: coverPath,
        duration_ms: song.duration_ms,
        lyrics_plain: lyrics.plain,
        lyrics_synced: lyrics.synced,
        play_count: 0,
        likes: 0,
        created_at: new Date().toISOString(),
    });
}

// ======================================================================
//  Demo User + Playlist
// ======================================================================
async function createDemoUser() {
    await supabase.from("users").upsert({
        id: "demo_user",
        name: "Demo User",
        avatar: "",
        liked_songs: [],
        recently_played: [],
        following_artists: [],
        created_at: new Date().toISOString(),
    });
}

async function createDemoPlaylist(songIds) {
    await supabase.from("playlists").upsert({
        id: "demo_playlist",
        title: "Imported Playlist",
        owner_id: "demo_user",
        song_ids: songIds.slice(0, 100),
        created_at: new Date().toISOString(),
    });
}

// ======================================================================
//  Import Many Songs
// ======================================================================
async function importMany(songs) {
    console.log(`⏳ Importing ${songs.length} songs...\n`);
    const importedIds = [];

    for (const s of songs) {
        console.log(`🎵 ${s.artist} - ${s.title}`);

        try {
            const lyrics = await fetchLyrics(s.artist, s.title);
            await sleep(150);

            // -------------------------
            // Upload cover
            // -------------------------
            let coverPath = null;
            try {
                const coverBuf = (
                    await axios.get(s.image_url, { responseType: "arraybuffer" })
                ).data;

                coverPath = `covers/${normalizeId(s.artist)}_${Date.now()}.jpg`;
                await uploadFile("covers", coverPath, coverBuf, "image/jpeg");
            } catch {
                console.log("⚠ Cover upload failed");
            }

            // -------------------------
            // Upload audio
            // -------------------------
            let audioPath = null;
            try {
                const audioBuf = (
                    await axios.get(s.audio_url, { responseType: "arraybuffer" })
                ).data;

                audioPath = `songs/${normalizeId(s.title)}_${Date.now()}.mp3`;
                await uploadFile("songs", audioPath, audioBuf, "audio/mpeg");
            } catch {
                console.log("⚠ Audio upload failed");
            }

            // -------------------------
            // Upsert DB
            // -------------------------
            await upsertArtist(s);
            await upsertGenre(s);
            await upsertAlbum(s, coverPath);
            await upsertSong(s, lyrics, audioPath, coverPath);

            importedIds.push(`${s.source}_${s.source_id}`);
        } catch (err) {
            console.log(`❌ ERROR importing: ${err.message}`);
        }
    }

    await createDemoUser();
    await createDemoPlaylist(importedIds);

    console.log("\n🎉 DONE! All songs imported successfully.");
}

// ======================================================================
//  Run Script
// ======================================================================
(async () => {
    try {
        const provider = (process.argv[2] || "itunes").toLowerCase();
        const term = process.argv[3] || "lofi";
        const limit = parseInt(process.argv[4] || "20", 10);

        console.log(`Provider: ${provider}`);
        console.log(`Search term: "${term}"`);
        console.log(`Limit: ${limit}\n`);

        const songs = await searchItunes(term, limit);
        console.log(`Fetched ${songs.length} tracks from iTunes.\n`);

        await importMany(songs);
        process.exit(0);
    } catch (err) {
        console.error("❌ FATAL ERROR:", err);
        process.exit(1);
    }
})();
