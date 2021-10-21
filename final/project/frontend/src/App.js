import React from "react";
import Login from "./login/Login";
import { Route, Switch, Redirect } from "react-router-dom";
import { CssBaseline } from "@material-ui/core";
import Profile from "./profile/Profile";
function App() {
    return (
        <React.Fragment>
            <CssBaseline />
            <div className="App">
                <Switch>
                    <Route exact path="/" exact component={Login} />
                    <Route exact path="/profile" exact component={Profile} />

                </Switch>
            </div>
        </React.Fragment>
    );
}
export default App;