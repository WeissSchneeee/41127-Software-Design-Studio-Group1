import React, { useEffect, useState } from "react";
import { useNavigate, useParams, withRouter } from "react-router-dom";

export function CreateAnAnnouncement(props) {
    
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
        if (id) loadSingleData()        
    }, [id])

    document.title = "Create An Announcement"
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
                    document.title = "Update " + data.data.announcement_title
                }
                setSubmitting(false)
            });
    }

    const submit = (e) => {
        e.preventDefault()
        setSubmitting(true)
        fetch(typeof (state.input.announcement_id) === 'undefined' ? "/api/announcement/create" : "/api/announcement/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(state.input)
        })
            .then((res) => { return res.json(); })
            .then((data) => {
                alert(data.message);
                if (data.status) {
                    closeForm()
                }
                setSubmitting(false)
            });

    }

    const closeForm = () => {
        navigate(-1)
    }
    return(<section>
<div className="container">
                <h2 className="mb-3">{typeof (state.input.announcement_id) === 'undefined' ? 'Create New Announcement' : `Update Announcement : ${state.input.announcement_title}`}</h2>
                <div className="row">
                    <div className="col-12 col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <form onSubmit={submit}>
                                <div className="form-group row">
                                        <label className="col-12 col-md-4">Announcement Title</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="announcement_title" className="form-control" placeholder="Title" onChange={handleChange} value={state.input.announcement_title} required />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Announcement ID</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="announcement_id" className="form-control" placeholder="ID" onChange={handleChange} value={state.input.announcement_id} disabled />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Announcement Description</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="announcement_description" className="form-control" placeholder="Description" onChange={handleChange} value={state.input.announcement_description} required/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Announcement Date</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="announcement_date" className="form-control" placeholder="Date" onChange={handleChange} value={state.input.announcement_date} required/>
                                        </div>
                                    </div>
                                    <div className="mb-3"></div>
                                    <div className="center-side-button" style={{ float: "right" }} >
                                        <button type="submit" className="btn-lg me-2" disabled={submitting}>{submitting ? 'Submitting' : 'Submit'}</button>
                                        <button type="button" className="btn-lg" onClick={closeForm} disabled={submitting}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

    </section>)
}