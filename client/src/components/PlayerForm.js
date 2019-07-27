import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core";
import styled from "styled-components";

const StyledForm = styled.form`
  min-width: 320px;
  max-width: 600px;
`;

const PlayerForm = ({ submit }) => {
  const [member, setMemberValues] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const handleInputChange = e => {
    const { name, value } = e.target;
    setMemberValues({ ...member, [name]: value });
  };

  const submitForm = e => {
    e.preventDefault();
    if (member.name && member.email) {
      submit(member);
    }
  };

  return (
    <StyledForm onSubmit={submitForm}>
      <TextField
        required
        fullWidth
        label="Name"
        name="name"
        onChange={handleInputChange}
        value={member.name}
      />
      <TextField
        required
        fullWidth
        label="Email"
        name="email"
        onChange={handleInputChange}
        value={member.email}
      />
      <TextField
        fullWidth
        label="Phone"
        name="phone"
        onChange={handleInputChange}
        value={member.phone}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        onClick={submitForm}
      >
        Create Member
      </Button>
    </StyledForm>
  );
};

export default PlayerForm;
