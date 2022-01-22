import React, {useEffect, useState, useRef} from 'react';
import {Link} from "react-router-dom";
import { styled } from '@mui/material/styles';
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
import FileRead from "../components/fileread";
import ScrollList from "../components/similarvisitsscroll";
import SendIcon from '@mui/icons-material/Send';
import {PlaylistAdd} from "@material-ui/icons";
import CircularProgress from "@material-ui/core/CircularProgress";
import SimilarvisitScrollList from "../components/similarvisitsscroll";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
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

        height: "44rem",
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
    },
    paper2: {
        height: "70rem",

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

function SimilarPatients(props) {
    let [loadPage, setLoadPage] = React.useState(false);
    const classes = useStyles();
    let [open, setOpen] = React.useState(false);
    let [open2, setOpen2] = React.useState(false);
    let [add, setAdd] = React.useState(true);
    let [pid, setPid] = React.useState('');
    let [prognosis, setprognosis] = React.useState([]);

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

        rid:'',
        ptid:'',
        viscode:''


    });
    const [dataFetched, setDataFetched] = useState(false);
    const [apicalled, setApicalled] = useState(false);
    const [clicked, setClicked] = useState(false);
    const handleOnClick = () => {
        setDataFetched(false);
        setApicalled(true);
        setClicked(true);
        const url = "http://tdjango.eba-nfssu9sz.us-west-2.elasticbeanstalk.com/api/getSimilarVisits";
        const data = {

            RID: info.rid,
            PTID: info.ptid,
            VISCODE: info.viscode

        }

        fetch( url
            , {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(res => res.json())
            .then(json => {
                console.log("aaaaaaa");
                console.log(json);
                console.log(json.visits);
                setprognosis(json.visits)


            }).then(() => {
            setDataFetched(true);
            setClicked(false);
        }).then(json => {
        })
            .catch(err => console.log(err));
    };
    const [TSNE, setTSNE] = useState();
    const [insideTSNE, setinsideTSNE] = useState(false);
    const [tsneFetched, setTsneFetched] = useState(false);
    const handleOnClickTSNE = () => {
        console.log("sjdsj")
        setinsideTSNE(true);
        const url = "http://tdjango.eba-nfssu9sz.us-west-2.elasticbeanstalk.com/api/getTSNE";
        fetch( url
            , {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            }).then(res => res.json())
            .then(json => {
                let edited = "";
                edited="data:image/png;base64,"+json.tsne.ImageBytes.split("b'")[1].slice(0,-1);
                console.log(edited)
                setTSNE(edited)
            }).then(() => {
            setTsneFetched(true)
        }).then(json => {
        })
            .catch(err => console.log(err));
    };

    let [name, setName] = useState({

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
                console.log(json.doctor.Name)

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
                            <Link style={{color: "#0B3954"}}to={{
                                pathname: '/similarvisits',
                                state: { id: id }
                            }}>
                               Similar Visitations
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
                                                marginLeft: "12rem",
                                                marginBottom: "2rem"
                                            }}
                                            defaultValue="Similarities"
                                            disabled={true}
                                        />
                                    </div>
                                    <div style={{marginLeft: "6rem"}}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} sm={2}>
                                                <TextField
                                                    fullWidth
                                                    id="rid"
                                                    label="RID"
                                                    variant="outlined"
                                                    defaultValue={info.rid}
                                                    disabled={!add}
                                                    onChange={onChange}

                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={2}>
                                                <TextField
                                                    fullWidth
                                                    id="ptid"
                                                    label="PTID"
                                                    variant="outlined"
                                                    defaultValue={info.ptid}
                                                    disabled={!add}
                                                    onChange={onChange}

                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <TextField
                                                    fullWidth
                                                    id="viscode"
                                                    label="VISCODE"
                                                    variant="outlined"
                                                    defaultValue={info.viscode}
                                                    disabled={!add}
                                                    onChange={onChange}

                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={2}>
                                                <Button disabled={clicked} variant="contained" onClick={handleOnClick}   style={{
                                                    backgroundColor: "orange",
                                                    color:'white',
                                                    fontSize: 20,
                                                    fontWeight: "500",
                                                }}  endIcon={<SendIcon />}>
                                                    RESULTS
                                                </Button>
                                            </Grid>

                                            <Grid item xs={10}>
                                                <Paper >
                                                    <div>
                                                        <InputBase
                                                            style={{
                                                                color: "black",
                                                                fontSize: 30,
                                                                fontWeight: "500",

                                                            }}
                                                            defaultValue="Similar Visitations"

                                                        />
                                                    </div>
                                                    {(!dataFetched)&&apicalled ? (
                                                        <CircularProgress />
                                                    ) : (
                                                        <SimilarvisitScrollList listof={prognosis} />
                                                    )}
                                                </Paper>

                                            </Grid>

                                        </Grid>
                                        <Grid  >{!insideTSNE ?
                                            <Button disabled={clicked} variant="contained" onClick={handleOnClickTSNE}   style={{
                                                backgroundColor: "green",
                                                color:'white',
                                                fontSize: 20,
                                                fontWeight: "500",
                                                width:'40rem',
                                                marginTop:'1rem'
                                            }}  endIcon={<SendIcon />}>
                                                FETCH TSNE GRAPH
                                            </Button>:(<div style={{
                                                marginTop:'1rem'
                                            }}></div>)}
                                            {(!tsneFetched)&&insideTSNE ? (
                                                <CircularProgress style={{
                                                    marginTop:'1rem'
                                                }} />
                                            ) : ([]
                                            )}
                                            {(tsneFetched) ? (
                                                <img style={{
                                                    marginTop:'1rem',
                                                    width:'40rem',
                                                    height:'30rem'
                                                }} src={TSNE} alt="Red dot"/>
                                            ) : ([]
                                            )}
                                        </Grid>
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

export default SimilarPatients;