import { readdir } from "node:fs/promises"
import fs from "node:fs"
import path from "node:path"
import expressDefault, * as express from "express"
import { PORT_NUMBER, VIDEO_DIR } from "./config"

const app = expressDefault()

app.use("/", express.static(path.join(__dirname, "client")))

app.get("/api/videos", async (_, res) => {
    const files = await readdir(VIDEO_DIR)

    res.setHeader("Content-Type", "application/json")
    res.end(
        JSON.stringify({
            files: files.filter((fileName) => fileName.includes(".mp4")),
        }),
    )
})

app.get("/api/videos/:fileName", (req, res) => {
    const fileName = req.params.fileName

    const range = req.headers.range
    if (!range) {
        res.status(400).send("Requires Range header")
        return
    }
    const videoPath = `${VIDEO_DIR}/${fileName}`
    const videoSize = fs.statSync(videoPath).size
    const CHUNK_SIZE = 10 ** 6
    const start = Number(range.replace(/\D/g, ""))
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1)
    const contentLength = end - start + 1
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    }
    res.writeHead(206, headers)
    const videoStream = fs.createReadStream(videoPath, { start, end })
    videoStream.pipe(res)
})

app.listen(PORT_NUMBER, "0.0.0.0", () => {
    process.stdout.write(`Listening on port ${PORT_NUMBER}\n`)
})
