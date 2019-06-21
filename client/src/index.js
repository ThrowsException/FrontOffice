import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import wretch from "wretch";

import CreateTeamComponent from "./components/CreateTeamComponent";
import CreateMemberComponent from "./components/CreateMemberComponent";
import TeamListComponent from "./components/TeamListComponent";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

import "typeface-roboto";

const Home = () => {
  const [teams, setTeams] = useState([]);
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);

  const [form, setFormValues] = useState({
    event: "",
    event_id: ""
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
    fetchData("/api/events", setEvents);
    fetchData("/api/members", setMembers);
  }, []);

  const createTeam = async name => {
    const team = await postData("/api/teams", { name });
    setTeams([...teams, team]);
  };

  const createEvent = async () => {
    const event = await postData("/api/events", {
      name: form.event,
      team: form.team_id
    });
    setEvents([...events, event]);
  };

  const createMember = async ({ name, email, phone, team }) => {
    const member = await postData("/api/members", {
      name,
      email,
      phone,
      team
    });
    setMembers([...members, member]);
  };

  const handleInputChange = event => {
    const { name, value } = event;
    setFormValues({ ...form, [name]: value });
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <h1>Create A Team</h1>
          <CreateTeamComponent submit={createTeam} />
          <TeamListComponent items={teams} />
        </Grid>

        <Grid item xs={12}>
          <h1>Add Member</h1>
          <CreateMemberComponent submit={createMember} />
        </Grid>

        <Grid item xs={12}>
          {events.length > 0 ? (
            <h1>
              ID: {events[0].id} Name: {events[0].name}
            </h1>
          ) : (
            <>
              <h1>Create an Event</h1>
              <div>
                <TextField
                  label="Event Name"
                  name="event"
                  onChange={handleInputChange}
                  value={form.event}
                />
                <TextField
                  label="Team Id"
                  name="team_id"
                  onChange={handleInputChange}
                  value={form.team_id}
                />
              </div>
              <Button variant="contained" onClick={createEvent}>
                Create Event
              </Button>
            </>
          )}
        </Grid>
        <Grid item xs={12}>
          <ul>
            {members.map(member => (
              <li key={member.id}>
                {member.name} {member.email}
              </li>
            ))}
          </ul>
        </Grid>
      </Grid>
    </>
  );
};

ReactDOM.render(<Home />, document.getElementById("root"));
