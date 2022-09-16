import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { AccountCircle, Announcement, GolfCourse, Login, MeetingRoom, School, Storage } from '@mui/icons-material/';
import '../style/navbar.css';
import { getUserID, logOut } from "../../App";

export const NavBar = (props) => {
    const [userID, setUserID] = useState();
    const [userType, setUserType] = useState();

    useEffect(() => {
        try {
            getUserID().then(res => setUserID(res));
        } catch (error) {
            console.log(error);
        }
    }, []);
    useEffect(() => {
        try {
            const getUserData = async _ => {
                const res = await fetch("/api/getprofile", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userID: userID
                    })
                });
                const data = await res.json();
                if (data.status) {
                    setUserType(data.user.user_type);
                }
            };
            if (userID != null && userID !== "none") getUserData();
        } catch (error) {
            console.log(error);
        }
    }, [userID]);

    if (userID == null) return (<section></section>);
    return (
        <main>
            <header className="content-navbar">
                <div className="topnav">
                    {(userID === "none") && <a className={props.page === "signin" ? "active" : ""} href="/signin"><Login />Sign In</a>}
                    {
                        (userID !== "none") && (isAdmin(userType) || isStaff(userType)) && <>
                            <a className={props.page === "courselist" ? "active" : ""} href="/courselist"><GolfCourse />Course List</a>
                        </>
                    }
                    {
                        (userID !== "none") && isAdmin(userType) && <>
                            <a className={props.page === "accountlist" ? "active" : ""} href="/accountlist"><Storage />Account List</a>
                        </>
                    }
                    {
                        (userID !== "none") && isAdmin(userType) && <>
                            <a className={props.page === "announcementlist" ? "active" : ""} href = "/announcementlist"><Announcement />Post Announcements</a>
                        </>

                    }
                    {
                        (userID !== "none") && isStudent(userType) && <>
                            <a className={props.page === "enrolment" ? "active" : ""} href = "/enrolment">< School/>Enrol in Subject</a>
                        </>

                    }
                    {(userID !== "none") && accountMenu(props.page, userType)}
                </div>
            </header>
            <Outlet />
        </main>
    );
};

const accountMenu = (page, userType) => {
    return (
        <div className="topnav-dropdown">
            <button className={(page === "profile") ? "topnav-dropbtn-active topnav-dropbtn" : "topnav-dropbtn"}><AccountCircle /></button>
            <div className="topnav-dropdown-content">
                <a className={page === "profile" ? "active" : ""} href="/profile"><AccountCircle />Profile</a>
                <a href="/signin" onClick={logOut}><MeetingRoom />Log Out</a>
            </div>
        </div>
    );
};
const isAdmin = (userType) => {
    return String(userType).toLowerCase() === "a";
};
const isStaff = (userType) => {
    return String(userType).toLowerCase() === "e";
};
const isStudent = (userType) => {
    return String(userType).toLowerCase() === "s";
};