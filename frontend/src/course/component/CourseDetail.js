import { Add, Backspace, Create, Delete, Edit, Search } from "@mui/icons-material";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, withRouter } from "react-router-dom";
import { MainTable } from "../../figures/components/MainTable";
import { TableCell, TableRow, Checkbox, IconButton, Dialog, DialogTitle, DialogActions, Button, DialogContent } from "@mui/material";
// import "../style/account.css";


export function CourseDetail(props) {

    const [state, setState] = useState({
        data: {},
        input: { key: '' },
        subjects_course: [],
        subject: [],
        selected: [],
    })
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false);
    const [showConfirmAction, setShowConfirmAction] = useState(false);
    const [action, setAction] = useState(false);
    const [openAlertDeleteSubject, setOpenAlertDeleteSubject] = useState(false)
    const [openAlertDelete, setOpenAlertDelete] = useState(false)
    const myref = useRef([])

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
        fetch("/api/course/detail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: id })
        })
            .then((res) => { return res.json(); })
            .then((data) => {
                document.title = data.data.course_name
                if (data.status) {
                    setState(prevState => ({
                        ...prevState,
                        data: data.data
                    }))
                }
                document.title = data.data.course_name
                setSubmitting(false)
                loadSubjectscourse(data.data.course_id)
            });
    }

    const loadSubjectlist = () => {

        setSubmitting(true)
        fetch("/api/subject/list", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then((res) => { return res.json(); })
            .then((data) => {
                if (data.status) {
                    setState(prevState => ({
                        ...prevState,
                        subject: data.subject
                    }))
                }
                setSubmitting(false)
            });
    }



    const loadSubjectscourse = (id) => {

        setSubmitting(true)
        fetch("/api/subject/list/fromcourse", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ course_id: id })
        })
            .then((res) => { return res.json(); })
            .then((data) => {
                if (data.status) {
                    setState(prevState => ({
                        ...prevState,
                        subjects_course: data.subject
                    }))
                }
                setSubmitting(false)
            });
    }
    const SubjectTabe = () => {
        const columns = [
            {
                id: 'subject_id',
                numeric: false,
                disablePadding: true,
                label: 'Subject ID',
            },
            {
                id: 'subject_name',
                numeric: false,
                disablePadding: false,
                label: 'Name',
            },
            {
                id: 'scredit_points',
                numeric: false,
                disablePadding: false,
                label: 'Credit Point',
            },
            {
                id: 'subjectFees',
                numeric: true,
                disablePadding: false,
                label: 'Fees',
            },
            {
                id: 'edit',
                numeric: true,
                disablePadding: false,
                label: 'Action',
            },
        ]
        const handleCreate = _ => {
            loadSubjectlist()
            setShowModal(true)
        };


        const handleDeleteSubject = (selected) => {
            setOpenAlertDeleteSubject(true)
            myref.current = selected
        }

        return (
            MainTable(columns, state.subjects_course, cellFormat, "Subject List", "New Subject", handleCreate, "Delete Subject", handleDeleteSubject)
        );
    };
    const cellFormat = (handleClick, isSelected, index, row) => {
        const isItemSelected = isSelected(row.subject_id);
        const labelId = `enhanced-table-checkbox-${index}`;
        return (
            <TableRow
                hover
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                key={row.subject_id}
                selected={isItemSelected}
            >
                <TableCell className="table-cell" padding="checkbox">
                    <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                            'aria-labelledby': labelId,
                        }}
                        onClick={(event) => handleClick(event, row.subject_id)}
                    />
                </TableCell>
                <TableCell
                    className="table-cell"
                    component="th"
                    id={labelId}
                    scope="row"
                    padding="none"
                >
                    {row.subject_id}
                </TableCell>
                <TableCell className="table-cell" align="center">{row.subject_name}</TableCell>
                <TableCell className="table-cell" align="center">{row.scredit_points}</TableCell>
                <TableCell className="table-cell" align="center">{row.subjectFees}</TableCell>
                <TableCell className="table-cell" align="center"><IconButton onClick={() => navigate(`/subjectlist/detail/${row.subject_id}`)}><Search /></IconButton></TableCell>
            </TableRow>
        );
    };



    const submitDeleteSubject = () => {
        fetch("/api/course/deletesubject", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                list: myref.current,
                course_id: state.data.course_id
            })
        })
            .then((res) => { return res.json(); })
            .then((data) => {
                if (data.status) {
                }
                loadSubjectscourse()
                setLoading(false)
                setOpenAlertDeleteSubject(false)

            });
    }

    const handleDeleteBtn = () => {
        setOpenAlertDelete(true)
    }

    const submitDelete = () => {
        fetch("/api/course/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                list: [state.data.course_id]
            })
        })
            .then((res) => { return res.json(); })
            .then((data) => {
                setLoading(false)
                navigate(`/courselist`)
            });
    }

    const [onAddSubject, setOnAddSubject] = useState(false)
    const submitAddSubject = (e) => {
        setOnAddSubject(true)
        const id = e.currentTarget.getAttribute('data-id');
        console.log('id', id)
        fetch("/api/course/addsubject", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ course_id: state.data.course_id, subject_id: id })
        })
            .then((res) => { return res.json(); })
            .then((data) => {
                setOnAddSubject(false)
                loadSubjectscourse(state.data.course_id)
                setShowModal(false)
            });
    }

    return (

        <section>
            <div className={`modal fade ${showModal ? 'show' : ''}`} id="modal-detail" style={showModal ? { display: 'block' } : { display: 'none' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Add Subject to List</h4>
                        </div>
                        <div className="modal-body">
                            <div className="form-group mb-3">
                                <div className="input-group">
                                    <input id="key" value={state.input.key} className="form-control" onChange={handleChange} placeholder="Search subject..." />
                                    <span className="input-group-text"><Search /></span>
                                </div>

                            </div>
                            <div className="card mb-3">
                                <div className="card-body">
                                    {
                                        state.subject
                                            .filter(subject => (subject.subject_name.toLowerCase().indexOf(state.input.key.toLowerCase()) >= 0))
                                            .map((val, key) => {
                                                return <div className="d-flex">
                                                    <div>
                                                        {val.subject_name}. <strong><a href={`/student/subjectlist/detail/${val.subject_id}`}>{val.subject_id}</a></strong>
                                                    </div>
                                                    <div className="me-0 ms-auto">
                                                        <IconButton disable={onAddSubject} data-id={val.subject_id} onClick={submitAddSubject}><Add /></IconButton>
                                                    </div>
                                                </div>
                                            })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-warning ms-2" data-dismiss="modal" onClick={() => { setShowConfirmAction(false); setShowModal(false) }}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <h2 className="mb-3">Detail of : <strong>{state.data.course_name}</strong></h2>
                <p>
                    <IconButton title="Back" onClick={() => navigate(-1)}><Backspace /></IconButton>
                    <IconButton title="Update" onClick={() => navigate(`/courselist/update/${state.data.course_id}`)}><Edit /></IconButton>
                    <IconButton title="Delete" onClick={handleDeleteBtn}><Delete /></IconButton>
                </p>
                <div className="card mb-3">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12 col-md-4">
                                <p className="mb-1"><small><strong>Course Id</strong></small></p>
                                <p>{state.data.course_id}</p>
                                <p className="mb-1"><small><strong>Name</strong></small></p>
                                <p>{state.data.course_name}</p>
                            </div>
                            <div className="col-12 col-md-4">
                                <p className="mb-1"><small><strong>Duration</strong></small></p>
                                <p>{state.data.course_duration}</p>
                                <p className="mb-1"><small><strong>Credit Points</strong></small></p>
                                <p>{state.data.course_credit_points}</p>
                            </div>
                            <div className="col-12 col-md-4">
                                <p className="mb-1"><small><strong>Fees</strong></small></p>
                                <p>{state.data.course_fees}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card mb-3">
                    <div className="card-body">
                        {
                            loading ? <div className="container">Loading data, please wait...</div> : <SubjectTabe />
                        }
                    </div>
                </div>

            </div>

            <Dialog open={openAlertDeleteSubject} >
                <DialogTitle>Delete Confirmation</DialogTitle>
                <DialogContent>
                    Are you sure want to delete selected subject from list?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { myref.current = []; setOpenAlertDeleteSubject(false) }}>Cancel</Button>
                    <Button autuFocus onClick={submitDeleteSubject} >Yes, Delete</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openAlertDelete} >
                <DialogTitle>Delete Confirmation</DialogTitle>
                <DialogContent>
                    Are you sure want to delete this course?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenAlertDelete(false) }}>Cancel</Button>
                    <Button autuFocus onClick={submitDelete} >Yes, Delete</Button>
                </DialogActions>
            </Dialog>

        </section>
    )

}
