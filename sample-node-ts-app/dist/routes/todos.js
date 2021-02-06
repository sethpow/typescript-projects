"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const todos_1 = require("../controllers/todos");
const router = express_1.Router();
// post one todo
router.post('/', todos_1.createTodo);
// get all todos
router.get('/', todos_1.getTodos);
// edit todo by id
router.patch('/:id', todos_1.updateTodo);
// delete todo by id
router.delete('/:id', todos_1.deleteTodo);
exports.default = router;
