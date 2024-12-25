import { appContext } from "src/config"

function main(): void {
    appContext.appConfig.localDriveApp.start()
}

if (require.main === module) {
    main()
}
