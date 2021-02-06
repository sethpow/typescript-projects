import React, {useRef} from 'react'
import './NewTodo.css'

interface NewTodoProps {
    onAddTodo: (text: string) => void;
};

const NewTodo: React.FC <NewTodoProps> = (props) => {
    // assign to DOM element, and interact with it in submitTodo fn
    const textInputRef = useRef<HTMLInputElement>(null);

    function submitTodo(event: React.FormEvent){
        event.preventDefault();
        const enteredText = textInputRef.current!.value;
        props.onAddTodo(enteredText);
    }

    return (
        <form onSubmit={submitTodo}>
            <div className='form-control'>
                <label htmlFor="todo-text">Todo Text</label>
                <input type="text" id='todo-text' autoComplete='off' ref={textInputRef} />
            </div>
            <button type="submit">Add Todo</button>
        </form>
    )
}

export default NewTodo;