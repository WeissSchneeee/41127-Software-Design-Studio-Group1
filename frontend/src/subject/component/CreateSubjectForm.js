import React, { useEffect, useState } from "react";
import { useNavigate, useParams, withRouter } from "react-router-dom";
// import "../style/account.css";


export function CreateSubjectForm(props) {

    const [state, setState] = useState({
        course: {},
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
    const { course, id } = useParams()

    useEffect(() => {
        loadCourseData()
    }, [])
    useEffect(() => {
        if (id) loadSingleData()
    }, [id])


    const loadCourseData = () => {

        setSubmitting(true)
        fetch("/api/course/detail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: course })
        })
            .then((res) => { return res.json(); })
            .then((data) => {
                if (data.status) {
                    setState(prevState => ({
                        ...prevState,
                        course: data.data
                    }))
                    document.title = "Create New Subject of " + data.data.course_name
                }
                setSubmitting(false)
            });
    }

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
                    document.title = "Update Subject : " + data.data.subject_name
                }
                setSubmitting(false)
            });
    }

    const submit = (e) => {
        e.preventDefault()
        setSubmitting(true)
        fetch(typeof (id) === 'undefined' ? "/api/subject/create" : "/api/subject/update", {
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
                <h2 className="mb-3">{typeof (state.input.subject_id) === 'undefined' ? 'Create New Subject' : `Update Subject : ${state.input.subject_name}`}</h2>
                <div className="row">
                    <div className="col-12 col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <form onSubmit={submit}>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Subject ID</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="subject_id" className="form-control" placeholder="ID" onChange={handleChange} value={state.input.subject_id} required />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Name</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="subject_name" className="form-control" placeholder="Name" onChange={handleChange} value={state.input.subject_name} required/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Pre-Requisites</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="pre_requisites" className="form-control" placeholder="Pre Requisites" onChange={handleChange} value={state.input.pre_requisites} required/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Core Subject</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="core_subjects" className="form-control" placeholder="Core Subject" onChange={handleChange} value={state.input.core_subjects} required/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Anti-Requisites</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="anti_requisites" className="form-control" placeholder="Anti-Requisites" onChange={handleChange} value={state.input.anti_requisites} required/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Co-Requisites</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="co_requisites" className="form-control" placeholder="Co-Requisites" onChange={handleChange} value={state.input.co_requisites} required/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Credit Points</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="scredit_points" className="form-control" placeholder="Credit Points" onChange={handleChange} value={state.input.scredit_points} required/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Descriptions</label>
                                        <div className="col-12 col-md-8">
                                            <textarea type="text" id="subject_descriptions" className="form-control" placeholder="Descriptions" onChange={handleChange} value={state.input.subject_descriptions} required rows={5}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Level</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="subject_level" className="form-control" placeholder="Level" onChange={handleChange} value={state.input.subject_level} required/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Electives</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="electives" className="form-control" placeholder="Electives" onChange={handleChange} value={state.input.electives} required/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Fees</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="subjectFees" className="form-control" placeholder="Fees" onChange={handleChange} value={state.input.subjectFees} required/>
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
                    <div className="col-12 col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <p className="mb-1"><small><strong>Course Id</strong></small></p>
                                <p>{state.course.course_id}</p>
                                <p className="mb-1"><small><strong>Name</strong></small></p>
                                <p>{state.course.course_name}</p>
                                <p className="mb-1"><small><strong>Duration</strong></small></p>
                                <p>{state.course.course_duration}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </section>
    )

}
