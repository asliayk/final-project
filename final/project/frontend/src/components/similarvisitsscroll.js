import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const useStyles = makeStyles((theme) => ({
    list: {
        overflowY: "scroll",
        overflow: 'hidden',
        height:250,
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
    }



}));

export const SimilarvisitScrollList  = ({listof}) => {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState([]);

    const handleClickOpen = (value) => {
        setOpen(true);
        setValue(value)
    };

    const handleClose = () => {
        setOpen(false);
    };
    const classes = useStyles();
    let category='';


    return (

        <List  dense className={classes.list}>
            {listof.map((value) => {
                const labelId = `checkbox-list-secondary-label-${value}`;
                return (

                    <ListItem onClick={()=>handleClickOpen(value)}  key={value} button>
                        <div>
                            <Stack direction="row" spacing={20}>
                                <ListItemText  classes={{primary:classes.listItemText}} id={labelId} primary={`${"RID: "+value.RID+" PTID: "+value.PTID+" VISCODE: "+value.VISCODE+" DATE: "+value.EXAMDATE+" DX: "+value.DX+" Category: "+value.category+" Confidence_Level (Soft_max): "+value.softmax }`}/>
                            </Stack>
                        </div>

                    </ListItem>


                );

            })}
            <Dialog
                open={open}
                onClose={handleClose}
                value={value}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Detailed Visitation Information"}
                </DialogTitle>
                <DialogContent>
                    <pre>RID: {value.RID}</pre>
                    <pre>VISCODE: {value.VISCODE}</pre>
                    <pre>ADAS11: {value.ADAS11}</pre>
                    <pre>ADAS13: {value.ADAS13}</pre>
                    <pre>APOE4: {value.APOE4}</pre>
                    <pre>CDRSB: {value.CDRSB}</pre>
                    <pre>COLPROT: {value.COLPROT}</pre>
                    <pre>D1: {value.D1}</pre>
                    <pre>D2: {value.D2}</pre>
                    <pre>DXCHANGE: {value.DXCHANGE}</pre>
                    <pre>Entorhinal: {value.Entorhinal}</pre>
                    <pre>FDG: {value.FDG}</pre>
                    <pre>Fusiform: {value.Fusiform}</pre>
                    <pre>Hippocampus: {value.Hippocampus}</pre>
                    <pre>ICV: {value.ICV}</pre>
                    <pre>M: {value.M}</pre>
                    <pre>MMSE: {value.MMSE}</pre>
                    <pre>ORIGPROT: {value.ORIGPROT}</pre>
                    <pre>Ventricles: {value.Ventricles}</pre>
                    <pre>WholeBrain: {value.WholeBrain}</pre>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>OK</Button>
                </DialogActions>
            </Dialog>
        </List>


    );


}
export default SimilarvisitScrollList;
