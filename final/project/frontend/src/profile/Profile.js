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
import {PlaylistAdd} from "@material-ui/icons";



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

        height: "35rem",
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
    },
    paper2: {
        height: "35rem",

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

function Profile(props) {
    let [loadPage, setLoadPage] = React.useState(false);
    const classes = useStyles();
    let [open, setOpen] = React.useState(false);
    let [edit, setEdit] = React.useState(false);
    let [nameChanged, setNameChanged] = React.useState(false);
    let [surnameChanged, setSurnameChanged] = React.useState(false);
    let [emailChanged, setEmailChanged] = React.useState(false);
    let [addressChanged, setAddressChanged] = React.useState(false);
    let [usernameChanged, setUsernameChanged] = React.useState(false);
    const  id=props.location.state.id;



    let history = useHistory();

    const handleClick = () => {
        setOpen(!open);

    };


    const [name, setName] = useState({

        first_name: '',
        last_name: '',
        email: '',

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


    useEffect(() => {
        const docid=props.location.state.id

            fetch( 'http://tdjango.eba-ixskapzh.us-west-2.elasticbeanstalk.com/api/doctorProfile/'+docid+'/'
        , {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            }).then(res => res.json())
                .then(json => {

                    setName({first_name: json.doctor.Name,last_name: json.doctor.Surname,email: json.doctor.Mail})
                 

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
                                state: { id: id }
                            }}>
                                My Account
                            </Link>
                        </Breadcrumbs>
                    </div>

                    <div className={classes.gridroot}>
                        <Grid container>
                            <Grid item xs={3}>
                                <Paper className={classes.paper}>

                                        <div>
                                            <div>
                                                <IconButton>
                                                    <Badge>
                                                        <AccountCircleOutlinedIcon
                                                            style={{fontSize: "2.5rem", color: "#525b60"}}/>
                                                    </Badge>
                                                </IconButton>
                                                <InputBase
                                                    style={{
                                                        color: "#525B60",
                                                        marginTop: "1.5rem",
                                                        marginBottom: "1rem"
                                                    }}
                                                    defaultValue={name.first_name + ' ' + name.last_name}
                                                    inputProps={{'aria-label': 'new-arrivals'}}
                                                    disabled={true}
                                                />

                                            </div>
                                            <List
                                                component="nav"
                                                className={classes.root}
                                            >

                                                <ListItem button style={{marginTop: '1rem', marginBottom: '1rem'}}
                                                          component={Link} to={{pathname: "/doctorpatients", state: {id: props.location.state.id}}}>
                                                    <ListItemIcon>
                                                        <ReorderIcon/>
                                                    </ListItemIcon>
                                                    <ListItemText primary="My Patients"/>
                                                </ListItem>

                                                <ListItem button style={{marginTop: '1rem', marginBottom: '1rem'}}
                                                          component={Link} to={{pathname: "/patientadd", state: {id: props.location.state.id}}}
                                                    >
                                                    <ListItemIcon>
                                                        <AddCircleIcon/>
                                                    </ListItemIcon>
                                                    <ListItemText primary="Add Patient"/>
                                                </ListItem>
                                                <ListItem button style={{marginTop: '1rem', marginBottom: '1rem'}}
                                                          component={Link}  to={{pathname: "/visitadd", state: {id: props.location.state.id}}}
                                                >
                                                    <ListItemIcon>
                                                        <PlaylistAdd/>
                                                    </ListItemIcon>
                                                    <ListItemText primary="Add Visitation"/>
                                                </ListItem>

                                            </List>
                                        </div>


                                </Paper>
                            </Grid>
                            <Grid item xs={7} style={{marginLeft: "2rem"}}>
                                <Paper className={classes.paper2}>
                                    <div className={classes.grid2}>
                                        <InputBase
                                            style={{
                                                color: "black",
                                                fontSize: 30,
                                                fontWeight: "500",
                                                marginLeft: "12rem",
                                                marginBottom: "2rem"
                                            }}
                                            defaultValue="My Account"
                                            disabled={true}
                                        />
                                    </div>
                                    <div style={{marginLeft: "6rem"}}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={10} sm={5}>
                                                <TextField
                                                    fullWidth
                                                    id="first_name"
                                                    label="Name"
                                                    variant="outlined"
                                                    defaultValue={name.first_name}
                                                    disabled={!edit}
                                                    onChange={onChange}
                                                    /*InputProps={{
                                                      endAdornment: (
                                                        <InputAdornment position="end">
                                                          <IconButton onClick={() => setEdit(true)}>
                                                            <EditIcon />
                                                          </IconButton>
                                                        </InputAdornment>
                                                      )
                                                    }}*/
                                                />
                                            </Grid>
                                            <Grid item xs={10} sm={5}>
                                                <TextField
                                                    fullWidth
                                                    id="last_name"
                                                    label="Surname"
                                                    variant="outlined"
                                                    defaultValue={name.last_name}
                                                    disabled={!edit}
                                                    onChange={onChange}
                                                />
                                            </Grid>
                                            <Grid item xs={10} sm={5}>
                                                <TextField
                                                    fullWidth
                                                    id="username"
                                                    label="Username"
                                                    variant="outlined"
                                                    defaultValue={name.username}

                                                    disabled={!edit}
                                                    onChange={onChange}
                                                />
                                            </Grid>
                                            <Grid item xs={10} sm={5}>
                                                <TextField
                                                    fullWidth
                                                    id="email"
                                                    label="E-mail"
                                                    variant="outlined"
                                                    defaultValue={name.email}
                                                    disabled={true}
                                                    onChange={onChange}
                                                />
                                            </Grid>
                                            {/*<div>
                          <TextField
                              className={classes.txtfield2}
                              error={val.address.error}
                              helperText={val.address.message}
                              id="address"
                              label="Address"
                              variant="outlined"
                              defaultValue={JSON.parse(JSON.stringify(name.address)) !== '' ?
                                  (JSON.parse(JSON.stringify(name.address))) : (' ')
                              }
                              disabled={!edit}
                              multiline={true}
                              onChange={onChange}
                          />
                        </div>*/}



                                            <Grid item xs={10}>
                                                <TextField
                                                    required

                                                    id="address_1"
                                                    name="address1"
                                                    label="Address line 1"
                                                    fullWidth
                                                    variant="outlined"
                                                    autoComplete="shipping address-line1"
                                                    disabled={!edit}

                                                    defaultValue={''}

                                                    onChange={onChange}

                                                />
                                            </Grid>

                                        </Grid>

                                        <div style={{marginTop: '2rem'}}>


                                            {edit ? (
                                                    <div style={{display: 'flex', flexDirection: 'row'}}>
                                                        <Button
                                                            style={{
                                                                width: "20rem",

                                                                marginLeft: "1rem",
                                                                marginRight: "1rem",

                                                                marginTop: "1rem",
                                                                backgroundColor: "#0B3954",
                                                            }}
                                                            variant="contained" color="primary"
                                                            onClick={handleOnClick}
                                                        >
                                                            Save
                                                        </Button>
                                                        <Button
                                                            style={{
                                                                width: "20rem",
                                                                marginLeft: "1rem",
                                                                marginRight: "8rem",
                                                                marginTop: "1rem",
                                                                backgroundColor: "#a71325",
                                                            }}
                                                            variant="contained" color="primary"
                                                            onClick={() => setEdit(false)}
                                                        >Cancel
                                                        </Button></div>
                                                ) :
                                                <Button
                                                    style={{
                                                        width: "20rem",
                                                        marginLeft: "10rem",
                                                        marginRight: "8rem",
                                                        backgroundColor: "#0B3954",
                                                    }}
                                                    variant="contained" color="primary"
                                                   // onClick={() => setEdit(true)}
                                                >
                                                    Edit
                                                </Button>
                                            }
                                        </div>
                                    </div>
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

export default Profile;