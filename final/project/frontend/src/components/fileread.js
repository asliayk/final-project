import React, { Component } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack'
import makeStyles from "@material-ui/core/styles/makeStyles";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";


export const FileRead  = ({id}) =>{

    let result= '';
    /*function readRecord(event) {
        return new Promise(function(resolve, reject) {
            var reader = new FileReader();
            reader.onload = function(event) {
                reader.readAsText(document.getElementById('csvFileUploadID').files[0]);
                record = reader.result.split(/\r\n|\r|\n/)[1];
                record = record.split(',')[1];
                resolve(record);
            };
        });
    };*/
   const showFile = async (e) => {
       e.preventDefault()

        const reader = new FileReader()
            reader.onload = async (e) => {

                result=e.target.result;
                console.log(result)


            };
           reader.readAsText(e.target.files[0])
        };



/*const handleOnClick2=()=>{
    console.log(result.split(',')[0].split(' ')[result.split(',')[0].split(' ').length-1])
    console.log(result.split(',')[1].split(' ')[result.split(',')[1].split(' ').length-1])
    console.log(result.split(',')[2].split(' ')[result.split(',')[2].split(' ').length-1])
    console.log(result.split(',')[3].split(' ')[result.split(',')[3].split(' ').length-1])
};*/

    const handleOnClick = () => {
        console.log('inside')

        const url = "http://tdjango.eba-ixskapzh.us-west-2.elasticbeanstalk.com/api/addVisit";
        const data = {
            RID: result.split(',')[0].split(' ')[result.split(',')[0].split(' ').length-1],
            PTID: result.split(',')[1].split(' ')[result.split(',')[1].split(' ').length-1],
            VISCODE: result.split(',')[2].split(' ')[result.split(',')[2].split(' ').length-1],
            SITE: result.split(',')[3].split(' ')[result.split(',')[3].split(' ').length-1],
            D1: result.split(',')[4].split(' ')[result.split(',')[4].split(' ').length-1],
            D2: result.split(',')[5].split(' ')[result.split(',')[5].split(' ').length-1],
            COLPROT: result.split(',')[6].split(' ')[result.split(',')[6].split(' ').length-1],
            ORIGPROT: result.split(',')[7].split(' ')[result.split(',')[7].split(' ').length-1],
            EXAMDATE: result.split(',')[8].split(' ')[result.split(',')[8].split(' ').length-1],
            DX_bl:result.split(',')[9].split(' ')[result.split(',')[9].split(' ').length-1],
            DXCHANGE: result.split(',')[10].split(' ')[result.split(',')[10].split(' ').length-1],
            AGE: result.split(',')[11].split(' ')[result.split(',')[11].split(' ').length-1],
            PTGENDER:result.split(',')[12].split(' ')[result.split(',')[12].split(' ').length-1],
            PTEDUCAT: result.split(',')[13].split(' ')[result.split(',')[13].split(' ').length-1],
            PTETHCAT:result.split(',')[14].split(' ')[result.split(',')[14].split(' ').length-1],
            PTRACCAT: result.split(',')[15].split(' ')[result.split(',')[15].split(' ').length-1],
            PTMARRY: result.split(',')[16].split(' ')[result.split(',')[16].split(' ').length-1],
            APOE4: result.split(',')[17].split(' ')[result.split(',')[17].split(' ').length-1],
            FDG: result.split(',')[18].split(' ')[result.split(',')[18].split(' ').length-1],
            CDRSB: result.split(',')[19].split(' ')[result.split(',')[19].split(' ').length-1],
            ADAS11: result.split(',')[20].split(' ')[result.split(',')[20].split(' ').length-1],
            ADAS13: result.split(',')[21].split(' ')[result.split(',')[21].split(' ').length-1],
            MMSE: result.split(',')[22].split(' ')[result.split(',')[22].split(' ').length-1],
            RAVLT_immediate: result.split(',')[23].split(' ')[result.split(',')[23].split(' ').length-1],
            RAVLT_learning:result.split(',')[24].split(' ')[result.split(',')[24].split(' ').length-1],
            RAVLT_forgetting:result.split(',')[25].split(' ')[result.split(',')[25].split(' ').length-1],
            RAVLT_perc_forgetting: result.split(',')[26].split(' ')[result.split(',')[26].split(' ').length-1],
            FAQ: result.split(',')[27].split(' ')[result.split(',')[27].split(' ').length-1],
            Ventricles: result.split(',')[28].split(' ')[result.split(',')[28].split(' ').length-1],
            Hippocampus: result.split(',')[29].split(' ')[result.split(',')[29].split(' ').length-1],
            WholeBrain:result.split(',')[30].split(' ')[result.split(',')[30].split(' ').length-1],
            Entorhinal:result.split(',')[31].split(' ')[result.split(',')[31].split(' ').length-1],
            Fusiform: result.split(',')[32].split(' ')[result.split(',')[32].split(' ').length-1],
            MidTemp:result.split(',')[33].split(' ')[result.split(',')[33].split(' ').length-1],
            ICV: result.split(',')[34].split(' ')[result.split(',')[34].split(' ').length-1],
            DX: result.split(',')[35].split(' ')[result.split(',')[35].split(' ').length-1],
            EXAMDATE_bl: result.split(',')[36].split(' ')[result.split(',')[36].split(' ').length-1],
            CDRSB_bl: result.split(',')[37].split(' ')[result.split(',')[37].split(' ').length-1],
            ADAS11_bl: result.split(',')[38].split(' ')[result.split(',')[38].split(' ').length-1],
            ADAS13_bl:result.split(',')[39].split(' ')[result.split(',')[39].split(' ').length-1],
            MMSE_bl: result.split(',')[40].split(' ')[result.split(',')[40].split(' ').length-1],
            RAVLT_immediate_bl: result.split(',')[41].split(' ')[result.split(',')[41].split(' ').length-1],
            RAVLT_learning_bl:result.split(',')[42].split(' ')[result.split(',')[42].split(' ').length-1],
            RAVLT_forgetting_bl: result.split(',')[43].split(' ')[result.split(',')[43].split(' ').length-1],
            RAVLT_perc_forgetting_bl: result.split(',')[44].split(' ')[result.split(',')[44].split(' ').length-1],
            FAQ_bl:result.split(',')[45].split(' ')[result.split(',')[45].split(' ').length-1],
            Ventricles_bl:result.split(',')[46].split(' ')[result.split(',')[46].split(' ').length-1],
            Hippocampus_bl: result.split(',')[47].split(' ')[result.split(',')[47].split(' ').length-1],
            WholeBrain_bl:result.split(',')[48].split(' ')[result.split(',')[48].split(' ').length-1],
            Entorhinal_bl: result.split(',')[49].split(' ')[result.split(',')[49].split(' ').length-1],
            Fusiform_bl: result.split(',')[50].split(' ')[result.split(',')[50].split(' ').length-1],
            MidTemp_bl: result.split(',')[51].split(' ')[result.split(',')[51].split(' ').length-1],
            ICV_bl:result.split(',')[52].split(' ')[result.split(',')[52].split(' ').length-1],
            Years_bl: result.split(',')[53].split(' ')[result.split(',')[53].split(' ').length-1],
            Month_bl: result.split(',')[54].split(' ')[result.split(',')[54].split(' ').length-1],
            Month: result.split(',')[55].split(' ')[result.split(',')[55].split(' ').length-1],
            M: result.split(',')[56].split(' ')[result.split(',')[56].split(' ').length-1],
            update_stamp: result.split(',')[57].split(' ')[result.split(',')[57].split(' ').length-1],
            FDG_bl: result.split(',')[58].split(' ')[result.split(',')[58].split(' ').length-1],
        }

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }).then(res => res.json())
            .then(json => {
                console.log(data)
                const success = json.status.success
                console.log(success)
                if (success) {
                    console.log()
                    console.log('aaaa')

                } else {
                    alert('Problem occurred.');
                }
            })
            .catch(err => {
                alert('Some error has occurred')
                console.log(err)
            });


    };



        return (<div>
                <label className="custom-file-upload">
                    <input type="file"  style={{fontSize: "2rem", color: "#525b60"}} onChange={async (e) => await showFile(e)} />
                </label>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <Button
                        style={{
                            width: "10rem",
                            backgroundColor: "green",
                            color:'white',
                            marginTop:'1rem',
                            marginLeft:'1rem',
                            marginBottom:'1rem'
                        }}
                        variant="contained"

                        onClick={handleOnClick}
                    >
                        ADD
                    </Button>
                </div>
            </div>

        )

}

export default FileRead;