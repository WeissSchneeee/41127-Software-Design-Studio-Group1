import React, { useEffect, useState } from "react";
import { getUserID } from "../../App";
import { TableCell, TableRow, Checkbox, IconButton } from "@mui/material";
import { MainTable } from "../../figures/components/MainTable";
import { Edit } from "@mui/icons-material";

export const SessionList = _ => {
    const [userID, setUserID] = useState();
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        try{
            getUserID().then(res => setUserID(res));
        }catch(error){
            console.log(error);
        }
    }, []);
    useEffect(() => {
        try{
            if(userID != null && userID !== "none") getSessionList(setSessions);
        }catch(error){
            console.log(error);
        }
    }, [userID]);

    if(userID === "none") return window.location.href = "/signin";
    return(
        <secion>
            {sessionTable(sessions, setSessions)}
        </secion>
    );
};
const sessionTable = (sessions, setSessions) => {
    const columns = [
        {
            id: 'session_id',
            numeric: false,
            label: 'Session ID'
        },
        {
            id: 'type',
            numeric: false,
            label: 'Session'
        },
        {
            id: 'year',
            numeric: false,
            label: 'Year'
        },
        {
            id: 'census_date',
            numeric: false,
            label: 'Census Date'
        },
        {
            id: 'edit',
            numeric: false,
            label: 'Action'
        },
    ];
    const createSession = _ => {
        
    };
    const deleteSession = _ => {
        
    };
    return(MainTable(columns, sessions, cellFormat, "SESSION DATABASE", "New Session", createSession, "Delete Session", deleteSession));
}; 
const cellFormat = (handleClick, isSelected, index, row) => {
    const isItemSelected = isSelected(row.session_id);
    const labelId = `enhanced-table-checkbox-${index}`;
    return(
        <TableRow
            hover
            onClick={(event) => handleClick(event, row.session_id)}
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            key={row.session_id}
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
            {row.session_id}
            </TableCell>
            <TableCell className="table-cell" align="center">{row.type}</TableCell>
            <TableCell className="table-cell" align="center">{row.year}</TableCell>
            <TableCell className="table-cell" align="center">{row.census_date}</TableCell>
            <TableCell className="table-cell" align="center"><IconButton ><Edit/></IconButton></TableCell>
        </TableRow>
    );
};

const getSessionList = async (setSessions) => {
    const res = await fetch("/api/getsessionlist", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await res.json();
    if(data.status){
        setSessions(data.sessions);
    }
};