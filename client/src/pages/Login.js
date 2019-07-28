import React, { useState } from "react";
import wretch from "wretch";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-conent: center;
  height: 100vh;
  width: 100%;
`;

const Content = styled.div`
  width: 320px;
  margin-top: 20vh;
`;

const StyledInput = styled.input`
  width: 100%;
  font-size: 1em;
  padding: 1em 0;
  background-color: #d8dbe2;
  border-style: none;
  margin-bottom: 8px;
  border-radius: 4px;
  padding-left: 1em;
  box-sizing: border-box;
`;

const LoginButton = styled.button`
  background-color: #58a4b0;
  color: white;
  font-size: 1em;
  padding: 1em 0;
  width: 100%;
  border-radius: 2px;
`;

const Login = ({ history }) => {
  const [user, setValues] = useState({
    email: "",
    password: ""
  });
  const [formError, setFormError] = useState();

  const handleInputChange = e => {
    const { name, value } = e.target;
    setValues({ ...user, [name]: value });
  };

  const submit = async e => {
    e.preventDefault();
    await wretch("/api/login")
      .post({ username: user.email, password: user.password })
      .json(() => {
        history.push("/teams");
      })
      .catch(error => setFormError(error));
  };

  return (
    <Container>
      <Content>
        <h2 style={{ width: "100%", textAlign: "center" }}>Front Office</h2>
        {formError && <span style={{ color: "red" }}>{formError.message}</span>}
        <form onSubmit={submit}>
          <StyledInput
            label="Email"
            name="email"
            onChange={handleInputChange}
            value={user.email}
            autoComplete="email"
            autoFocus
            placeholder="Email"
          />
          <StyledInput
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            onChange={handleInputChange}
            value={user.password}
            placeholder="Password"
          />
          <LoginButton type="submit" onClick={submit}>
            Login
          </LoginButton>
        </form>
      </Content>
    </Container>
  );
};

export default Login;
