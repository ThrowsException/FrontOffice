import React from 'react'
import PropTypes from 'prop-types'
import { startOfToday, format } from 'date-fns'
import { Formik, Field } from 'formik'
import Button from './Button'
import Input, { StyledSelect } from './Input'

const validate = values => {
  const errors = {}

  if (!values.name.trim()) {
    errors.name = 'Name Required'
  }

  return errors
}

const EventForm = ({ submit, players }) => {
  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          date: format(startOfToday(), 'yyyy-MM-dd'),
          name: '',
          refreshments: '',
          hour: 1,
          minute: 0,
          period: 'PM',
          reminder: 3,
        }}
        onSubmit={values => {
          submit(values)
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
        }) => (
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '960px',
            }}
          >
            <Input
              name="name"
              placeholder="name"
              onChange={handleChange}
              value={values.name}
            />
            {errors.name && touched.name && <div>{errors.name}</div>}

            <StyledSelect
              name="refreshments"
              onChange={handleChange}
              value={values.refreshments}
              onBlur={handleBlur}
            >
              <option value="">Refreshments...</option>
              {players.map(i => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </StyledSelect>
            <input
              style={{ width: '150px' }}
              required
              type="date"
              name="date"
              min={format(new Date(), 'yyyy-MM-dd')}
              max="2050-01-01"
              value={values.date}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <div>
              <StyledSelect
                name="hour"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.hour}
              >
                {[...Array(12).keys()].map(i => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </StyledSelect>
              <StyledSelect
                name="minute"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.minute}
              >
                {[...Array(60).keys()].map(i => (
                  <option key={i} value={`00${i}`.substr(-2, 2)}>
                    {`00${i}`.substr(-2, 2)}
                  </option>
                ))}
              </StyledSelect>
              <StyledSelect
                name="period"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.period}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </StyledSelect>
              <h2>**Beta**</h2>
              <p>
                A reminder to all players will go out the day of an event
                automatically
              </p>
              <p>
                An invite to automatically be sent ahead of time configured here
              </p>
              <label htmlFor="reminder">Remind Players: </label>
              <Field
                name="reminder"
                render={({ field }) => (
                  <StyledSelect {...field}>
                    <option value="3">3 days before event</option>
                    <option value="4">4 days before event</option>
                    <option value="5">5 days before event</option>
                  </StyledSelect>
                )}
              />
            </div>
            <Button type="submit">Create Event</Button>
          </form>
        )}
      </Formik>
    </>
  )
}

EventForm.propTypes = {
  submit: PropTypes.func.isRequired,
  players: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.name,
    })
  ),
}

EventForm.defaultProps = {
  players: [],
}

export default EventForm
