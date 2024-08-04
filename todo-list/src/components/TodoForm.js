import React, { useState } from 'react';

function TodoForm({ addTodo }) {
  // 입력 필드 상태 관리
  const [input, setInput] = useState('');

  // 폼 제출 처리
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      addTodo(input);  // 새로운 할 일 추가
      setInput('');    // 입력 필드 초기화
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="할 일을 입력해주세요"
      />
      <button type="submit">추가</button>
    </form>
  );
}

export default TodoForm;
