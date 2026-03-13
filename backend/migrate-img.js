const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('e:/library-ai/database/library.db');

db.serialize(() => {
  db.run("ALTER TABLE Books ADD COLUMN image_url TEXT", (err) => {
    if (err && !err.message.includes('duplicate column name')) console.error(err);
    
    const stmt = db.prepare("UPDATE Books SET image_url = ? WHERE title = ?");
    const updates = [
        { title: 'Introduction to Algorithms', url: 'https://covers.openlibrary.org/b/isbn/9780262033848-L.jpg' },
        { title: 'Deep Work', url: 'https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg' },
        { title: 'Thinking, Fast and Slow', url: 'https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg' },
        { title: 'Pride and Prejudice', url: 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg' },
        { title: '1984', url: 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg' }
    ];
    updates.forEach(u => stmt.run([u.url, u.title]));
    stmt.finalize(() => {
        db.run("UPDATE Books SET image_url = 'https://via.placeholder.com/300x400/e2e8f0/475569?text=Cover+Not+Found' WHERE image_url IS NULL", (err2) => {
            console.log('Update Complete.');
            db.close();
        });
    });
  });
});
