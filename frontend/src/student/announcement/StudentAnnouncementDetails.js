import { Add, Backspace, Create, Delete, Edit, Search } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, withRouter } from "react-router-dom";
// import "../style/account.css";


export function StudentAnnouncementDetails(props) {

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
        fetch("/api/announcement/detail", {
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
                    //document.title = data.data.subject_id + ' ' + data.data.subject_name
                }
                setSubmitting(false)
            });
    }

    // const handleDeleteBtn = () => {
    //     const conf = window.confirm(`Are you sure delete this item?`);
    //     if (conf) {
    //         setSubmitting(true)
    //         fetch("/api/announcement/delete", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify({ list: [id] })
    //         })
    //             .then((res) => { return res.json(); })
    //             .then((data) => {
    //                 if (data.status) {
    //                     navigate(`/announcementlist`)
    //                 }
    //                 setSubmitting(false)
    //             });
    //     }
    // }

    return (
        <section>
            <div className="container">
                <h2 className="mb-3"><strong>{state.input.subject_id} {state.input.subject_name}</strong></h2>
                <p>
                    <IconButton title="Back" onClick={() => navigate(-1)}><Backspace /></IconButton>
                    {/* <IconButton title="Update" onClick={() => navigate(`/announcementlist/update/${state.input.announcement_id}`)}><Edit /></IconButton>
                    <IconButton title="Delete" onClick={handleDeleteBtn}><Delete /></IconButton> */}
                </p>
                <div className="card mb-3">
                    <div className="card-body">
                        {/* <h5><strong>Announcement ID</strong></h5>
                        <p>{state.input.announcement_id}</p> */}
                        <h5><strong>Announcement Title</strong></h5>
                        <p>{state.input.announcement_title}</p>
                        <h5><strong>Announcement Description</strong></h5>
                        <p>{state.input.announcement_description}</p>
                        <h5><strong>Announcement Date</strong></h5>
                        <p>{state.input.announcement_date}</p>
                    </div>
                </div>
            </div>

        </section>
    )
    

}
