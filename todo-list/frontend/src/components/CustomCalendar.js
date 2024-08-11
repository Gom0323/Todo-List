import React, { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  format,
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

function CustomCalendar({ onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date());

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

  return (
    <div className="calendar">
      <div className="month">
        <button onClick={handlePrevMonth}>이전</button>
        <span>{format(currentDate, "yyyy년 M월")}</span>
        <button onClick={handleNextMonth}>다음</button>
      </div>
      <div className="day">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "30px",
          }}
        >
          {["일", "월", "화", "수", "목", "금", "토"].map((dayName, index) => (
            <div
              key={index}
              style={{
                flex: 0.1,
                textAlign: "center",
                padding: "10px",
                color:
                  dayName === "일"
                    ? "red"
                    : dayName === "토"
                    ? "blue"
                    : "black",
              }}
            >
              {dayName}
            </div>
          ))}
        </div>
        {daysInCalendar.map((week, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "center" }}>
            {week.map((day, j) => {
              const isCurrentMonth =
                format(day, "M") === format(currentDate, "M");
              return (
                <div
                  key={j}
                  style={{
                    flex: 0.1,
                    textAlign: "center",
                    padding: "10px",
                    cursor: "pointer",
                    color: isCurrentMonth ? "black" : "#ddd",
                  }}
                  onClick={() => handleDateClick(day)}
                >
                  {format(day, "d")}
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
