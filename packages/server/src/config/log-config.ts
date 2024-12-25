import { Console } from "node:console"
import { stderr, stdout } from "node:process"
import { lazy } from "src/util"

class LogConfig {
    @lazy
    get console(): Console {
        return new Console(stdout, stderr)
    }
}

export { LogConfig }
