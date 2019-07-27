import React, { useState, useEffect } from "react";
import wretch from "wretch";
import { PlayerList, EventList, PlayerForm, EventForm } from "./";

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

  const createEvent = async (name, date) => {
    console.log(date);
    const event = await postData("/api/events", {
      name,
      date,
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
    setMembers([...members, member]);
  };

  return (
    <>
      <h1>{team[0].name}</h1>
      <h1>Upcoming Events</h1>
      <EventList events={events} />
      <EventForm submit={createEvent} />
      <h1>Players</h1>
      <PlayerList members={members} />
      <PlayerForm submit={createMember} />
    </>
  );
};

export default TeamDetails;
