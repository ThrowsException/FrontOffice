import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Layout from 'atomic-layout'

const TeamCard = styled.div`
  height: 200px;
  width: 250px;
  margin: 8px 8px 8px 0px;
  border-radius: 4px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);

  @media (max-width: ${Layout.breakpoints.xs.maxWidth}) {
    width: 100%;
  }
`

const TopCard = styled.div`
  flex: 0.7;
  background-color: #f0f0f0a0;
`

const BottomCard = styled.div`
  background-color: white;
`

const Container = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`

const TeamList = ({ items }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {items.length === 0 ? (
        <p>Add a team to get started</p>
      ) : (
        items.map(item => (
          <TeamCard key={item.id}>
            <Link to={`/teams/${item.id}`} style={{ textDecoration: 'none' }}>
              <Container>
                <TopCard>
                  <h2>{item.name}</h2>
                </TopCard>
                <BottomCard>
                  <span>Next Game: N/A</span>
                </BottomCard>
              </Container>
            </Link>
          </TeamCard>
        ))
      )}
    </div>
  )
}

TeamList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })
  ),
}

TeamList.defaultProps = {
  items: [],
}

export default TeamList
