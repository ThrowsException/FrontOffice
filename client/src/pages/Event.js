import React, { useState, useEffect } from "react";
import wretch from "wretch";

export default Event = ({ match }) => {
  const [event, setEvent] = useState({ members: [] });

  const fetchData = async (url, callback) => {
    await wretch(url)
      .get()
      .json(json => {
        callback(json);
      })
      .catch(error => console.log(error));
  };

  useEffect(() => {
    fetchData(`/api/events/${match.params.eventId}`, setEvent);
  }, {});

  return (
    <>
      <h1>{event.name}</h1>
      <h1>{event.date}</h1>

      <ul>
        {event.members &&
          event.members.map(e => (
            <li>
              {e.name} {e.email} {e.reply ? e.reply : "No Reply"}
            </li>
          ))}
      </ul>
    </>
  );
};
