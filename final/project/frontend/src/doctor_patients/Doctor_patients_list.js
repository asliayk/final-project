import {Box, Divider, Grid, Paper, Typography} from "@material-ui/core";
import React from "react";
import {serverUrl} from "../common/ServerUrl";
import {useState, useEffect} from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import {Link} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import { FixedSizeList as List } from "react-window";
import { PieChart } from 'react-minimal-pie-chart';
import Chip from '@mui/material/Chip';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const useStyles = makeStyles((theme) => ({

    list: {
        overflowY: "scroll",
        overflow: 'hidden',
        maxHeight: '100',
        marginLeft:'2rem',
        marginTop:'1rem',
        backgroundColor: theme.palette.background.paper,
        '&::-webkit-scrollbar': {
            width: '0.5em'
        },
        '&::-webkit-scrollbar-track': {
            '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.3)',
            'border-radius': '10px',
        },
        '&::-webkit-scrollbar-thumb': {
            '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.5)',
            'border-radius': '10px',
        },
    },
    listItemText:{
        color:'black',
        fontSize:'2em',
    },
    root: {
        width: "100%",
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    paper: {
        padding: theme.spacing(2),
        margin: theme.spacing(2),
        marginLeft: theme.spacing(12),
        marginRight: theme.spacing(12),
        flexDirection: "column",
        display: "flex",

    },
    paper2: {
        padding: theme.spacing(2),
        margin: theme.spacing(2),
        marginLeft: theme.spacing(12),
        marginRight: theme.spacing(12),
        flexDirection: "row",
        display: "flex",
        alignItems:'center'

    },
    paper3: {
        padding: theme.spacing(1),
        marginLeft: theme.spacing(12),
        flexDirection: "row",
        display: "flex",
        alignItems:'center'

    },
    paper4: {
        padding: theme.spacing(1),
        flexDirection: "row",
        marginLeft: theme.spacing(2),
        display: "flex",
        alignItems:'center'
    },
    box: {
        display: "flex",
        justifyContent: "center",
    },


}));

export default function Doctor_patients_list(props) {
    const classes = useStyles();

    const[married,setMarried]= useState(0.0);
    const[divorced,setDivorced]= useState(0.0);
    const[nevermarried,setNevermarried]= useState(0.0);
    const[unknown,setUnknown]= useState(0.0);
    const[widowed,setWidowed]= useState(0.0);

    const[white,setWhite]= useState(0.0);
    const[asian,setAsian]= useState(0.0);
    const[black,setBlack]= useState(0.0);
    const[unknownrace,setUnknownrace]= useState(0.0);
    const[hawaiian,setHawaiian]= useState(0.0);
    const[amindianalaskan,setAmindianalaskan]= useState(0.0);
    const[morethanone,setMorethanone]= useState(0.0);

    const[averageage,setAverageage]= useState(0.0);
    const[femalepercentage,setFemalepercentage]= useState(0.0);
    const[malepercentage,setMalepercentage]= useState(0.0);


    const[datap,setDatap]= useState([]);
    const[count,setCount]= useState(10);
    const[num,setNum]=useState(1)
    let lendivideten=1;
    const[plist,setPlist]= useState([]);
    const[inpage,setinpage]= useState(false);
    const docid=props.location.state.id;

    useEffect(() => {


        fetch("http://tdjango.eba-nfssu9sz.us-west-2.elasticbeanstalk.com/api/doctorProfile/"+docid+'/', {

        })
            .then((response) => response.json())
            .then((data) => {
                setDatap(data.patients)
                lendivideten=Math.floor(data.patients.length/10)
                if(!(data.patients.length%10==0)){
                    setCount(lendivideten+1)
                }else{
                    setCount(lendivideten)
                }
                setPlist(data.patients.slice(0,10))
                setNum(lendivideten)
            }).then(() => {
            fetch("http://tdjango.eba-nfssu9sz.us-west-2.elasticbeanstalk.com/api/getStatistics", {

            })
                .then((response2) => response2.json())
                .then((data2) => {

                setDivorced(parseFloat(data2.statistics[0].DivorcedPercentage_m))
                setMarried(parseFloat(data2.statistics[0].MarriedPercentage_m))
                setNevermarried(parseFloat(data2.statistics[0].NeverMarriedPercentage_m))
                setUnknown(parseFloat(data2.statistics[0].UnknownPercentage_m))
                setWidowed(parseFloat(data2.statistics[0].WidowedPercentage_m))

                setWhite(parseFloat(data2.statistics[0].WhitePercentage_race))
                setAsian(parseFloat(data2.statistics[0].AsianPercentage_race))
                setBlack(parseFloat(data2.statistics[0].BlackPercentage_race))
                setAmindianalaskan(parseFloat(data2.statistics[0].AmIndianAlaskanPercentage_race))
                setHawaiian(parseFloat(data2.statistics[0].HawaiianPercentage_race))
                setMorethanone(parseFloat(data2.statistics[0].MoreThanOnePercentage_race))
                setUnknownrace(parseFloat(data2.statistics[0].UnknownPercentage_race))

                setAverageage(parseFloat(data2.statistics[0].AvgAge))
                setFemalepercentage(parseFloat(data2.statistics[0].FemalePercentage))
                setMalepercentage((100.0-parseFloat(data2.statistics[0].FemalePercentage)))


                })

        }).then(() => {
            setinpage(true)
        });

    }, []);

    const [page, setPage] = React.useState(1);
    const handleChange = (event, value) => {

        let endvalue=0;
        setPage(value);

        if(value>num){
            endvalue=datap.length
        }else{
            endvalue=10+((value-1)*10)
        }
        setPlist(datap.slice(0+((value-1)*10),endvalue))



    };





    const Row = ({ index, key, style }) => (

        <div>
            <div key={key} style={style} >
        <Paper className={classes.paper}>
            <Grid container spacing={4}>
                <Grid
                    item
                    style={{ flexDirection: "column", position: "relative" }}
                    container>
                    <Link
                        to={{pathname: "/patient", state: {id:plist[index].PTID,docid:docid}}}
                    >
                        <Typography gutterBottom variant="h4">
                            {plist[index].PTID + " : " + plist[index].DX }
                        </Typography>
                    </Link>
                    <Divider variant="middle" />
                </Grid>
            </Grid>
        </Paper>
            </div>
        </div>
    )

    return (
        <div  >
            {inpage?(
            <div  >
                <div style={{marginTop: "1rem", overflow:'hidden'}} >
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
                    </Breadcrumbs>
                </div>
                <Grid container >
                    <Grid item xs={5}>
               <div style={{marginBottom: "1rem"}}>
                <List  className={classes.list}
                    width={window.screen.width*(0.45)}
                    height={window.screen.height*(0.7)}
                    itemCount={plist.length}
                    itemSize={120}
                >
                    {Row}
                </List>
                    <Stack  style={{marginLeft:'12rem',overflow:'hidden'}}spacing={2}>
                        <Pagination page={page} onChange={handleChange} count={count} />
                    </Stack>
                </div>
                    </Grid>
                    <Grid item xs={7}>
                        <Grid container s={11} >
                            <Grid item xs={5}>
                                <Paper className={classes.paper3} >
                                    <div  style={{fontSize:'20px'}}> <b>Average Age:  </b></div>
                                    <Chip label={averageage}  style={{marginLeft:'1rem'}} />
                                </Paper>
                            </Grid>
                            <Grid item xs={6}>
                                <Paper className={classes.paper4} >
                                    <div  style={{fontSize:'22px'}}> <b>Gender Stats: </b></div>
                                    <Chip label={"Female : %"+femalepercentage} style={{marginLeft:'1rem',backgroundColor: '#FFA9FD'}}/>
                                    <Chip label={"Male : %"+malepercentage} style={{marginLeft:'1rem',backgroundColor: '#74BBFB'}}/>
                                </Paper> </Grid >
                          </Grid>
                 <Paper className={classes.paper2}>
                <div style={{marginLeft:'4rem',display:'flex',alignItems:'center'}}>

                    <Stack spacing={1} alignItems="center">
                        <div  style={{fontSize:'20px'}}> <b>Marital Statistics: </b></div>
                    <Stack direction="row" spacing={1}>
                    <Stack direction="column" spacing={1}>
                        <Chip label={"Married : %"+married} style={{backgroundColor: '#6050DC'}}/>
                        <Chip label={"Divorced : %"+divorced} style={{backgroundColor: '#D52DB7'}} />
                        <Chip label={"Widowed : %"+widowed} style={{backgroundColor: '#FF2E7E'}}/>
                    </Stack>
                        <Stack direction="column" spacing={1}>
                        <Chip label={"NeverMarried : %"+nevermarried} style={{backgroundColor: '#FF6B45'}}/>
                        <Chip label={"Unknown : %"+unknown} style={{backgroundColor: '#FFAB05'}}/>
                    </Stack>
                <Stack direction="row" spacing={1}>
             <div style={{marginLeft:'2.5rem',maxHeight:'200px',maxWidth:'200px'}}>
                <PieChart
                    data={[
                        { title: 'Married', value: parseFloat(`${married}`), color: '#6050DC' },
                        { title: 'Divorced', value: parseFloat(`${divorced}`), color: '#D52DB7' },
                        { title: 'Widowed', value: parseFloat(`${widowed}`), color: '#FF2E7E' },
                        { title: 'NeverMarried', value:parseFloat(`${nevermarried}`), color: '#FF6B45' },
                        { title: 'Unknown', value: parseFloat(`${unknown}`), color: '#FFAB05' },

                    ]}
                /></div></Stack></Stack></Stack>
                </div></Paper>
                        <Paper className={classes.paper2}>
                            <div style={{marginLeft:'3rem',display:'flex',alignItems:'center'}}>

                                <Stack spacing={1} alignItems="center">
                                    <div  style={{fontSize:'20px'}}> <b>Race Statistics: </b></div>
                                    <Stack direction="row" spacing={1}>
                                        <Stack direction="column" spacing={1}>
                                            <Chip label={"White : %"+white} style={{backgroundColor: '#E6F69D'}}/>
                                            <Chip label={"Black : %"+black} style={{backgroundColor: '#AADEA7'}} />
                                            <Chip label={"Asian : %"+asian} style={{backgroundColor: '#F66D44'}}/>
                                            <Chip label={"MoreThanOne : %"+morethanone} style={{backgroundColor: '#64C2A6'}}/>
                                        </Stack>
                                            <Stack direction="column" spacing={1}>
                                            <Chip label={"UnknownRace : %"+unknownrace} style={{backgroundColor: '#2D87BB'}}/>
                                            <Chip label={"AmIndianAlaskan : %"+amindianalaskan} style={{backgroundColor: '#FEAE65'}}/>
                                            <Chip label={"Hawaiian : %"+hawaiian} style={{backgroundColor: '#93F03B'}}/>
                                        </Stack>
                                        <Stack direction="row" spacing={1}>
                                            <div style={{marginLeft:'1rem',maxHeight:'200px',maxWidth:'200px'}}>
                                                <PieChart
                                                    data={[
                                                        { title: 'White', value: parseFloat(`${white}`), color: '#E6F69D' },
                                                        { title: 'Black', value: parseFloat(`${black}`), color: '#AADEA7' },
                                                        { title: 'Asian', value: parseFloat(`${asian}`), color: '#F66D44' },
                                                        { title: 'MoreThanOne', value:parseFloat(`${morethanone}`), color: '#64C2A6' },
                                                        { title: 'UnknownRace', value: parseFloat(`${unknownrace}`), color: '#2D87BB' },
                                                        { title: 'AmIndianAlaskan', value: parseFloat(`${amindianalaskan}`), color: '#FEAE65' },
                                                        { title: 'Hawaiian', value: parseFloat(`${hawaiian}`), color: '#93F03B' },
                                                    ]}
                                                /></div></Stack></Stack></Stack>
                            </div></Paper>

                        </Grid> </Grid>
            </div>):null}
        </div>
    );
}