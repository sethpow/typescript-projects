// holds controller functions we want to point at from inside our routes
import { RequestHandler } from 'express';
import { Todo } from '../models/todo';

const TODOS: Todo[] = [];

// create todo
// export const createTodo = (req: express.Request, res: express.Response, next: express.NextFunction) => {}
export const createTodo: RequestHandler = (req, res, next) => {
    const text = (req.body as {text: string}).text;
    const newTodo = new Todo(Math.random().toString(), text);

    TODOS.push(newTodo);

    res.status(201).json({message: "Created todo!", createdTodo: newTodo});
}

// get all todos
export const getTodos: RequestHandler = (req, res, next) => {
    res.json({todos: TODOS});
}

// edit todo by id
export const updateTodo: RequestHandler <{id: string}> = (req, res, next) => {
    const todoId = req.params.id;

    const updatedText = (req.body as {text: string}).text;

    const todoIndex = TODOS.findIndex(todo => todo.id === todoId);
    if(todoIndex < 0){
        throw new Error('Could not find todo');
    }
    
    TODOS[todoIndex] = new Todo(TODOS[todoIndex].id, updatedText);
    
    res.json({ message: "Updated todo", updateTodo: TODOS[todoIndex] });
}

export const deleteTodo: RequestHandler = (req, res, next) => {
    const todoId = req.params.id;
    
    const todoIndex = TODOS.findIndex(todo => todo.id === todoId);
    if(todoIndex < 0){
        throw new Error('Could not find todo');
    }

    TODOS.splice(todoIndex, 1);

    res.json({ message: "Deleted todo" });
}