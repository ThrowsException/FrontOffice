import React, { useState } from "react";
import { startOfToday, format } from "date-fns";

const EventForm = ({ submit }) => {
  const [form, setFormValues] = useState({
    name: ""
  });

  const [selectedDate, handleDateChange] = useState(
    format(startOfToday(), "yyyy-MM-dd")
  );

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
        type="date"
        name="date"
        min={format(new Date(), "yyyy-MM-dd")}
        value={selectedDate}
        onChange={handleDateChange}
      />
      <button
        variant="contained"
        color="primary"
        onClick={() =>
          submit(form.name, format(selectedDate, "yyyy-MM-dd HH:mm:ssxxxxx"))
        }
      >
        Create Event
      </button>
    </>
  );
};

export default EventForm;
