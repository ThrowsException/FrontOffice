import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Skeleton from "react-loading-skeleton";
import { postData, fetchData } from "../utils/w";
import { PlayerList, PlayerForm } from "../components";
import Layout from "../layout/Layout";

const TeamName = styled.h1`
  font-size: 4em;
`;

const TeamDetails = props => {
  const { match } = props;
  const [team, setTeam] = useState();

  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchData(`/teams/${match.params.id}`, setTeam);
    fetchData(`/teams/${match.params.id}/members`, setMembers);
  }, []);

  const createMember = async ({ name, email, phone }) => {
    await postData("/members", {
      name,
      email,
      phone,
      team: match.params.id
    });
    setMembers([...members, { name, email }]);
  };

  return (
    <Layout {...props}>
      <TeamName>{team ? team.name : <Skeleton />}</TeamName>
      <h2>Players</h2>
      <PlayerList members={members} />
      <PlayerForm submit={createMember} />
    </Layout>
  );
};

TeamDetails.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.node
    }).isRequired
  }).isRequired
};

export default TeamDetails;
