import React, { useState, useEffect } from "react";
import w from "../utils/w";
import { PlayerList, PlayerForm } from "../components";
import styled from "styled-components";
import Layout from "../layout/Layout";

const TeamName = styled.h1`
  font-size: 4em;
`;

const TeamDetails = props => {
  let { match } = props;
  const [team, setTeam] = useState([{ name: "Loading..." }]);

  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchData(`/api/teams/${match.params.id}`, setTeam);
    fetchData(`/api/teams/${match.params.id}/members`, setMembers);
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
    <Layout {...props}>
      <TeamName>{team[0].name}</TeamName>
      <h2>Players</h2>
      <PlayerList members={members} />
      <PlayerForm submit={createMember} />
    </Layout>
  );
};

export default TeamDetails;
