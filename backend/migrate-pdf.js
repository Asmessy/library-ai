const db = require('./config/db');

async function migrate() {
  try {
    await db.runAsync("ALTER TABLE Books ADD COLUMN pdf_url TEXT");
    console.log("Added pdf_url column to Books table.");
  } catch (error) {
    if (error.message.includes("duplicate column name")) {
      console.log("Column pdf_url already exists.");
    } else {
      console.error("Migration failed:", error);
    }
  }
}

migrate();
