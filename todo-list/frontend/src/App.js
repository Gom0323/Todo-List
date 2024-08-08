import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import Modal from 'react-modal';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import './App.css';
import 'react-calendar/dist/Calendar.css';

Modal.setAppElement('#root');

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchTodosForDate(new Date());
  }, []);

  const fetchTodosForDate = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    axios.get(`http://localhost:3000/todos/${formattedDate}`)
      .then(response => setTodos(response.data))
      .catch(error => console.error('Error fetching data:', error));
  };

  const addTodo = (text) => {
    const formattedDate = selectedDate.toISOString().split('T')[0];
    axios.post('http://localhost:3000/todos', { text, created_at: formattedDate })
      .then(() => fetchTodosForDate(selectedDate))
      .catch(error => console.error('Error adding todo:', error));
  };

  const toggleTodo = (id) => {
    const todo = todos.find(todo => todo.id === id);
    axios.put(`http://localhost:3000/todos/${id}`, { completed: !todo.completed })
      .then(() => fetchTodosForDate(selectedDate))
      .catch(error => console.error('Error updating todo:', error));
  };

  const deleteTodo = (id) => {
    axios.delete(`http://localhost:3000/todos/${id}`)
      .then(() => fetchTodosForDate(selectedDate))
      .catch(error => console.error('Error deleting todo:', error));
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchTodosForDate(date);
    closeModal();
  };

  const allTodosCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <div className="app" style={{ backgroundColor: allTodosCompleted ? '#d4edda' : 'white' }}>
      <h1>
        오늘 할 일
      </h1>
        <button onClick={openModal} className="calendar-button">
          <img src={process.env.PUBLIC_URL + '/calendar.png'} alt='달력'/>
        </button>
      <TodoForm addTodo={addTodo} />
      <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
      <p>
        {todos.length === 0
          ? "아직 아무것도 안했어.."
          : todos.filter(todo => !todo.completed).length === 0
          ? "다했다!!"
          : `${todos.filter(todo => !todo.completed).length} 개나 남았어...`}
      </p>
      <Modal 
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Calendar Modal"
        className="calendar-modal"
        overlayClassName="calendar-overlay"
      >
        <Calendar 
          onChange={handleDateChange} 
          value={selectedDate}
          locale="ko-KR"
          formatShortWeekday={(locale, date) => {
            const weekDay = date.toLocaleDateString(locale, { weekday: 'short' });
            return weekDay[0]; // 요일의 첫 글자만 표시
          }}
          tileClassName={({ date, view }) => view === 'month' && date.getDay() === 0 ? 'sunday' : ''}
        />
        <button onClick={closeModal}>닫기</button>
      </Modal>
    </div>
  );
}

export default TodoApp;
