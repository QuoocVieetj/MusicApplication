// import_songs.js
// Usage examples:
// node import_songs.js itunes "lofi chill" 25

const fs = require("fs");
const axios = require("axios");
const admin = require("firebase-admin");

// 1) Init Firebase Admin
const cred = JSON.parse(fs.readFileSync("./firebase-key.json", "utf8"));
admin.initializeApp({ credential: admin.credential.cert(cred) });
const db = admin.firestore();

/** Helpers */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** iTunes Search API */
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
            // --- THAY ĐỔI 1: THÊM TRƯỜNG GENRE ---
            genre: item.primaryGenreName ?? "",
            // ------------------------------------
        }))
        .filter((s) => !!s.audioUrl);
}


/** Upsert vào Firestore (collection 'songs') */
async function upsertSongs(songs) {
    if (!songs.length) return;
    const batchSize = 400; // an toàn với giới hạn 500 của Firestore

    for (let i = 0; i < songs.length; i += batchSize) {
        const chunk = songs.slice(i, i + batchSize);
        const batch = db.batch();

        for (const s of chunk) {
            const docId = `${s.source}_${s.sourceId}`;
            const ref = db.collection("songs").doc(docId);
            batch.set(
                ref,
                {
                    title: s.title,
                    artist: s.artist,
                    album: s.album,
                    imageUrl: s.imageUrl,
                    audioUrl: s.audioUrl,
                    durationMs: s.durationMs,
                    source: s.source,
                    sourceId: s.sourceId,
                    playCount: 0,
                    artistId: s.artist.toLowerCase().replace(/\s+/g, "_"),
                    // --- THAY ĐỔI 2: LƯU TRỮ TRƯỜNG GENRE VÀO FIRESTORE ---
                    genre: s.genre,
                    // ----------------------------------------------------
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                },
                { merge: true }
            );
        }

        await batch.commit();
        console.log(`Imported ${chunk.length} songs...`);
        await sleep(200);
    }
}

/** Main */
(async () => {
    try {
        const provider = (process.argv[2] || "itunes").toLowerCase();
        const term = process.argv[3] || "lofi";
        const limit = parseInt(process.argv[4] || "20", 10);

        console.log(`Provider: ${provider} | term: "${term}" | limit: ${limit}`);

        let songs = [];
        if (provider === "itunes") {
            songs = await searchItunes(term, limit);
        } else if (provider === "deezer") {
            // Cần thêm logic searchDeezer và trích xuất genre ở đây
            // Hiện tại sẽ báo lỗi nếu chọn provider là deezer
            throw new Error('Hàm searchDeezer chưa được triển khai!');
        } else {
            throw new Error('Provider phải là "itunes" hoặc "deezer"');
        }

        console.log(`Fetched ${songs.length} songs. Importing to Firestore...`);
        await upsertSongs(songs);
        console.log("Done.");
        process.exit(0);
    } catch (e) {
        console.error("Error:", e.message);
        process.exit(1);
    }
})();