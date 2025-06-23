import { join } from "@std/path"
import { Application } from "@oak/oak/application"
import { Router } from "@oak/oak/router"
import { lazy } from "@src/util/mod.ts"
import { LocalDriveApp } from "@src/app/local-drive-app.ts"

class AppConfig {
  @lazy
  get localDriveApp(): LocalDriveApp {
    return new LocalDriveApp(
      this.application,
      this.router,
      {
        portNumber: 8000,
        ipAddress: "0.0.0.0",
        videoDir: join(import.meta.dirname!, "..", "..", "..", "static"),
        clientDir: join(import.meta.dirname!, "..", "..", "..", "client"),
      }
    )
  }

  @lazy
  get application(): Application {
    return new Application()
  }

  @lazy
  get router(): Router {
    return new Router()
  }
}

export { AppConfig }
