import React, { useState } from 'react';
import NewTodo from './components/NewTodo';
import TodoList from './components/TodoList';
import { Todo } from './todo.model';

function App() {
    const [todos, setTodos] = useState<Todo[]>([]);

    function todoAddHandler(text: string){
        setTodos(prevTodos => [
            ...prevTodos,
            {id: Math.random().toString(), text: text}
        ]);
    }

    function todoDeleteHandler(todoId: string) {
        setTodos(prevTodos => {
            return prevTodos.filter(todo => todo.id !== todoId);
        });
    }

    return (
        <div className="App">
            <NewTodo onAddTodo={todoAddHandler} />
            <TodoList onDeleteTodo={todoDeleteHandler} items={todos} />
        </div>
    );
}

export default App;