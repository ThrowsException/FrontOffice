import React, { useState, useEffect } from "react";
import { Button, TextField } from "@material-ui/core";

const CreateMemberComponent = ({ submit }) => {
  const [member, setMemberValues] = useState({
    name: "",
    email: "",
    phone: "",
    team: ""
  });

  const handleInputChange = e => {
    const { name, value } = e.target;
    setMemberValues({ ...member, [name]: value });
  };

  return (
    <div>
      <div>
        <TextField
          label="Name"
          name="name"
          onChange={handleInputChange}
          value={member.name}
        />
        <TextField
          label="Email"
          name="email"
          onChange={handleInputChange}
          value={member.email}
        />
        <TextField
          label="Phone"
          name="phone"
          onChange={handleInputChange}
          value={member.phone}
        />
        <TextField
          label="Team Id"
          name="team"
          onChange={handleInputChange}
          value={member.team}
        />
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => submit(member)}
      >
        Create Member
      </Button>
    </div>
  );
};

export default CreateMemberComponent;
