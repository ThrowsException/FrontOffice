import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { format } from 'date-fns'
import styled from 'styled-components'
import Layout from '../layout/Layout'
import { fetchData, postData } from '../utils/w'
import TeamContext from '../TeamContext'

const EventReply = styled.span`
  color: ${p => (p.reply ? 'green' : 'red')};
`

const TeamName = styled.h1`
  font-size: 4em;
`

const Event = ({ match }) => {
  const { team } = React.useContext(TeamContext)

  const [event, setEvent] = useState({ date: new Date(), members: [] })

  const sendInvites = async () => {
    postData('/invites', { event: event.id })
  }

  useEffect(() => {
    fetchData(`/events/${match.params.eventId}`, setEvent)
  }, {})

  const refreshment = event.members.find(member => {
    return member.id === event.refreshments
  })

  const sorted = event.members.sort((a, b) => {
    if (a.reply === null) return 1
    if (a.reply < b.reply) return 1
    if (a.reply > b.reply) return -1

    if (a.name.toUpperCase() > b.name.toUpperCase()) return 1
    return -1
  })

  return (
    <Layout {...props}>
      <TeamName>{team.name}</TeamName>
      <h1>{event.name}</h1>
      <h1>{format(new Date(event.date), 'P p')}</h1>
      <h3>
        Refreshments:
        {refreshment && refreshment.name}
      </h3>
      <button
        variant="contained"
        color="primary"
        onClick={sendInvites}
        type="button"
      >
        Send Invites
      </button>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Reply</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {sorted.map(e => {
            let reply = 'Not Replied'
            if (e.reply) {
              reply = 'In'
            } else if (e.reply === false) {
              reply = 'Out'
            }

            return (
              <tr key={e.email}>
                <td>{e.name}</td>
                <td>{e.email}</td>
                <td>
                  <EventReply reply={e.reply}>{reply}</EventReply>
                </td>
                <td>{e.id === event.refreshments && <b>Refreshments</b>}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Layout>
  )
}

Event.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.node,
      eventId: PropTypes.node,
    }).isRequired,
  }).isRequired,
}

export default Event
