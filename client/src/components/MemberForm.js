import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core";

const MemberForm = ({ submit }) => {
  const [member, setMemberValues] = useState({
    name: "",
    email: "",
    phone: ""
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

export default MemberForm;
