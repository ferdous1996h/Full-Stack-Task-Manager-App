import path from 'node:path';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { getDBConnection } from './db/getDBConnection.js';

async function alterTable() {
  const db = await getDBConnection();
  await db.run(`
    ALTER TABLE tasks
    ADD COLUMN dueDate TEXT;
    `);
  console.log('Table altered');
  await db.close();
  console.log('Table closed');
}
alterTable();
