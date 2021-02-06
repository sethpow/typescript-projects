import express from 'express'
import { json } from 'body-parser';     // parse bodies of all inc req's; extract any json found, and populate body key found in req obj (in /controllers/todos.ts on line 9)
import todoRoutes from './routes/todos';

const app = express();

app.use(json());

app.use('/todos', todoRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(500).json(err.message);
});

app.listen(3000);