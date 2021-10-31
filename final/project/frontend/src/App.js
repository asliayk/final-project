import React from "react";
import Login from "./login/Login";
import Patient from "./patient/Patient";
import Doctor_patients_list from "./doctor_patients/Doctor_patients_list"
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
                    <Route exact path="/doctorpatients" exact component={Doctor_patients_list} />
                    <Route exact path="/patient" exact component={Patient} />
                </Switch>
            </div>
        </React.Fragment>
    );
}
export default App;