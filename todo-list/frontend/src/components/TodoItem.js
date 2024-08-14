import React from 'react';

function TodoItem({ todo, toggleTodo, deleteTodo }) {
  return (
    <li>
      <label className="checkbox-container">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
        />
        <span className="checkmark"></span>
      </label>
      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
        {todo.text}
      </span>
      <button onClick={() => deleteTodo(todo.id)}>
        <img src={process.env.PUBLIC_URL + '/Delete.png'} alt='삭제' />
      </button>
    </li>
  );
}

export default TodoItem;
