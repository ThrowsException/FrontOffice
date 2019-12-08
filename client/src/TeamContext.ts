import * as React from 'react'

interface Team {
  team: any
  setTeam: React.Dispatch<any>
}

const TeamContext = React.createContext<Team>({ team: null, setTeam: () => {} })

export default TeamContext
