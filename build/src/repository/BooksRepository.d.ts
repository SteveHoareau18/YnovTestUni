import Book from "../model/Book";
import DatabaseService from "../service/DatabaseService";
export interface IBooksRepository {
    searchBooks(): Promise<Book[]>;
    createChapter(bookId: number, title: string, content: string, chapterNumber?: number): Promise<void>;
    fetchReadingList(userId: string): Promise<{
        bookId: number;
        lastReadChapter: {
            id: number;
            title: string;
            chapterNumber: number;
        };
        lastChapter: {
            id: number;
            title: string;
            chapterNumber: number;
            createdAt: string;
        };
    }[]>;
    userExists(userId: string): Promise<boolean>;
}
export default class BooksRepositoryImpl implements IBooksRepository {
    private db;
    constructor(db: DatabaseService);
    createChapter(bookId: number, title: string, content: string, chapterNumber?: number): Promise<void>;
    searchBooks(): Promise<Book[]>;
    fetchReadingList(userId: string): Promise<{
        bookId: number;
        lastReadChapter: {
            id: number;
            title: string;
            chapterNumber: number;
        };
        lastChapter: {
            id: number;
            title: string;
            chapterNumber: number;
            createdAt: string;
        };
    }[]>;
    userExists(userId: string): Promise<boolean>;
}
