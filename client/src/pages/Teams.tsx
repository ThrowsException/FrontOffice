import * as React from 'react'
import { TeamForm, TeamList } from '../components'
import Button from '../components/Button'
import Layout from '../layout/Layout'
import w, { postData, fetchData } from '../utils/w'

export const Teams: React.FC = props => {
  const [teams, setTeams] = React.useState([])
  const [formVisible, setFormVisible] = React.useState(false)

  const onDelete = async (id: string) => {
    setTeams(teams.filter(item => item.id !== id))
    await w.delete(`/teams/${id}`)
  }

  React.useEffect(() => {
    fetchData('/teams', setTeams)
  }, [])

  const createTeam = async (name: string) => {
    if (name) {
      const team = await postData('/teams', { name })
      setTeams([team, ...teams])
      setFormVisible(false)
    }
  }

  return (
    <Layout {...props}>
      <h1>Your Teams</h1>
      <TeamList items={teams} />
      <Button onClick={() => setFormVisible(!formVisible)}>Add Team</Button>
      {formVisible && <TeamForm submit={createTeam} />}
    </Layout>
  )
}
