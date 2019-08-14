import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import w from "../utils/w";

const EventReply = styled.span`
  color: ${p => (p.reply ? "green" : "red")};
`;

const Event = props => {
  const { match } = props;
  const [replies, setReplies] = useState([]);

  const fetchData = async (url, callback) => {
    await w
      .url(url)
      .get()
      .json(json => {
        callback(json);
      });
  };

  useEffect(() => {
    fetchData(`/api/checkins/${match.params.id}`, setReplies);
  }, {});

  const sorted = replies.sort((a, b) => {
    if (a.reply === null) return 1;
    if (a.reply < b.reply) return 1;
    if (a.reply > b.reply) return -1;

    if (a.name.toUpperCase() > b.name.toUpperCase()) return 1;
    return -1;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Reply</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map(e => {
          let reply = "Not Replied";
          if (e.reply) {
            reply = "In";
          } else if (e.reply === false) {
            reply = "Out";
          }

          return (
            <tr key={e.name}>
              <td>{e.name}</td>
              <td>
                <EventReply reply={e.reply}>{reply}</EventReply>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
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
