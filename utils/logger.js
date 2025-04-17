import sapLoggging from "@sap/logging"

const appContext = sapLoggging.createAppContext()
const logContext = appContext.createLogContext()
const logger = logContext.getLogger("/api")
export {logger}