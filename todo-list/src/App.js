import React, { useState } from 'react';
import Calendar from 'react-calendar';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import 'react-calendar/dist/Calendar.css';
import './App.css';

function TodoApp() {
  // 할 일 목록 관리
  const [todos, setTodos] = useState([]);

  // 할 일 추가
  const addTodo = (text) => {
    const newTodo = { id: Date.now(), text, completed: false };
    setTodos([...todos, newTodo]);
  };

  // 완료/미완료 상태 변경
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // 할 일 삭제
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // 남은 할 일 갯수 계산
  const remainingTodos = todos.filter(todo => !todo.completed).length;

  // 캘린더
  const [value, onChange] = useState(new Date());

  return (
    <div className="app">
      <h1>오늘 할 일</h1>
      <TodoForm addTodo={addTodo} />
      <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
      <p>
        {todos.length === 0
          ? "아직 아무것도 안했어.."
          : remainingTodos === 0
          ? "다했다!!"
          : `${remainingTodos} 개나 남았어...`}
      </p>
    </div>
  );
}

export default TodoApp;
