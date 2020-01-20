import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import TeamDetails from './pages/TeamDetails'
import { Teams } from './pages/Teams'
import Event from './pages/Event'
import Features from './pages/Features'
import Roster from './pages/Roster'
import TeamContext from './TeamContext'
import 'typeface-montserrat'
import Amplify, { Hub } from 'aws-amplify'
import { withAuthenticator } from 'aws-amplify-react'
const config = {
  Auth: {
    mandatorySignIn: true,
    region: 'us-east-1',
    userPoolId: 'us-east-1_I1wwaxDmP',
    userPoolWebClientId: '5doe311sg57aocpmnnh773m9vr',
  },
}

Amplify.configure(config)

const listener = (data: any) => {
  switch (data.payload.event) {
    case 'signIn':
      document.location.href = '/teams'
      break
  }
}

Hub.listen('auth', listener)

const PrivateRoutes = () => {
  const [team, setTeam] = React.useState()

  return (
    <TeamContext.Provider value={{ team, setTeam }}>
      <Router>
        <Switch>
          <Route path="/teams" exact component={Teams} />
          <Route path="/teams/:id" exact component={TeamDetails} />
          <Route path="/teams/:id/events/:eventId" exact component={Event} />
          <Route path="/teams/:id/roster" exact component={Roster} />
        </Switch>
      </Router>
    </TeamContext.Provider>
  )
}

const AuthPrivateRoutes = withAuthenticator(PrivateRoutes)

function AppRouter() {
  return (
    <Router>
      <Switch>
        <Route path="/teams" component={AuthPrivateRoutes} />
        <Route component={Features} />
      </Switch>
    </Router>
  )
}

export default AppRouter

ReactDOM.render(<AppRouter />, document.getElementById('app'))
