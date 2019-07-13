import React, { useState, useEffect } from "react";
import wretch from "wretch";
import { TeamForm, TeamList } from "./";

const TeamHome = () => {
  const [teams, setTeams] = useState([]);

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

  useEffect(() => {
    fetchData("/api/teams", setTeams);
  }, []);

  const createTeam = async name => {
    const team = await postData("/api/teams", { name });
    setTeams([...teams, team]);
  };

  return (
    <>
      {teams.length === 0 ? <div>No Teams</div> : <TeamList items={teams} />}
      <TeamForm submit={createTeam} />
    </>
  );
};

export default TeamHome;
