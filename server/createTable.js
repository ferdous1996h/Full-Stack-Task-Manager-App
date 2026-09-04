import { getDBConnection } from './db/getDBConnection.js';
export async function createTable() {
  const db = await getDBConnection();
  try {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS task_categories(
      task_id INTEGER NOT NULL,
      category_id INTEGER NOT NULL,
      PRIMARY KEY (task_id,category_id),
      FOREIGN KEY (task_id) REFERENCES tasks(id),
      FOREIGN KEY (category_id) REFERENCES categories(id)
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
