import React, { useEffect, useState } from "react";
import { TableCell, TableRow, Checkbox, IconButton } from "@mui/material";
import { MainTable } from "../../figures/components/MainTable";
import { getUserID } from "../../App";
import { useNavigate } from "react-router-dom";
import { Edit, Search } from "@mui/icons-material";

export const SubjectListStudent = (props) => {
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

    document.title = "Subject List"

    const loadData = () => {
        setLoading(true)
        fetch("/api/subject/list", {
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
                        data: data.subject
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
                    <h1 className="mb-3">Subject List</h1>
                    <div className="form-group mb-3">
                        <div className="input-group">
                            <input id="key" value={state.input.key} className="form-control" onChange={handleChange} placeholder="Search subject..." />
                            <span className="input-group-text"><Search /></span>
                        </div>
                        
                    </div>
                    <div className="card mb-3">
                        <div className="card-body">
                            {
                                state.data
                                    .filter(subject => (subject.subject_name.toLowerCase().indexOf(state.input.key.toLowerCase()) >= 0))
                                    .map((val, key) => {
                                        return <p>{val.subject_name}. <strong><a href={`/student/subjectlist/detail/${val.subject_id}`}>{val.subject_id}</a></strong></p>
                                    })
                            }
                        </div>
                    </div>
                </div>
            }
        </section>
    );
};

