import React, {useEffect, useState, useRef} from 'react';
import {Link} from "react-router-dom";
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import InputBase from "@material-ui/core/InputBase";
import makeStyles from "@material-ui/core/styles/makeStyles";
import List from "@material-ui/core/List";
import ReorderIcon from '@material-ui/icons/Reorder';
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import LocalMallIcon from '@material-ui/icons/LocalMall';
import ListIcon from '@material-ui/icons/List';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import HomeIcon from '@material-ui/icons/Home';
import PaymentIcon from '@material-ui/icons/Payment';
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
//import {serverUrl} from "../common/ServerUrl";
import {useHistory} from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
//import validate from "./ValidateEditProfile";
import LockIcon from '@material-ui/icons/Lock';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Tooltip from "@material-ui/core/Tooltip";
import CheckboxListSecondary from "../components/scrolllist";
import ScrollList from "../components/scrolllist";



const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    gridroot: {
        flexGrow: 1,
        marginTop: "1rem",
        marginLeft: "2rem",
    },
    paper: {
        marginBottom:'2rem',
        height: "10rem",
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
    },
    paper3: {
        height: "39rem",

        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
    },
    paper2: {
        height: "27rem",

        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
    },
    txt: {
        fontSize: 20,
    },
    grid2: {
        marginBottom: "1.5rem",
        marginLeft: "6rem",
    },
    grid: {
        marginBottom: "1.5rem",
        marginLeft: "1rem",
    },
    ftr: {
        marginTop: "2rem",
    },
    txtfield: {
        width: "16rem",
        marginBottom: "2rem",
    },
    txtfield2: {
        width: "36rem",
        marginBottom: "2rem",
    },
    txtfield3: {
        width: "20rem",
        marginBottom: "2rem",
        marginLeft: "2rem",
    }
}));

function Patient(props) {
    let [loadPage, setLoadPage] = React.useState(false);
    const classes = useStyles();
    let [open, setOpen] = React.useState(false);
    let [edit, setEdit] = React.useState(false);
    // let [nameChanged, setNameChanged] = React.useState(false);
    //let [surnameChanged, setSurnameChanged] = React.useState(false);
    //let [emailChanged, setEmailChanged] = React.useState(false);
    //let [addressChanged, setAddressChanged] = React.useState(false);
    //let [usernameChanged, setUsernameChanged] = React.useState(false);
    let [prognosis, setprognosis] = React.useState([]);
    let [lastdiagnosis, setlastdiagnosis] = React.useState();
    let [lastdiagnosisscore, setlastdiagnosisscore] = React.useState();


/*

    const handleClick = () => {
        setOpen(!open);

    };
*/


    const [name, setName] = useState({

        ptid: '',
        sex: '',
        age: '',
        maritalStatus: '',
        race: '',

    });




    function onChange(event) {

        if (event.target.id === "first_name") {
            setNameChanged(true);
        }
        if (event.target.id === "last_name") {
            setSurnameChanged(true);
        }
        if (event.target.id === "email") {
            setEmailChanged(true);
        }
        if (event.target.id === "address") {
            setAddressChanged(true);
        }
        if (event.target.id === "username") {
            setUsernameChanged(true);
        }

        let mutableState = name
        mutableState[event.target.id] = event.target.value
        setName(mutableState)
    }

    const id = props.location.state.id;
    const docid = props.location.state.docid;
    useEffect(() => {


            fetch( 'http://tdjango.eba-nfssu9sz.us-west-2.elasticbeanstalk.com/api/patientProfile/'+id+'/'
        , {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            }).then(res => res.json())
                .then(json => {
                    console.log(json)
                    setprognosis(json.visits)
                    setlastdiagnosis(json.patient.DX)
                    //setlastdiagnosisscore(json.patient.LastScore)

                    setName({ptid: json.patient.PTID,sex: json.patient.PTGENDER,
                        age: json.patient.AGE,maritalStatus: json.patient.PTMARRY, race: json.patient.PTRACCAT})
                 

                }).then(() => {
                setLoadPage(true)
            }).then(json => {
            })
                .catch(err => console.log(err));

    }, []);



    return (

        <div>
            {loadPage ? (
                <div>
                    <div className="Home">

                    </div>
                    <div>

                    </div>
                    <div style={{marginTop: "1rem"}}>
                        <Breadcrumbs style={{color: "#0B3954"}} separator="›">
                            <Link style={{marginLeft: "3rem", color: "#0B3954"}}to={{
                                pathname: '/profile',
                                state: { id: docid }
                            }}>
                                My Account
                            </Link>
                            <Link style={{color: "#0B3954"}} to={{
                                pathname: '/doctorpatients',
                                state: { id: docid }
                            }} >
                                My Patients
                            </Link>
                            <Link style={{color: "#0B3954"}} to={{
                                pathname: '/patient',
                                state: { id: id }
                            }} >
                                Patient {name.ptid}
                            </Link>
                        </Breadcrumbs>
                    </div>

                    <div className={classes.gridroot}>
                        <Grid container>
                           
                            <Grid item xs={11} sm={4} style={{marginLeft: "2rem"}}>
                                <Paper className={classes.paper3}>
                                    <div className={classes.grid2}>
                                        <InputBase
                                            style={{
                                                color: "black",
                                                fontSize: 30,
                                                fontWeight: "500",
                                                marginBottom: "2rem"
                                            }}
                                            defaultValue="Demographic Info"
                                            disabled={true}
                                        />
                                    </div>
                                    <div style={{marginLeft: "3rem"}}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={10}>
                                                <TextField


                                                    id="ptid"
                                                    name="ptid"
                                                    label="PTID"
                                                    fullWidth
                                                    variant="outlined"
                                                    disabled={!edit}

                                                    defaultValue={name.ptid}

                                                    onChange={onChange}

                                                />
                                            </Grid>
                                            <Grid item xs={10}>
                                                <TextField


                                                    id="age"
                                                    name="age"
                                                    label="Age"
                                                    fullWidth
                                                    variant="outlined"
                                                    disabled={!edit}

                                                    defaultValue={name.age}

                                                    onChange={onChange}

                                                />
                                            </Grid>
                                            <Grid item xs={10}>
                                                <TextField


                                                    id="sex"
                                                    name="sex"
                                                    label="Sex"
                                                    fullWidth
                                                    variant="outlined"
                                                    disabled={!edit}

                                                    defaultValue={name.sex}

                                                    onChange={onChange}

                                                />
                                            </Grid>
                                      
                                            <Grid item xs={10}>
                                                <TextField
                                                    

                                                    id="race"
                                                    name="race"
                                                    label="Race"
                                                    fullWidth
                                                    variant="outlined"
                                                    disabled={!edit}

                                                    defaultValue={name.race}

                                                    onChange={onChange}

                                                />
                                            </Grid>

                                            <Grid item xs={10}>
                                                <TextField
                                             

                                                    id="maritalStatus"
                                                    name="maritalStatus"
                                                    label="Marital Status"
                                                    fullWidth
                                                    variant="outlined"
                                                    autoComplete="shipping address-line1"
                                                    disabled={!edit}

                                                    defaultValue={name.maritalStatus}

                                                    onChange={onChange}

                                                />
                                            </Grid>

                                        </Grid>

                                        
                                    </div>

                                </Paper>

                            </Grid>
                            <Grid item xs={11} sm={7} style={{marginLeft: "2rem"}}>

                                <Paper className={classes.paper}>
                                    <div className={classes.grid}>
                                        <InputBase
                                            style={{
                                                color: "black",
                                                fontSize: 30,
                                                fontWeight: "500",

                                            }}
                                            defaultValue="Last Diagnosis"

                                        />
                                    </div>
                                    <div style={{color: "black",marginLeft: "1rem",fontSize: 20}}>
                                    {"DX: "+prognosis[0].DX+" Category: "+prognosis[0].category+" Confidence_Level(Soft_max): "+prognosis[0].softmax}
                                    </div>
                                </Paper>
                                <Paper className={classes.paper2}>
                                    <div className={classes.grid}>
                                        <InputBase
                                            style={{
                                                color: "black",
                                                fontSize: 30,
                                                fontWeight: "500",

                                            }}
                                            defaultValue="Prognosis"

                                        />
                                    </div>
                                <ScrollList listof={prognosis} />
                                </Paper>
                            </Grid>

                        </Grid>



                    </div>
                    <div className={classes.ftr}>
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default Patient;