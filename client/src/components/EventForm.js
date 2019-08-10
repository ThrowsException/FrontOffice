import React from "react";
import PropTypes from "prop-types";
import { startOfToday, format } from "date-fns";
import { Formik } from "formik";
import Button from "./Button";
import Input from "./Input";

const EventForm = ({ submit }) => {
  return (
    <Formik
      initialValues={{
        date: format(startOfToday(), "yyyy-MM-dd"),
        name: "",
        hour: 1,
        minute: 0,
        period: "PM"
      }}
      onSubmit={values => {
        submit(values);
      }}
    >
      {({ values, handleChange, handleBlur, handleSubmit }) => (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "960px"
          }}
        >
          <Input
            name="name"
            placeholder="name"
            onChange={handleChange}
            value={values.name}
          />
          <Input
            required
            type="date"
            name="date"
            min={format(new Date(), "yyyy-MM-dd")}
            max="2050-01-01"
            value={values.date}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <div>
            <select
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
            </select>
            <select
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
            </select>
            <select
              name="period"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.period}
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
          <Button type="submit">Create Event</Button>
        </form>
      )}
    </Formik>
  );
};

EventForm.propTypes = {
  submit: PropTypes.func.isRequired
};

export default EventForm;
