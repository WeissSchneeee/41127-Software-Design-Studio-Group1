import React, { useEffect, useState } from "react";
import { TableCell, TableRow, Checkbox } from "@mui/material";
import { getUserID } from "../../App";
import { Search } from "@mui/icons-material";
import "../style/student.css";
import { SecondaryTable } from "../../figures/components/SecondaryTable";
import { useNavigate } from "react-router-dom";

export const StudentEnrolment = _ => {
    const [userID, setUserID] = useState();
    const [enrolment, setEnrolment] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        try{
            getUserID().then(res => setUserID(res));
        }catch(error){
            console.log(error);
        }
    }, []);
    useEffect(() => {
        try{
            if(userID != null && userID !== "none") getEnrolment(userID, setEnrolment);
        }catch(error){
            console.log(error);
        }
    }, [userID]);

    if(userID === "none") return window.location.href = "/signin";
    return(
        <section>
            {enrolmentList(enrolment)}
            <div className="button-row">
                <div className="card-body col-3 col-lg-3" >
                    <p className="lead text-white mb-0">
                        <a className="btn btn-warning btn-lg" href={`/student/recommendation`} role="button"><Search />Find My Best Course</a>
                    </p>
                </div>
                <button type="button" className="btn-lg" onClick={() => navigate(`/student/enrolment/create`)} >Enrol in subjects</button>
                <button type="button" className="btn-lg" onClick={() => navigate(`/student/enrolment/withdraw`)} >Withdraw from subjects</button>
                <button type="button" className="btn-lg" >Email my enrolment details</button>
            </div>
        </section>
    );
};

const enrolmentList = (enrolment) => {
    // List of subjects the student is currently enroled to
    const columns = [
        {
            id: 'year',
            numeric: true,
            label: 'YEAR'
        },
        {
            id: 'type',
            numeric: false,
            label: 'SESSION'
        },
        {
            id: 'subject_id',
            numeric: false,
            label: 'SUBJECT ID'
        },
        {
            id: 'subject_name',
            numeric: false,
            label: 'SUBJECT NAME'
        },
        {
            id: 'scredit_points',
            numeric: true,
            label: 'CREDIT POINTS'
        },
        {
            id: 'census_date',
            numeric: false,
            label: 'CENSUS DATE'
        }
    ];
    const cellFormat = (handleClick, isSelected, index, row) => {
        const isItemSelected = isSelected(row.enrolment_id);
        const labelId = `enhanced-table-checkbox-${index}`;
        return(
            <TableRow
                hover
                onClick={(event) => handleClick(event, row.enrolment_id)}
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                key={row.enrolment_id}
                selected={isItemSelected}
            >
                <TableCell className="table-cell" padding="checkbox">
                    <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                        'aria-labelledby': labelId,
                        }}
                    />
                </TableCell>
                <TableCell
                    className="table-cell" 
                    component="th"
                    id={labelId}
                    scope="row"
                    padding="none"
                >
                {row.year}
                </TableCell>
                <TableCell className="table-cell" align="center">{row.type} Session</TableCell>
                <TableCell className="table-cell" align="center">{row.subject_id}</TableCell>
                <TableCell className="table-cell" align="center">{row.subject_name}</TableCell>
                <TableCell className="table-cell" align="center">{row.scredit_points}</TableCell>
                <TableCell className="table-cell" align="center">{row.census_date}</TableCell>
            </TableRow>
        );
    };
    return(
        SecondaryTable(columns, enrolment, cellFormat, "ENROLMENT DETAILS")
    );
};

const getEnrolment = async (userID, setEnrolment) => {
    const res = await fetch("/api/getenrolmentlist", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userID: userID
        })
    });
    const data = await res.json();
    if(data.status){
        setEnrolment(data.enrolment);
    }
};