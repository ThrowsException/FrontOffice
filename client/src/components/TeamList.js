import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const TeamCard = styled.div`
  display: flex;
  align-items: center;
`;

const TeamName = styled.h3`
  margin: 16px;
  font-size: 32px;
  font-weight: 4;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  flex: 0.5;
`;

const StyledButton = styled.button`
  background-color: #f71735;
  color: white;
  font-size: 1em;
  padding: 1em;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  border-radius: 4px;

  :focus {
    outline: 0;
  }
`;

const TeamList = ({ items, onDelete }) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [id, setId] = useState();

  const deleteTeam = async () => {
    await onDelete(id);
    setDialogVisible(false);
    onDelete(item.id);
  };

  return (
    <>
      {items.length == 0 && <h1> Nothing Here</h1>}
      {items.map(item => (
        <TeamCard key={item.id}>
          <StyledLink to={`/teams/${item.id}`}>
            <TeamName>{item.name}</TeamName>
          </StyledLink>
          <StyledButton
            onClick={() => {
              onDelete(item.id);
            }}
          >
            Delete
          </StyledButton>
        </TeamCard>
      ))}
    </>
  );
};

export default TeamList;
