import fs from "node:fs"
import { readdir } from "node:fs/promises"
import path from "node:path"
import { type Application, static as expressStatic } from "express"

interface LocalDriveAppOptions {
    readonly portNumber: number
    readonly ipAddress: string
    readonly videoDir: string
}

class LocalDriveApp {
    constructor(
        private readonly expressApp: Application,
        private readonly console: Console,
        private readonly options: LocalDriveAppOptions,
    ) {}

    start(): void {
        this.expressApp.use("/", expressStatic(path.join(__dirname, "client")))

        this.expressApp.get("/api/videos", async (_, res) => {
            const files = await readdir(this.options.videoDir)

            res.setHeader("Content-Type", "application/json")
            res.end(
                JSON.stringify({
                    files: files.filter((fileName) =>
                        fileName.includes(".mp4"),
                    ),
                }),
            )
        })

        this.expressApp.get("/api/videos/:fileName", (req, res) => {
            const fileName = req.params.fileName

            const range = req.headers.range
            if (!range) {
                res.status(400).send("Requires Range header")
                return
            }
            const videoPath = `${this.options.videoDir}/${fileName}`
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

        this.expressApp.listen(
            this.options.portNumber,
            this.options.ipAddress,
            () => {
                this.console.log(`Listening on port ${this.options.portNumber}`)
            },
        )
    }
}

export { LocalDriveApp }
