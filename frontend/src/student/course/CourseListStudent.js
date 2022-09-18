import React, { useEffect, useState } from "react";
import { getUserID } from "../../App";
import { useNavigate } from "react-router-dom";
import { Search } from "@mui/icons-material";

export const CourseListStudent = (props) => {
    const [userID, setUserID] = useState();
    const [state, setState] = useState({
        data: [],
        input: {key: ''},
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

    document.title = "Course List"

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

    const handleChange = (e) => {
        const { id, value } = e.target;
        setState(prevState => ({
            ...prevState,
            input: {
                ...prevState.input,
                [id]: value
            }
        }))
    }

    return (

        <section>
            {
                loading && <div className="container">Loading data, please wait...</div>
            }
            {
                !loading && <div className="container">
                    <h1 className="mb-3">Course List</h1>
                    <div className="form-group mb-3">
                        <div className="input-group">
                            <input id="key" value={state.input.key} className="form-control" onChange={handleChange} placeholder="Search course..." />
                            <span className="input-group-text"><Search /></span>
                        </div>
                        
                    </div>
                    <div className="card mb-3">
                        <div className="card-body">
                            {
                                state.data
                                    .filter(course => (course.course_name.toLowerCase().indexOf(state.input.key.toLowerCase()) >= 0))
                                    .map((val, key) => {
                                        return <p>{val.course_name}. <strong><a href={`/student/courselist/detail/${val.course_id}`}>{val.course_id}</a></strong></p>
                                    })
                            }
                        </div>
                    </div>
                </div>
            }
        </section>
    );
};

