// import_songs_multi.js
// Usage:
// node import_songs_multi.js itunes "lofi chill" 25
//
// This script imports songs from iTunes and splits data into multiple Firestore collections:
// songs, artists, albums, genres, playlists, users (skeleton).
//
// Make sure firebase-key.json exists locally (DO NOT push it), and that you have firebase-admin installed.

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

// ---------- iTunes search ----------
async function searchItunes(term, limit = 25, country = "us") {
    const url = "https://itunes.apple.com/search";
    const { data } = await axios.get(url, {
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

// ---------- Upsert multiple collections ----------
async function upsertMany(songs) {
    if (!songs.length) return;

    // We'll perform batched writes in chunks
    const BATCH_LIMIT = 400;

    // We will maintain caches in memory per run to avoid extra reads/writes:
    // artistCache: { artistId: true }, albumCache, genreCache, songCache
    const artistCache = new Set();
    const albumCache = new Set();
    const genreCache = new Set();
    const songCache = new Set();

    // Prewarm caches by checking existence for a small set? (skip for simplicity)

    for (let i = 0; i < songs.length; i += BATCH_LIMIT) {
        const chunk = songs.slice(i, i + BATCH_LIMIT);
        const batch = db.batch();

        for (const s of chunk) {
            // Build ids
            const artistId = `artist_${normalizeId(s.artist || "unknown") || "anon"}`;
            const albumId = `album_${normalizeId(s.album || `${s.artist}_album`)}`;
            const genreId = `genre_${normalizeId(s.genre || "unknown")}`;
            const songId = `${s.source}_${s.sourceId}`; // e.g., itunes_12345

            // 1) Create artist doc if not cached
            if (!artistCache.has(artistId)) {
                const artistRef = db.collection("artists").doc(artistId);
                // Use set with merge: if exists, won't overwrite custom fields
                batch.set(
                    artistRef,
                    {
                        name: s.artist || "Unknown Artist",
                        avatar: s.imageUrl || "",
                        bio: "",
                        followers: 0,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    },
                    { merge: true }
                );
                artistCache.add(artistId);
            }

            // 2) Create album doc if not cached
            if (!albumCache.has(albumId)) {
                const albumRef = db.collection("albums").doc(albumId);
                batch.set(
                    albumRef,
                    {
                        title: s.album || "Single",
                        artistId: artistId,
                        coverUrl: s.imageUrl || "",
                        releaseYear: null,
                        genres: s.genre ? [s.genre] : [],
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    },
                    { merge: true }
                );
                albumCache.add(albumId);
            } else {
                // Optionally append genre to existing album (omitted for simplicity)
            }

            // 3) Create genre doc if not cached
            if (!genreCache.has(genreId)) {
                const genreRef = db.collection("genres").doc(genreId);
                batch.set(
                    genreRef,
                    {
                        name: s.genre || "Unknown",
                        description: "",
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    },
                    { merge: true }
                );
                genreCache.add(genreId);
            }

            // 4) Create song doc
            if (!songCache.has(songId)) {
                const songRef = db.collection("songs").doc(songId);
                batch.set(
                    songRef,
                    {
                        title: s.title || "Unknown Title",
                        artistId,
                        albumId,
                        genreId,
                        genreName: s.genre || "Unknown",
                        imageUrl: s.imageUrl || "",
                        audioUrl: s.audioUrl || "",
                        durationMs: s.durationMs || 0,
                        playCount: 0,
                        likes: 0,
                        source: s.source,
                        sourceId: s.sourceId,
                        createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    },
                    { merge: true }
                );
                songCache.add(songId);
            } else {
                // optionally update fields if needed
            }
        }

        // commit the batch
        await batch.commit();
        console.log(`Committed ${chunk.length} items to Firestore.`);
        await sleep(200);
    }

    // Optionally: create a system playlist with imported songs (first 100)
    try {
        const playlistRef = db.collection("playlists").doc("import_top_playlist");
        const sampleSongIds = Array.from(songCache).slice(0, 100);
        await playlistRef.set(
            {
                title: "Imported Playlist",
                ownerId: "system",
                songIds: sampleSongIds,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                imageUrl: "",
            },
            { merge: true }
        );
        console.log("Created/updated system playlist: import_top_playlist");
    } catch (err) {
        console.warn("Playlist create failed:", err.message);
    }

    // Optionally: create a demo user skeleton
    try {
        const demoUserId = "user_demo";
        const userRef = db.collection("users").doc(demoUserId);
        await userRef.set(
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
        console.log("Created demo user: user_demo");
    } catch (err) {
        console.warn("User create failed:", err.message);
    }
}

// ---------- Main ----------
(async () => {
    try {
        const provider = (process.argv[2] || "itunes").toLowerCase();
        const term = process.argv[3] || "lofi";
        const limit = parseInt(process.argv[4] || "20", 10);

        console.log(`Provider: ${provider} | term: "${term}" | limit: ${limit}`);

        let songs = [];
        if (provider === "itunes") {
            songs = await searchItunes(term, limit);
        } else {
            throw new Error('Currently only "itunes" provider is implemented.');
        }

        console.log(`Fetched ${songs.length} songs. Importing to Firestore...`);
        await upsertMany(songs);
        console.log("Import finished.");
        process.exit(0);
    } catch (e) {
        console.error("Error:", e.message || e);
        process.exit(1);
    }
})();
