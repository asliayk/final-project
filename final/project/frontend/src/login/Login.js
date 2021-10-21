import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link, Redirect } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { useState } from 'react';
import validate from './Validate'
import './Login.css'
//import { postData } from "../common/Requests";
import Alert from '@material-ui/lab/Alert';
//import { serverUrl } from "../common/ServerUrl";



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
        password: '',
        uid: '',
    });

    const [val, setVal] = useState({
        password: { error: false, message: '' },
        uid: { error: false, message: '' },
    });

    const [logged, setLogged] = useState(false);

    const [alertMessage, setAlertMessage] = useState('');


    //handlers
    function onChange(event) {
        var mutableState = state
        mutableState[event.target.id] = event.target.value
        setState(mutableState)
        setAlertMessage('')
    }

    function handleOnClick() {
        const newVal = validate(state, val);
        setVal(newVal)
        let valCheck = true;

        for (const key in newVal) {
            if (newVal.hasOwnProperty(key)) {
                const element = newVal[key];
                if (element.error) {
                    valCheck = false;
                }
            }
        }

        if (valCheck) {
            const url = serverUrl + 'api/auth/login/';
            const data = {
                email: state.uid,
                password: state.password,
            }

            postData(url, data)
                .then(handleResponse)
                .catch((rej) => { setAlertMessage('Some error has occured'); console.log(rej) })
        }
    }

    function handleResponse(res) {
        try {
            const token = res.auth_token;
            if (token) {
                console.log(token)
                localStorage.setItem('token', token);
                localStorage.setItem('is_vendor', res.is_vendor);
                setLogged(true);
            } else {
                console.log("error message is " + res.error)
                setAlertMessage(res.error);
            }
        } catch (error) {
            setAlertMessage('Some error has occured');
        }
    }


    if (logged) {
        return <Redirect to='/profile' />
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
                            id="uid"
                            label="E-mail"
                            variant="outlined"
                            error={val.uid.error}
                            helperText={val.uid.message}
                            onChange={onChange} />
                    </div>
                    <div className="password">
                        <TextField
                            id="password"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            variant="outlined"
                            error={val.password.error}
                            helperText={val.password.message}
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