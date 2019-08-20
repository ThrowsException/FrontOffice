import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import TeamDetails from "./pages/TeamDetails";
import Teams from "./pages/Teams";
import Event from "./pages/Event";
import Features from "./pages/Features";
import Roster from "./pages/Roster";
import "typeface-montserrat";
import Amplify, { Auth, Hub } from "aws-amplify";
import { Authenticator, withAuthenticator } from "aws-amplify-react";
const config = {
  Auth: {
    mandatorySignIn: true,
    region: "us-east-1",
    userPoolId: "us-east-1_I1wwaxDmP",
    userPoolWebClientId: "5doe311sg57aocpmnnh773m9vr"
  }
};

Amplify.configure(config);

const listener = data => {
  switch (data.payload.event) {
    case "signIn":
      document.location = "/teams";
      break;
  }
};

Hub.listen("auth", listener);

const PrivateRoutes = props => {
  return (
    <Router>
      <Switch>
        <Route path="/teams" exact component={Teams} />
        <Route path="/teams/:id" exact component={TeamDetails} />
        <Route path="/teams/:id/events/:eventId" exact component={Event} />
        <Route path="/teams/:id/roster" exact component={Roster} />
      </Switch>
    </Router>
  );
};

const AuthPrivateRoutes = withAuthenticator(PrivateRoutes);

function AppRouter() {
  return (
    <Router>
      <Switch>
        <Route path="/teams" component={AuthPrivateRoutes} />
        <Route
          path="/login"
          exact
          render={props => {
            Auth.currentSession().then(value => {
              console.log(value);
            });
            return !Auth.user ? (
              <Redirect to="/teams" />
            ) : (
              <Authenticator {...props} amplifyConfig={config} />
            );
          }}
        />
        <Route component={Features} />
      </Switch>
    </Router>
  );
}

export default AppRouter;

ReactDOM.render(<AppRouter />, document.getElementById("root"));
