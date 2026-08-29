import express from 'express';
import {
  createTask,
  deleteTask,
  getSingleTask,
  getTasks,
  updateTask,
} from '../controllers/taskController.js';
export const taskRouter = express.Router();

taskRouter.get('/', getTasks);
taskRouter.get('/:id', getSingleTask);
taskRouter.post('/', createTask);
taskRouter.patch('/:id', updateTask);
taskRouter.delete('/:id', deleteTask);
