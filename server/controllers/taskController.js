import { getDBConnection } from '../db/getDBConnection.js';
import { isTitleTooLong } from '../utils/isTitleTooLong.js';
export async function getTasks(req, res) {
  const db = await getDBConnection();
  try {
    // const results = await db.all(
    //   `SELECT * FROM tasks ORDER BY created_at DESC`
    // );
    const results = await db.all(`
      SELECT
          t.id,
          t.title,
          t.description,
          t.completed,
          t.created_at,
          t.priority,
          t.dueDate,

          COALESCE(
            json_group_array(
              CASE
                WHEN c.id IS NOT NULL
                THEN json_object(
                  'id',c.id,
                  'name',c.name
                )
              END
            ) FILTER (WHERE c.id IS NOT NULL),
            '[]'
          ) AS categories
      FROM tasks t
      LEFT JOIN task_categories tc ON tc.task_id=t.id
      LEFT JOIN categories c ON c.id=tc.category_id
      GROUP BY t.id
      ORDER BY t.created_at DESC
      `);
    const tasks = results.map(task => ({
      ...task,
      completed: Boolean(task.completed),
      categories: JSON.parse(task.categories || '[]'),
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
    let { title, description = '', priority, dueDate, multiSelect } = req.body;
    // -------------------------
    // Validate title
    // -------------------------
    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).send({
        message: 'Title is required',
        success: false,
      });
    }
    title = title.trim();
    if (isTitleTooLong(title, 40)) {
      return res.status(400).send({
        message: `This is a very long title...`,
        success: false,
      });
    }
    // -------------------------
    // Validate priority
    // -------------------------
    if (priority === null) priority = 'medium';
    priority = priority.toLowerCase();
    if (!acceptedPriority.includes(priority)) {
      return res.status(400).send({
        message: 'Priority can be only high, medium or low.',
        success: false,
      });
    }
    // -------------------------
    // description
    // -------------------------
    if (description) {
      description = description.toString().trim();
    }
    // -------------------------
    // Due date
    // -------------------------
    if (dueDate) {
      const date = new Date(dueDate);
      if (Number.isNaN(date.getTime())) {
        return res.status(400).json({
          message: 'Invalid due date.',
          success: false,
        });
      }
      dueDate = date.toISOString();
    } else {
      dueDate = null;
    }
    // -------------------------
    // categories
    // -------------------------
    const categoriesID = Array.isArray(multiSelect)
      ? multiSelect.map(Number)
      : [];
    console.log(categoriesID);
    if (categoriesID.some(id => !Number.isInteger(id) || id <= 0)) {
      return res.status(400).json({
        message: 'Invalid category. Please select atleast one valid category',
        success: false,
      });
    }
    // -------------------------
    // Create task
    // -------------------------
    const result = await db.get(
      `
      INSERT INTO tasks
          (title, description,priority,dueDate)
      VALUES
          (?,?,?,?)
      RETURNING
          id,title,description,completed,priority,created_at,dueDate
      `,
      [title, description, priority, dueDate]
    );
    const taskId = result.id;
    // -------------------------
    // Add category
    // -------------------------
    if (categoriesID.length > 0) {
      await db.exec(`
        INSERT INTO task_categories(task_id,category_id)
        VALUES ${categoriesID.map(number => `(${taskId},${number})`).join(',')}
        `);
    }

    // -------------------------
    // Add category
    // -------------------------
    const categories = await db.all(
      `
      SELECT
          c.id,
          c.name
      FROM categories c
      JOIN task_categories tc ON tc.category_id=c.id
      WHERE tc.task_id = ?
      `,
      taskId
    );

    const tasks = {
      ...result,
      completed: Boolean(result.completed),
      categories,
    };
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
    let { completed, title, description, priority, dueDate, categoriesID } =
      req.body;

    const updates = [];
    const params = [];
    // -------
    // Validate categoriesID
    // -------
    if (categoriesID !== undefined) {
      if (!Array.isArray(categoriesID)) {
        return res.status(400).json({
          message: 'categoriesID must be an array.',
          success: false,
        });
      }

      categoriesID = categoriesID.map(Number);

      if (categoriesID.some(id => !Number.isInteger(id) || id <= 0)) {
        return res.status(400).json({
          message: 'Invalid category ID.',
          success: false,
        });
      }
    }
    // -------
    // Validate completed
    // -------
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
    // -------
    // Validate title
    // -------
    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title);
    }
    // -------
    // Validate description
    // -------
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    // -------
    // Validate priority
    // -------
    if (priority) {
      priority = priority.toLowerCase();
      if (!acceptedPriority.includes(priority)) {
        return res.status(400).send({
          message: 'Priority can be only high, medium or low.',
          success: false,
        });
      }
      updates.push('priority = ?');
      params.push(priority);
    }
    // -------
    // Validate dueDate
    // -------
    if (dueDate) {
      const date = new Date(dueDate);

      if (Number.isNaN(date.getTime())) {
        return res.status(400).json({
          message: 'Invalid due date.',
          success: false,
        });
      }

      dueDate = date.toISOString();
      updates.push('dueDate = ?');
      params.push(dueDate);
    } else {
      dueDate = null;
    }
    // -------
    // Validate Empty Update
    // -------
    if (updates.length === 0 && categoriesID === undefined) {
      return res.status(400).send({
        message: 'Incomplete update',
        success: false,
      });
    }
    const taskExists = await db.get(
      `
      SELECT id FROM tasks
      WHERE tasks.id=?
      `,
      [patchId]
    );
    if (!taskExists) {
      return res.status(404).send({
        message: 'Task not found.',
        success: false,
      });
    }
    let result;
    if (updates.length > 0) {
      params.push(patchId);
      result = await db.get(
        `
        UPDATE tasks
        SET ${updates.join(', ')}
        WHERE id=?
        RETURNING id,title,description,completed,created_at,priority,dueDate
        `,
        params
      );
    } else {
      result = await db.get(
        `
        SELECT
          t.id,
          t.title,
          t.description,
          t.completed,
          t.created_at,
          t.priority,
          t.dueDate
        FROM tasks t
        WHERE t.id=?
        `,
        [patchId]
      );
    }

    if (categoriesID !== undefined) {
      await db.run(
        `
        DELETE FROM task_categories
        WHERE task_id = ?
        `,
        [patchId]
      );

      if (categoriesID.length > 0) {
        const placeholder = categoriesID.map(() => `(?,?)`).join(',');
        const values = categoriesID.flatMap(num => [patchId, num]);
        await db.run(
          `
          INSERT INTO task_categories(task_id,category_id)
          VALUES ${placeholder}
          `,
          values
        );
      }
    }

    const categories = await db.all(
      `
      SELECT
          c.id,
          c.name
      FROM categories c
      JOIN task_categories tc ON tc.category_id=c.id
      WHERE tc.task_id = ?
      `,
      patchId
    );
    const tasks = {
      ...result,
      completed: Boolean(result.completed),
      categories,
    };
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
    await db.run(
      `
      DELETE FROM task_categories
      WHERE task_id=?
      `,
      id
    );
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
