import React from "react";

export const YearField = (title, data, id) => {
    return(
        <secion>
            <div className="row">
                <div className="col-sm-3">
                    <h6 className="mb-0">{title}</h6>
                </div>
                <input className="col-sm-9 text-secondary" readOnly={id==="session_id"} id={id} type="number" min="1900" max="2099" step="1" defaultValue={data} />
            </div>
            <hr/>
        </secion>
    );
};