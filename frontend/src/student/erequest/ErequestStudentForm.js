import React, { useEffect, useState } from "react";
import { useNavigate, useParams, withRouter } from "react-router-dom";
import { getUserID } from "../../App";
// import "../style/account.css";


export function ErequestStudentForm(props) {

    const [userID, setUserID] = useState();
    useEffect(() => {
        try {
            getUserID().then(res => setUserID(res));
        } catch (error) {
            console.log(error);
        }
    }, []);
    const [state, setState] = useState({
        last_input: {},
        input: {}
    })
    const [submitting, setSubmitting] = useState(false)
    const [validFile, setValidFile] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { id, value } = e.target;
        let accp = ["image/", "application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","text/plain"]

        //filter file input        
        if ((e.target.type === "file")) {
            let includ = false;
            accp.map(item => {
                if (e.target.files[0].type.includes(item)) {
                    includ = true;
                    setValidFile(true);
                }
            })
            if (includ === false) {
                e.target.value = ''
                alert("Only image, pdf, word and txt are allowed!");
                return
            } else if (e.target.files[0].size > 2097152) {
                e.target.value = ''
                alert("Filesize max is 2MB.");
                return

            }
        }

        setState(prevState => ({
            ...prevState,
            input: {
                ...prevState.input,
                [id]: (e.target.type === 'file') ? e.target.files[0] : value
            }
        }))
    }


    const { id } = useParams()

    document.title = "E Request"

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
                    data.data.last_id = data.data.request_id
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

        let formData = new FormData;
        formData.append("question", state.input.question);
        formData.append("file", state.input.file);
        formData.append("request_id", state.input.request_id);
        formData.append("student_id", userID);

        fetch(typeof (state.last_input.request_id) === 'undefined' ? "/api/erequest/create" : "/api/erequest/update", {
            method: "POST",
            body: formData
        })
            .then((res) => { return res.json(); })
            .then((data) => {
                setSubmitting(false)
                alert(data.message);
                if (data.status) {
                    closeForm()
                }
            });
        
            setSubmitting(false)

    }

    const closeForm = () => {
        navigate('/erequest')
    }

    return (
        <section>
            <div className="container">
                <h1 className="mb-3">{typeof (state.last_input.request_id) === 'undefined' ? 'Create New Request' : `Update Request : ${state.last_input.request_id}`}</h1>
                <div className="row">
                    <div className="col-12 col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <form onSubmit={submit}>
                                    <div className="form-group">
                                        <label className="form-label">Something you want to ask</label>
                                        <textarea className="form-control" placeholder="type here..." onChange={handleChange} value={state.input.question} required id="question"></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">File to Upload</label>
                                        <input className="form-control" type="file" onChange={handleChange} id="file" />
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
