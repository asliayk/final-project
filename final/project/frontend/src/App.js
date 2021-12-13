import React from "react";
import Login from "./login/Login";
import Patient from "./patient/Patient";
import Doctor_patients_list from "./doctor_patients/Doctor_patients_list"
import { Route, Switch, Redirect } from "react-router-dom";
import { CssBaseline } from "@material-ui/core";
import Profile from "./profile/Profile";
import AddPatient from "./profile/AddPatient";
import AddVisit from "./profile/AddVisit";
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
                    <Route exact path="/patientadd" exact component={AddPatient} />
                    <Route exact path="/visitadd" exact component={AddVisit} />
                </Switch>
            </div>
        </React.Fragment>
    );
}
export default App;