const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('e:/library-ai/database/library.db');

db.serialize(() => {
    const stmt = db.prepare("UPDATE Books SET image_url = ? WHERE title = ?");
    const updates = [
        { title: 'A People\'s History of the United States', url: 'https://covers.openlibrary.org/b/isbn/9780060838652-L.jpg' },
        { title: 'Design Patterns', url: 'https://covers.openlibrary.org/b/isbn/9780201633610-L.jpg' },
        { title: 'Clean Code', url: 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg' },
        { title: 'Atomic Habits', url: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg' },
        { title: 'Guns, Germs, and Steel', url: 'https://covers.openlibrary.org/b/isbn/9780393317558-L.jpg' }
    ];
    updates.forEach(u => stmt.run([u.url, u.title]));
    stmt.finalize(() => {
        console.log('Update Complete.');
        db.close();
    });
});
