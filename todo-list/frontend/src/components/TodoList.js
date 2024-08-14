import React from 'react';
import TodoItem from './TodoItem';

function TodoList({ todos, toggleTodo, deleteTodo }) {
  // 전달된 todos 배열을 출력하여 확인
  // console.log('TodoList received todos:', todos);

  return (
    <div className='main_list'>
      <ul>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
          />
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
