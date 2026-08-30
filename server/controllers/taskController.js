import { json } from 'express';
import { getDBConnection } from '../db/getDBConnection.js';
import { isTitleTooLong } from '../utils/isTitleTooLong.js';
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
      success: false,
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
        success: false,
      });
    }
  } catch (err) {
    return res.status(500).send({
      message: 'Fail to fetch the task',
      success: false,
    });
  }
}
export async function createTask(req, res) {
  const db = await getDBConnection();
  try {
    const acceptedPriority = ['low', 'medium', 'high'];
    let { title, description = '', priority } = req.body;
    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).send({
        message: 'Title is required',
        success: false,
      });
    }
    title = title.trim();
    if (priority === null) priority = 'medium';
    priority = priority.toLowerCase();
    console.log(priority);
    if (!acceptedPriority.includes(priority)) {
      return res.status(400).send({
        message: 'Priority can be only high, medium or low.',
        success: false,
      });
    }
    if (description) {
      description = description.toString().trim();
    }
    if (isTitleTooLong(title, 40)) {
      return res.status(400).send({
        message: `This is a very long title...`,
        success: false,
      });
    }

    const result = await db.get(
      `
      INSERT INTO tasks (title, description,priority) VALUES(?,?,?)
      RETURNING id,title,description,completed,priority,created_at
      `,
      [title, description, priority]
    );
    const tasks = { ...result, completed: Boolean(result.completed) };
    return res.status(201).json(tasks);
  } catch (err) {
    return res.status(500).send({
      message: `There is a problem while creating a task`,
      error: err,
      success: false,
    });
  }
}
export async function updateTask(req, res) {
  const db = await getDBConnection();
  try {
    const acceptedPriority = ['low', 'medium', 'high'];
    const patchId = req.params.id;
    let { completed, title, description, priority } = req.body;
    const updates = [];
    const params = [];
    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return res.status(400).send({
          message: 'Completed request must be in boolean value',
          success: false,
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
    if(priority){
      priority=priority.toLowerCase()
    }
    if (!acceptedPriority.includes(priority)) {
      return res.status(400).send({
        message: 'Priority can be only high, medium or low.',
        success: false,
      });
    }
    updates.push('priority = ?');
    params.push(priority)

    if (updates.length === 0) {
      return res.status(400).send({
        message: 'Incomplete update',
        success: false,
      });
    }
    params.push(patchId);
    const result = await db.get(
      `
      UPDATE tasks
      SET ${updates.join(', ')}
      WHERE id=?
      RETURNING id,title,description,completed,created_at,priority
      `,
      params
    );
    if (!result) {
      return res.status(404).send({
        message: 'Task not found.',
        success: false,
      });
    }
    const tasks = { ...result, completed: Boolean(result.completed) };
    return res.status(200).json(tasks);
  } catch (err) {
    return res.status(500).send({
      message: `There is a problem while updating a task`,
      error: err,
      success: false,
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
        message: 'Task not found',
        success: false,
      });
    } else {
      return res.status(200).send({
        message: 'Task deleted successfully',
        success: true,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({
      message: 'Task deletion failed',
      success: false,
    });
  }
}
