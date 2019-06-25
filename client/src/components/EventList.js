import React from "react";

const EventList = ({ events }) => {
  return (
    <>
      {events.length > 0 ? (
        <ul>
          {events.map(events => (
            <li key={events.id}>
              {events.name} {events.email}
            </li>
          ))}
        </ul>
      ) : (
        <span>No Upcoming Events</span>
      )}
    </>
  );
};

export default EventList;
