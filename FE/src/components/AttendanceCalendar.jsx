import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const AttendanceCalendar = () => {
  return (
    <React.Fragment>
      <DayPicker
        mode="single"
        modifiers={{
          present: (date) =>
            attendance[date.toISOString.slice(0, 10)] === "present",
          absent: (date) =>
            attendance[date.toISOString().slice(0, 10)] === "absent",
          leave: (date) =>
            attendance[date.toISOString().slice(0, 10)] === "leave",
        }}
        modifiersClassNames={{
          present: "bg-green-500 text-white",
          absent: "bg-red-500 text-white",
          leave: "bg-yellow-500 text-black",
        }}
        onDayClick={() => console.log("Day was clicked")}
      />
    </React.Fragment>
  );
};

export default AttendanceCalendar;
