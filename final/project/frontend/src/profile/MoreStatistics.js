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
import TextField from "@material-ui/core/TextField";

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
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(12),
        flexDirection: "row",
        display: "flex",
        alignItems:'center'

    },
    paper3: {
        padding: theme.spacing(1),
        marginLeft: theme.spacing(6),
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
    paper5: {
        padding: theme.spacing(2),
        margin: theme.spacing(2),
        marginLeft: theme.spacing(6),
        marginRight: theme.spacing(2),
        flexDirection: "row",
        display: "flex",
        alignItems:'center',
        height:"35rem"

    },
    box: {
        display: "flex",
        justifyContent: "center",
    },


}));

export default function MoreStatistics(props) {
    const classes = useStyles();

    const[marriedmci,setMarriedmci]= useState(0.0);
    const[divorcedmci,setDivorcedmci]= useState(0.0);
    const[nevermarriedmci,setNevermarriedmci]= useState(0.0);
    const[unknownmci,setUnknownmci]= useState(0.0);
    const[widowedmci,setWidowedmci]= useState(0.0);

    const[marrieddementia,setMarrieddementia]= useState(0.0);
    const[divorceddementia,setDivorceddementia]= useState(0.0);
    const[nevermarrieddementia,setNevermarrieddementia]= useState(0.0);
    const[unknowndementia,setUnknowndementia]= useState(0.0);
    const[widoweddementia,setWidoweddementia]= useState(0.0);

    const[marriednl,setMarriednl]= useState(0.0);
    const[divorcednl,setDivorcednl]= useState(0.0);
    const[nevermarriednl,setNevermarriednl]= useState(0.0);
    const[unknownnl,setUnknownnl]= useState(0.0);
    const[widowednl,setWidowednl]= useState(0.0);

    const[marriedmcitodementia,setMarriedmcitodementia]= useState(0.0);
    const[divorcedmcitodementia,setDivorcedmcitodementia]= useState(0.0);
    const[nevermarriedmcitodementia,setNevermarriedmcitodementia]= useState(0.0);
    const[unknownmcitodementia,setUnknownmcitodementia]= useState(0.0);
    const[widowedmcitodementia,setWidowedmcitodementia]= useState(0.0);

    const[marrieddementiatomci,setMarrieddementiatomci]= useState(0.0);
    const[divorceddementiatomci,setDivorceddementiatomci]= useState(0.0);
    const[nevermarrieddementiatomci,setNevermarrieddementiatomci]= useState(0.0);
    const[unknowndementiatomci,setUnknowndementiatomci]= useState(0.0);
    const[widoweddementiatomci,setWidoweddementiatomci]= useState(0.0);

    const[marriedmcitonl,setMarriedmcitonl]= useState(0.0);
    const[divorcedmcitonl,setDivorcedmcitonl]= useState(0.0);
    const[nevermarriedmcitonl,setNevermarriedmcitonl]= useState(0.0);
    const[unknownmcitonl,setUnknownmcitonl]= useState(0.0);
    const[widowedmcitonl,setWidowedmcitonl]= useState(0.0);

    const[marriednltomci,setMarriednltomci]= useState(0.0);
    const[divorcednltomci,setDivorcednltomci]= useState(0.0);
    const[nevermarriednltomci,setNevermarriednltomci]= useState(0.0);
    const[unknownnltomci,setUnknownnltomci]= useState(0.0);
    const[widowednltomci,setWidowednltomci]= useState(0.0);

    const[marriednltodementia,setMarriednltodementia]= useState(0.0);
    const[divorcednltodementia,setDivorcednltodementia]= useState(0.0);
    const[nevermarriednltodementia,setNevermarriednltodementia]= useState(0.0);
    const[unknownnltodementia,setUnknownnltodementia]= useState(0.0);
    const[widowednltodementia,setWidowednltodementia]= useState(0.0);

    const[femalemci,setFemalemci]= useState(0.0);
    const[femalemcitodementia,setFemalemcitodementia]= useState(0.0);
    const[femaledementiatomci,setFemaledementiatomci]= useState(0.0);
    const[femaledementia,setFemaledementia]= useState(0.0);
    const[femalemcitonl,setFemalemcitonl]= useState(0.0);
    const[femalenltomci,setFemalenltomci]= useState(0.0);
    const[femalenltodementia,setFemalenltodementia]= useState(0.0);
    const[femalenl,setFemalenl]= useState(0.0);

    const[malemci,setMalemci]= useState(0.0);
    const[malemcitodementia,setMalemcitodementia]= useState(0.0);
    const[maledementiatomci,setMaledementiatomci]= useState(0.0);
    const[maledementia,setMaledementia]= useState(0.0);
    const[malemcitonl,setMalemcitonl]= useState(0.0);
    const[malenltomci,setMalenltomci]= useState(0.0);
    const[malenltodementia,setMalenltodementia]= useState(0.0);
    const[malenl,setMalenl]= useState(0.0);




    const[inpage,setinpage]= useState(false);
    const docid=props.location.state.id;

    useEffect(() => {

            fetch("http://tdjango.eba-nfssu9sz.us-west-2.elasticbeanstalk.com/api/getStatistics", {

            })
                .then((response2) => response2.json())
                .then((data2) => {

                   setMarriedmci(data2.statistics[0].MCI_Married);
                   setDivorcedmci(data2.statistics[0].MCI_Divorced);
                   setNevermarriedmci(data2.statistics[0].MCI_NeverMarried);
                   setUnknownmci(100.0-(parseFloat(data2.statistics[0].MCI_Married)+parseFloat(data2.statistics[0].MCI_Divorced)+parseFloat(data2.statistics[0].MCI_NeverMarried)+parseFloat(data2.statistics[0].MCI_Widowed)));
                   setWidowedmci(data2.statistics[0].MCI_Widowed);

                    setMarrieddementia(data2.statistics[0].Dementia_Married);
                    setDivorceddementia(data2.statistics[0].Dementia_Divorced);
                    setNevermarrieddementia(data2.statistics[0].Dementia_NeverMarried);
                    setUnknowndementia(100.0-(parseFloat(data2.statistics[0].Dementia_Married)+parseFloat(data2.statistics[0].Dementia_Divorced)+parseFloat(data2.statistics[0].Dementia_NeverMarried)+parseFloat(data2.statistics[0].Dementia_Widowed)));
                    setWidoweddementia(data2.statistics[0].Dementia_Widowed);

                    setMarriednl(data2.statistics[0].NL_Married);
                    setDivorcednl(data2.statistics[0].NL_Divorced);
                    setNevermarriednl(data2.statistics[0].NL_NeverMarried);
                    setUnknownnl(100.0-(parseFloat(data2.statistics[0].NL_Married)+parseFloat(data2.statistics[0].NL_Divorced)+parseFloat(data2.statistics[0].NL_NeverMarried)+parseFloat(data2.statistics[0].NL_Widowed)));
                    setWidowednl(data2.statistics[0].NL_Widowed);

                    setMarriedmcitonl(data2.statistics[0].MCItoNL_Married);
                    setDivorcedmcitonl(data2.statistics[0].MCItoNL_Divorced);
                    setNevermarriedmcitonl(data2.statistics[0].MCItoNL_NeverMarried);
                    setUnknownmcitonl(100.0-(parseFloat(data2.statistics[0].MCItoNL_Married)+parseFloat(data2.statistics[0].MCItoNL_Divorced)+parseFloat(data2.statistics[0].MCItoNL_NeverMarried)+parseFlaot(data2.statistics[0].MCItoNL_Widowed)));
                    setWidowedmcitonl(data2.statistics[0].MCItoNL_Widowed);

                    setMarriednltomci(data2.statistics[0].NLtoMCI_Married);
                    setDivorcednltomci(data2.statistics[0].NLtoMCI_Divorced);
                    setNevermarriednltomci(data2.statistics[0].NLtoMCI_NeverMarried);
                    setUnknownnltomci(100.0-(parseFloat(data2.statistics[0].NLtoMCI_Married)+parseFloat(data2.statistics[0].NLtoMCI_Divorced)+parseFloat(data2.statistics[0].NLtoMCI_NeverMarried)+parseFlaot(data2.statistics[0].NLtoMCI_Widowed)));
                    setWidowednltomci(data2.statistics[0].NLtoMCI_Widowed);

                    setMarriedmcitodementia(data2.statistics[0].MCItoDementia_Married);
                    setDivorcedmcitodementia(data2.statistics[0].MCItoDementia_Divorced);
                    setNevermarriedmcitodementia(data2.statistics[0].MCItoDementia_NeverMarried);
                    setUnknownmcitodementia(100.0-(parseFloat(data2.statistics[0].MCItoDementia_Married)+parseFloat(data2.statistics[0].MCItoDementia_Divorced)+parseFloat(data2.statistics[0].MCItoDementia_NeverMarried)+parseFlaot(data2.statistics[0].MCItoDementia_Widowed)));
                    setWidowedmcitodementia(data2.statistics[0].MCItoDementia_Widowed);

                    setMarrieddementiatomci(data2.statistics[0].DementiatoMCI_Married);
                    setDivorceddementiatomci(data2.statistics[0].DementiatoMCI_Divorced);
                    setNevermarrieddementiatomci(data2.statistics[0].DementiatoMCI_NeverMarried);
                    setUnknowndementiatomci(100.0-(parseFloat(data2.statistics[0].DementiatoMCI_Married)+parseFloat(data2.statistics[0].DementiatoMCI_Divorced)+parseFloat(data2.statistics[0].DementiatoMCI_NeverMarried)+parseFlaot(data2.statistics[0].DementiatoMCI_Widowed)));
                    setWidoweddementiatomci(data2.statistics[0].DementiatoMCI_Widowed);

                    setMarriednltodementia(data2.statistics[0].NLtoDementia_Married);
                    setDivorcednltodementia(data2.statistics[0].NLtoDementia_Divorced);
                    setNevermarriednltodementia(data2.statistics[0].NLtoDementia_NeverMarried);
                    setUnknownnltodementia(100.0-(parseFloat(data2.statistics[0].NLtoDementia_Married)+parseFloat(data2.statistics[0].NLtoDementia_Divorced)+parseFloat(data2.statistics[0].NLtoDementia_NeverMarried)+parseFlaot(data2.statistics[0].NLtoDementia_Widowed)));
                    setWidowednltodementia(data2.statistics[0].NLtoDementia_Widowed);

                    setFemalemci(data2.statistics[0].Female_MCI);
                    setFemaledementia(data2.statistics[0].Female_Dementia);
                    setFemalenl(data2.statistics[0].Female_NL);
                    setFemaledementiatomci(data2.statistics[0].Female_DementiatoMCI);
                    setFemalemcitodementia(data2.statistics[0].Female_MCItoDementia);
                    setFemalemcitonl(data2.statistics[0].Female_MCItoNL);
                    setFemalenltomci(data2.statistics[0].Female_NLtoMCI);
                    setFemalenltodementia(data2.statistics[0].Female_NLtoDementia);

                    setMalemci(data2.statistics[0].Male_MCI);
                    setMaledementia(data2.statistics[0].Male_Dementia);
                    setMalenl(data2.statistics[0].Male_NL);
                    setMaledementiatomci(data2.statistics[0].Male_DementiatoMCI);
                    setMalemcitodementia(data2.statistics[0].Male_MCItoDementia);
                    setMalemcitonl(data2.statistics[0].Male_MCItoNL);
                    setMalenltomci(data2.statistics[0].Male_NLtoMCI);
                    setMalenltodementia(data2.statistics[0].Male_NLtoDementia);
                })

        .then(() => {
            setinpage(true)
        });

    }, []);



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
                            <div >
                                <Paper className={classes.paper5}>
                                    <div style={{marginLeft:'5rem',display:'flex',alignItems:'center'}}>

                                        <Stack spacing={3} alignItems="center">
                                            <div  style={{fontSize:'20px'}}> <b>Condition Count Stats: </b></div>
                                            <Stack direction="column" spacing={1}>
                                                <Stack direction="column" spacing={1}>
                                                    <Chip label={"Married : %"+married} style={{backgroundColor: '#6050DC'}}/>
                                                    <Chip label={"Divorced : %"+divorced} style={{backgroundColor: '#D52DB7'}} />
                                                    <Chip label={"Widowed : %"+widowed} style={{backgroundColor: '#FF2E7E'}}/>
                                                </Stack>
                                                <Stack direction="column" spacing={1}>
                                                    <Chip label={"NeverMarried : %"+nevermarried} style={{backgroundColor: '#FF6B45'}}/>
                                                    <Chip label={"Unknown : %"+unknown} style={{backgroundColor: '#FFAB05'}}/>
                                                </Stack>
                                                <Stack direction="column" spacing={1}>
                                                    <div style={{marginLeft:'2.5rem',maxHeight:'300px',maxWidth:'300px'}}>
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
                            </div>
                        </Grid>
                        <Grid item xs={7}>

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