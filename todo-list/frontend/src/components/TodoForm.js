import React, { useState } from 'react';

function TodoForm({ addTodo }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      addTodo(input);
      setInput('');
    }
  };

  return (
    <div className='main_form'>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="뭘 해야 하더라?"
        />
        <button type="submit">
          <img src={process.env.PUBLIC_URL + '/add.png'} alt='추가'/>
        </button>
      </form>
    </div>
  );
}

export default TodoForm;
