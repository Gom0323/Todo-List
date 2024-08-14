import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import CustomCalendar from "./components/CustomCalendar";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import { format } from "date-fns";
import "./App.css";

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 모든 할 일 데이터를 가져오기 위한 함수
  const fetchTodos = useCallback(() => {
    axios.get(`http://localhost:4000/todos`)
      .then(response => {
        setTodos(response.data); // 모든 할 일 데이터를 설정
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = (text) => {
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    axios
      .post("http://localhost:4000/todos", { text, created_at: formattedDate })
      .then(() => fetchTodos()) // 새 할 일을 추가한 후 전체 할 일을 다시 가져옴
      .catch((error) => console.error("Error adding todo:", error));
  };

  const toggleTodo = (id) => {
    const updatedTodos = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    
    setTodos(updatedTodos); // 상태 업데이트
  
    axios
      .put(`http://localhost:4000/todos/${id}`, {
        completed: !todos.find((todo) => todo.id === id).completed,
      })
      .catch((error) => console.error("Error updating todo:", error));
  };

  const deleteTodo = (id) => {
    axios
      .delete(`http://localhost:4000/todos/${id}`)
      .then(() => fetchTodos()) // 할 일을 삭제한 후 전체 할 일을 다시 가져옴
      .catch((error) => console.error("Error deleting todo:", error));
  };

  // 선택된 날짜에 해당하는 할 일만 필터링
  const filteredTodos = todos.filter(todo => {
    const todoDate = format(new Date(todo.created_at), 'yyyy-MM-dd');
    const selectedFormattedDate = format(selectedDate, 'yyyy-MM-dd');
    return todoDate === selectedFormattedDate;
  });

  return (
    <div className="app">
      <h1>할 일 관리</h1>
      <div className="main-content">
        <CustomCalendar todos={todos} onDateSelect={(date) => setSelectedDate(date)} />
        <div className="todo-section">
          <TodoForm addTodo={addTodo} />
          <TodoList
            todos={filteredTodos}  // 선택된 날짜의 할 일만 전달
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
          />
          <p> {todos.length === 0 ? "아직 아무것도 안했어.." : todos.filter((todo) => !todo.completed).length === 0 ? "다했다!!" : `${ todos.filter((todo) => !todo.completed).length } 개나 남았어...`} </p>
        </div>
      </div>
    </div>
  );
}

export default TodoApp;
