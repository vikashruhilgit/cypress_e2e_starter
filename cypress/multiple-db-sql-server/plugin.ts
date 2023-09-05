import { ConnectionConfig } from "tedious";
import pluginFactory from "cypress-sql-server/src/plugins/db.js"

export default {
    "sqlServer:execute": (args: {query: string, config: ConnectionConfig}) => {
        return pluginFactory(args.config)["sqlServer:execute"](args.query);
    }
};