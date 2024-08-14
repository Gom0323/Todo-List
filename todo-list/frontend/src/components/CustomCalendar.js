import React, { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  format,
  isSameDay,
} from "date-fns";

function generateCalendar(year, month) {
  const firstDayOfMonth = startOfMonth(new Date(year, month));
  const lastDayOfMonth = endOfMonth(firstDayOfMonth);
  const firstDayOfWeek = startOfWeek(firstDayOfMonth);

  const daysInCalendar = [];
  let currentDay = firstDayOfWeek;

  while (currentDay <= lastDayOfMonth || daysInCalendar.length < 6) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(currentDay);
      currentDay = addDays(currentDay, 1);
    }
    daysInCalendar.push(week);
  }

  return daysInCalendar;
}

function CustomCalendar({ todos = [], onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInCalendar = generateCalendar(year, month);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (date) => {
    onDateSelect(date);
  };

  // 할 일을 모두 마친 날짜인지 확인
  const isAllTodosCompleted = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const todosForDate = todos.filter(todo => {
      const todoDate = format(new Date(todo.created_at), 'yyyy-MM-dd');
      return todoDate === formattedDate;
    });
  
    return todosForDate.length > 0 && todosForDate.every(todo => todo.completed);
  };
  
  const hasTodos = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const todosExist = todos.some(todo => {
      const todoDate = format(new Date(todo.created_at), 'yyyy-MM-dd');
      return todoDate === formattedDate;
    });
  
    // console.log(`Checking if todos exist for ${formattedDate}:`, todosExist); // 디버깅 메시지 추가
    return todosExist;
  };

  return (
    <div className="calendar">
      <div className="month">
        <button onClick={handlePrevMonth}>이전</button>
        <span>{format(currentDate, "yyyy년 M월")}</span>
        <button onClick={handleNextMonth}>다음</button>
      </div>
      <div className="day">
        <div style={{ display: "flex", justifyContent: "center", paddingTop: "30px" }}>
          {["일", "월", "화", "수", "목", "금", "토"].map((dayName, index) => (
            <div
              key={index}
              style={{
                flex: 0.1,
                textAlign: "center",
                padding: "10px",
                color: dayName === "일" ? "red" : dayName === "토" ? "blue" : "black",
              }}
            >
              {dayName}
            </div>
          ))}
        </div>
        {daysInCalendar.map((week, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "center" }}>
            {week.map((day, j) => {
              const isCurrentMonth = format(day, "M") === format(currentDate, "M");
              const isToday = isSameDay(day, today);
              const allTodosCompleted = isAllTodosCompleted(day); // 모든 할 일이 완료된 날
              const todosExist = hasTodos(day); // 할 일이 존재하는 날

              return (
                <div
                  key={j}
                  style={{
                    flex: 0.1,
                    textAlign: "center",
                    padding: "10px",
                    cursor: "pointer",
                    backgroundColor: allTodosCompleted ? '#39d353' : isToday ? 'pink' : '', // 할 일을 모두 마친 날짜의 배경색과 오늘 날짜의 배경색 설정
                    border: todosExist && !allTodosCompleted ? '0.5px solid #000' : 'none', // 할 일이 있는 날짜에만 테두리 추가, 할 일을 모두 마친 경우 테두리 제거
                    color: isCurrentMonth ? "black" : "#ddd",  // 현재 월에 속하지 않는 날짜는 회색으로 표시
                  }}
                  onClick={() => handleDateClick(day)}
                >
                  {format(day, "d")}  {/* 날짜 숫자 표시 */}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomCalendar;
