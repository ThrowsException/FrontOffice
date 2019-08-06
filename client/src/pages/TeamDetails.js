import React, { useState, useEffect } from "react";
import wretch from "wretch";
import { EventList, EventForm } from "../components";
import { format, parseISO } from "date-fns";
import { Composition } from "atomic-layout";
import styled from "styled-components";
import { Link } from "react-router-dom";

const areas = `
 header header
 aside content
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

const Root = styled.div`
  display: flex;
  flex-flow: column wrap;
  place-items: center;
`;

const Container = styled.div`
  flex: 1;
  width: 100%;
  max-width: 960px;
`;

const TeamDetails = ({ match }) => {
  const [team, setTeam] = useState([{ name: "Loading..." }]);

  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchData(`/api/teams/${match.params.id}`, setTeam);
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

  return (
    <Composition areas={areas} templateCols="auto 1fr">
      {({ Header, Aside, Content }) => (
        <>
          <Header>
            <NavBar>
              <NavTitle>Front Office</NavTitle>
            </NavBar>
          </Header>
          <Aside style={{ background: "#0F0F0F0f" }}>
            <Link to={`/teams`}>
              <h3>Home</h3>
            </Link>
            <Link to={`/teams/${match.params.id}`}>
              <h3>{team[0]["name"]}</h3>
            </Link>
            <Link to={`/teams/${match.params.id}/roster`}>
              <h3>Roster</h3>
            </Link>
          </Aside>
          <Content>
            <Root>
              <Container>
                <TeamName>{team[0].name}</TeamName>
                <h2>Upcoming Events</h2>
                <EventList events={events} />
                <EventForm submit={createEvent} />
              </Container>
            </Root>
          </Content>
        </>
      )}
    </Composition>
  );
};

export default TeamDetails;
