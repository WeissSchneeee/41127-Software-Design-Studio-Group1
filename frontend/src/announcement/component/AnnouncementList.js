/*import React, { useEffect, useState } from "react";
//import "../style/account.css";
import { getUserID } from "../../App";
import { TableCell, TableRow, Checkbox } from "@mui/material";
import { MainTable } from "../../figures/components/MainTable";
import { CreateAnAnnoucement } from "./CreateAnAnnouncement";

export const AnnouncementList = _ => {
    const [userID, setUserID] = useState();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        try{
            getUserID().then(res => setUserID(res));
        }catch(error){
            console.log(error);
        }
    }, []);
    useEffect(() => {
        try{
            if(userID != null && userID !== "none") getUsers(userID, setUsers);
        }catch(error){
            console.log(error);
        }
    }, [userID]);

    if(userID === "none") return window.location.href = "/signin";
    return(
        <section>
            {CreateAnAnnoucement(users, setUsers)}
            {AnnouncementList(users, userID, setUsers)}
        </section>
    );
};
const announcementList = (users, userID, setUsers) => {
    const columns = [
        {
            id: 'announcement_title',
            numeric: false,
            disablePadding: true,
            label: 'USER ID',
        },
        {
            id: 'user_type',
            numeric: false,
            disablePadding: false,
            label: 'USER TYPE',
        }
    ]
    const createAnnouncement = _ => {
        document.getElementById("createAnAnnouncement").style.display = "block";
    };
    const deleteUser = (selected) => {
        try{
            fetch("/api/deletemultipleuser", {
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
                        getUsers(userID, setUsers)
                    }
                });
        }catch(error){
            console.log(error);
        }
    };
    return(
        MainTable(columns, users, cellFormat, "ACCOUNT DATABASE", "New User", createUser,"Delete User", deleteUser)
    );
};
const cellFormat = (handleClick, isSelected, index, row) => {
    const isItemSelected = isSelected(row.user_id);
    const labelId = `enhanced-table-checkbox-${index}`;
    return(
        <TableRow
            hover
            onClick={(event) => handleClick(event, row.user_id)}
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            key={row.user_id}
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
            {row.user_id}
            </TableCell>
            <TableCell className="table-cell" align="center">{row.user_type}</TableCell>
            <TableCell className="table-cell" align="center">{row.role}</TableCell>
            <TableCell className="table-cell" align="center">{row.email_address}</TableCell>
            <TableCell className="table-cell" align="center">{row.first_name}</TableCell>
            <TableCell className="table-cell" align="center">{row.last_name}</TableCell>
            <TableCell className="table-cell" align="center">{row.contact_number}</TableCell>
            <TableCell className="table-cell" align="center">{row.dob}</TableCell>
        </TableRow>
    );
};
const getUsers = async (userID, setUsers) => {
    const res = await fetch("/api/getalluser", {
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
        setUsers(data.users);
    }
};*/