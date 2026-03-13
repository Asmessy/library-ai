const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('e:/library-ai/database/library.db');

db.serialize(() => {
  db.run("ALTER TABLE Books ADD COLUMN borrow_count INTEGER DEFAULT 0", (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error(err);
    } else {
      console.log('Update Complete.');
    }
    db.close();
  });
});
