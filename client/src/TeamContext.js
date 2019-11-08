import { createContext } from 'react'

const TeamContext = createContext({ team: null, setTeam: () => {} })

export default TeamContext
