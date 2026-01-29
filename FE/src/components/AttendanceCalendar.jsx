import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import React, { useMemo, useState } from "react";

const STATUSES = ["present", "absent", "leave", "half-day", "wfh"];

const AttendanceCalendar = ({ attendance = [], onDayUpdate }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const attendanceMap = useMemo(() => {
    const map = {};
    attendance.forEach((a) => {
      const key = new Date(a.date).toISOString().slice(0, 10);
      map[key] = a.status;
    });
    return map;
  }, [attendance]);

  const getStatus = (date) => attendanceMap[date.toISOString().slice(0, 10)];

  return (
    <>
      <DayPicker
        onDayClick={(date) => setSelectedDate(date)}
        modifiers={{
          present: (date) => getStatus(date) === "present",
          absent: (date) => getStatus(date) === "absent",
          leave: (date) => getStatus(date) === "leave",
          halfDay: (date) => getStatus(date) === "half-day",
          wfh: (date) => getStatus(date) === "wfh",
        }}
        modifiersStyles={{
          present: { color: "#16a34a", fontWeight: 700 },
          absent: { color: "#dc2626", fontWeight: 700 },
          leave: { color: "#ca8a04", fontWeight: 700 },
          halfDay: { color: "#ea580c", fontWeight: 700 },
          wfh: { color: "#4f46e5", fontWeight: 700 },
        }}
      />

      {selectedDate && (
        <div style={{ marginTop: 12 }}>
          <strong>{selectedDate.toDateString()}</strong>

          <select
            value={getStatus(selectedDate) || ""}
            onChange={(e) => {
              onDayUpdate(selectedDate, e.target.value);
              setSelectedDate(null);
            }}
            style={{ marginLeft: 10 }}
          >
            <option value="">—</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  );
};

export default AttendanceCalendar;
