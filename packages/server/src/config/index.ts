import { AppConfig } from "src/config/app-config"
import { LogConfig } from "src/config/log-config"
import { lazy } from "src/util"

class AppContext {
    @lazy
    get appConfig(): AppConfig {
        return new AppConfig(this.logConfig)
    }

    @lazy
    get logConfig(): LogConfig {
        return new LogConfig()
    }
}

export const appContext = new AppContext()
