"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql2/promise");
class DatabaseService {
    constructor() {
        mysql
            .createConnection({
            host: "localhost",
            user: "root",
            password: "rootpassword",
            database: "library",
        })
            .then((co) => {
            this.connection = co;
        });
    }
    isReady() {
        return new Promise((resolve, _) => {
            const interval = setInterval(() => {
                if (this.connection) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        });
    }
    getConnection() {
        return this.connection;
    }
}
exports.default = DatabaseService;
//# sourceMappingURL=DatabaseService.js.map