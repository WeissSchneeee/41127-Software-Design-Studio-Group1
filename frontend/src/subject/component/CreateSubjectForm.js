import React, { useEffect, useState } from "react";
import { useNavigate, useParams, withRouter } from "react-router-dom";
// import "../style/account.css";


export function CreateSubjectForm(props) {

    const [state, setState] = useState({
        last_input: {},
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
                    data.data.last_id = data.data.subject_id
                    setState(prevState => ({
                        ...prevState,
                        input: data.data,
                        last_input: data.data
                    }))
                    document.title = "Update Subject : " + data.data.subject_name
                }
                setSubmitting(false)
            });
    }

    const submit = (e) => {
        e.preventDefault()
        setSubmitting(true)
        fetch(typeof (state.last_input.subject_id) === 'undefined' ? "/api/subject/create" : "/api/subject/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(state.input)
        })
            .then((res) => { return res.json(); })
            .then((data) => {
                setSubmitting(false)
                alert(data.message);
                if (data.status) {
                    closeForm()
                }
            });

    }

    const closeForm = () => {
        navigate(-1)
    }

    return (
        <section>
            <div className="container">
                <h2 className="mb-3">{typeof (state.last_input.subject_id) === 'undefined' ? 'Create New Subject' : `Update Subject : ${state.last_input.subject_name}`}</h2>
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
                                            <input type="text" id="pre_requisites" className="form-control" placeholder="Pre Requisites" onChange={handleChange} value={state.input.pre_requisites}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Core Subject</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="core_subjects" className="form-control" placeholder="Core Subject" onChange={handleChange} value={state.input.core_subjects}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Anti-Requisites</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="anti_requisites" className="form-control" placeholder="Anti-Requisites" onChange={handleChange} value={state.input.anti_requisites} />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Co-Requisites</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="co_requisites" className="form-control" placeholder="Co-Requisites" onChange={handleChange} value={state.input.co_requisites}/>
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
                                            <textarea type="text" id="subject_descriptions" className="form-control" placeholder="Descriptions" onChange={handleChange} value={state.input.subject_descriptions} /*required rows={5}*//>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Level</label>
                                        <div className="col-12 col-md-8">
                                            <select id="subject_level" value={state.input.subject_level} className="form-control form-select" onChange={handleChange} required>
                                                <option value="">- select -</option>
                                                <option value="undergraduate">Undergraduate</option>
                                                <option value="postgraduate">Postgraduate</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Electives</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="electives" className="form-control" placeholder="Electives" onChange={handleChange} value={state.input.electives}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Fees</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="subject_fees" className="form-control" placeholder="Fees" onChange={handleChange} value={state.input.subject_fees}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Number of Quiz</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="subject_quiz" className="form-control" placeholder="subjectQuiz" onChange={handleChange} value={state.input.subject_quiz}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Number of Individual Assignment</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="subject_indiassign" className="form-control" placeholder="Individual Assignment" onChange={handleChange} value={state.input.subject_indiassign}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Number of Group Assignment</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="subject_groupassign" className="form-control" placeholder="Group Assignment" onChange={handleChange} value={state.input.subject_groupassign}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Number of Exam</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="subject_exam" className="form-control" placeholder="Exam" onChange={handleChange} value={state.input.subject_exam}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Number of Needed Pre Requisites Subject</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="subject_preq" className="form-control" placeholder="Pre Requisites Subject" onChange={handleChange} value={state.input.subject_preq}/>
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
