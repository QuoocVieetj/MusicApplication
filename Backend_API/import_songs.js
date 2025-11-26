// import_songs_multi_with_lyrics.js
// Usage:
// node import_songs.js itunes "lofi chill" 25

const fs = require("fs");
const axios = require("axios");
const admin = require("firebase-admin");

// ---------- Init Firebase Admin ----------
const cred = JSON.parse(fs.readFileSync("./firebase-key.json", "utf8"));
admin.initializeApp({ credential: admin.credential.cert(cred) });
const db = admin.firestore();

// ---------- Helpers ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const normalizeId = (str) =>
    String(str || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");


// -------------------------------------------------
// 🔥 Fetch lyrics from LRCLIB (auto)
// -------------------------------------------------
async function fetchLyrics(artist, title) {
    try {
        const { data } = await axios.get("https://lrclib.net/api/get", {
            params: {
                artist_name: artist,
                track_name: title
            }
        });

        return {
            plain: data.plainLyrics || "",
            synced: data.syncedLyrics || ""
        };
    } catch (err) {
        console.log(`⚠ No lyrics for: ${artist} - ${title}`);
        return { plain: "", synced: "" };
    }
}


// -------------------------------------------------
// 🔥 iTunes search
// -------------------------------------------------
async function searchItunes(term, limit = 25, country = "us") {
    const { data } = await axios.get("https://itunes.apple.com/search", {
        params: { term, media: "music", entity: "song", country, limit },
    });

    return data.results
        .map((item) => ({
            source: "itunes",
            sourceId: String(item.trackId),
            title: item.trackName ?? "",
            artist: item.artistName ?? "",
            album: item.collectionName ?? "",
            imageUrl: (item.artworkUrl100 || "").replace("100x100", "512x512"),
            audioUrl: item.previewUrl || "",
            durationMs: item.trackTimeMillis ?? 0,
            genre: item.primaryGenreName ?? "",
        }))
        .filter((s) => !!s.audioUrl);
}


// -------------------------------------------------
// 🔥 Upsert multiple collections + lyrics
// -------------------------------------------------
async function upsertMany(songs) {
    if (!songs.length) return;

    const BATCH_LIMIT = 300;

    const artistCache = new Set();
    const albumCache = new Set();
    const genreCache = new Set();
    const songCache = new Set();

    for (let i = 0; i < songs.length; i += BATCH_LIMIT) {
        const chunk = songs.slice(i, i + BATCH_LIMIT);
        const batch = db.batch();

        for (const s of chunk) {
            // Build IDs
            const artistId = `artist_${normalizeId(s.artist || "unknown") || "anon"}`;
            const albumId = `album_${normalizeId(s.album || `${s.artist}_album`)}`;
            const genreId = `genre_${normalizeId(s.genre || "unknown")}`;
            const songId = `${s.source}_${s.sourceId}`;

            // Artist
            if (!artistCache.has(artistId)) {
                batch.set(
                    db.collection("artists").doc(artistId),
                    {
                        name: s.artist,
                        avatar: s.imageUrl,
                        bio: "",
                        followers: 0,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    },
                    { merge: true }
                );
                artistCache.add(artistId);
            }

            // Album
            if (!albumCache.has(albumId)) {
                batch.set(
                    db.collection("albums").doc(albumId),
                    {
                        title: s.album || "Single",
                        artistId,
                        coverUrl: s.imageUrl,
                        releaseYear: null,
                        genres: s.genre ? [s.genre] : [],
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    },
                    { merge: true }
                );
                albumCache.add(albumId);
            }

            // Genre
            if (!genreCache.has(genreId)) {
                batch.set(
                    db.collection("genres").doc(genreId),
                    {
                        name: s.genre,
                        description: "",
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    },
                    { merge: true }
                );
                genreCache.add(genreId);
            }

            // ----------------------------------------------
            // 🔥 Fetch lyrics for each song (with delay)
            // ----------------------------------------------
            const lyrics = await fetchLyrics(s.artist, s.title);
            await sleep(150); // tránh bị chặn API

            // Song
            if (!songCache.has(songId)) {
                batch.set(
                    db.collection("songs").doc(songId),
                    {
                        title: s.title,
                        artistId,
                        albumId,
                        genreId,
                        genreName: s.genre,
                        imageUrl: s.imageUrl,
                        audioUrl: s.audioUrl,
                        durationMs: s.durationMs,
                        playCount: 0,
                        likes: 0,

                        // 📌 ADD LYRICS HERE
                        lyrics: {
                            plain: lyrics.plain,
                            synced: lyrics.synced
                        },

                        source: s.source,
                        sourceId: s.sourceId,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    },
                    { merge: true }
                );
                songCache.add(songId);
            }
        }

        await batch.commit();
        console.log(`✔ Committed ${chunk.length} items to Firestore.`);
    }

    // Playlist
    try {
        await db.collection("playlists").doc("import_top_playlist").set(
            {
                title: "Imported Playlist",
                ownerId: "system",
                songIds: Array.from(songCache).slice(0, 100),
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
        );
    } catch (err) {
        console.log("⚠ Playlist error: ", err.message);
    }

    // Demo user
    try {
        await db.collection("users").doc("user_demo").set(
            {
                name: "Demo User",
                avatar: "",
                likedSongs: [],
                recentlyPlayed: [],
                followingArtists: [],
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
        );
    } catch (err) {
        console.log("⚠ User create error: ", err.message);
    }
}


// -------------------------------------------------
// 🔥 Main
// -------------------------------------------------
(async () => {
    try {
        const provider = (process.argv[2] || "itunes").toLowerCase();
        const term = process.argv[3] || "lofi";
        const limit = parseInt(process.argv[4] || "20", 10);

        console.log(`Provider: ${provider} | "${term}" | limit: ${limit}`);

        let songs = [];
        if (provider === "itunes") {
            songs = await searchItunes(term, limit);
        }

        console.log(`Fetched ${songs.length} songs.`);
        await upsertMany(songs);

        console.log("🎉 Import completed.");
        process.exit(0);
    } catch (e) {
        console.error("Error:", e.message);
        process.exit(1);
    }
})();
