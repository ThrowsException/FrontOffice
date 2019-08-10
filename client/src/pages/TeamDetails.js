import React, { useState, useEffect } from "react";
import w from "../utils/w";
import { EventList, EventForm } from "../components";
import { format, parseISO } from "date-fns";
import styled from "styled-components";
import Layout from "../layout/Layout";

const TeamName = styled.h1`
  font-size: 4em;
`;

const TeamDetails = props => {
  let { match } = props;
  const [team, setTeam] = useState([{ name: "Loading..." }]);

  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchData(`/api/teams/${match.params.id}`, setTeam);
    fetchData(`/api/teams/${match.params.id}/events`, setEvents);
  }, []);

  const postData = async (url, body) => {
    return await w
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
      })
      .catch(error => console.log(error));
  };

  const createEvent = async ({ name, date, hour, minute, period }) => {
    hour = period === "PM" ? parseInt(hour) + 12 : hour;
    let l = parseISO(
      `${date} ${("00" + hour).substr(-2, 2)}:${("00" + minute).substr(-2, 2)}`,
      "P p",
      new Date()
    );
    const event = await postData("/api/events", {
      name,
      date: format(l, "yyyy-MM-dd HH:mm:ssxxxxx"),
      team: match.params.id
    });
    setEvents([...events, event]);
  };

  return (
    <Layout {...props}>
      <TeamName>{team[0].name}</TeamName>
      <h2>Upcoming Events</h2>
      <EventList events={events} />
      <EventForm submit={createEvent} />
    </Layout>
  );
};

export default TeamDetails;
