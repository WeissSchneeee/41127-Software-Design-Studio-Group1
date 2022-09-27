import React, { useEffect, useState } from "react";
import { TableCell, TableRow, Checkbox, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Edit, Search } from "@mui/icons-material";
import { MainTable } from "../figures/components/MainTable";
import { getUserID } from "../App";

export const SysLogList = (props) => {
    const [userID, setUserID] = useState();
    const [state, setState] = useState({
        data: []
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    document.title = "Sys Log"

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
        fetch("/api/syslog/list", {
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
                        data: data.sys_log
                    }))
                }
                setLoading(false)

            });
    }

    const AccountTable = () => {
        const columns = [
            {
                id: 'time',
                disablePadding: false,
                label: 'Time',
            },
            {
                id: 'prefix',
                disablePadding: false,
                label: 'Prefix',
            },
            {
                id: 'message',
                disablePadding: false,
                label: 'Message',
            },
        ]
        const handleCreate = _ => {
            navigate(`/courselist/create`)
        };


        const handleDelete = (selected) => {
            fetch("/api/syslog/delete", {
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
            MainTable(columns, state.data, cellFormat, "Sys Log", null, null, "Delete Log", handleDelete)
        );
    };

    const TimeConverter = ({timestamp}) => {
        var a = new Date(timestamp * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
        return time;
      }

    const cellFormat = (handleClick, isSelected, index, row) => {
        const isItemSelected = isSelected(row.id);
        const labelId = `enhanced-table-checkbox-${index}`;
        return (
            <TableRow
                hover
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                key={row.id}
                selected={isItemSelected}
            >
                <TableCell className="table-cell" padding="checkbox">
                    <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                            'aria-labelledby': labelId,
                        }}
                        onClick={(event) => handleClick(event, row.id)}
                    />
                </TableCell>
                <TableCell size="medium" className="table-cell"><TimeConverter timestamp={row.time} /></TableCell>
                <TableCell className="table-cell">{row.prefix}</TableCell>
                <TableCell size="string" className="table-cell"><pre>{row.message}</pre></TableCell>
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

