import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import CustomCalendar from './components/CustomCalendar';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import { format } from 'date-fns'; 
import './App.css';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchTodosForDate = useCallback((date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    axios.get(`http://localhost:3000/todos/${formattedDate}`)
      .then(response => setTodos(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetchTodosForDate(selectedDate);
  }, [selectedDate, fetchTodosForDate]);

  const addTodo = (text) => {
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    axios.post('http://localhost:3000/todos', { text, created_at: formattedDate })
      .then(() => fetchTodosForDate(selectedDate))
      .catch(error => console.error('Error adding todo:', error));
  };

  const toggleTodo = (id) => {
    axios.put(`http://localhost:3000/todos/${id}`, { completed: !todos.find(todo => todo.id === id).completed })
      .then(() => fetchTodosForDate(selectedDate))
      .catch(error => console.error('Error updating todo:', error));
  };

  const deleteTodo = (id) => {
    axios.delete(`http://localhost:3000/todos/${id}`)
      .then(() => fetchTodosForDate(selectedDate))
      .catch(error => console.error('Error deleting todo:', error));
  };

  return (
    <div className="app">
      <h1>할 일 관리</h1>
      <div className="main-content">
        <CustomCalendar onDateSelect={(date) => setSelectedDate(date)} />
        <div className="todo-section">
          <TodoForm addTodo={addTodo} />
          <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
          <p>
            {todos.length === 0
              ? "아직 아무것도 안했어.."
              : todos.filter(todo => !todo.completed).length === 0
              ? "다했다!!"
              : `${todos.filter(todo => !todo.completed).length} 개나 남았어...`}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TodoApp;
