import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

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

export const ScrollList  = ({listof}) => {

    const classes = useStyles();
    let category='';

    function handleOnClick(rid,ptid,viscode) {
        console.log(rid,ptid,viscode)


        const url = "http://tdjango.eba-ixskapzh.us-west-2.elasticbeanstalk.com/api/getCategory";
        const data = {
            "RID": rid,
            "PTID": ptid,
            "VISCODE":viscode,
        }

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(res => res.json())
            .then(json => {
                console.log(json)
                const success = json.status.success
                if (success) {
                    category=json.category;
                    alert('Category is '+category);

                } else {
                    alert('Something went wrong');
                }
            })
            .catch(err => {
                alert('Some error has occurred')
                console.log(err)
            });

    }

    return (

        <List  dense className={classes.list}>
            {listof.map((value) => {
                const labelId = `checkbox-list-secondary-label-${value}`;
                return (

                    <ListItem  key={value} button>
                        <div>
                        <Stack direction="row" spacing={20}>
                        <ListItemText  classes={{primary:classes.listItemText}} id={labelId} primary={`${value.EXAMDATE+" "+value.DX}`}/>
                        <Button variant="contained" onClick={() => handleOnClick(value.RID,value.PTID,value.VISCODE)}>SCORE CATEGORY VALUE</Button>
                        </Stack>
                        </div>

                    </ListItem>


                );

            })}
        </List>

    );


}
export default ScrollList;
