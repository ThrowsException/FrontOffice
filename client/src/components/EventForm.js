import React, { useState } from "react";
import { startOfToday, format } from "date-fns";

const EventForm = ({ submit }) => {
  const [form, setFormValues] = useState({
    name: "",
    date: format(startOfToday(), "yyyy-MM-dd"),
    hour: 1,
    minute: 0,
    period: "PM"
  });

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormValues({ ...form, [name]: value });
  };

  return (
    <>
      <input
        label="Event Name"
        name="name"
        onChange={handleInputChange}
        value={form.name}
      />
      <input
        required
        type="date"
        name="date"
        min={format(new Date(), "yyyy-MM-dd")}
        max={"2050-01-01"}
        value={form.date}
        onChange={handleInputChange}
      />
      <select name="hour" onChange={handleInputChange} value={form.hour}>
        {[...Array(12).keys()].map(i => (
          <option key={i} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>
      <select name="minute" onChange={handleInputChange} value={form.minute}>
        {[...Array(60).keys()].map(i => (
          <option key={i} value={("00" + i).substr(-2, 2)}>
            {("00" + i).substr(-2, 2)}
          </option>
        ))}
      </select>
      <select name="period" onChange={handleInputChange} value={form.period}>
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
      <button variant="contained" color="primary" onClick={() => submit(form)}>
        Create Event
      </button>
    </>
  );
};

export default EventForm;
