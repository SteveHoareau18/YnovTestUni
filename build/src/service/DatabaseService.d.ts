import * as mysql from "mysql2/promise";
export default class DatabaseService {
    private connection;
    constructor();
    isReady(): Promise<void>;
    getConnection(): mysql.Connection;
}
