import React, { useEffect, useState } from "react";
import { TableCell, TableRow, Checkbox, IconButton } from "@mui/material";
import { MainTable } from "../../figures/components/MainTable";
import { getUserID } from "../../App";
import { useNavigate } from "react-router-dom";
import { Edit, Search, Delete } from "@mui/icons-material";

export const SubjectList = (props) => {
    const [userID, setUserID] = useState();
    const [state, setState] = useState({
        data: []
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

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

    const loadData = () => {
        setLoading(true)
        fetch("/api/subject/list", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then((res) => { return res.json(); })
            .then((data) => {
                if (data.status) {
                    setState(prevState => ({
                        ...prevState,
                        data: data.subject
                    }))
                }
                setLoading(false)

            });
    }

    const AccountTable = () => {
        const columns = [
            {
                id: 'subject_id',
                numeric: false,
                disablePadding: true,
                label: 'Subject Id',
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
                label: 'Action',
            },
        ]
        const handleCreate = _ => {
            navigate(`/subjectlist/create`)
        };


        const handleDelete = (selected) => {
            fetch("/api/subject/delete", {
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
            MainTable(columns, state.data, cellFormat, "Subject List", "New Subject", handleCreate, "Delete Subject", handleDelete)
        );
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
                {/* <TableCell className="table-cell" align="center">{row.course_duration}</TableCell> */}
                <TableCell className="table-cell" align="center">{row.scredit_points}</TableCell>
                <TableCell className="table-cell" align="center">{row.subject_level}</TableCell>
                <TableCell className="table-cell" align="center"><IconButton onClick={() => navigate(`/subjectlist/detail/${row.subject_id}`)}><Search /></IconButton></TableCell>
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

