import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Composition, Only } from "atomic-layout";
import { Link } from "react-router-dom";

const areas = `
  header
  content
`;

const areasMd = `
 header header
 aside content
`;

const NavBar = styled.div`
  display: flex;
  align-items center;
  justify-content: center;
  padding: 0 1em;
  background: #1B1B1E
  color: white;
`;

const NavTitle = styled.h4`
  flex: 1;
`;

const Root = styled.div`
  display: flex;
  flex-flow: column wrap;
  place-items: center;
`;

const Container = styled.div`
  flex: 1;
  width: 100%;
  max-width: 960px;
`;

const NavLink = styled(Link)`
  color: white;
  padding: 8px;
`;

const Layout = props => {
  const { match } = props;
  return (
    <Composition
      height="100vh"
      areas={areas}
      areasMd={areasMd}
      templateRows="auto 1fr"
      templateColsMd="240px 1fr"
    >
      {({ Header, Aside, Content }) => (
        <>
          <Header>
            <NavBar>
              <NavTitle>Front Office</NavTitle>
              <Only to="md">
                <NavLink to="/teams">Home</NavLink>
                {match.params.id && (
                  <NavLink to={`/teams/${match.params.id}`}>Events</NavLink>
                )}
                {match.params.id && (
                  <NavLink to={`/teams/${match.params.id}/roster`}>
                    Roster
                  </NavLink>
                )}
              </Only>
            </NavBar>
          </Header>
          <Aside style={{ background: "#0F0F0F0f" }}>
            <Link to="/teams">
              <h3>Home</h3>
            </Link>
            {match.params.id && (
              <Link to={`/teams/${match.params.id}`}>
                <h3>Events</h3>
              </Link>
            )}
            {match.params.id && (
              <Link to={`/teams/${match.params.id}/roster`}>
                <h3>Roster</h3>
              </Link>
            )}
          </Aside>
          <Content>
            <Root>
              <Container>{props.children}</Container>
            </Root>
          </Content>
        </>
      )}
    </Composition>
  );
};

Layout.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.node
    }).isRequired
  }).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

Layout.defaultProps = {
  children: []
};

export default Layout;
