import { Add, Backspace, Create, Delete, Edit, Search } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, withRouter } from "react-router-dom";
// import "../style/account.css";


export function SubjectDetailStudent(props) {

    const [state, setState] = useState({
        input: {},
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
                    document.title = data.data.subject_id + ' ' + data.data.subject_name
                }
                setSubmitting(false)
            });
    }

    return (
        <section>
            <div className="container">
                <h2 className="mb-3"><strong>{state.input.subject_id} {state.input.subject_name}</strong></h2>
                <p>
                    <IconButton title="Back" onClick={() => navigate(-1)}><Backspace /></IconButton>
                </p>

                <div className="card mb-3">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12 col-md-4">
                                <p className="mb-1"><small><strong>Credit Point</strong></small></p>
                                <p>{state.input.scredit_points}</p>
                            </div>
                            <div className="col-12 col-md-4">
                                <p className="mb-1"><small><strong>Subject Level</strong></small></p>
                                <p>{state.input.subject_level}</p>
                            </div>
                            <div className="col-12 col-md-4">
                                <p className="mb-1"><small><strong>Anti Requisites</strong></small></p>
                                <p>{state.input.anti_requisites}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card mb-3">
                    <div className="card-body">
                        <p className="mb-1"><small><strong>Descriptions</strong></small></p>
                        <p>{state.input.subject_descriptions}</p>
                    </div>
                </div>
            </div>

        </section>
    )


}
