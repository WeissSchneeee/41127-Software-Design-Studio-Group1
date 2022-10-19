import React from "react";

export const DateField = (title, data, id) => {
    return(
        <secion>
            <div className="row">
                <div className="col-sm-3">
                    <h6 className="mb-0">{title}</h6>
                </div>
                <input className="col-sm-9 text-secondary" id={id} type="date" defaultValue={String(data).substring(0, 10)} />
            </div>
            <hr/>
        </secion>
    );
}