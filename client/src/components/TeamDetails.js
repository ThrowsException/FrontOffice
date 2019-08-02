import React, { useState, useEffect } from "react";
import wretch from "wretch";
import { PlayerList, EventList, PlayerForm, EventForm } from "./";
import { format, parseISO } from "date-fns";
import { Composition } from "atomic-layout";
import styled from "styled-components";

const areas = `
 header
 content
`;

const NavBar = styled.div`
  display: flex;
  align-items center;
  justify-content: center;
  padding: 0 1em;
  background: #1B1B1E
  color: white;
`;

const NavTitle = styled.h4`
  flex: 1;
`;

const TeamName = styled.h1`
  font-size: 4em;
`;

const TeamDetails = ({ match }) => {
  const [team, setTeam] = useState([{ name: "Loading..." }]);

  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchData(`/api/teams/${match.params.id}`, setTeam);
    fetchData(`/api/teams/${match.params.id}/members`, setMembers);
    fetchData(`/api/teams/${match.params.id}/events`, setEvents);
  }, []);

  const postData = async (url, body) => {
    return await wretch(url)
      .post({ ...body })
      .json();
  };

  const fetchData = async (url, callback) => {
    await wretch(url)
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

  const createMember = async ({ name, email, phone }) => {
    const member = await postData("/api/members", {
      name,
      email,
      phone,
      team: match.params.id
    });
    setMembers([...members, { name, email }]);
  };

  return (
    <Composition areas={areas}>
      {({ Header, Content }) => (
        <>
          <Header>
            <NavBar>
              <NavTitle>Front Office</NavTitle>
            </NavBar>
          </Header>
          <Content>
            <TeamName>{team[0].name}</TeamName>
            <h2>Upcoming Events</h2>
            <EventList events={events} />
            <EventForm submit={createEvent} />
            <h2>Players</h2>
            <PlayerList members={members} />
            <PlayerForm submit={createMember} />
          </Content>
        </>
      )}
    </Composition>
  );
};

export default TeamDetails;
