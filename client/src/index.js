import React from "react";
import ReactDOM from "react-dom";

import { TeamHome, TeamDetails } from "./components";
import { Drawer, List, ListItem } from "@material-ui/core";

import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import "typeface-roboto";

function AppRouter() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <Drawer style={{ width: 240 }} variant="permanent">
          <List style={{ width: 240 }}>
            <ListItem>
              <Link to="/teams">Teams</Link>
            </ListItem>
          </List>
        </Drawer>

        <main style={{ flexGrow: 1 }}>
          <Switch>
            <Route path="/" exact component={TeamHome} />
            <Route path="/teams" exact component={TeamHome} />
            <Route path="/teams/:id" component={TeamDetails} />
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default AppRouter;

ReactDOM.render(<AppRouter />, document.getElementById("root"));
