import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core";
import { DateTimePicker } from "@material-ui/pickers";
import { startOfToday, format } from "date-fns";

const EventForm = ({ submit }) => {
  const [form, setFormValues] = useState({
    name: ""
  });

  const [selectedDate, handleDateChange] = useState(startOfToday());

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormValues({ ...form, [name]: value });
  };
  return (
    <>
      <TextField
        label="Event Name"
        name="name"
        onChange={handleInputChange}
        value={form.name}
      />
      <DateTimePicker
        variant="inline"
        name="date"
        label="Basic example"
        value={selectedDate}
        onChange={handleDateChange}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          submit(form.name, format(selectedDate, "yyyy-MM-dd HH:mm:ssxxxxx"))
        }
      >
        Create Event
      </Button>
    </>
  );
};

export default EventForm;
