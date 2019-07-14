import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { TeamDetails, Login } from "./components";
import Teams from "./pages/Teams";

import "typeface-roboto";

function AppRouter() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <main style={{ flexGrow: 1 }}>
          <Switch>
            <Route path="" exact component={Login} />
            <Route path="/" exact component={Login} />
            <Route path="/teams" exact component={Teams} />
            <Route path="/teams/:id" component={TeamDetails} />
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default AppRouter;

ReactDOM.render(<AppRouter />, document.getElementById("root"));
