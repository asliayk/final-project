import {
    Box,
    Button,
    Divider,
    Grid,
    makeStyles,
    Paper,
    Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { Rating } from "@material-ui/lab";
import {Link} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
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
        marginLeft: theme.spacing(10),
        marginRight: theme.spacing(10),
        flexDirection: "column",
        display: "flex",
        minHeight: 16,
    },
    box: {
        display: "flex",
        justifyContent: "center",
    },
}));

export default function Doctor_patients_list_item(props) {
    const classes = useStyles();

    return (
        <Paper className={classes.paper}>
            <Grid container spacing={4}>
             
                <Grid
                    item
                    style={{ flexDirection: "column", position: "relative" }}
                    container
                    xs={6}
                >
                    <Link 
            to={{pathname: "/patient", state: {id: props.patient.PatientId}}} 

            
        >
                    <Typography gutterBottom variant="h4">
                        {props.patient.Name + " " + props.patient.Surname + ": " + props.patient.LastDiagnosis}
                    </Typography>
                    </Link>
                    <Divider variant="middle" />


                    <Box
                        style={{
                            position: "absolute",
                            top:180,
                            bottom: 10,
                            left:30,
                            right: 550,

                            display: "flex",
                        }}
                    >

                       
                        <Typography
                            gutterBottom
                            variant="h5"
                            style={{
                                marginBottom: 40,
                                marginRight:5,
                                marginLeft:5,
                                textDecorationLine: "line-through",
                                color: "#A93226",
                            }}
                        >

                        </Typography>

                    </Box>
                </Grid>
                <Grid
                    item
                    container
                    direction="column"
                    alignItems="center"
                    justify="center"
                    xs={3}
                >
                 
                   

                    

                </Grid>
            </Grid>
        </Paper>
    );
}