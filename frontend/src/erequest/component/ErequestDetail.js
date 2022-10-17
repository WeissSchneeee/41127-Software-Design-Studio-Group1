import { Add, Backspace, Create, Delete, Edit, Search } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, withRouter } from "react-router-dom";
import { getUserID } from "../../App";
// import "../style/account.css";


export function ErequestDetail(props) {

    const [state, setState] = useState({
        input: {},
    })
    const [submitting, setSubmitting] = useState(false)
    const [validFile, setValidFile] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const [userID, setUserID] = useState();
    useEffect(() => {
        try {
            getUserID().then(res => setUserID(res));
        } catch (error) {
            console.log(error);
        }
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        let accp = ["image/", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"]

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
    useEffect(() => {
        loadSingleData()
    }, [id])

    const loadSingleData = () => {

        setSubmitting(true)
        fetch("/api/erequest/detail", {
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
                    document.title = `Request ID ${data.data.request_id}`
                }
                setSubmitting(false)
            });
    }

    const handleDeleteBtn = () => {
        const conf = window.confirm(`Are you sure delete this item?`);
        if (conf) {
            setSubmitting(true)
            fetch("/api/erequest/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ list: [id] })
            })
                .then((res) => { return res.json(); })
                .then((data) => {
                    if (data.status) {
                        navigate(`/erequestlist`)
                    }
                    setSubmitting(false)
                });
        }
    }

    const submit = (e) => {
        e.preventDefault()
        setSubmitting(true)

        let formData = new FormData;
        formData.append("answer", state.input.answer);
        formData.append("answ_file", state.input.answ_file);
        formData.append("request_id", state.input.request_id);
        formData.append("answer_by", userID);
        fetch("/api/erequest/updateanswer", {
            method: "POST",
            body: formData
        })
            .then((res) => { return res.json(); })
            .then((data) => {
                setSubmitting(false)
                alert(data.message);
                if (data.status) {
                    window.location.reload()
                }
            });
        setSubmitting(false)
    }

    const loadFile = (id, whatfile) => {

        fetch(`/api/erequest/file?id=${id}&get=${whatfile}`, {
            method: "get",
        })
            .then((res) => {
                let filename = res.headers.get('content-disposition').split('filename=')[1];
                let blob = res.blob()
                return { filename: filename, data: blob }
            })
            .then((data) => {
                (data.data).then((val) => {
                    const filename = data.filename
                    const url = window.URL.createObjectURL(new Blob([val]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', filename); //or any other extension
                    document.body.appendChild(link);
                    link.click();
                })
            })
            .then((err) => {
                console.error(err)
                setLoading(false)
            });
    }

    return (
        <section>
            <div className="container">
                <h2 className="mb-3"><strong>{state.input.erequest_id} {state.input.erequest_name}</strong></h2>
                <p>
                    <IconButton title="Back" onClick={() => navigate(-1)}><Backspace /></IconButton>
                    <IconButton title="Update" onClick={() => navigate(`/erequestlist/update/${state.input.erequest_id}`)}><Edit /></IconButton>
                    <IconButton title="Delete" onClick={handleDeleteBtn}><Delete /></IconButton>
                </p>
                <div className="card mb-3">
                    <div className="card-body">
                        <h4>{state.input.request_id}</h4>
                        <div className="row">
                            <div className="col-12 col-lg-6">
                                <div className="d-flex flex-column">
                                    <div><small><strong>Question</strong></small></div>
                                    <div>{state.input.question}</div>
                                    <div><small><strong>File Upload</strong></small></div>
                                    <div>
                                        {
                                            (state.input.file) && <span className="btn badge bg-warning" onClick={() => loadFile(state.input.request_id, 'request')}>{state.input.file}</span>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-3">
                                <div className="d-flex flex-column">
                                    <div><small><strong>Ins By</strong></small></div>
                                    <div>{state.input.first_name} {state.input.last_name}</div>
                                    <div><small><strong>Ins Time</strong></small></div>
                                    <div>{state.input.ins_time}</div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-3">
                                <div className="d-flex flex-column">
                                    <div><small><strong>Status</strong></small></div>
                                    <div>

                                        {
                                            (state.input.status === 1) &&
                                            <span className="badge bg-warning">Waiting for Answer</span>
                                        }
                                        {
                                            (state.input.status === 2) &&
                                            <span className="badge bg-success">Answered</span>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card mb-3">
                    <div className="card-body">
                        <p><strong>Give Answer</strong></p>
                        <div className="row">
                            <div className="col-12 col-lg-6">
                                <form onSubmit={submit}>
                                    <div className="form-group">
                                        <label className="form-label">Answer</label>
                                        <textarea className="form-control" placeholder="type here..." onChange={handleChange} value={state.input.answer} required id="answer"></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">File to Upload</label>
                                        {
                                            (state.input.answer_file) && <div><span className="btn badge bg-success" onClick={() => loadFile(state.input.request_id, 'answer')}>{state.input.answer_file}</span></div>
                                        }
                                        <input className="form-control" type="file" onChange={handleChange} id="answ_file" />
                                    </div>

                                    <div className="mb-3"></div>
                                    <div className="center-side-button" style={{ float: "right" }} >
                                        <button type="submit" className="btn-lg me-2" disabled={submitting}>{submitting ? 'Submitting' : 'Submit'}</button>
                                    </div>
                                </form>
                            </div>
                            {
                                (state.input.status === 2) && <>
                                    <div className="col-12 col-lg-3">
                                        <div className="d-flex flex-column">
                                            <div><small><strong>Answered By</strong></small></div>
                                            <div>{state.input.answer_by}</div>
                                            <div><small><strong>Answer Time</strong></small></div>
                                            <div>{state.input.answer_time}</div>
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>

        </section>
    )


}
