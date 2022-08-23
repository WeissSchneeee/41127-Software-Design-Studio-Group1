import React, { useState } from "react";
import {Outlet} from "react-router-dom";
import {AccountCircle, Login, MeetingRoom} from '@mui/icons-material/';
import '../style/navbar.css';
import { getUserID, logOut } from "../../App";

export const NavBar = (props) => {
    const [userID, setUserID] = useState();

    getUserID().then(res => setUserID(res));

    if(userID == null) return (<section></section>);

    return(
        <main>
            <header className="content-navbar">
                <div className="topnav">
                    {(userID === "none") && <a className = {props.page === "signin" ? "active" : ""} href="/signin"><Login/>Sign In</a> }
                    {(userID !== "none") && accountMenu(props.page)}
                </div>
            </header>
            <Outlet/>
        </main>
    );
};

const accountMenu = (page) => {
    return(
        <div className = "topnav-dropdown">
            <button className = {page === "profile" ? "topnav-dropbtn-active topnav-dropbtn" : "topnav-dropbtn"}><AccountCircle/></button>
            <div className="topnav-dropdown-content">
                <a className={page === "profile" ? "active" : ""} href = "/profile"><AccountCircle/>Profile</a>
                <a href = "/signin" onClick={logOut}><MeetingRoom/>Log Out</a>
            </div>
        </div>
    );
};