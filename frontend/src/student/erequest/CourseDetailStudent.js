import { Add, Backspace, Create, Delete, Edit, Search } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, withRouter } from "react-router-dom";
import { MainTable } from "../../figures/components/MainTable";
import { TableCell, TableRow, Checkbox, IconButton } from "@mui/material";
// import "../style/account.css";


export function CourseDetailStudent(props) {

    const [state, setState] = useState({
        input: {
            key: ''
        },
        subject: [],
    })
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            input: {
                ...prevState.input,
                [id]: value
            }
        }))

    }
    const { id } = useParams()
    useEffect(() => {
        loadSingleData()
        loadSubjectlist()
    }, [id])

    const loadSingleData = () => {

        setSubmitting(true)
        fetch("/api/course/detail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: id })
        })
            .then((res) => { return res.json(); })
            .then((data) => {
                if (data.status) {
                    setState(prevState => ({
                        ...prevState,
                        input: data.data
                    }))
                    document.title = data.data.course_name
                }
                setSubmitting(false)
            });
    }

    const loadSubjectlist = () => {

        setSubmitting(true)
        fetch("/api/subject/list/fromcourse", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ course_id: id })
        })
            .then((res) => { return res.json(); })
            .then((data) => {
                if (data.status) {
                    setState(prevState => ({
                        ...prevState,
                        subject: data.subject
                    }))
                }
                setSubmitting(false)
            });
    }

    return (
        <section>
            <div className="container">
                <h2 className="mb-3"><strong>{state.input.course_name}</strong></h2>
                <p>
                    <IconButton title="Back" onClick={() => navigate(-1)}><Backspace /></IconButton>
                </p>
                <div className="card mb-3">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12 col-md-4">
                                <p className="mb-1"><small><strong>Course Id</strong></small></p>
                                <p>{state.input.course_id}</p>
                                <p className="mb-1"><small><strong>Name</strong></small></p>
                                <p>{state.input.course_name}</p>
                            </div>
                            <div className="col-12 col-md-4">
                                <p className="mb-1"><small><strong>Duration</strong></small></p>
                                <p>{state.input.course_duration}</p>
                                <p className="mb-1"><small><strong>Credit Points</strong></small></p>
                                <p>{state.input.course_credit_points}</p>
                            </div>
                            <div className="col-12 col-md-4">
                                <p className="mb-1"><small><strong>Fees</strong></small></p>
                                <p>{state.input.course_fees}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <h3 className="mb-3 mt-3">Subject List</h3>
                <div className="form-group mb-3">
                    <div className="input-group">
                        <input id="key" value={state.input.key} className="form-control" onChange={handleChange} placeholder="Search subject..." />
                        <span className="input-group-text"><Search /></span>
                    </div>

                </div>
                <div className="card mb-3">
                    <div className="card-body">
                        {
                            state.subject
                                .filter(data => (data.subject_name.toLowerCase().indexOf(state.input.key.toLowerCase()) >= 0))
                                .map((val, key) => {
                                    return <p>{val.subject_name}. <strong><a href={`/student/subjectlist/detail/${val.subject_id}`}>{val.subject_id}</a></strong></p>
                                })
                        }
                        {
                            (state.subject.length === 0) && <p>No data available.</p>
                        }
                    </div>
                </div>

            </div>

        </section>
    )

}
