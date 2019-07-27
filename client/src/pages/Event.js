import React, { useState, useEffect } from "react";
import wretch from "wretch";
import { format } from "date-fns";

export default Event = ({ match }) => {
  const [event, setEvent] = useState({ date: new Date(), members: [] });

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
      <h1>{format(new Date(event.date), "P p")}</h1>

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
