const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('e:/library-ai/database/library.db');

db.serialize(() => {
    const stmt = db.prepare("UPDATE Books SET image_url = ? WHERE title = ?");
    const updates = [
        { title: 'The Pragmatic Programmer', url: 'https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg' },
        { title: 'The Psychology of Money', url: 'https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg' },
        { title: 'Think and Grow Rich', url: 'https://covers.openlibrary.org/b/isbn/9781585424337-L.jpg' },
        { title: 'To Kill a Mockingbird', url: 'https://covers.openlibrary.org/b/isbn/9780060935467-L.jpg' },
        { title: 'The Wright Brothers', url: 'https://covers.openlibrary.org/b/isbn/9781476728742-L.jpg' }
    ];
    updates.forEach(u => stmt.run([u.url, u.title]));
    stmt.finalize(() => {
        console.log('Update Complete.');
        db.close();
    });
});
