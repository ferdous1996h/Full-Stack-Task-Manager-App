import { getDBConnection } from './db/getDBConnection.js';
export async function createTable() {
  const db = await getDBConnection();
  try {
    await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT DEFAULT '',
        completed INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
    `);
    console.log(`Table created`);
  } catch (err) {
    console.log(`There is an Error while creating a table`, err);
  } finally {
    await db.close();
  }
}
createTable();
