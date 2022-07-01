import React from 'react';
import RecordsList from "../components/records-list/records-list";
import RecordsForm from "../components/records-form/records-form";

export default () => {
    return <>
        <main id="view_records">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-8 mt-5 mx-auto">
                        <RecordsForm />
                    </div>
                    <div className="col-md-8 mt-5 mx-auto">
                        <RecordsList/>
                    </div>
                </div>
            </div>
        </main>
    </>
};