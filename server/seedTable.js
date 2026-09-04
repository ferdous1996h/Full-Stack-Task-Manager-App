import { categoriesTAG } from './data.js';
import { getDBConnection } from './db/getDBConnection.js';

export async function seedTable() {
  const db = await getDBConnection();
  try {
    await db.exec(`BEGIN`);
    for (const item of categoriesTAG) {
      await db.run(
        `
        INSERT INTO categories (name) VALUES(?)
        `,
        [item]
      );
    }
    await db.exec(`COMMIT`);
    console.log(`Table data inserted`);
  } catch (err) {
    await db.exec(`ROLLBACK`);
    console.log(`There is an Error while insering table data`, err);
  } finally {
    await db.close();
  }
}
seedTable();
