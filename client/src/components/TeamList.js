import React from "react";
import PropTypes from "prop-types";
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

const TeamList = ({ items }) => {
  return (
    <>
      {items.length === 0 ? (
        <h1> Nothing Here</h1>
      ) : (
        items.map(item => (
          <TeamCard key={item.id}>
            <StyledLink to={`/teams/${item.id}`}>
              <TeamName>{item.name}</TeamName>
            </StyledLink>
          </TeamCard>
        ))
      )}
    </>
  );
};

TeamList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    })
  )
};

TeamList.defaultProps = {
  items: []
};

export default TeamList;
