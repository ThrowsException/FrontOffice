import React, { useEffect, useState } from 'react'
import { TeamForm, TeamList } from '../components'
import Button from '../components/Button'
import Layout from '../layout/Layout'
import w, { postData, fetchData } from '../utils/w'

const Teams = props => {
  const [teams, setTeams] = useState([])
  const [formVisible, setFormVisible] = useState(false)

  const onDelete = async id => {
    setTeams(teams.filter(item => item.id !== id))
    await w(`/teams/${id}`).delete()
  }

  useEffect(() => {
    fetchData('/teams', setTeams)
  }, [])

  const createTeam = async name => {
    if (name) {
      const team = await postData('/teams', { name })
      setTeams([team, ...teams])
      setFormVisible(false)
    }
  }

  return (
    <Layout {...props}>
      <h1>Your Teams</h1>
      <TeamList items={teams} onDelete={onDelete} />
      <Button onClick={() => setFormVisible(!formVisible)}>Add Team</Button>
      {formVisible && <TeamForm submit={createTeam} />}
    </Layout>
  )
}

export default Teams
