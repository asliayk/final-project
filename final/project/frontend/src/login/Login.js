import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link, Redirect } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import validate from './Validate'
import './Login.css'
import { postData } from "../common/Requests";
import Alert from '@material-ui/lab/Alert';
import { serverUrl } from "../common/ServerUrl";



//styles
const useStyles = makeStyles((theme) => ({
    loginFormRoot: {
        "& .MuiTextField-root": {
            width: '100%',
        },
        "& > div": {
            margin: theme.spacing(2),
        },
    },
    loginButtonRoot: {
        '& > *': {
            width: '100%',
            height: '56px',
        },
    },
    alertRoot: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

function Login() {


    const classes = useStyles();

    console.log("classes.loginButtonRoot is " + classes.loginButtonRoot)

    const [state, setState] = useState({
        DoctorId: '',
        Password: '',
    });

    const [logged, setLogged] = useState(false);

    const [alertMessage, setAlertMessage] = useState('');


    //handlers
    function onChange(event) {
        let mutableState = state
        console.log(mutableState)
        mutableState[event.target.id] = event.target.value
        setState(mutableState)
        console.log(state+'zzzzzzzz')
    }

    function handleOnClick() {

            const url = "http://ldjangol.eba-ixskapzh.us-west-2.elasticbeanstalk.com/api/login";
            const data = {
                DoctorId: state.DoctorId,
                Password: state.Password,
            }

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(res => res.json())
            .then(json => {
                console.log(json)
                const success = json.status.success
                if (success) {
                    setLogged(true)

                } else {
                    alert('There is no user');
                }
            })
            .catch(err => {
                alert('Some error has occurred')
                console.log(err)
            });

    }




    if (logged) {
        return <Redirect to={{
            pathname: '/profile',
            state: { id: state.DoctorId }
        }} />
    }
    return (
        <div className="login">
            <div className="login-header">

            </div>
            <div className="login-container">
                <Typography className="h5-style" variant="h5" gutterBottom>
                    Patient Evaluation System
                </Typography>
                <div className={classes.alertRoot} style={{ display: alertMessage ? 'block' : 'none' }}>
                    <Alert severity="error">{alertMessage}</Alert>
                </div>
                <form className={classes.loginFormRoot} noValidate autoComplete="off">
                    <div className="username">
                        <TextField
                            id="DoctorId"
                            label="E-mail"
                            variant="outlined"

                            onChange={onChange} />
                    </div>
                    <div className="password">
                        <TextField
                            id="Password"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            variant="outlined"

                            onChange={onChange} />
                    </div>
                </form>
                <div className="button-div">
                    <div className={classes.loginButtonRoot}>
                        <Button
                            variant="contained"
                            color="primary"
                            className="button-style"
                            onClick={handleOnClick}
                        >
                            <b>Continue</b>
                        </Button>
                    </div>
                </div>
                <div>
                    <div className="forgot-password">
                        <Button
                            color="primary"
                            style={{ textTransform: "none" }}
                            to="/forgot/enter/email"
                            component={Link}
                        >
                            <b>Forgot password?</b>
                        </Button>
                    </div>
                    <div className="signup">
                        <Button
                            color="primary"
                            style={{ textTransform: "none" }}
                            to="/signup"
                            component={Link}
                        >
                            <b>Sign Up</b>
                        </Button>
                    </div>
                </div>
                <div>
                    <div style={{ textAlign: 'center', margin: '8px' }}>

                    </div>
                   
                </div>
            </div>
        </div>
    );
}


export default Login;