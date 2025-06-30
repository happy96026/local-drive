import { Application } from "@oak/oak/application"
import { Router } from "@oak/oak/router"
import { walk } from "@std/fs"
import { Context } from "@oak/oak/context"

export { LocalDriveApp }

interface LocalDriveAppOptions {
  readonly portNumber: number
  readonly ipAddress: string
  readonly clientDir: string
  readonly videoDir: string
}

class LocalDriveApp {
  constructor(
    private readonly app: Application,
    private readonly router: Router,
    private readonly options: LocalDriveAppOptions,
  ) {}

  start(this: this) {
    this.router
      .get("/", async (context) => await this.sendStatic(context))
      .get("/index.js", async (context) => await this.sendStatic(context))
      .get("/api/videos", async (context) => {
        const videoSet = new Set<string>()
        const subtitleSet = new Set<string>()
        const filesAsyncIterator = walk(this.options.videoDir, {
          exts: [".mp4", ".vtt"],
          maxDepth: 1,
        })

        for await (const { name } of filesAsyncIterator) {
          const set = name.endsWith(".mp4") ? videoSet : subtitleSet
          set.add(name)
        }

        context.response.body = {
          files: Array.from(videoSet).map((videoName) => {
            const subtitleName = `${videoName.split(".")[0]}.vtt`

            return {
              videoName,
              subtitleNames: [
                subtitleSet.has(subtitleName) ? subtitleName : null,
              ].filter(Boolean),
            }
          }),
        }
      })
      .get("/api/videos/:fileName", async (context) => {
        await context.send({
          root: this.options.videoDir,
          path: context.params.fileName,
        })
      })

    this.app.use(this.router.allowedMethods())
    this.app.use(this.router.routes())

    this.app.addEventListener("listen", ({ port }) => {
      console.log(`Listening on port ${port}`)
    })

    this.app.listen({
      port: this.options.portNumber,
      hostname: this.options.ipAddress,
    })
  }

  private async sendStatic(this: this, context: Context) {
    await context.send({
      root: this.options.clientDir,
      index: "index.html"
    })
  }
}
