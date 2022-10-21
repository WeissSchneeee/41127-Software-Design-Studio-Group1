import { CallOutlined, QuestionAnswer, QuestionMark, Search } from "@mui/icons-material";
import { Dialog, Icon } from "@mui/material";
import img from "./../../images/subject.jpg"
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, withRouter } from "react-router-dom";

export const RecommendationForm = () => {

    document.title = "Recommendation Student"

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

    const loadSingleData = () => {

        setSubmitting(true)
        fetch("/api/recommendation/detail", {
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
                }
                setSubmitting(false)
            });
    }

    const submit = (e) => {
        e.preventDefault()
        setSubmitting(true)
        fetch("/api/KNN",{
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
        <div className="container">
            <h2 className="mb-3">Recommendation</h2>
            <div className="row mt-5 align-items-center">
                <div className="col-12 col-lg-7">
                    <div className="card">
                        <div className="card-body">
                            <h1 class="display-5">Fill in your prefered subject features</h1>
                            <p class="lead">The subject features include the number of the quiz, individual and group assignment, exam you want your prefered subject has</p>
                        </div>
                        <div className="card-body">
                                <form onSubmit={submit}>
                                <div className="form-group row">
                                        <label className="col-12 col-md-4">Want to enrol in core subject or not</label>
                                        <div className="col-12 col-md-8">
                                        <select id="coreSubject" value={state.input.preference} className="form-control form-select" onChange={handleChange} required>
                                                <option value="">- select -</option>
                                                <option value="Yes">Yes</option>
                                                <option calue="No">No</option>
                                        </select>
                                        </div>
                                    </div>
                                <div className="form-group row">
                                        <label className="col-12 col-md-4">Number of Quiz</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="subjectQuiz" className="form-control" placeholder="Subject Quiz" onChange={handleChange} value={state.input.subjectQuiz}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Number of Individual Assignment</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="subjectIndiAssign" className="form-control" placeholder="Individual Assignment" onChange={handleChange} value={state.input.subjectIndiAssign}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Number of Group Assignment</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="subjectGroupAssign" className="form-control" placeholder="Group Assignment" onChange={handleChange} value={state.input.subjectGroupAssign}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Number of Exam</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="subjectExam" className="form-control" placeholder="Exam" onChange={handleChange} value={state.input.subjectExam}/>
                                        </div>
                                    </div>                                                                       
                                    <h1 class="display-5">Fill in your personal details and your preference</h1>
                                    <p class="lead">Please fill in your current grade(which year are you in your study plan) and select your preference</p>
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Pre requisite</label>
                                        <div className="col-12 col-md-8">
                                            <input type="text" id="subjectPreRS" className="form-control" placeholder="Study level" onChange={handleChange} value={state.input.studyLevel}/>
                                        </div>
                                    </div> 
                                    <div className="form-group row">
                                        <label className="col-12 col-md-4">Major</label>
                                        <div className="col-12 col-md-8">
                                        <select id="major" value={state.input.preference} className="form-control form-select" onChange={handleChange} required>
                                                <option value="">- select -</option>
                                                <option value="Data Analysis">Data Analysis</option>
                                                <option value="Cyber Security">Cyber Security</option>
                                                <option value="Software Development">Software Development</option>
                                                <option value="Machine Learning">Machine Learning</option>
                                                <option value="Real Time System">Real Time System</option>
                                                <option value="Embedded System">Embedded System</option>
                                        </select>
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
                <div className="col-12 col-lg-5">
                    <img src={img} className="img-fluid" />
                </div>
            </div>
                <div className="card my-5">
                    <div className="row">
                        <div className="card-body col-12 col-lg-5">
                            <p className="h4">
                                Have some question? request?    
                            </p>
                            <p className="mb-0"><a class="" href={`/student/erequest/create`} role="button"><QuestionAnswer /> Make an E-Request </a></p>
                        </div>
                    </div>
                </div>        
            </div>
    );
}