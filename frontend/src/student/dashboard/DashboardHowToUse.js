import React, { useEffect, useState } from "react";
import { getUserID } from "../../App";

export function DashboardHowToUse() {
    const [userID, setUserID] = useState();
    useEffect(() => {
        try {
            getUserID().then(res => setUserID(res));
        } catch (error) {
            console.log(error);
        }
    }, []);
    document.title = "How To Use"
    return (
        <section>
            <div className="container">
                <h1 className="display-3">How To Use</h1>
                <div className="card my-3">
                    <div className="card-body border-bottom">
                        <h4 className="bold"></h4>
                        <p>
                            You can edit your personal details in your <strong>profile</strong>.
                        </p>
                    </div>
                </div>
                <div className="card my-3">
                    <div className="card-body border-bottom">
                        <h4 className="bold"></h4>
                        <p>
                            You can view the courses and subjects through the <strong>course list</strong> and <strong>subject list</strong> by clicking on the <strong>Subjects</strong> on the top right navigation bar.
                        </p>
                    </div>
                </div>
                <div className="card my-3">
                    <div className="card-body border-bottom">
                        <h4 className="bold"></h4>
                        <p>
                            You can get useful advise for suitable subjects by clicking the <strong>Recommendation</strong> in <strong>Subjects</strong>, and you can do the enrolment in <strong>Enrolment</strong>.
                        </p>
                    </div>
                </div>
                <div className="card my-3">
                    <div className="card-body border-bottom">
                        <h4 className="bold"></h4>
                        <p>
                            To view the announcements posted by the system admin, click <strong>view Announcements</strong>.
                        </p>
                        <p>
                            To enqiury staff about the enrolment, click <strong>E Request</strong>.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}