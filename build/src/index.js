"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router_1 = require("./router");
const serverPort = 9000;
const app = express();
const router = new router_1.default(app);
router.init().setupRoutes();
app.listen(serverPort, () => console.info(`Listening on port ${serverPort}`));
//# sourceMappingURL=index.js.map