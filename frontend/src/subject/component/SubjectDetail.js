import { Add, Backspace, Create, Delete, Edit } from "@mui/icons-material";
import { Backdrop, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, withRouter } from "react-router-dom";
// import "../style/account.css";


export function SubjectDetail(props) {

    const [state, setState] = useState({
        input: {}
    })
    const [submitting, setSubmitting] = useState(false)
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
    }, [id])

    const loadSingleData = () => {

        setSubmitting(true)
        fetch("/api/subject/detail", {
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
                    document.title = data.data.subject_name
                }
                setSubmitting(false)
            });
    }
    
    const handleDeleteBtn = () => {

    }

    return (
        <section>
            <div className="container">
                <h2 className="mb-3">Detail of : <strong>{state.input.subject_name}</strong></h2>
                <p>
                    <IconButton title="Back" onClick={() => navigate(`/subjectlist`)}><Backspace/></IconButton> 
                    <IconButton title="Update" onClick={() => navigate(`/subjectlist/update/${state.input.subject_id}`)}><Edit/></IconButton>
                    <IconButton title="Delete" onClick={handleDeleteBtn}><Delete/></IconButton>
                </p>
                <div className="card mb-3">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12 col-md-4">
                                <p className="mb-1"><small><strong>Subject Id</strong></small></p>
                                <p>{state.input.subject_id}</p>
                                <p className="mb-1"><small><strong>Name</strong></small></p>
                                <p>{state.input.subject_name}</p>
                            </div>
                            <div className="col-12 col-md-4">
                                {/* <p className="mb-1"><small><strong>Duration</strong></small></p>
                                <p>{state.input.subject_duration}</p> */}
                                <p className="mb-1"><small><strong>Credit Points</strong></small></p>
                                <p>{state.input.subject_credit_points}</p>
                            </div>
                            <div className="col-12 col-md-4">
                                <p className="mb-1"><small><strong>Fees</strong></small></p>
                                <p>{state.input.subject_fees}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <h2 className="mb-3">Subject List</h2>
                <p>
                    <IconButton title="Add Subject" onClick={() => navigate(`/subjectlist/${state.input.course_id}/add`)}><Add/></IconButton>
                </p>
                <div className="card mb-3">
                    <div className="card-body">
                    </div>
                </div>

            </div>

        </section>
    )

}
