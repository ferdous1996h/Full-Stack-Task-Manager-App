import { json } from 'express';
import { getDBConnection } from '../db/getDBConnection.js';
export async function getTasks(req, res) {
  const db = await getDBConnection();
  try {
    const results = await db.all(
      `SELECT * FROM tasks ORDER BY created_at DESC`
    );
    const tasks = results.map(ele => ({
      ...ele,
      completed: Boolean(ele.completed),
    }));
    return res.json(tasks);
  } catch (err) {
    return res.status(500).send({
      message: 'Fail to fetch task',
    });
  }
}
export async function getSingleTask(req, res) {
  const db = await getDBConnection();
  try {
    const taskId = req.params.id;
    const singleTask = await db.get(
      `
    SELECT * FROM tasks WHERE id=?
    `,
      [taskId]
    );
    if (singleTask) {
      const tasks = { ...singleTask, completed: Boolean(singleTask.completed) };
      return res.status(202).json(tasks);
    } else {
      return res.status(404).send({
        message: 'Task not found',
      });
    }
  } catch (err) {
    return res.status(500).send({
      message: 'Fail to fetch the task',
    });
  }
}
export async function createTask(req, res) {
  const db = await getDBConnection();
  try {
    let { title, description = '' } = req.body;
    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).send({
        error: 'Title is required',
      });
    }
    title = title.trim();
    if (description) {
      description = description.toString().trim();
    }
    const result = await db.get(
      `
      INSERT INTO tasks (title, description) VALUES(?,?)
      RETURNING id,title,description,completed,created_at
      `,
      [title, description]
    );
    const tasks = { ...result, completed: Boolean(result.completed) };
    return res.status(201).json(tasks);
  } catch (err) {
    return res.status(500).send({
      message: `There is a problem while creating a task`,
      error: err,
    });
  }
}
export async function updateTask(req, res) {
  const db = await getDBConnection();
  try {
    const patchId = req.params.id;
    const { completed, title, description } = req.body;
    const updates = [];
    const params = [];
    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return res.status(400).send({
          message: 'Completed request must be in boolean value',
        });
      }
      updates.push('completed = ?');
      params.push(completed ? 1 : 0);
    }
    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    if (updates.length === 0) {
      return res.status(400).send({
        error: 'Incomplete update',
      });
    }
    params.push(patchId);
    const result = await db.get(
      `
      UPDATE tasks
      SET ${updates.join(', ')}
      WHERE id=?
      RETURNING id,title,description,completed,created_at
      `,
      params
    );
    if (!result) {
      return res.status(404).send({
        error: 'Task not found.',
      });
    }
    const tasks = { ...result, completed: Boolean(result.completed) };
    return res.status(200).json(tasks);
  } catch (err) {
    return res.status(500).send({
      message: `There is a problem while updating a task`,
      error: err,
    });
  }
}
export async function deleteTask(req, res) {
  const db = await getDBConnection();
  try {
    const { id } = req.params;
    const result = await db.run(
      `
      DELETE FROM tasks
      WHERE id=?
      `,
      [id]
    );
    if (result.changes !== 1) {
      return res.status(404).send({
        error: 'Task not found',
      });
    } else {
      return res.status(200).send({
        message: 'Task deleted successfully',
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      error: 'Task deletion failed',
    });
  }
}
