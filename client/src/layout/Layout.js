import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Composition } from 'atomic-layout'
import { Link } from 'react-router-dom'

const areas = `
  header
  content
`

const NavBar = styled.div`
  display: flex;
  align-items center;
  justify-content: center;
  padding: 0 1em;
  background: #1B1B1E
  color: white;
`

const NavTitle = styled.h4`
  flex: 1;
`

const Root = styled.div`
  display: flex;
  flex-flow: column wrap;
  place-items: center;
`

const Container = styled.div`
  flex: 1;
  width: 100%;
  max-width: 960px;
`

const NavLink = styled(Link)`
  color: white;
  padding: 8px;
`

const Layout = ({ match, children }) => {
  return (
    <Composition height="100vh" areas={areas} templateRows="auto 1fr">
      {({ Header, Content }) => (
        <>
          <Header>
            <NavBar>
              <NavTitle>Front Office</NavTitle>
              {match.params.id && <NavLink to="/teams">Teams</NavLink>}
              {match.params.id && (
                <NavLink to={`/teams/${match.params.id}`}>Events</NavLink>
              )}
              {match.params.id && (
                <NavLink to={`/teams/${match.params.id}/roster`}>
                  Roster
                </NavLink>
              )}
            </NavBar>
          </Header>

          <Content>
            <Root>
              <Container>{children}</Container>
            </Root>
          </Content>
        </>
      )}
    </Composition>
  )
}

Layout.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.node,
    }).isRequired,
  }).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}

Layout.defaultProps = {
  children: [],
}

export default Layout
