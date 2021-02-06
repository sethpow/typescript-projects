import { Router } from 'express'
import { createTodo, getTodos, updateTodo, deleteTodo } from '../controllers/todos'

const router = Router();

// post one todo
router.post('/', createTodo);

// get all todos
router.get('/', getTodos);

// edit todo by id
router.patch('/:id', updateTodo);

// delete todo by id
router.delete('/:id', deleteTodo);

export default router;