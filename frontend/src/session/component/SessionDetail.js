import { Backspace } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NormalField } from "./NormalField";
import { getUserID } from "../../App";
import { SelectField } from "./SelectField";
import { DateField } from "./DateField";
import { YearField } from "./YearField";

export const SessionDetail = _ => {
    const [userID, setUserID] = useState();
    const [session, setSession] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const sessionID = useParams().id;
    useEffect(() => {
        try{
            getUserID().then(res => setUserID(res));
        }catch(error){
            console.log(error);
        }
    }, []);

    useEffect(() => {
        try{
            if(userID != null && userID !== "none") getSession(sessionID, setSession, navigate, setLoading);
        }catch(error){
            console.log(error);
        }
    }, [userID, sessionID, navigate]);
    
    const updateData = _ => {
        try{
            const sessionType = document.getElementById("sessionTypeSelection").value;
            const sessionYear = document.getElementById("year").value;
            const censusDate = document.getElementById("censusdate").value;
            if(!(sessionYear && censusDate))
                return alert("Please fill in all of the non-optional data!");
            fetch("/api/updatesession", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sessionID: session.session_id,
                    sessionType: sessionType,
                    sessionYear: sessionYear,
                    censusDate: censusDate
                })
            })
                .then((res) => { return res.json(); } )
                .then((data) => {
                    alert(data.message);
                    if(data.status){
                        setSession(data.session);
                    }
                });
        }catch(error){
            console.log(error);
        }
    };
    return(
        <section className="container">
            { loading ? <div className="container">Loading data, please wait...</div> :
            <section>
                <h2 className="mb-3"><strong>{session.session_id}</strong></h2>
                <p>
                    <IconButton title="Back" onClick={() => navigate(-1)}><Backspace/></IconButton>
                </p>
                <div className="card mb-3">
                    <div className="card-body">
                        {NormalField("Session ID", session.session_id, "session_id")}
                        {SelectField("Session")}
                        {YearField("Year", session.year, "year")}
                        {DateField("Census Date", session.census_date, "censusdate")}
                    </div>
                </div>
                <div className="center-side-button" style={{float: "right"}} >
                    <button type="button" className="btn-lg" onClick={updateData}>Update</button>
                </div>
            </section>
            }
        </section>
    );
};
const getSession = async (sessionID, setSession, navigate, setLoading) => {
    const res = await fetch("/api/getsession", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            sessionID: sessionID
        })
    });
    const data = await res.json();
    if(data.status){
        setSession(data.session);
        setLoading(false);
        document.getElementById("sessionTypeSelection").value = data.session.type;
    }else{
        navigate(-1);
    }
};