import React, { useState } from "react";
import { startOfToday, format } from "date-fns";
import { Formik } from "formik";

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
        console.log(values);
        submit(values);
      }}
    >
      {({ values, handleChange, handleBlur, handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="name"
            onChange={handleChange}
            value={values.name}
          />
          <input
            required
            type="date"
            name="date"
            min={format(new Date(), "yyyy-MM-dd")}
            max={"2050-01-01"}
            value={values.date}
            onChange={handleChange}
            onBlur={handleBlur}
          />
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
              <option key={i} value={("00" + i).substr(-2, 2)}>
                {("00" + i).substr(-2, 2)}
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
          <button type="submit">Create Event</button>
        </form>
      )}
    </Formik>
  );
};

export default EventForm;
