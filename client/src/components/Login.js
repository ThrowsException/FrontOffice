import React, { useState } from "react";
import wretch from "wretch";
import { Button, TextField } from "@material-ui/core";

const Login = () => {
  const [user, setValues] = useState({
    email: "",
    password: ""
  });

  const handleInputChange = e => {
    const { name, value } = e.target;
    setValues({ ...user, [name]: value });
  };

  const submit = async () => {
    await wretch("/api/login")
      .post({ username: user.email, password: user.password })
      .json(json => {
        callback(json);
      })
      .catch(error => console.log(error));
  };

  return (
    <>
      <TextField
        label="Username"
        name="email"
        onChange={handleInputChange}
        value={user.email}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        onChange={handleInputChange}
        value={user.password}
      />
      <Button onClick={() => submit()}>Submit</Button>
    </>
  );
};

export default Login;
