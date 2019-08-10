import React, { useState, useEffect } from "react";
import w from "../utils/w";
import { format } from "date-fns";
import styled from "styled-components";
import Layout from "../layout/Layout";

const EventReply = styled.span`
  color: ${p => (p.reply ? "green" : "red")};
`;

export default Event = props => {
  const { match } = props;
  const [event, setEvent] = useState({ date: new Date(), members: [] });

  const fetchData = async (url, callback) => {
    await w
      .url(url)
      .get()
      .json(json => {
        callback(json);
      })
      .catch(error => console.log(error));
  };

  const sendInvites = async () => {
    await w.url("/api/invites").post({ event: event.id });
  };

  useEffect(() => {
    fetchData(`/api/events/${match.params.eventId}`, setEvent);
  }, {});

  return (
    <Layout {...props}>
      <h1>{event.name}</h1>
      <h1>{format(new Date(event.date), "P p")}</h1>
      <button variant="contained" color="primary" onClick={sendInvites}>
        Send Invites
      </button>
      <ul>
        {event.members &&
          event.members.map(e => (
            <li key={e.email}>
              {e.name} {e.email}{" "}
              <EventReply reply={e.reply}>{e.reply ? "In" : "Out"}</EventReply>
            </li>
          ))}
      </ul>
    </Layout>
  );
};
