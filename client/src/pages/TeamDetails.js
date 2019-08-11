import { format, parseISO } from "date-fns";
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { EventList, EventForm } from "../components";
import Layout from "../layout/Layout";
import w from "../utils/w";

const TeamName = styled.h1`
  font-size: 4em;
`;

const TeamDetails = props => {
  const { match } = props;
  const [team, setTeam] = useState([{ name: "Loading..." }]);
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);

  const postData = async (url, body) => {
    return w
      .url(url)
      .post({ ...body })
      .json();
  };

  const fetchData = async (url, callback) => {
    await w
      .url(url)
      .get()
      .json(json => {
        callback(json);
      });
  };

  useEffect(() => {
    fetchData(`/api/teams/${match.params.id}`, setTeam);
    fetchData(`/api/teams/${match.params.id}/events`, setEvents);
    fetchData(`/api/teams/${match.params.id}/members`, setMembers);
  }, []);

  const createEvent = async ({
    name,
    date,
    hour,
    minute,
    period,
    refreshments
  }) => {
    const h = period === "PM" ? parseInt(hour, 10) + 12 : hour;
    const l = parseISO(
      `${date} ${`00${h}`.substr(-2, 2)}:${`00${minute}`.substr(-2, 2)}`,
      "P p",
      new Date()
    );
    const event = await postData("/api/events", {
      name,
      date: format(l, "yyyy-MM-dd HH:mm:ssxxxxx"),
      team: match.params.id,
      refreshments
    });
    setEvents([...events, event]);
  };

  return (
    <Layout {...props}>
      <TeamName>{team[0].name}</TeamName>
      <h2>Upcoming Events</h2>
      <EventList events={events} />
      <EventForm submit={createEvent} players={members} />
    </Layout>
  );
};

TeamDetails.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.node
    }).isRequired
  }).isRequired
};

export default TeamDetails;
