import React, { useEffect, useState } from "react";
import { TableCell, TableRow, Checkbox, IconButton } from "@mui/material";
import { MainTable } from "../../figures/components/MainTable";
import { useNavigate } from "react-router-dom";
import { getUserID } from "../../App";
import { Edit, Search, Delete } from "@mui/icons-material";

export const ErequestList = (props) => {
    const [state, setState] = useState({
        data: []
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()    
    const [userID, setUserID] = useState();
    useEffect(() => {
        try{
            getUserID().then(res => setUserID(res));
        }catch(error){
            console.log(error);
        }
    }, []);

    useEffect(() => {
        try {
            getUserID().then(res => setUserID(res));
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        try {
            if (userID != null && userID !== "none") loadData();
        } catch (error) {
            console.log(error);
        }
    }, [userID]);

    if (userID === "none") return window.location.href = "/signin";

    document.title = "E-Request List"

    const loadData = () => {
        setLoading(true)
        fetch("/api/erequest/list", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userID: userID })
        })
            .then((res) => { return res.json(); })
            .then((data) => {
                if (data.status) {
                    setState(prevState => ({
                        ...prevState,
                        data: data.request
                    }))
                }
                setLoading(false)

            });
    }

    const AccountTable = () => {
        const columns = [
            {
                id: 'request_id',
                numeric: false,
                disablePadding: true,
                label: 'Request Id',
            },
            {
                id: 'student_id',
                numeric: false,
                disablePadding: false,
                label: 'Student Id',
            },
            {
                id: 'name',
                numeric: true,
                disablePadding: false,
                label: 'Student Name',
            },
            {
                id: 'question',
                numeric: true,
                disablePadding: false,
                label: 'Question',
            },
            {
                id: 'ins_time',
                numeric: true,
                disablePadding: false,
                label: 'Ins Time',
            },
            {
                id: 'status',
                numeric: true,
                disablePadding: false,
                label: 'Status',
            },
            {
                id: 'detail',
                numeric: true,
                disablePadding: false,
                label: 'Action',
            },
        ]

        const handleDelete = (selected) => {
            fetch("/api/erequest/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    list: selected
                })
            })
                .then((res) => { return res.json(); })
                .then((data) => {
                    if (data.status) {
                        loadData()
                    }
                    setLoading(false)

                });
        }

        return (
            MainTable(columns, state.data, cellFormat, " E - Request List", null, null, "Delete Request", handleDelete)
        );
    };
    const cellFormat = (handleClick, isSelected, index, row) => {
        const isItemSelected = isSelected(row.request_id);
        const labelId = `enhanced-table-checkbox-${index}`;
        return (
            <TableRow
                hover
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                key={row.request_id}
                selected={isItemSelected}
            >
                <TableCell className="table-cell" padding="checkbox">
                    <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                            'aria-labelledby': labelId,
                        }}
                        onClick={(event) => handleClick(event, row.request_id)}
                    />
                </TableCell>
                <TableCell
                    className="table-cell"
                    component="th"
                    id={labelId}
                    scope="row"
                    padding="none"
                >
                    {row.request_id}
                </TableCell>
                <TableCell className="table-cell" align="center">{row.student_id}</TableCell>
                <TableCell className="table-cell" align="center">{row.first_name} {row.last_name}</TableCell>
                <TableCell className="table-cell" align="">{row.question}</TableCell>
                <TableCell className="table-cell" align="">{row.ins_time}</TableCell>
                <TableCell className="table-cell">
                    {
                        (row.status === 1) &&
                        <span className="badge bg-warning">Waiting for Answer</span>
                    }
                    {
                        (row.status === 2) &&
                        <span className="badge bg-success">Answered</span>
                    }
                </TableCell>
                <TableCell className="table-cell" align="center"><IconButton onClick={() => navigate(`/erequestlist/detail/${row.request_id}`)}><Search /></IconButton></TableCell>
            </TableRow>
        );
    };

    return (
        <section>
            {
                loading ? <div className="container">Loading data, please wait...</div> : <AccountTable />
            }

        </section>
    );
};

