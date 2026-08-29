import cors from 'cors';
import express from 'express';
import { taskRouter } from './router/taskRouter.js';
const app = express();
const PORT = 3000;

// app.use(cors());
app.use(express.json());

app.use('/api/tasks', taskRouter);

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
