import React, { useEffect, useState } from "react";
import { useNavigate, useParams, withRouter } from "react-router-dom";
// import "../style/account.css";


export function CreateCourseForm(props) {

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

    document.title = "Create Course"
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
                    document.title = "Update " + data.data.course_name
                }
                setSubmitting(false)
            });
    }

    const submit = (e) => {
        e.preventDefault()
        setSubmitting(true)
        fetch(typeof (state.input.course_id) === 'undefined' ? "/api/course/create" : "/api/course/update", {
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

    return (
        <section>
            <div className="container">
                <h2 className="mb-3">{typeof (state.input.course_id) === 'undefined' ? 'Create New Course' : `Update Course : ${state.input.course_name}`}</h2>
                <div className="row">
                    <div className="col-12 col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <form onSubmit={submit}>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Course ID</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="course_id" className="form-control" placeholder="ID" onChange={handleChange} value={state.input.course_id} disabled />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4"> Name</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="course_name" className="form-control" placeholder="Name" onChange={handleChange} value={state.input.course_name} />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4"> Duration</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="course_duration" className="form-control" placeholder="Duration" onChange={handleChange} value={state.input.course_duration} />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4"> Credit Points</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="course_credit_points" className="form-control" placeholder="Credit Points" onChange={handleChange} value={state.input.course_credit_points} />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Fees</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="course_fees" className="form-control" placeholder="Fees" onChange={handleChange} value={state.input.course_fees} />
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

        </section>
    )

}
