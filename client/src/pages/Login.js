import React, { useEffect } from "react";
import wretch from "wretch";
import styled from "styled-components";
import { Formik } from "formik";

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
  useEffect(() => {
    if (document.cookie.indexOf("logged_in") > -1) {
      history.push("/teams");
    }
  });

  const submit = async (values, { setSubmitting, setErrors }) => {
    await wretch("/api/login")
      .post({ username: values.email, password: values.password })
      .json(() => {
        document.cookie = "logged_in=1";
        history.push("/teams");
      })
      .catch(e => setErrors({ api: e.message }))
      .finally(setSubmitting(false));
  };

  return (
    <Formik initialValues={{ email: "", password: "" }} onSubmit={submit}>
      {props => {
        const {
          values,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          errors
        } = props;
        return (
          <Container>
            <Content>
              <h2 style={{ width: "100%", textAlign: "center" }}>
                Front Office
              </h2>
              {errors && errors.api && (
                <span style={{ color: "red" }}>{errors.api}</span>
              )}
              <form onSubmit={handleSubmit}>
                <StyledInput
                  label="Email"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  autoComplete="email"
                  autoFocus
                  placeholder="Email"
                />
                <StyledInput
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  placeholder="Password"
                />
                <LoginButton type="submit" disabled={isSubmitting}>
                  Login
                </LoginButton>
              </form>
            </Content>
          </Container>
        );
      }}
    </Formik>
  );
};

export default Login;
