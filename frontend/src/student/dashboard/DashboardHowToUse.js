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

                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}