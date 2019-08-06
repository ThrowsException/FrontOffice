import React, { useState, useEffect } from "react";
import wretch from "wretch";
import { format } from "date-fns";
import styled from "styled-components";
import { Composition } from "atomic-layout";
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
    <Composition areas={areas} templateCols="auto 1fr">
      {({ Header, Aside, Content }) => (
        <>
          <Header>
            <NavBar>
              <NavTitle>Front Office</NavTitle>
            </NavBar>
          </Header>
          <Aside style={{ background: "#0F0F0F0f" }}>
            <Link to={`/teams/${match.params.id}`}>
              <h3>Home</h3>
            </Link>
            <Link to={`/teams/${match.params.id}`}>
              <h3>Events</h3>
            </Link>
            <Link to={`/teams/${match.params.id}/roster`}>
              <h3>Roster</h3>
            </Link>
          </Aside>
          <Content>
            <Root>
              <Container>
                <h1>{event.name}</h1>
                <h1>{format(new Date(event.date), "P p")}</h1>
                <button
                  variant="contained"
                  color="primary"
                  onClick={sendInvites}
                >
                  Send Invites
                </button>
                <ul>
                  {event.members &&
                    event.members.map(e => (
                      <li key={e.email}>
                        {e.name} {e.email}{" "}
                        <EventReply reply={e.reply}>
                          {e.reply ? "In" : "Out"}
                        </EventReply>
                      </li>
                    ))}
                </ul>
              </Container>
            </Root>
          </Content>
        </>
      )}
    </Composition>
  );
};
