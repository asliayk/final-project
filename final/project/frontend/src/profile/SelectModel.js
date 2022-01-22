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
import Stack from '@mui/material/Stack';
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
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import PieChartIcon from "@mui/icons-material/PieChart";



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

function SelectModel(props) {
    let [loadPage, setLoadPage] = React.useState(false);
    const classes = useStyles();
    let [open, setOpen] = React.useState(false);
    let [edit, setEdit] = React.useState(false);
    let [modelid, setModelid] = React.useState("");
    let [model2, setModel2] = React.useState(false);
    let [model3, setModel3] = React.useState(false);
    let [model4, setModel4] = React.useState(false);
    let [model8, setModel8] = React.useState("");

    const  id=props.location.state.id;



    let history = useHistory();




    const [name, setName] = useState({

        first_name: '',
        last_name: '',
        email: '',

    });


    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);

    };
    const handleOnClick = (classnum) => {
        console.log(classnum)
        const url = "http://tdjango.eba-nfssu9sz.us-west-2.elasticbeanstalk.com/api/selectModel";
        const data = {

            ID: '1',
            ClassNum:classnum

        }

            fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(res => res.json())
                .then(json => {
                    const success = json.status.success
                    if (success) {
                        setOpen(true)
                        setModelid(classnum)
                        if(classnum=="2"){
                            setModel2(true)
                            setModel3(false)
                            setModel4(false)
                            setModel8(false)
                        }else if(classnum=="3"){
                            setModel3(true)
                            setModel2(false)
                            setModel4(false)
                            setModel8(false)
                        }else if(classnum=="4"){
                            setModel4(true)
                            setModel2(false)
                            setModel3(false)
                            setModel8(false)
                        }else if(classnum=="8"){
                            setModel8(true)
                            setModel2(false)
                            setModel3(false)
                            setModel4(false)
                        }
                    } else {
                        alert('Problem occurred.');
                    }
                })
                .catch(err => {
                    alert('Some error has occurred')
                    console.log(err)
                });


    };

    useEffect(() => {
        const docid=props.location.state.id
        fetch( 'http://tdjango.eba-nfssu9sz.us-west-2.elasticbeanstalk.com/api/doctorProfile/'+docid+'/'
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

        fetch( 'http://tdjango.eba-nfssu9sz.us-west-2.elasticbeanstalk.com/api/getModel'
            , {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            }).then(res => res.json())
            .then(json => {

         if(json.model=="2"){
             setModel2(true)
         }else if(json.model=="3"){
             setModel3(true)
         }else if(json.model=="4"){
             setModel4(true)
         }else if(json.model=="8"){
             setModel8(true)
         }


            }).then(() => {
           // setLoadPage(true)
        }).then(json => {
        })
            .catch(err => console.log(err));

    }, []);



    return (

        <div>
            {loadPage ? (
                <div>
                    <div className="Home">
                        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{
                            vertical: "top",
                            horizontal: "center"
                        }}>
                            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }} >
                                Model is successfully set to {modelid} .
                            </Alert>
                        </Snackbar>
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
                            <Link style={{color: "#0B3954"}}to={{
                                pathname: '/selectmodel',
                                state: { id: id }
                            }}>
                                Select Model
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
                                                      component={Link} to={{pathname: "/selectmodel", state: {id: props.location.state.id}}}>
                                                <ListItemIcon>
                                                    <SelectAllIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="Select Model"/>
                                            </ListItem>

                                            <ListItem button style={{marginTop: '1rem', marginBottom: '1rem'}}
                                                      component={Link} to={{pathname: "/doctorpatients", state: {id: props.location.state.id}}}>
                                                <ListItemIcon>
                                                    <ReorderIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="My Patients"/>
                                            </ListItem>
                                            <ListItem button style={{marginTop: '1rem', marginBottom: '1rem'}}
                                                      component={Link}  to={{pathname: "/morestatistics", state: {id: props.location.state.id}}}
                                            >
                                                <ListItemIcon>
                                                    <PieChartIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="More Statistics"/>
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
                                            <ListItem button style={{marginTop: '1rem', marginBottom: '1rem'}}
                                                      component={Link}  to={{pathname: "/similarvisits", state: {id: props.location.state.id}}}
                                            >
                                                <ListItemIcon>
                                                    <PersonSearchIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary="Similar Visitations"/>
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
                                                marginLeft: "12rem"
                                            }}
                                            defaultValue="Model Terms"
                                            disabled={true}
                                        />
                                    </div>
                                    <div style={{marginLeft: "2rem",width:"57rem"}}>

                                            <Grid item xs={10}>
                                                <TextField
                                                    required
                                                    style={{width:"48rem"}}
                                                    id="outlined-multiline-flexible"
                                                    label="Explanation"
                                                    multiline
                                                    maxRows={20}
                                                    variant="outlined"
                                                    autoComplete="shipping address-line1"
                                                    disabled={!edit}

                                                    defaultValue={'bfsdjgbckbjffndnvzxnfLNLk' +
                                                    'jgjhgkkgkjhkjklj;ll;;;jl;jl;jkhkjjjlgggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg'
                                                    }



                                                />


                                        </Grid>

                                        <div style={{marginTop: '2rem'}}>
                                            <Stack direction="row" spacing={2}>
                                                {model2?<Button  style={{fontSize:"2rem",background:"green",color:"white",height:"11rem",width:"11rem",borderRadius: '5em'}} onClick={()=>handleOnClick('2')}>Select Model 2</Button>:<Button  style={{fontSize:"2rem",background:"#B0E0E6",color:"white",height:"11rem",width:"11rem",borderRadius: '5em'}} onClick={()=>handleOnClick('2')}>Select Model 2</Button>}
                                                {model3?<Button  style={{fontSize:"2rem",background:"green",color:"white",height:"11rem",width:"11rem",borderRadius: '5em'}} onClick={()=>handleOnClick('3')}>Select Model 3</Button>:<Button  style={{fontSize:"2rem",background:"#98d8d5",color:"white",height:"11rem",width:"11rem",borderRadius: '5em'}} onClick={()=>handleOnClick('3')}>Select Model 3</Button>}
                                                {model4?<Button style={{fontSize:"2rem",background:"green",color:"white",height:"11rem",width:"11rem",borderRadius: '5em'}} onClick={()=>handleOnClick('4')}>Select Model 4</Button>:<Button style={{fontSize:"2rem",background:"#97bec4",color:"white",height:"11rem",width:"11rem",borderRadius: '5em'}} onClick={()=>handleOnClick('4')}>Select Model 4</Button>}
                                                {model8?<Button  style={{fontSize:"2rem",background:"green",color:"white",height:"11rem",width:"11rem",borderRadius: '5em'}} onClick={()=>handleOnClick('8')}>Select Model 8</Button>:<Button  style={{fontSize:"2rem",background:"#58babf",color:"white",height:"11rem",width:"11rem",borderRadius: '5em'}} onClick={()=>handleOnClick('8')}>Select Model 8</Button>}
                                            </Stack>
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

export default SelectModel;