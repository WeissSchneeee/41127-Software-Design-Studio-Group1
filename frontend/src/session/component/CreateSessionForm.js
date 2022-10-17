import React from "react";

export const CreateSessionForm = (sessions, setSessions) => {
    const handleKeypress = e => {
        if(e.key === "Enter"){
            createSession();
        }
    };
    const createSession = _ => {
        try{
            const sessionType = document.getElementById("sessionTypeSelection").value;
            const sessionYear = document.getElementById("year").value;
            const censusDate = document.getElementById("censusdate").value;
            if(!(sessionYear && censusDate))
                return alert("Please fill in all of the non-optional data!");
            fetch("/api/createsession", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sessionType: sessionType,
                    sessionYear: sessionYear,
                    censusDate: censusDate
                })
            })
                .then((res) => { return res.json(); } )
                .then((data) => {
                    alert(data.message);
                    if(data.status){
                        const newList = [...sessions];
                        newList.push(data.session);
                        setSessions(newList);
                        closeForm();
                    }
                });
        }catch(error){
            console.log(error);
        }
    };

    return(
        <section id="createSessionForm" className="form-popup center form-container">
            <h2>CREATE NEW SESSION</h2>
            <div>
                <div className="form-floating left-field">
                    <select id="sessionTypeSelection" >
                        <optgroup label="Session Types">
                            <option value="Autumn">Autumn</option>
                            <option value="Spring">Spring</option>
                            <option value="Summer">Summer</option>
                        </optgroup>
                    </select>
                </div>
                <div className="form-floating right-field">
                    <input id="year" className="form-control" type="number" min="1900" max="2099" step="1" defaultValue={new Date().getFullYear() + 1} required onKeyPress={handleKeypress} />
                    <label >Session Year</label>
                </div>
            </div>
            <div className="form-floating">
                <input type="date" id="censusdate" className="form-control" />
                <label >Census Date</label>
            </div>
            <div className="center-side-button" style={{float: "right"}} >
                <button type="button" className="btn-lg" onClick={createSession}>Create</button>
                <button type="button" className="btn-lg" onClick={closeForm} >Cancel</button>
            </div>
        </section>
    );
};

const closeForm = _ => {
    document.getElementById("createSessionForm").style.display = "none";
};
