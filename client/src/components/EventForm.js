import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core";

const EventForm = ({ submit }) => {
  const [form, setFormValues] = useState({
    name: ""
  });

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormValues({ ...form, [name]: value });
  };
  return (
    <>
      <div>
        <TextField
          label="Event Name"
          name="name"
          onChange={handleInputChange}
          value={form.name}
        />
      </div>
      <Button variant="contained" color="primary" onClick={() => submit(form)}>
        Create Event
      </Button>
    </>
  );
};

export default EventForm;
