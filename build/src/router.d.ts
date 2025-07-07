import * as express from "express";
export default class Router {
    private booksRepository;
    private app;
    constructor(app: express.Express);
    init(): this;
    private tokenize;
    private scoreTokenizedMatch;
    setupRoutes(): void;
}
