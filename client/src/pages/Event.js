import React, { useState, useEffect } from "react";
import wretch from "wretch";
import { Button } from "@material-ui/core";
import { format } from "date-fns";
import styled from "styled-components";

const EventReply = styled.span`
  color: ${p => (p.reply ? "green" : "red")};
`;

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

  const sendInvites = async () => {
    await wretch("/api/invites").post({ event: event.id });
  };

  useEffect(() => {
    fetchData(`/api/events/${match.params.eventId}`, setEvent);
  }, {});

  return (
    <>
      <h1>{event.name}</h1>
      <h1>{format(new Date(event.date), "P p")}</h1>
      <Button variant="contained" color="primary" onClick={sendInvites}>
        Send Invites
      </Button>
      <ul>
        {event.members &&
          event.members.map(e => (
            <li key={e.email}>
              {e.name} {e.email}{" "}
              <EventReply reply={e.reply}>{e.reply ? "In" : "Out"}</EventReply>
            </li>
          ))}
      </ul>
    </>
  );
};
