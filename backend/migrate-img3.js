const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('e:/library-ai/database/library.db');

db.serialize(() => {
    const stmt = db.prepare("UPDATE Books SET image_url = ? WHERE title = ?");
    const updates = [
        { title: 'Sapiens: A Brief History of Humankind', url: 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg' },
        { title: 'The 7 Habits of Highly Effective People', url: 'https://covers.openlibrary.org/b/isbn/9780671708634-L.jpg' },
        { title: 'The Great Gatsby', url: 'https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg' },
        { title: 'Rich Dad Poor Dad', url: 'https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg' },
        { title: 'The Intelligent Investor', url: 'https://covers.openlibrary.org/b/isbn/9780060555665-L.jpg' }
    ];
    updates.forEach(u => stmt.run([u.url, u.title]));
    stmt.finalize(() => {
        console.log('Update Complete.');
        db.close();
    });
});
