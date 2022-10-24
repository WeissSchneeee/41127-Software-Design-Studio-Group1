import React, { useEffect, useState } from "react";
import { TableCell, TableRow, Checkbox, IconButton } from "@mui/material";
import { getUserID } from "../../App";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Backspace, Search } from "@mui/icons-material";
import { SecondaryTable } from "../../figures/components/SecondaryTable";

export const NewEnrolment = _ => {
    const [userID, setUserID] = useState();
    const [subjects, setSubjects] = useState([]);
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
            if(userID != null && userID !== "none") getSubjectList(userID, setSubjects);
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
            {subjectList(subjects, setSubjects, userID, navigate)}
        </section>
    );
};

const subjectList = (subjects, setSubjects, userID, navigate) => {
    const columns = [
        {
            id: 'subject_id',
            numeric: false,
            disablePadding: true,
            label: 'Subject ID',
        },
        {
            id: 'subject_name',
            numeric: false,
            disablePadding: false,
            label: 'Subject Name',
        },
        {
            id: 'subject_credit_points',
            numeric: true,
            disablePadding: false,
            label: 'Credit Points',
        },
        {
            id: 'subject_level',
            numeric: true,
            disablePadding: false,
            label: 'Subject Level',
        },
        {
            id: 'edit',
            numeric: true,
            disablePadding: false,
            label: 'Detail',
        },
        {
            id: 'enrol',
            numeric: true,
            disablePadding: false,
            label: 'Action',
        },
    ];
    const enrolSubject = (subjectID) => {
        try{
            if(!window.confirm("Are you sure to enrol to this subject?"))
                return;
            fetch("/api/createenrolment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userID: userID,
                    subjectID: subjectID
                })
            })
                .then((res) => { return res.json(); } )
                .then((data) => {
                    alert(data.message);
                    if(data.status){
                        getSubjectList(userID, setSubjects)
                    }
                });
        }catch(error){
            console.log(error);
        }
    };
    const cellFormat = (handleClick, isSelected, index, row) => {
        const isItemSelected = isSelected(row.subject_id);
        const labelId = `enhanced-table-checkbox-${index}`;
        return (
            <TableRow
                hover
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                key={row.subject_id}
                selected={isItemSelected}
            >
                <TableCell className="table-cell" padding="checkbox">
                    <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                            'aria-labelledby': labelId,
                        }}
                        onClick={(event) => handleClick(event, row.subject_id)}
                    />
                </TableCell>
                <TableCell
                    className="table-cell"
                    component="th"
                    id={labelId}
                    scope="row"
                    padding="none"
                >
                    {row.subject_id}
                </TableCell>
                <TableCell className="table-cell" align="center">{row.subject_name}</TableCell>
                <TableCell className="table-cell" align="center">{row.scredit_points}</TableCell>
                <TableCell className="table-cell" align="center">{row.subject_level}</TableCell>
                <TableCell className="table-cell" align="center"><IconButton onClick={() => navigate(`/subjectlist/detail/${row.subject_id}`)}><Search /></IconButton></TableCell>
                <TableCell className="table-cell" align="center"><IconButton onClick={() => enrolSubject(row.subject_id)} ><ArrowRight />Enrol</IconButton></TableCell>
            </TableRow>
        );
    };
    return(
        SecondaryTable(columns, subjects, cellFormat, "ENROLMENT OPTION")
    );
};

const getSubjectList = async (userID, setSubjects) => {
    const res = await fetch("/api/getenrolmentoption", {
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
        setSubjects(data.subject);
    }
};