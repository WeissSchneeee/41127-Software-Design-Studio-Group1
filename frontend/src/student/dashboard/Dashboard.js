import { CallOutlined, QuestionAnswer, QuestionMark, Search } from "@mui/icons-material";
import { Dialog, Icon } from "@mui/material";
import React, { useEffect, useState } from "react";
import { getUserID } from "../../App";
import img from "./../../images/iStock-131364744.jpg"

export const Dashboard = () => {

    const [userID, setUserID] = useState();
    useEffect(() => {
        try {
            getUserID().then(res => setUserID(res));
        } catch (error) {
            console.log(error);
        }
    }, []);

    document.title = "Dashboard Student"

    return (
        <div className="container">
            <div className="row mt-5 align-items-center">
                <div className="col-12 col-lg-7">
                    <div className="card">
                        <div className="card-body">
                            <h1 class="display-4">Are you new to UTS?</h1>
                            <p class="lead">This website helps you to find a <strong>suitable course for you</strong> and also the course and subject information.</p>
                            <hr class="my-4" />
                            <p>Let find out how it works!</p>
                            <p class="lead">
                                <a class="btn btn-primary btn-lg" href={`/student/dashboard/howtouse`} role="button">Learn more...</a>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-5">
                    <img src={img} className="img-fluid" />
                </div>
            </div>

            <div className="card my-5">
                <div className="row">
                    <div className="card-body col-12 col-lg-7 bg-primary">
                        <p className="lead text-white mb-0">
                            I've already know how it works, lets... <br/>
                            <a className="btn btn-warning btn-lg" href={`/student/recommendation`} role="button"><Search />Find My Best Course</a>
                        </p>
                    </div>
                    <div className="card-body col-12 col-lg-5">
                        <p className="h4">
                            Have some question? request?    
                        </p>
                        <p className="mb-0"><a class="" href={`/student/erequest/create`} role="button"><QuestionAnswer /> Make an E-Request </a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}