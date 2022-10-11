import React, { useEffect, useState } from "react";
import { getUserID } from "../../App";
import { useNavigate } from "react-router-dom";
import { Search } from "@mui/icons-material";

export const ErequestStudent = (props) => {
    const [userID, setUserID] = useState();
    const [state, setState] = useState({
        data: [],
        input: { key: '' },
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        try {
            getUserID().then(res => setUserID(res));
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        try {
            if (userID != null && userID !== "none") loadData();
        } catch (error) {
            console.log(error);
        }
    }, [userID]);

    if (userID === "none") return window.location.href = "/signin";

    document.title = "My E Request"

    const loadData = () => {
        setLoading(true)
        fetch("/api/erequest/list", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userID: userID
            })
        })
            .then((res) => { return res.json(); })
            .then((data) => {
                if (data.status) {
                    setState(prevState => ({
                        ...prevState,
                        data: data.request
                    }))
                }
                setLoading(false)

            })
            .then((err) => {
                setLoading(false)
            });
    }

    const handleChange = (e) => {
        const { id, value } = e.target;
        setState(prevState => ({
            ...prevState,
            input: {
                ...prevState.input,
                [id]: value
            }
        }))
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
            {
                loading && <div className="container">Loading data, please wait...</div>
            }
            {
                !loading && <div className="container">
                    <h1 className="mb-3">My E Request List</h1>
                    <div className="form-group mb-3">
                        <div className="input-group">
                            <input id="key" value={state.input.key} className="form-control" onChange={handleChange} placeholder="Search request..." />
                            <span className="input-group-text"><Search /></span>
                        </div>

                    </div>
                    {
                        state.data
                            .filter(request => (request.question.toLowerCase().indexOf(state.input.key.toLowerCase()) >= 0))
                            .map((val, key) => {
                                return <div className="card mb-3">
                                    <div className="card-body">
                                        <h4>{val.request_id}</h4>
                                        <div className="row">
                                            <div className="col-12 col-lg-6">
                                                <div className="d-flex flex-column">
                                                    <div><small><strong>Question</strong></small></div>
                                                    <div>{val.question}</div>
                                                    <div><small><strong>File Upload</strong></small></div>
                                                    <div><span className="btn badge bg-warning" onClick={() => loadFile(val.request_id, 'request')}>{val.file}</span></div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-lg-3">
                                                <div className="d-flex flex-column">
                                                    <div><small><strong>Ins By</strong></small></div>
                                                    <div>{val.first_name} {val.last_name}</div>
                                                    <div><small><strong>Ins Time</strong></small></div>
                                                    <div>{val.ins_time}</div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-lg-3">
                                                <div className="d-flex flex-column">
                                                    <div><small><strong>Status</strong></small></div>
                                                    <div>

                                                        {
                                                            (val.status === 1) &&
                                                            <span className="badge bg-warning">Waiting for Answer</span>
                                                        }
                                                        {
                                                            (val.status === 2) &&
                                                            <span className="badge bg-success">Answered</span>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            (val.status === 2) && <>
                                                <div className="row">
                                                    <div className="col-12 col-lg-6">
                                                        <div className="d-flex flex-column">
                                                            <div><small><strong>Answer</strong></small></div>
                                                            <div>{val.answer}</div>
                                                            <div><small><strong>File Upload</strong></small></div>
                                                            <div><span className="btn badge bg-success" onClick={() => loadFile(val.request_id, 'answer')}>{val.answer_file}</span></div>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 col-lg-3">
                                                        <div className="d-flex flex-column">
                                                            <div><small><strong>Answered By</strong></small></div>
                                                            <div>{val.answer_by}</div>
                                                            <div><small><strong>Answer Time</strong></small></div>
                                                            <div>{val.answer_time}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        }

                                    </div>
                                </div>
                            })
                    }
                </div>
            }
        </section >
    );
};

