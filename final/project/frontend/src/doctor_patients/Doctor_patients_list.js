import {Box} from "@material-ui/core";
import React from "react";
import {serverUrl} from "../common/ServerUrl";
import {useState, useEffect} from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import {Link} from "react-router-dom";
import Doctor_patients_list_item from "./Doctor_patients_list_item";



export default function Doctor_patients_list() {
    const [plist, setPlist] = useState([]);
    const[inpage,setinpage]= useState('false');


    useEffect(() => {
        fetch(serverUrl +"/api/getPatientsofDoctor/"+1+'/', {

        })
            .then((response) => response.json())
            .then((data) => {
                setPlist(data);

               console.log(data)

            }).then(() => {
            setinpage(true)
        });

    }, []);




    const renderPatients = () => {
        console.log(plist+'kkkkk')
        return plist.map((e, i) => {
            return (
                <Doctor_patients_list_item
                    patient={e}
                />
            );
        });
    };

    return (
        <div>
            {inpage?(
            <div>
                <div className="Home">

                </div>
                <div>


                </div>
                <div style={{marginTop: "1rem"}}>
                    <Breadcrumbs style={{color: "#0B3954"}} separator="›">

                        <Link style={{color: "#0B3954"}} >
                            My Patients
                        </Link>
                    </Breadcrumbs>
                </div>
                <React.Fragment>

                    {plist && plist.length > 0 && <Box>{renderPatients()}</Box>}
                </React.Fragment>
            </div>):null}
        </div>
    );
}