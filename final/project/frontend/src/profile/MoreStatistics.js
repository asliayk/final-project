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
import Stack from '@mui/material/Stack';
import TextField from "@material-ui/core/TextField";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import CircularProgress from "@material-ui/core/CircularProgress";

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
        alignItems:'center',
        height:"55rem"

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

    const[marriedselected,setMarriedselected]= useState(0.0);
    const[divorcedselected,setDivorcedselected]= useState(0.0);
    const[nevermarriedselected,setNevermarriedselected]= useState(0.0);
    const[unknownselected,setUnknownselected]= useState(0.0);
    const[widowedselected,setWidowedselected]= useState(0.0);

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

    const[gendermci,setGendermci]= useState(0.0);
    const[gendermcitodementia,setGendermcitodementia]= useState(0.0);
    const[genderdementiatomci,setGenderdementiatomci]= useState(0.0);
    const[genderdementia,setGenderdementia]= useState(0.0);
    const[gendermcitonl,setGendermcitonl]= useState(0.0);
    const[gendernltomci,setGendernltomci]= useState(0.0);
    const[gendernltodementia,setGendernltodementia]= useState(0.0);
    const[gendernl,setGendernl]= useState(0.0);

    const[countmci,setCountmci]= useState(0.0);
    const[countmcitodementia,setCountmcitodementia]= useState(0.0);
    const[countdementiatomci,setCountdementiatomci]= useState(0.0);
    const[countdementia,setCountdementia]= useState(0.0);
    const[countmcitonl,setCountmcitonl]= useState(0.0);
    const[countnltomci,setCountnltomci]= useState(0.0);
    const[countnltodementia,setCountnltodementia]= useState(0.0);
    const[countnl,setCountnl]= useState(0.0);




    const[inpage,setinpage]= useState(false);
    const docid=props.location.state.id;

    const [Graph, setGraph] = useState();
    const [GraphFetched, setGraphFetched] = useState(false);

    useEffect(() => {

            fetch("http://tdjango.eba-nfssu9sz.us-west-2.elasticbeanstalk.com/api/getStatistics", {

            })
                .then((response2) => response2.json())
                .then((data2) => {

                   setMarriedmci(data2.statistics[0].MCI_Married);
                   setDivorcedmci(data2.statistics[0].MCI_Divorced);
                   setNevermarriedmci(data2.statistics[0].MCI_NeverMarried);
                   setUnknownmci((100.0-(parseFloat(data2.statistics[0].MCI_Married)+parseFloat(data2.statistics[0].MCI_Divorced)+parseFloat(data2.statistics[0].MCI_NeverMarried)+parseFloat(data2.statistics[0].MCI_Widowed))).toFixed(2));
                   setWidowedmci(data2.statistics[0].MCI_Widowed);

                    setMarrieddementia(data2.statistics[0].Dementia_Married);
                    setDivorceddementia(data2.statistics[0].Dementia_Divorced);
                    setNevermarrieddementia(data2.statistics[0].Dementia_NeverMarried);
                    setUnknowndementia((100.0-(parseFloat(data2.statistics[0].Dementia_Married)+parseFloat(data2.statistics[0].Dementia_Divorced)+parseFloat(data2.statistics[0].Dementia_NeverMarried)+parseFloat(data2.statistics[0].Dementia_Widowed))).toFixed(2));
                    setWidoweddementia(data2.statistics[0].Dementia_Widowed);

                    setMarriednl(data2.statistics[0].NL_Married);
                    setDivorcednl(data2.statistics[0].NL_Divorced);
                    setNevermarriednl(data2.statistics[0].NL_NeverMarried);
                    setUnknownnl((100.0-(parseFloat(data2.statistics[0].NL_Married)+parseFloat(data2.statistics[0].NL_Divorced)+parseFloat(data2.statistics[0].NL_NeverMarried)+parseFloat(data2.statistics[0].NL_Widowed))).toFixed(2));
                    setWidowednl(data2.statistics[0].NL_Widowed);

                    setMarriedmcitonl(data2.statistics[0].MCItoNL_Married);
                    setDivorcedmcitonl(data2.statistics[0].MCItoNL_Divorced);
                    setNevermarriedmcitonl(data2.statistics[0].MCItoNL_NeverMarried);
                    setUnknownmcitonl((100.0-(parseFloat(data2.statistics[0].MCItoNL_Married)+parseFloat(data2.statistics[0].MCItoNL_Divorced)+parseFloat(data2.statistics[0].MCItoNL_NeverMarried)+parseFloat(data2.statistics[0].MCItoNL_Widowed))).toFixed(2));
                    setWidowedmcitonl(data2.statistics[0].MCItoNL_Widowed);

                    setMarriednltomci(data2.statistics[0].NLtoMCI_Married);
                    setDivorcednltomci(data2.statistics[0].NLtoMCI_Divorced);
                    setNevermarriednltomci(data2.statistics[0].NLtoMCI_NeverMarried);
                    setUnknownnltomci((100.0-(parseFloat(data2.statistics[0].NLtoMCI_Married)+parseFloat(data2.statistics[0].NLtoMCI_Divorced)+parseFloat(data2.statistics[0].NLtoMCI_NeverMarried)+parseFloat(data2.statistics[0].NLtoMCI_Widowed))).toFixed(2));
                    setWidowednltomci(data2.statistics[0].NLtoMCI_Widowed);

                    setMarriedmcitodementia(data2.statistics[0].MCItoDementia_Married);
                    setDivorcedmcitodementia(data2.statistics[0].MCItoDementia_Divorced);
                    setNevermarriedmcitodementia(data2.statistics[0].MCItoDementia_NeverMarried);
                    setUnknownmcitodementia((100.0-(parseFloat(data2.statistics[0].MCItoDementia_Married)+parseFloat(data2.statistics[0].MCItoDementia_Divorced)+parseFloat(data2.statistics[0].MCItoDementia_NeverMarried)+parseFloat(data2.statistics[0].MCItoDementia_Widowed))).toFixed(2));
                    setWidowedmcitodementia(data2.statistics[0].MCItoDementia_Widowed);

                    setMarrieddementiatomci(data2.statistics[0].DementiatoMCI_Married);
                    setDivorceddementiatomci(data2.statistics[0].DementiatoMCI_Divorced);
                    setNevermarrieddementiatomci(data2.statistics[0].DementiatoMCI_NeverMarried);
                    setUnknowndementiatomci((100.0-(parseFloat(data2.statistics[0].DementiatoMCI_Married)+parseFloat(data2.statistics[0].DementiatoMCI_Divorced)+parseFloat(data2.statistics[0].DementiatoMCI_NeverMarried)+parseFloat(data2.statistics[0].DementiatoMCI_Widowed))).toFixed(2));
                    setWidoweddementiatomci(data2.statistics[0].DementiatoMCI_Widowed);

                    setMarriednltodementia(data2.statistics[0].NLtoDementia_Married);
                    setDivorcednltodementia(data2.statistics[0].NLtoDementia_Divorced);
                    setNevermarriednltodementia(data2.statistics[0].NLtoDementia_NeverMarried);
                    setUnknownnltodementia((100.0-(parseFloat(data2.statistics[0].NLtoDementia_Married)+parseFloat(data2.statistics[0].NLtoDementia_Divorced)+parseFloat(data2.statistics[0].NLtoDementia_NeverMarried)+parseFloat(data2.statistics[0].NLtoDementia_Widowed))).toFixed(2));
                    setWidowednltodementia(data2.statistics[0].NLtoDementia_Widowed);

                    setMarriedselected(data2.statistics[0].NL_Married);
                    setDivorcedselected(data2.statistics[0].NL_Divorced);
                    setNevermarriedselected(data2.statistics[0].NL_NeverMarried);
                    setUnknownselected((100.0-(parseFloat(data2.statistics[0].NL_Married)+parseFloat(data2.statistics[0].NL_Divorced)+parseFloat(data2.statistics[0].NL_NeverMarried)+parseFloat(data2.statistics[0].NL_Widowed))).toFixed(2));
                    setWidowedselected(data2.statistics[0].NL_Widowed);

                    setFemalemci(data2.statistics[0].Female_MCI);
                    setFemaledementia(data2.statistics[0].Female_Dementia);
                    setFemalenl(data2.statistics[0].Female_NL);
                    setFemaledementiatomci(data2.statistics[0].Female_DementiatoMCI);
                    setFemalemcitodementia(data2.statistics[0].Female_MCItoDementia);
                    setFemalemcitonl(data2.statistics[0].Female_MCItoNL);
                    setFemalenltomci(data2.statistics[0].Female_NLtoMCI);
                    setFemalenltodementia(data2.statistics[0].Female_NLtoDementia);

                    setGenderdementia(data2.statistics[0].Female_Dementia);
                    setGendernl(data2.statistics[0].Female_NL);
                    setGendermci(data2.statistics[0].Female_MCI);
                    setGenderdementiatomci(data2.statistics[0].Female_DementiatoMCI);
                    setGendermcitodementia(data2.statistics[0].Female_MCItoDementia);
                    setGendermcitonl(data2.statistics[0].Female_MCItoNL);
                    setGendernltomci(data2.statistics[0].Female_NLtoMCI);
                    setGendernltodementia(data2.statistics[0].Female_NLtoDementia);

                    setMalemci(data2.statistics[0].Male_MCI);
                    setMaledementia(data2.statistics[0].Male_Dementia);
                    setMalenl(data2.statistics[0].Male_NL);
                    setMaledementiatomci(data2.statistics[0].Male_DementiatoMCI);
                    setMalemcitodementia(data2.statistics[0].Male_MCItoDementia);
                    setMalemcitonl(data2.statistics[0].Male_MCItoNL);
                    setMalenltomci(data2.statistics[0].Male_NLtoMCI);
                    setMalenltodementia(data2.statistics[0].Male_NLtoDementia);

                    setCountmci(data2.statistics[0].MCI_count);
                    setCountdementia(data2.statistics[0].Dementia_count);
                    setCountnl(data2.statistics[0].NL_count);
                    setCountdementiatomci(data2.statistics[0].Dementia_to_MCI_count);
                    setCountmcitodementia(data2.statistics[0].MCI_to_Dementia_count);
                    setCountmcitonl(data2.statistics[0].MCI_to_NL_count);
                    setCountnltomci(data2.statistics[0].NL_to_MCI_count);
                    setCountnltodementia(data2.statistics[0].NL_to_Dementia_count);

                })

        .then(() => {
            setinpage(true)
        });

        const url = "http://tdjango.eba-nfssu9sz.us-west-2.elasticbeanstalk.com/api/getAgeGraphs";
        fetch( url
            , {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            }).then(res => res.json())
            .then(json => {
                let edited = "";
                edited="data:image/png;base64,"+json.graph.ImageBytes.split("b'")[1].slice(0,-1);
                console.log(edited)
                setGraph(edited)
            }).then(() => {
            setGraphFetched(true)
        })

    }, []);
    const [valuegender, setValuegender] = React.useState('female');
    const [valuemarriage, setValuemarriage] = React.useState('NL');

    const handleChange = (event) => {
        setValuegender(event.target.value);
        if(event.target.value=='female'){
            setGendermci(femalemci)
            setGenderdementia(femaledementia);
            setGendernl(femalenl);
            setGenderdementiatomci(femaledementiatomci);
            setGendermcitodementia(femalemcitodementia);
            setGendermcitonl(femalemcitonl);
            setGendernltomci(femalenltomci);
            setGendernltodementia(femalenltodementia);
        }else if(event.target.value=='male'){
            setGendermci(malemci)
            setGenderdementia(maledementia);
            setGendernl(malenl);
            setGenderdementiatomci(maledementiatomci);
            setGendermcitodementia(malemcitodementia);
            setGendermcitonl(malemcitonl);
            setGendernltomci(malenltomci);
            setGendernltodementia(malenltodementia);

        }
    };
    const handleChange2 = (event) => {
        setValuemarriage(event.target.value);
        if(event.target.value=='NL'){
            setMarriedselected(marriednl);
            setDivorcedselected(divorcednl);
            setNevermarriedselected(nevermarriednl);
            setUnknownselected(unknownnl);
            setWidowedselected(widowednl);
        }else if(event.target.value=='MCI'){
            setMarriedselected(marriedmci);
            setDivorcedselected(divorcedmci);
            setNevermarriedselected(nevermarriedmci);
            setUnknownselected(unknownmci);
            setWidowedselected(widowedmci);
        }else if(event.target.value=='Dementia'){
            setMarriedselected(marrieddementia);
            setDivorcedselected(divorceddementia);
            setNevermarriedselected(nevermarrieddementia);
            setUnknownselected(unknowndementia);
            setWidowedselected(widoweddementia);
        }else if(event.target.value=='MCI to Dementia'){
            setMarriedselected(marriedmcitodementia);
            setDivorcedselected(divorcedmcitodementia);
            setNevermarriedselected(nevermarriedmcitodementia);
            setUnknownselected(unknownmcitodementia);
            setWidowedselected(widowedmcitodementia);
        }else if(event.target.value=='Dementia to MCI'){
            setMarriedselected(marrieddementiatomci);
            setDivorcedselected(divorceddementiatomci);
            setNevermarriedselected(nevermarrieddementiatomci);
            setUnknownselected(unknowndementiatomci);
            setWidowedselected(widoweddementiatomci);
        }else if(event.target.value=='MCI to NL'){
            setMarriedselected(marriedmcitonl);
            setDivorcedselected(divorcedmcitonl);
            setNevermarriedselected(nevermarriedmcitonl);
            setUnknownselected(unknownmcitonl);
            setWidowedselected(widowedmcitonl);
        }else if(event.target.value=='NL to MCI'){
            setMarriedselected(marriednltomci);
            setDivorcedselected(divorcednltomci);
            setNevermarriedselected(nevermarriednltomci);
            setUnknownselected(unknownnltomci);
            setWidowedselected(widowednltomci);
        }else if(event.target.value=='NL to Dementia'){
            setMarriedselected(marriednltodementia);
            setDivorcedselected(divorcednltodementia);
            setNevermarriedselected(nevermarriednltodementia);
            setUnknownselected(unknownnltodementia);
            setWidowedselected(widowednltodementia);
        }
    };



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
                            <Link style={{color: "#0B3954"}}to={{
                                pathname: '/morestatictics',
                                state: { id: docid }
                            }}>
                                More Statistics
                            </Link>
                        </Breadcrumbs>
                    </div>
                    <Grid container >
                        <Grid item xs={5}>
                            <div >
                                <Paper className={classes.paper5}>
                                    <div style={{marginLeft:'6rem',display:'flex',alignItems:'center'}}>

                                        <Stack spacing={3} alignItems="center">
                                            <div  style={{fontSize:'20px'}}> <b>Conditional Count Stats </b></div>
                                            <Stack direction="row" spacing={1}>
                                                <Stack direction="column" spacing={1}>
                                                    <Chip label={"NL : "+countnl} style={{backgroundColor: '#fbb4ae'}}/>
                                                    <Chip label={"MCI : "+countmci} style={{backgroundColor: '#b3cde3'}} />
                                                    <Chip label={"Dementia : "+countdementia} style={{backgroundColor: '#ccebc5'}}/>
                                                    <Chip label={"MCI to Dementia : "+countmcitodementia} style={{backgroundColor: '#decbe4'}}/>
                                                </Stack>
                                                <Stack direction="column" spacing={1}>
                                                    <Chip label={"Dementia to MCI : "+countdementiatomci} style={{backgroundColor: '#fed9a6'}}/>
                                                    <Chip label={"NL to MCI : "+countnltomci} style={{backgroundColor: '#ffffcc'}}/>
                                                    <Chip label={"MCI to NL: "+countmcitonl} style={{backgroundColor: '#e5d8bd'}}/>
                                                    <Chip label={"NL to Dementia: "+countnltodementia} style={{backgroundColor: '#fddaec'}}/>
                                                </Stack>
                                           </Stack></Stack>
                                    </div>
                                    <div>

                                        <Stack spacing={3} alignItems="center">
                                            <div  style={{fontSize:'20px',marginTop:"3rem"}}> <b>Condtional Age Graphs </b></div>
                                            {(GraphFetched) ? (
                                                <img style={{
                                                    marginTop:'1rem',
                                                    width:'35rem',
                                                    height:'30rem'
                                                }} src={Graph} alt="Red dot"/>
                                            ) : ( <CircularProgress style={{
                                                    marginTop:'1rem'
                                                }} />
                                            )}
                                        </Stack></div>

                                </Paper>
                            </div>
                        </Grid>
                        <Grid item xs={7}>
                            <FormControl style={{marginLeft:'2rem'}}>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={valuemarriage}
                                    onChange={handleChange2}
                                    sx={{
                                        '& .MuiSvgIcon-root': {
                                            fontSize: 15,
                                        },
                                    }}
                                >
                                    <FormControlLabel value="NL" control={<Radio />}  label={<span style={{ fontSize: '0.85rem' }}>NL</span>} />
                                    <FormControlLabel value="MCI" control={<Radio />} label={<span style={{ fontSize: '0.85rem' }}>MCI</span>} />
                                    <FormControlLabel value="Dementia" control={<Radio />} label={<span style={{ fontSize: '0.85rem' }}>Dementia</span>} />
                                    <FormControlLabel value="MCI to Dementia" control={<Radio />} label={<span style={{ fontSize: '0.85rem' }}>MCI to Dementia</span>} />
                                    <FormControlLabel value="Dementia to MCI" control={<Radio />} label={<span style={{ fontSize: '0.85rem' }}>Dementia to MCI</span>} />
                                    <FormControlLabel value="MCI to NL" control={<Radio />} label={<span style={{ fontSize: '0.85rem' }}>MCI to NL</span>} />
                                    <FormControlLabel value="NL to MCI" control={<Radio />} label={<span style={{ fontSize: '0.85rem' }}>NL to MCI</span>} />
                                    <FormControlLabel value="NL to Dementia" control={<Radio />} label={<span style={{ fontSize: '0.85rem' }}>NL to Dementia</span>} />

                                </RadioGroup>
                            </FormControl>
                            <Paper className={classes.paper2}>
                                <div style={{marginLeft:'4rem',display:'flex',alignItems:'center'}}>

                                    <Stack spacing={1} alignItems="center">
                                        <div  style={{fontSize:'20px',marginBottom:"1rem"}}> <b>Conditional Marital Statistics ( {valuemarriage} ) </b></div>
                                        <Stack direction="row" spacing={1}>
                                            <Stack direction="column" spacing={1}>
                                                <Chip label={"Married : %"+marriedselected} style={{backgroundColor: '#AC92EB'}}/>
                                                <Chip label={"Divorced : %"+divorcedselected} style={{backgroundColor: '#4FC1E8'}} />
                                                <Chip label={"Widowed : %"+widowedselected} style={{backgroundColor: '#A0D568'}}/>
                                            </Stack>
                                            <Stack direction="column" spacing={1}>
                                                <Chip label={"NeverMarried : %"+nevermarriedselected} style={{backgroundColor: '#ED5564'}}/>
                                                <Chip label={"Unknown : %"+unknownselected} style={{backgroundColor: '#FFCE54'}}/>
                                            </Stack>
                                            <Stack direction="row" spacing={1}>
                                                <div style={{marginLeft:'2.5rem',maxHeight:'200px',maxWidth:'200px'}}>
                                                    <PieChart
                                                        data={[
                                                            { title: 'Married', value: parseFloat(`${marriedselected}`), color: '#AC92EB' },
                                                            { title: 'Divorced', value: parseFloat(`${divorcedselected}`), color: '#4FC1E8' },
                                                            { title: 'Widowed', value: parseFloat(`${widowedselected}`), color: '#A0D568' },
                                                            { title: 'NeverMarried', value:parseFloat(`${nevermarriedselected}`), color: '#ED5564' },
                                                            { title: 'Unknown', value: parseFloat(`${unknownselected}`), color: '#FFCE54' },

                                                        ]}
                                                    /></div></Stack></Stack></Stack>
                                </div></Paper>
                            <FormControl style={{marginLeft:'2rem'}}>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    value={valuegender}
                                    onChange={handleChange}
                                    sx={{
                                        '& .MuiSvgIcon-root': {
                                            fontSize: 15,
                                        },
                                    }}
                                >
                                    <FormControlLabel value="female" control={<Radio />} label={<span style={{ fontSize: '0.85rem' }}>Female</span>} />
                                    <FormControlLabel value="male" control={<Radio />} label={<span style={{ fontSize: '0.85rem' }}>Male</span>} />
                                </RadioGroup>
                            </FormControl>
                            <Paper className={classes.paper2}>
                                <div style={{marginLeft:'3rem',display:'flex',alignItems:'center'}}>

                                    <Stack spacing={1} alignItems="center">
                                        <div  style={{fontSize:'20px',marginBottom:"1rem"}}> <b>Conditional Gender Statistics ( {valuegender} )  </b></div>
                                        {valuegender=='female'?<Stack direction="row" spacing={1}>
                                            <Stack direction="column" spacing={1}>
                                                <Chip label={"NL : %"+gendernl} style={{backgroundColor: '#CD5E77'}}/>
                                                <Chip label={"MCI : %"+gendermci} style={{backgroundColor: '#EE959E'}} />
                                                <Chip label={"Dementia : %"+genderdementia} style={{backgroundColor: '#F4C2C2'}}/>
                                                <Chip label={"MCI to Dementia : %"+gendermcitodementia} style={{backgroundColor: '#B83384'}}/>
                                            </Stack>
                                            <Stack direction="column" spacing={1}>
                                                <Chip label={"Dementia to MCI : %"+genderdementiatomci} style={{backgroundColor: '#F44B8C'}}/>
                                                <Chip label={"NL to MCI : %"+gendernltomci} style={{backgroundColor: '#C92063'}}/>
                                                <Chip label={"MCI to NL: %"+gendermcitonl} style={{backgroundColor: '#FA7878'}}/>
                                                <Chip label={"NL to Dementia: %"+gendernltodementia} style={{backgroundColor: '#FFC2E9'}}/>
                                            </Stack>
                                            <Stack direction="row" spacing={1}>
                                                <div style={{marginLeft:'1rem',maxHeight:'200px',maxWidth:'200px'}}>
                                                    <PieChart
                                                        data={[
                                                            { title: 'NL', value: parseFloat(`${gendernl}`), color: '#CD5E77' },
                                                            { title: 'MCI', value: parseFloat(`${gendermci}`), color: '#EE959E' },
                                                            { title: 'Dementia', value: parseFloat(`${genderdementia}`), color: '#F4C2C2' },
                                                            { title: 'MCI to Dementia', value:parseFloat(`${gendermcitodementia}`), color: '#B83384' },
                                                            { title: 'Dementia to MCI', value: parseFloat(`${genderdementiatomci}`), color: '#F44B8C' },
                                                            { title: 'NL to MCI', value: parseFloat(`${gendernltomci}`), color: '#C92063' },
                                                            { title: 'MCI to NL', value: parseFloat(`${gendermcitonl}`), color: '#FA7878' },
                                                            { title: 'NL to Dementia', value: parseFloat(`${gendernltodementia}`), color: '#FFC2E9' },
                                                        ]}
                                                    /></div></Stack></Stack>:       <Stack direction="row" spacing={1}>
                                            <Stack direction="column" spacing={1}>
                                                <Chip label={"NL : %"+gendernl} style={{backgroundColor: '#89CFF0'}}/>
                                                <Chip label={"MCI : %"+gendermci} style={{backgroundColor: '#7DF9FF'}} />
                                                <Chip label={"Dementia : %"+genderdementia} style={{backgroundColor: '#7393B3'}}/>
                                                <Chip label={"MCI to Dementia : %"+gendermcitodementia} style={{backgroundColor: '#0096FF'}}/>
                                            </Stack>
                                            <Stack direction="column" spacing={1}>
                                                <Chip label={"Dementia to MCI : %"+genderdementiatomci} style={{backgroundColor: '#088F8F'}}/>
                                                <Chip label={"NL to MCI : %"+gendernltomci} style={{backgroundColor: '#6495ED'}}/>
                                                <Chip label={"MCI to NL: %"+gendermcitonl} style={{backgroundColor: '#40E0D0'}}/>
                                                <Chip label={"NL to Dementia: %"+gendernltodementia} style={{backgroundColor: '#B6D0E2'}}/>
                                            </Stack>
                                            <Stack direction="row" spacing={1}>
                                                <div style={{marginLeft:'1rem',maxHeight:'200px',maxWidth:'200px'}}>
                                                    <PieChart
                                                        data={[
                                                            { title: 'NL', value: parseFloat(`${gendernl}`), color: '#89CFF0' },
                                                            { title: 'MCI', value: parseFloat(`${gendermci}`), color: '#7DF9FF' },
                                                            { title: 'Dementia', value: parseFloat(`${genderdementia}`), color: '#7393B3' },
                                                            { title: 'MCI to Dementia', value:parseFloat(`${gendermcitodementia}`), color: '#0096FF' },
                                                            { title: 'Dementia to MCI', value: parseFloat(`${genderdementiatomci}`), color: '#088F8F' },
                                                            { title: 'NL to MCI', value: parseFloat(`${gendernltomci}`), color: '#6495ED' },
                                                            { title: 'MCI to NL', value: parseFloat(`${gendermcitonl}`), color: '#40E0D0' },
                                                            { title: 'NL to Dementia', value: parseFloat(`${gendernltodementia}`), color: '#B6D0E2' },
                                                        ]}
                                                    /></div></Stack></Stack>}
                                 </Stack>
                                </div></Paper>

                        </Grid> </Grid>
                </div>):null}
        </div>
    );
}