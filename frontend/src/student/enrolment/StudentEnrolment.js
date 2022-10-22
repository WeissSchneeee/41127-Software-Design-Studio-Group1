import React, { useEffect, useState } from "react";
import { TableCell, TableRow, Checkbox } from "@mui/material";
import { MainTable } from "../../figures/components/MainTable";
import { getUserID } from "../../App";
import { CallOutlined, QuestionAnswer, QuestionMark, Search } from "@mui/icons-material";

export const StudentEnrolment = _ => {
    const [userID, setUserID] = useState();
    const [enrolment, setenrolment] = useState([]);

    useEffect(() => {
        try{
            getUserID().then(res => setUserID(res));
        }catch(error){
            console.log(error);
        }
    }, []);
    useEffect(() => {
        try{
            if(userID != null && userID !== "none") getEnrolment(userID, setenrolment);
        }catch(error){
            console.log(error);
        }
    }, [userID]);

    return(
        <section>
            {enrolmentList(enrolment)}
            <div className="card-body col-12 col-lg-7" >
                <p className="lead text-white mb-0">
                    <a className="btn btn-warning btn-lg" href={`/student/recommendation`} role="button"><Search />Find My Best Course</a>
                </p>
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
        MainTable(columns, enrolment, cellFormat, "enrolMENT DETAILS", "Enrol in Subjects", null, "Withdraw Subject(s)", null)
    );
};

const getEnrolment = async (userID, setenrolment) => {
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
        setenrolment(data.enrolment);
    }
};