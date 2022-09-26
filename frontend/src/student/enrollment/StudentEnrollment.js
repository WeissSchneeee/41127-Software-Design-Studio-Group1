import React, { useEffect, useState } from "react";
import { TableCell, TableRow, Checkbox } from "@mui/material";
import { MainTable } from "../../figures/components/MainTable";
import { getUserID } from "../../App";

export const StudentEnrollment = _ => {
    const [userID, setUserID] = useState();
    const [enrollment, setEnrollment] = useState([]);

    useEffect(() => {
        try{
            getUserID().then(res => setUserID(res));
        }catch(error){
            console.log(error);
        }
    }, []);
    useEffect(() => {
        try{
            if(userID != null && userID !== "none") getEnrollment(userID, setEnrollment);
        }catch(error){
            console.log(error);
        }
    }, [userID]);

    return(
        <section>
            {enrollmentList(enrollment)}
        </section>
    );
};

const enrollmentList = (enrollment) => {
    // List of subjects the student is currently enrolled to
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
        const isItemSelected = isSelected(row.enrollment_id);
        const labelId = `enhanced-table-checkbox-${index}`;
        return(
            <TableRow
                hover
                onClick={(event) => handleClick(event, row.enrollment_id)}
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                key={row.enrollment_id}
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
        MainTable(columns, enrollment, cellFormat, "ENROLLMENT DETAILS", "Enrol in Subjects", null, "Withdraw Subject(s)", null)
    );
};

const getEnrollment = async (userID, setEnrollment) => {
    const res = await fetch("/api/getenrollmentlist", {
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
        setEnrollment(data.enrollment);
    }
};