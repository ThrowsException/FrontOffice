import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Formik } from 'formik'
import Button from './Button'
import Input from './Input'

const StyledForm = styled.form`
  min-width: 320px;
  max-width: 960px;
  display: flex;
  flex-direction: column;
`

const validate = values => {
  const errors = {}

  if (!values.email) {
    errors.email = 'Required'
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address'
  }

  if (!values.name) {
    errors.name = 'Required'
  }

  return errors
}

const PlayerForm = ({ submit }) => {
  return (
    <Formik
      initialValues={{ name: '', email: '', phone: '' }}
      onSubmit={(values, actions) => {
        submit(values)
        actions.setSubmitting(false)
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
        isSubmitting,
        /* and other goodies */
      }) => (
        <StyledForm onSubmit={handleSubmit}>
          <Input
            required
            name="name"
            placeholder="Name"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.name}
          />
          {errors.name && touched.name && <div>{errors.name}</div>}
          <Input
            required
            name="email"
            placeholder="Email"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.email}
          />
          {errors.email && touched.email && <div>{errors.email}</div>}
          <Input
            name="phone"
            placeholder="phone"
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
  )
}

PlayerForm.propTypes = {
  submit: PropTypes.func.isRequired,
}

export default PlayerForm
