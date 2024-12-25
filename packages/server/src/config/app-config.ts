import { join } from "node:path"
import createExpressApp, { type Application } from "express"
import { LocalDriveApp } from "src/app/local-drive-app"
import { type LogConfig } from "src/config/log-config"
import { lazy } from "src/util"

class AppConfig {
    constructor(private readonly logConfig: LogConfig) {}

    @lazy
    get localDriveApp(): LocalDriveApp {
        return new LocalDriveApp(this.expressApp, this.logConfig.console, {
            portNumber: this.portNumber,
            ipAddress: this.ipAddress,
            videoDir: this.videoDir,
        })
    }

    @lazy
    get expressApp(): Application {
        return createExpressApp()
    }

    @lazy
    get portNumber(): number {
        return 8000
    }

    @lazy
    get ipAddress(): string {
        return "0.0.0.0"
    }

    @lazy
    get videoDir(): string {
        return join(__dirname, "../../static")
    }
}

export { AppConfig }
