import { appContext } from "@src/config/mod.ts"

function main(): Promise<void> {
  const localDriveApp = appContext.appConfig.localDriveApp
  return localDriveApp.start()
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  main()
}
