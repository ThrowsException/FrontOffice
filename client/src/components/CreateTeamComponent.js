import React, { useState, useEffect } from "react";
import { Button, TextField } from "@material-ui/core";

const CreateTeamComponent = ({ submit }) => {
  const [name, setName] = useState("");

  const handleInputChange = e => {
    const { value } = e.target;
    setName(value);
  };

  return (
    <>
      <div>
        <TextField
          label="Team Name"
          name="team"
          onChange={handleInputChange}
          value={name}
        />
      </div>
      <Button variant="contained" color="primary" onClick={() => submit(name)}>
        Create Team
      </Button>
    </>
  );
};

export default CreateTeamComponent;
