import { Search } from "@mui/icons-material";
import { Icon } from "@mui/material";

export const Dashboard = () => {

    document.title = "Dashboard Student"

    return (
        <div className="container">
            <div className="card mt-5">
                <div className="card-body">
                    <h1 class="display-4">Are you new??</h1>
                    <p class="lead">‘This website helps you to find a <strong>suitable course for you</strong> and also the course and subject information.</p>
                    <hr class="my-4" />
                    <p>Let find out how it works!</p>
                    <p class="lead">
                        <a class="btn btn-primary btn-lg" href={`/student/dashboard/howtouse`} role="button">Learn more</a>
                    </p>
                </div>
            </div>
            <div className="card my-5 bg-primary">
                <div className="card-body">
                    <p class="lead text-white mb-1">
                        I've already know how it works, lets <a class="btn btn-warning btn-lg" href={`/student/howtouse`} role="button"><Search/>Find My Best Course</a>
                    </p>
                </div>
            </div>
        </div>
    );
}