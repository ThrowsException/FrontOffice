import React from 'react'
import PropTypes from 'prop-types'

const PlayerList = ({ members }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {members.map(member => (
          <tr key={member.email}>
            <td>{member.name}</td>
            <td>{member.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

PlayerList.propTypes = {
  members: PropTypes.arrayOf(
    PropTypes.shape({
      email: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
}

export default PlayerList
