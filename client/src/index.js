import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import wretch from "wretch";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

import "typeface-roboto";

const FormButton = withStyles({
  root: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 75%)",
    borderRadius: 3,
    border: 0,
    color: "white",
    height: 48,
    padding: "0 30px",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)"
  },
  label: {
    textTransform: "capitalize"
  }
})(Button);

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  }
}));

const Home = () => {
  const classes = useStyles();
  const [teams, setTeams] = useState([]);
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);

  const [form, setFormValues] = useState({
    team: "",
    event: "",
    name: "",
    email: "",
    phone: "",
    team_id: "",
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
    console.log("Effect", teams);
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
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {teams.length > 0 ? (
            <h1>
              ID: {teams[0].id} Name: {teams[0].name}
            </h1>
          ) : (
            <Box>
              <h1>Create A Team</h1>
              <div>
                <TextField
                  label="Team Name"
                  name="team"
                  onChange={handleInputChange}
                  value={form.team}
                  className={classes.textField}
                />
              </div>
              <FormButton variant="contained" onClick={createTeam}>
                Create Team
              </FormButton>
            </Box>
          )}
        </Grid>

        <Grid item xs={12}>
          <div>
            <h1>Add Member</h1>
            <div>
              <TextField
                label="Name"
                name="name"
                onChange={handleInputChange}
                value={form.name}
                className={classes.textField}
              />
              <TextField
                label="Email"
                name="email"
                onChange={handleInputChange}
                value={form.email}
                className={classes.textField}
              />
              <TextField
                label="Phone"
                name="phone"
                onChange={handleInputChange}
                value={form.phone}
                className={classes.textField}
              />
              <TextField
                label="Team Id"
                name="team_id"
                onChange={handleInputChange}
                value={form.team_id}
                className={classes.textField}
              />
            </div>
            <FormButton variant="contained" onClick={createMember}>
              Create Member
            </FormButton>
          </div>
        </Grid>

        <Grid item xs={12}>
          {events.length > 0 ? (
            <h1>
              ID: {events[0].id} Name: {events[0].name}
            </h1>
          ) : (
            <Box>
              <h1>Create an Event</h1>
              <div>
                <TextField
                  label="Event Name"
                  name="event"
                  onChange={handleInputChange}
                  value={form.event}
                  className={classes.textField}
                />
                <TextField
                  label="Team Id"
                  name="team_id"
                  onChange={handleInputChange}
                  value={form.team_id}
                  className={classes.textField}
                />
              </div>
              <FormButton variant="contained" onClick={createEvent}>
                Create Event
              </FormButton>
            </Box>
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
