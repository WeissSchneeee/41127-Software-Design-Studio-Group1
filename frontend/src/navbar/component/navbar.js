import React from "react";
import {Outlet} from "react-router-dom";
import {Login, HowToReg} from '@mui/icons-material/';
import '../style/navbar.css';

export const NavBar = (props) => {
    return(
        <main>
            <header className="content-navbar">
                <div className="topnav">
                    <a className = {props.page === "signin" ? "active" : ""} href="/signin"><Login/>Sign In</a>
                    <a className = {props.page === "signup" ? "active" : ""} href="/signup"><HowToReg/>Sign Up</a>
                </div>
            </header>
            <Outlet/>
        </main>
    );
};