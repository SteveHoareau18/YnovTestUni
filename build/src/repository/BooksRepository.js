"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class BooksRepositoryImpl {
    constructor(db) {
        this.db = db;
    }
    createChapter(bookId, title, content, chapterNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!bookId || !title || !content) {
                return Promise.reject(new Error("bookId, title, and content are required to create a chapter"));
            }
            const connection = this.db.getConnection();
            if (!chapterNumber) {
                // If chapterNumber is not provided, set it to the next available number
                const [rows] = yield connection.query(`
          SELECT MAX(chapter_number) AS maxChapterNumber
          FROM chapters
          WHERE book_id = ?
      `, [bookId]);
                const maxChapterNumber = rows[0].maxChapterNumber || 0;
                chapterNumber = maxChapterNumber + 1;
            }
            else {
                // update all chapters after the given chapterNumber if they exists
                yield connection.execute(`
          UPDATE chapters
          SET chapter_number = chapter_number + 1
          WHERE book_id = ?
            AND chapter_number >= ?
      `, [bookId, chapterNumber]);
            }
            yield connection.execute(`
        INSERT INTO chapters (book_id, title, content, chapter_number)
        VALUES (?, ?, ?, ?)
    `, [bookId, title, content, chapterNumber]);
        });
    }
    searchBooks() {
        return __awaiter(this, void 0, void 0, function* () {
            const [results] = yield this.db.getConnection().query(`
        SELECT books.*,
               COALESCE(json_agg(DISTINCT tags.*), '[]')     AS tags,
               COALESCE(json_agg(DISTINCT chapters.*), '[]') AS chapters
        FROM books
        LEFT JOIN book_tags
                      ON book_tags.book_id = books.id
        LEFT JOIN tags
                      ON tags.id = book_tags.tag_id
        LEFT JOIN chapters
                      ON chapters.book_id = books.id
        GROUP BY books.*
    `);
            return results;
        });
    }
    fetchReadingList(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield this.db.getConnection().query(`
        SELECT rp.book_id,
               last_read_chapter.id             AS last_read_chapter_id,
               last_read_chapter.title          AS last_read_chapter_title,
               last_read_chapter.chapter_number AS last_read_chapter_number,
               last_chapter.id                  AS last_chapter_id,
               last_chapter.title               AS last_chapter_title,
               last_chapter.chapter_number      AS last_chapter_number,
               last_chapter.created_at          AS last_chapter_created_at
        FROM reading_progress rp
        LEFT JOIN chapters    last_read_chapter
                      ON rp.last_read_chapter_id = last_read_chapter.id
        LEFT JOIN (
                      SELECT c1.*
                      FROM chapters    c1
                      INNER JOIN (
                                     SELECT book_id, MAX(created_at) AS max_created
                                     FROM chapters
                                     GROUP BY book_id
                                     ) c2
                                     ON c1.book_id = c2.book_id AND c1.created_at = c2.max_created
                      )       last_chapter
                      ON rp.book_id = last_chapter.book_id
        WHERE rp.user_id = ?
        ORDER BY last_chapter.created_at DESC
    `, [userId]);
            return rows.map((row) => ({
                bookId: row.book_id,
                lastReadChapter: {
                    id: row.last_read_chapter_id,
                    title: row.last_read_chapter_title,
                    chapterNumber: row.last_read_chapter_number,
                },
                lastChapter: {
                    id: row.last_chapter_id,
                    title: row.last_chapter_title,
                    chapterNumber: row.last_chapter_number,
                    createdAt: row.last_chapter_created_at,
                },
            }));
        });
    }
    userExists(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                return Promise.reject(new Error("userId is required to check user existence"));
            }
            const connection = this.db.getConnection();
            const [rows] = yield connection.query(`
        SELECT COUNT(*) AS count
        FROM users
        WHERE id = ?
    `, [userId]);
            return rows[0].count > 0;
        });
    }
}
exports.default = BooksRepositoryImpl;
//# sourceMappingURL=BooksRepository.js.map