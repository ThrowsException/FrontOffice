import React from "react";
import styled from "styled-components";
import { Formik } from "formik";
import Button from "./Button";

const StyledForm = styled.form`
  min-width: 320px;
  max-width: 600px;
`;

const validate = values => {
  let errors = {};

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  if (!values.name) {
    errors.name = "Required";
  }

  return errors;
};

const PlayerForm = ({ submit }) => {
  return (
    <Formik
      initialValues={{ name: "", email: "", phone: "" }}
      onSubmit={(values, actions) => {
        submit(values);
        actions.setSubmitting(false);
      }}
      validate={validate}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting
        /* and other goodies */
      }) => (
        <StyledForm onSubmit={handleSubmit}>
          <input
            required
            name="name"
            placeholder="Name"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.name}
          />
          {errors.name && touched.name && <div>{errors.name}</div>}
          <input
            required
            name="email"
            placeholder="Email"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.email}
          />
          {errors.email && touched.email && <div>{errors.email}</div>}
          <input
            name="phone"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.phone}
          />
          <Button type="submit" disabled={isSubmitting}>
            Create Member
          </Button>
        </StyledForm>
      )}
    </Formik>
  );
};

export default PlayerForm;
