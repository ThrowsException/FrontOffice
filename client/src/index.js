import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import wretch from "wretch";

const Home = () => {
  const [teams, setTeams] = useState([]);
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);

  const [form, setFormValues] = useState({
    team: "",
    event: "",
    name: "",
    email: "",
    phone: "",
    team_id: 0,
    event_id: 0
  });

  const fetchData = async (url, callback) => {
    await wretch(url)
      .get()
      .json(json => {
        callback(json);
      })
      .catch(error => console.log(error));
  };

  const postData = async (url, body) => {
    return await wretch(url)
      .post({ ...body })
      .json();
  };

  useEffect(() => {
    fetchData("/api/teams", setTeams);
  }, []);

  useEffect(() => {
    fetchData("/api/events", setEvents);
  }, []);

  useEffect(() => {
    fetchData("/api/members", setMembers);
  }, []);

  const createTeam = async () => {
    const team = await postData("/api/teams", { name: form.team });
    setTeams([...teams, team]);
  };

  const createEvent = async () => {
    const event = await postData("/api/events", {
      name: form.event,
      team: form.team_id
    });
    setEvents([...events, event]);
  };

  const createMember = async () => {
    const member = await postData("/api/members", {
      name: form.name,
      email: form.email,
      phone: form.phone,
      team: form.team_id
    });
    setMembers([...members, member]);
  };

  const handleInputChange = event => {
    let newObject = {};
    newObject[event.target.name] = event.target.value;
    setFormValues(Object.assign({}, form, newObject));
  };

  return (
    <>
      {teams && (
        <div>
          <b>No Teams! Make One</b>
          <div>
            <label>Name:</label>
            <input name="team" onChange={handleInputChange} value={form.team} />
          </div>
          <button onClick={createTeam}>Create Group</button>
        </div>
      )}

      {events && (
        <div>
          <b>No Events! Make One</b>
          <div>
            <label>Name:</label>
            <input
              name="event"
              onChange={handleInputChange}
              value={form.event}
            />
            <label>Team:</label>
            <input
              name="team_id"
              onChange={handleInputChange}
              value={form.team_id}
            />
          </div>
          <button onClick={createEvent}>Create Event</button>
        </div>
      )}

      {members && (
        <div>
          <b>No Members! Make One</b>
          <div>
            <label>Name:</label>
            <input name="name" onChange={handleInputChange} value={form.name} />
            <label>Email:</label>
            <input
              name="email"
              onChange={handleInputChange}
              value={form.email}
            />
            <label>Phone:</label>
            <input
              name="phone"
              onChange={handleInputChange}
              value={form.phone}
            />
            <label>Team:</label>
            <input
              name="team_id"
              onChange={handleInputChange}
              value={form.team_id}
            />
            <button onClick={createMember}>Create Member</button>
          </div>
        </div>
      )}

      <div>Form: {JSON.stringify(form)}</div>
      <div>Teams: {JSON.stringify(teams)}</div>
      <div>Events: {JSON.stringify(events)}</div>
      <div>Members: {JSON.stringify(members)}</div>
    </>
  );
};

ReactDOM.render(<Home />, document.getElementById("root"));
