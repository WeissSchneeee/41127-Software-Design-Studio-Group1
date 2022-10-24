import React, { useEffect, useState } from "react";
import { TableCell, TableRow, Checkbox, IconButton } from "@mui/material";
import { getUserID } from "../../App";
import { MainTable } from "../../figures/components/MainTable";
import { useNavigate } from "react-router-dom";
import { Backspace } from "@mui/icons-material";

export const WithdrawEnrolment = _ => {
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
            <p>
                <IconButton title="Back" onClick={() => navigate(-1)}><Backspace/></IconButton>
            </p>
            {withdrawList(enrolment, setEnrolment, userID, navigate)}
        </section>
    );
};

const withdrawList = (enrolment, setEnrolment, userID, navigate) => {
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
    const enrolSubject = _ => {
        navigate(`/student/enrolment/create`);
    };
    const withdraw = (selected) => {
        try{
            if(!window.confirm("Are you sure to withdraw the selected enrolment(s)?"))
                return;
            fetch("/api/withdrawenrolment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    list: selected
                })
            })
                .then((res) => { return res.json(); } )
                .then((data) => {
                    alert(data.message);
                    if(data.status){
                        getEnrolment(userID, setEnrolment);
                    }
                });
        }catch(error){
            console.log(error);
        }
    };
    return(
        MainTable(columns, enrolment, cellFormat, "ENROLMENT WITHDRAWAL", "Enrol in subjects", enrolSubject, "Withdraw from subjects", withdraw)
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
        setEnrolment(data.enrolment.filter(data => {
            return new Date(data.census_date).getTime() >= new Date().getTime()
        }));
    }
};