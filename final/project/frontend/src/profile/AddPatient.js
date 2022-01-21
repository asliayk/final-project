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
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
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
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

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

        height: "40rem",
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
    },
    paper2: {
        height: "40rem",

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

function AddPatient(props) {
    let [loadPage, setLoadPage] = React.useState(false);
    const classes = useStyles();
    let [open, setOpen] = React.useState(false);
    let [open2, setOpen2] = React.useState(false);
    let [add, setAdd] = React.useState(true);
    let [pid, setPid] = React.useState('');

    const  id=props.location.state.id;



    let history = useHistory();


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
        setOpen2(false)
    };




    const [info, setInfo] = useState({
        age:'',
        ptgender:'',
        pteducat:'',
        ptethcat:'',
        ptraccat:'',
        ptmarry:'',
        apoe4:'',
        dx_bl:'',
        dx:'',
        examdate:'',


    });
    const handleOnClick = () => {
        const url = "http://tdjango.eba-nfssu9sz.us-west-2.elasticbeanstalk.com/api/addPatient";
        const data = {

            AGE: info.age,
            PTGENDER: info.ptgender,
            PTEDUCAT: info.pteducat,
            PTETHCAT: info.ptethcat,
            PTRACCAT: info.ptraccat,
            PTMARRY: info.ptmarry,
            APOE4: info.apoe4,
            DX_bl: info.dx_bl,
            DX: info.dx,
            EXAMDATE: info.examdate

        }
       if(info.age==''||info.ptgender==''||info.pteducat==''||info.ptethcat==''||info.ptraccat==''||info.ptmarry==''||info.apoe4==''||info.dx_bl==''||info.dx==''||info.examdate==''){
           setOpen2(true)
       }else{
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(res => res.json())
            .then(json => {
                const success = json.status.success
                if (success) {
                    setPid(json.pid)
                    setOpen(true)
                } else {
                    alert('Problem occurred.');
                }
            })
            .catch(err => {
                alert('Some error has occurred')
                console.log(err)
            });}


    };


    const [name, setName] = useState({

        first_name: '',
        last_name: '',
        email: '',

    });


    function onChange(event) {
        let mutableState = info
        mutableState[event.target.id] = event.target.value
        setInfo(mutableState)
        console.log(info)
    }




    useEffect(() => {
        const docid=props.location.state.id

        fetch( 'http://tdjango.eba-nfssu9sz.us-west-2.elasticbeanstalk.com/api/doctorProfile/'+docid+'/'
            , {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            }).then(res => res.json())
            .then(json => {

                setName({first_name: json.doctor.Name,last_name: json.doctor.Surname})



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
                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{
                        vertical: "top",
                        horizontal: "center"
                    }}>
                        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }} >
                            Patient number {pid} successfully added.
                        </Alert>
                    </Snackbar>
                    <Snackbar open={open2} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{
                        vertical: "top",
                        horizontal: "center"
                    }}>
                        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}   >
                            Please fill every necessary information.
                        </Alert>
                    </Snackbar>
                    <div className="Home">

                    </div>

                    <div style={{marginTop: "1rem"}}>
                        <Breadcrumbs style={{color: "#0B3954"}} separator="›">
                            <Link style={{marginLeft: "3rem", color: "#0B3954"}}to={{
                                pathname: '/profile',
                                state: { id: id }
                            }}>
                                My Account
                            </Link>
                            <Link style={{ color: "#0B3954"}}to={{
                                pathname: '/profile',
                                state: { id: id }
                            }}>
                                Add Patient
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
                                                          component={Link}  to={{pathname: "/doctorpatients", state: {id: props.location.state.id}}}>
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
                                                component={Link} to={{pathname: "/visitadd", state: {id: props.location.state.id}}}
                                            >
                                                <ListItemIcon>
                                                    <PlaylistAddIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="Add Visit"/>
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
                                            defaultValue="Add New Patient"
                                            disabled={true}
                                        />
                                    </div>
                                    <div style={{marginLeft: "6rem"}}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={10} sm={5}>
                                                <TextField
                                                    fullWidth
                                                    id="age"
                                                    label="Age"
                                                    variant="outlined"
                                                    defaultValue={info.age}
                                                    disabled={!add}
                                                    onChange={onChange}

                                                />
                                            </Grid>
                                            <Grid item xs={10} sm={5}>
                                                <TextField
                                                    fullWidth
                                                    id="ptgender"
                                                    label="PTGender"
                                                    variant="outlined"
                                                    defaultValue={info.ptgender}
                                                    disabled={!add}
                                                    onChange={onChange}
                                                />
                                            </Grid>
                                            <Grid item xs={10} sm={5}>
                                                <TextField
                                                    fullWidth
                                                    id="pteducat"
                                                    label="PTEducat"
                                                    variant="outlined"
                                                    defaultValue={info.pteducat}

                                                    disabled={!add}
                                                    onChange={onChange}
                                                />
                                            </Grid>
                                            <Grid item xs={10} sm={5}>
                                                <TextField
                                                    fullWidth
                                                    id="ptethcat"
                                                    label="PTEthcat"
                                                    variant="outlined"
                                                    defaultValue={info.ptethcat}
                                                    disabled={!add}
                                                    onChange={onChange}
                                                />
                                            </Grid>
                                            <Grid item xs={10} sm={5}>
                                                <TextField
                                                    fullWidth
                                                    id="ptraccat"
                                                    label="PTRaccat"
                                                    variant="outlined"
                                                    defaultValue={info.ptraccat}

                                                    disabled={!add}
                                                    onChange={onChange}
                                                />
                                            </Grid>
                                            <Grid item xs={10} sm={5}>
                                                <TextField
                                                    fullWidth
                                                    id="ptmarry"
                                                    label="PTMarry"
                                                    variant="outlined"
                                                    defaultValue={info.ptmarry}
                                                    disabled={!add}
                                                    onChange={onChange}
                                                />
                                            </Grid>
                                            <Grid item xs={10} sm={5}>
                                                <TextField
                                                    fullWidth
                                                    id="apoe4"
                                                    label="Apoe4"
                                                    variant="outlined"
                                                    defaultValue={info.apoe4}

                                                    disabled={!add}
                                                    onChange={onChange}
                                                />
                                            </Grid>
                                            <Grid item xs={10} sm={5}>
                                                <TextField
                                                    fullWidth
                                                    id="dx_bl"
                                                    label="Dx_bl"
                                                    variant="outlined"
                                                    defaultValue={info.dx_bl}
                                                    disabled={!add}
                                                    onChange={onChange}
                                                />
                                            </Grid> <Grid item xs={10} sm={5}>
                                            <TextField
                                                fullWidth
                                                id="dx"
                                                label="Dx"
                                                variant="outlined"
                                                defaultValue={info.dx}

                                                disabled={!add}
                                                onChange={onChange}
                                            />
                                        </Grid>
                                            <Grid item xs={10} sm={5}>
                                                <TextField
                                                    fullWidth
                                                    id="examdate"
                                                    label="Examdate"
                                                    variant="outlined"
                                                    defaultValue={info.examdate}
                                                    disabled={!add}
                                                    onChange={onChange}
                                                />
                                            </Grid>





                                        </Grid>

                                        <div style={{marginTop: '2rem'}}>



                                                    <div style={{display: 'flex', flexDirection: 'row'}}>
                                                        <Button
                                                            style={{
                                                                width: "20rem",
                                                                marginLeft: "10rem",
                                                                marginRight: "8rem",
                                                                backgroundColor: "green",
                                                                color:'white',
                                                            }}
                                                            variant="contained"

                                                            onClick={handleOnClick}
                                                        >
                                                            ADD
                                                        </Button>
                                              </div>

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

export default AddPatient;