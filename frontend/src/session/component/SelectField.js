import React from "react";

export const SelectField = (title) => {
    return(
        <secion>
            <div className="row">
                <div className="col-sm-3">
                    <h6 className="mb-0" style={{marginTop: "30px"}}>{title}</h6>
                </div>
                <div className="form-container" style={{width: "75%", padding: "0", margin: "0"}}>
                    <div className="form-floating">
                        <select id="sessionTypeSelection" >
                            <optgroup label="Session Types">
                                <option value="Autumn">Autumn</option>
                                <option value="Spring">Spring</option>
                                <option value="Summer">Summer</option>
                            </optgroup>
                        </select>
                    </div>
                </div>
            </div>
            <hr/>
        </secion>
    );
};