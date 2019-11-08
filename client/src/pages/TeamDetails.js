import { format, parseISO } from 'date-fns'
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Skeleton from 'react-loading-skeleton'
import { EventList, EventForm } from '../components'
import Layout from '../layout/Layout'
import { postData, fetchData } from '../utils/w'
import TeamContext from '../TeamContext'

const TeamName = styled.h1`
  font-size: 4em;
`

const TeamDetails = props => {
  const { team, setTeam } = React.useContext(TeamContext)

  const { match } = props
  const [events, setEvents] = useState([])
  const [members, setMembers] = useState([])

  useEffect(() => {
    fetchData(`/teams/${match.params.id}`, setTeam)
    fetchData(`/teams/${match.params.id}/events`, setEvents)
    fetchData(`/teams/${match.params.id}/members`, setMembers)
  }, [])

  const createEvent = async ({
    name,
    date,
    hour,
    minute,
    period,
    refreshments,
    reminder,
  }) => {
    const h = period === 'PM' ? parseInt(hour, 10) + 12 : hour
    const l = parseISO(
      `${date} ${`00${h}`.substr(-2, 2)}:${`00${minute}`.substr(-2, 2)}`,
      'P p',
      new Date()
    )
    const event = await postData('/events', {
      name,
      date: format(l, 'yyyy-MM-dd HH:mm:ssxxxxx'),
      team: match.params.id,
      refreshments: refreshments ? refreshments : null,
      reminder,
    })
    setEvents([...events, event])
  }

  return (
    <Layout {...props}>
      <TeamName>{team ? team.name : <Skeleton />}</TeamName>
      <h2>Upcoming Events</h2>
      <EventList events={events} />
      <EventForm submit={createEvent} players={members} />
    </Layout>
  )
}

TeamDetails.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.node,
    }).isRequired,
  }).isRequired,
}

export default TeamDetails
