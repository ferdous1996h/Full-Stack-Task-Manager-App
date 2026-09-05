import { getDBConnection } from '../db/getDBConnection.js';

export async function getCategories(req, res) {
  const db = await getDBConnection();
  const result = await db.all(`
    SELECT * FROM categories
    `);
  const categoryName = result.map(category => ({
    value: category.id,
    label: category.name,
  }));
  return res.status(201).json(categoryName);
}
