import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import React, { useMemo, useState } from "react";

const STATUSES = [
  { value: "present", label: "Present" },
  { value: "absent", label: "Absent" },
  { value: "leave", label: "Leave" },
  { value: "half-day", label: "Half day" },
  { value: "wfh", label: "Work from home" },
];

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
    <div className="flex flex-col gap-4">
      <div className="flex justify-center">
        <DayPicker
          mode="single"
          onSelect={setSelectedDate}
          selected={selectedDate}
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
      </div>

      {selectedDate && (
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
          <p className="text-sm font-medium text-slate-700 mb-2">
            Set status for <span className="text-slate-900">{selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={getStatus(selectedDate) || ""}
              onChange={(e) => {
                const val = e.target.value;
                if (val) {
                  onDayUpdate(selectedDate, val);
                  setSelectedDate(null);
                }
              }}
              className="flex-1 min-w-[180px] rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Select status</option>
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setSelectedDate(null)}
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceCalendar;
