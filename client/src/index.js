import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import TeamDetails from "./pages/TeamDetails";
import Login from "./pages/Login";
import Teams from "./pages/Teams";
import Event from "./pages/Event";
import Features from "./pages/Features";
import Roster from "./pages/Roster";
import "typeface-roboto";

function AppRouter() {
  return (
    <Router>
      <Switch>
        <Route path="/teams" exact component={Teams} />
        <Route path="/teams/:id" exact component={TeamDetails} />
        <Route path="/teams/:id/events/:eventId" exact component={Event} />
        <Route path="/teams/:id/roster" exact component={Roster} />
        <Route path="/login" exact component={Login} />
        <Route component={Features} />
      </Switch>
    </Router>
  );
}

export default AppRouter;

ReactDOM.render(<AppRouter />, document.getElementById("root"));
