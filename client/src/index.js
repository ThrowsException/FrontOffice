import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import wretch from "wretch";

const Home = () => {
  const [groups, setGroups] = useState([]);
  const [events, setEvents] = useState([]);
  const [invites, setInvites] = useState([]);

  const [form, setFormValues] = useState({
    email: "",
    group: "",
    event: "",
    group_id: 0,
    event_id: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      await wretch("/api/groups")
        .get()
        .json(json => {
          setGroups(json);
        })
        .catch(error => console.log(error));
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await wretch("/api/events")
        .get()
        .json(json => {
          setEvents(json);
        })
        .catch(error => console.log(error));
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await wretch("/api/invite")
        .get()
        .json(json => {
          setInvites(json);
        })
        .catch(error => console.log(error));
    };
    fetchData();
  }, []);

  const createGroup = async () => {
    await wretch("/api/groups")
      .post({ name: form.group })
      .json(json => {
        setGroups([...groups, json]);
      });
  };

  const createEvent = async () => {
    await wretch("/api/events")
      .post({ name: form.event, group: form.group_id })
      .json(json => {
        setEvents([...events, json]);
      });
  };

  const createInvite = async () => {
    await wretch("/api/invite")
      .post({ email: form.email, event: form.event_id })
      .json(json => {
        setInvites([...events, json]);
      });
  };

  const handleInputChange = event => {
    let newObject = {};
    newObject[event.target.name] = event.target.value;
    setFormValues(Object.assign({}, form, newObject));
  };

  return (
    <>
      {groups && (
        <div>
          <b>No Groups! Make One</b>
          <div>
            <label>Name:</label>
            <input
              name="group"
              onChange={handleInputChange}
              value={form.group}
            />
          </div>
          <button onClick={createGroup}>Create Group</button>
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
            <label>Group:</label>
            <input
              name="group_id"
              onChange={handleInputChange}
              value={form.group_id}
            />
          </div>
          <button onClick={createEvent}>Create Event</button>
        </div>
      )}

      {invites && (
        <div>
          <b>No Invites! Make One</b>
          <div>
            <label>Email:</label>
            <input
              name="email"
              onChange={handleInputChange}
              value={form.email}
            />
            <label>Event:</label>
            <input
              name="event_id"
              onChange={handleInputChange}
              value={form.event_id}
            />
            <button onClick={createInvite}>Create Invite</button>
          </div>
        </div>
      )}

      <div>Form: {JSON.stringify(form)}</div>
      <div>Groups: {JSON.stringify(groups)}</div>
      <div>Events: {JSON.stringify(events)}</div>
      <div>Invites: {JSON.stringify(invites)}</div>
    </>
  );
};

ReactDOM.render(<Home />, document.getElementById("root"));
