import React from "react";

export const NormalField = (title, data, id) => {
    return(
        <secion>
            <div className="row">
                <div className="col-sm-3">
                    <h6 className="mb-0">{title}</h6>
                </div>
                <input className="col-sm-9 text-secondary" readOnly={id==="session_id"} id={id} type="text" defaultValue={data} />
            </div>
            <hr/>
        </secion>
    );
};