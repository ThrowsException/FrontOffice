import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import styled from "styled-components";
import Layout from "../layout/Layout";
import w from "../utils/w";

const EventReply = styled.span`
  color: ${p => (p.reply ? "green" : "red")};
`;

const Event = props => {
  const { match } = props;
  const [event, setEvent] = useState({ date: new Date(), members: [] });

  const fetchData = async (url, callback) => {
    await w
      .url(url)
      .get()
      .json(json => {
        callback(json);
      });
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
      <button
        variant="contained"
        color="primary"
        onClick={sendInvites}
        type="button"
      >
        Send Invites
      </button>
      <ul>
        {event.members &&
          event.members.map(e => {
            let reply =
              e.reply === null ? "Not Replied" : e.reply ? "In" : "Out";

            return (
              <li key={e.email}>
                {e.name}
                {e.email}
                <EventReply reply={e.reply}>{reply}</EventReply>
                {e.id === event.refreshments && <b>Refreshments</b>}
              </li>
            );
          })}
      </ul>
    </Layout>
  );
};

Event.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.node,
      eventId: PropTypes.node
    }).isRequired
  }).isRequired
};

export default Event;
