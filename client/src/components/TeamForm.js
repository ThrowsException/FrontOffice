import React, { useState } from "react";
import styled from "styled-components";

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

const StyledButton = styled.button`
  background-color: #58a4b0;
  color: white;
  font-size: 1em;
  padding: 1em;
  border: 0;
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
      <StyledButton
        type="submit"
        onClick={() => {
          submit(name);
          setName("");
        }}
      >
        Create Team
      </StyledButton>
    </>
  );
};

export default TeamForm;
