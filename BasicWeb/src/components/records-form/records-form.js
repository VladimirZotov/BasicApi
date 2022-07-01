import React, { useEffect, useState } from 'react';
import './records-form.css'
import { Link } from "react-router-dom";
import ApiService from "../../services/api-service";
import Spinner from "../spinner/spinner";

export default () => {

    let cancelled = false;

    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState("");
    const [records, setRecords] = useState([]);
    const [value, setValue] = useState("");
    const [submit, setSubmit] = useState(0);

    const handleAddRecord = (e) => {
        if (code && value) {
            e.preventDefault();
            setRecords([...records, { code, value }]);
            setCode("");
            setValue("");
        }
    }

    useEffect(() => {

        if (records.length > 0 && submit > 0) {
            !cancelled && setLoading(true);

            ApiService.postRecords(records)
            .then(({ data }) => {
                !cancelled && setLoading(false);
            })
            .catch(error => {
                !cancelled && setLoading(false);
            });
        }

        return () => cancelled = true
    }, [submit]);

    if (loading) {
        return <Spinner />;
    }

    const recordsList = records.map(record => {
        return <div className="row mb-2">
            <div className="form-group col-md-12">
                <div className="row pl-3">
                    <div className="col-md-4">
                        <input type="text" className="form-control" disabled={true} value={record['code']}  />
                    </div>
                    <div className="col-md-4">
                        <input type="text" className="form-control" disabled={true} value={record['value']} />
                    </div>
                </div>
            </div>

        </div>
    })

    return <>
        <form>
            {recordsList}
            <div className="row">
                <div className="form-group col-md-12">
                    <div className="row pl-3">
                        <div className="col-md-4">
                            <input type="text" className="form-control" placeholder="Code" value={code} onChange={(e) => { setCode(e.target.value) }} />
                        </div>
                        <div className="col-md-4">
                            <input type="text" className="form-control" placeholder="Value" value={value} onChange={(e) => { setValue(e.target.value) }} />
                        </div>
                        <div className="col-md-4">
                            <button type="button" className="btn btn-outline-primary" onClick={handleAddRecord} >+</button>
                            <button type="button" className="btn btn-success ms-3" onClick={(e) => { e.preventDefault(); setSubmit(submit + 1)}} >Add Records</button>
                        </div>
                    </div>
                </div>
                
            </div>
        </form>
    </>;

};