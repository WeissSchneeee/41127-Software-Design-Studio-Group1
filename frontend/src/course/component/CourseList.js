import React, { useEffect, useState } from "react";
import { TableCell, TableRow, Checkbox, IconButton } from "@mui/material";
import { MainTable } from "../../figures/components/MainTable";
import { getUserID } from "../../App";
import { CreateCourseForm } from "./CreateCourseForm";
import { useNavigate } from "react-router-dom";
import { Edit } from "@mui/icons-material";

export const CourseList = (props) => {
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
        fetch("/api/course/list", {
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
                        data: data.course
                    }))
                }
                setLoading(false)

            });
    }

    const AccountTable = () => {
        const columns = [
            {
                id: 'course_id',
                numeric: false,
                disablePadding: true,
                label: 'Course Id',
            },
            {
                id: 'course_name',
                numeric: false,
                disablePadding: false,
                label: 'Name',
            },
            {
                id: 'course_duration',
                numeric: false,
                disablePadding: false,
                label: 'Duration',
            },
            {
                id: 'course_credit_points',
                numeric: true,
                disablePadding: false,
                label: 'Credit Points',
            },
            {
                id: 'course_fees',
                numeric: true,
                disablePadding: false,
                label: 'Fees',
            },
            {
                id: 'edit',
                numeric: true,
                disablePadding: false,
                label: 'Edit',
            },
        ]
        const handleCreate = _ => {
            navigate(`/courselist/create`)
        };
        return (
            MainTable(columns, state.data, cellFormat, "Course List", "New Course", handleCreate)
        );
    };
    const cellFormat = (handleClick, isSelected, index, row) => {
        const isItemSelected = isSelected(row.course_id);
        const labelId = `enhanced-table-checkbox-${index}`;
        return (
            <TableRow
                hover
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                key={row.course_id}
                selected={isItemSelected}
            >
                <TableCell className="table-cell" padding="checkbox">
                    <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                            'aria-labelledby': labelId,
                        }}
                        onClick={(event) => handleClick(event, row.course_id)}
                    />
                </TableCell>
                <TableCell
                    className="table-cell"
                    component="th"
                    id={labelId}
                    scope="row"
                    padding="none"
                >
                    {row.course_id}
                </TableCell>
                <TableCell className="table-cell" align="center">{row.course_name}</TableCell>
                <TableCell className="table-cell" align="center">{row.course_duration}</TableCell>
                <TableCell className="table-cell" align="center">{row.course_credit_points}</TableCell>
                <TableCell className="table-cell" align="center">{row.course_fees}</TableCell>
                <TableCell className="table-cell" align="center"><IconButton onClick={() => navigate(`/courselist/update/${row.course_id}`)}><Edit/></IconButton></TableCell>
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

