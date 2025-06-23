import { AppConfig } from "@src/config/app-config.ts"
import { lazy } from "@src/util/mod.ts"

class AppContext {
  @lazy
  get appConfig(): AppConfig {
    return new AppConfig()
  }
}

export const appContext = new AppContext()
