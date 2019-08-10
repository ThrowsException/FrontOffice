import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Button from "./Button";

const StyledInput = styled.input`
  font-size: 1em;
  padding: 1em 0;
  margin-bottom: 8px;
  padding-left: 1em;
  outline: 0;
  border-width: 0 0 2px;
  border-color: black;
  margin-bottom: 2px;
  box-sizing: border-box;
  background: none;
`;

const TeamForm = ({ submit }) => {
  const [name, setName] = useState("");

  const handleInputChange = e => {
    const { value } = e.target;
    setName(value);
  };

  return (
    <>
      <div>
        <StyledInput
          placeholder="Team Name"
          name="team"
          onChange={handleInputChange}
          value={name}
        />
      </div>
      <Button
        type="submit"
        onClick={() => {
          submit(name);
          setName("");
        }}
      >
        Create Team
      </Button>
    </>
  );
};

TeamForm.propTypes = {
  submit: PropTypes.func.isRequired
};

export default TeamForm;
