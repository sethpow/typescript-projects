"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.updateTodo = exports.getTodos = exports.createTodo = void 0;
const todo_1 = require("../models/todo");
const TODOS = [];
// create todo
// export const createTodo = (req: express.Request, res: express.Response, next: express.NextFunction) => {}
const createTodo = (req, res, next) => {
    const text = req.body.text;
    const newTodo = new todo_1.Todo(Math.random().toString(), text);
    TODOS.push(newTodo);
    res.status(201).json({ message: "Created todo!", createdTodo: newTodo });
};
exports.createTodo = createTodo;
// get all todos
const getTodos = (req, res, next) => {
    res.json({ todos: TODOS });
};
exports.getTodos = getTodos;
// edit todo by id
const updateTodo = (req, res, next) => {
    const todoId = req.params.id;
    const updatedText = req.body.text;
    const todoIndex = TODOS.findIndex(todo => todo.id === todoId);
    if (todoIndex < 0) {
        throw new Error('Could not find todo');
    }
    TODOS[todoIndex] = new todo_1.Todo(TODOS[todoIndex].id, updatedText);
    res.json({ message: "Updated todo", updateTodo: TODOS[todoIndex] });
};
exports.updateTodo = updateTodo;
const deleteTodo = (req, res, next) => {
    const todoId = req.params.id;
    const todoIndex = TODOS.findIndex(todo => todo.id === todoId);
    if (todoIndex < 0) {
        throw new Error('Could not find todo');
    }
    TODOS.splice(todoIndex, 1);
    res.json({ message: "Deleted todo" });
};
exports.deleteTodo = deleteTodo;
