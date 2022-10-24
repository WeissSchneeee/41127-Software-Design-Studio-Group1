import { Backspace } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


export function SubjectDetail(props) {

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

    const handleDeleteBtn = () => {
        const conf = window.confirm(`Are you sure delete this item?`);
        if (conf) {
            setSubmitting(true)
            fetch("/api/subject/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ list: [id] })
            })
                .then((res) => { return res.json(); })
                .then((data) => {
                    if (data.status) {
                        navigate(`/subjectlist`)
                    }
                    setSubmitting(false)
                });
        }
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
                        <h5><strong>Credit Point</strong></h5>
                        <p>{state.input.scredit_points}</p>
                        <h5><strong>Subject Level</strong></h5>
                        <p>{state.input.subject_level}</p>
                        <h5><strong>Anti Requisites</strong></h5>
                        <p>{state.input.anti_requisites}</p>
                        <h5><strong>Descriptions</strong></h5>
                        <p>{state.input.subject_descriptions}</p>
                    </div>
                </div>
            </div>

        </section>
    )
    

}
