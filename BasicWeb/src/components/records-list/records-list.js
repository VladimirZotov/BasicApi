import React, { useEffect, useState } from 'react';
import './records-list.css'
import { Link } from "react-router-dom";
import ApiService from "../../services/api-service";
import DataTable from 'react-data-table-component';
import Spinner from "../spinner/spinner";

export default () => {

    let cancelled = false;

    const [loading, setLoading] = useState(false);
    const [sortBy, setSortBy] = useState("code");
    const [searchBy, setSearchBy] = useState("code");
    const [searchString, setSearchString] = useState("");
    const [dir, setDir] = useState("asc");
    const [totalNumber, setTotalNumber] = useState(10);
    const [pageSize, setPageSize] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    const [records, setRecords] = useState([]);
    const [reload, setReload] = useState(0);

    

    const search = () => {
        setReload(reload + 1);
    };

    useEffect(() => {
        !cancelled && setLoading(true);

        ApiService.getRecords({
            searchColumn: searchBy,
            search: searchString,
            sortColumn: sortBy,
            sortDirection: dir,
            pageSize: pageSize,
            pageNumber: pageNumber
        })
            .then(({ data }) => {
                const { totalNumber, list } = data;

                !cancelled && setTotalNumber(totalNumber);
                !cancelled && setLoading(false);
                !cancelled && setRecords(list);
            })
            .catch(error => {
                !cancelled && setLoading(false);
            });

        return () => cancelled = true
    }, [sortBy, dir, pageSize, pageNumber, reload]);

    const columns = [
        {
            name: "Id",
            selector: (row, index) => row.id,
            sortable: false
        },
        {
            name: "Code",
            sortBy: "code",
            selector: (row, index) => row.code || "N/A",
            sortable: true
        },
        {
            name: "Value",
            sortBy: "value",
            selector: (row, index) => row.value || "N/A",
            sortable: true
        }
    ];

    const customStyles = {
        headCells: {
            style: {
                fontSize: '14px',
                fontWeight: 'bold'
            },
        },
        cells: {
            style: {
                fontSize: '14px'
            },
        }
    };

    return <>
        <form>
            <div className="row">
                <div className="form-group col-md-12 mb-5">
                    <div className="row pl-3">
                        <label htmlFor="staticEmail" className="col-form-label mr-1">Search By:</label>
                        <div className="col-md-4">
                            <select className="form-control" onChange={(e) => { setSearchBy(e.target.value) }} value={searchBy}>
                                <option value="code">Code</option>
                                <option value="value">Value</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <input type="text" className="form-control" value={searchString} onChange={(e) => { setSearchString(e.target.value) }} />
                        </div>
                        <div className="col-md-4">
                            <button className="btn btn-warning" onClick={(e) => { e.preventDefault(); search() }} >Search</button>
                        </div>
                    </div>
                </div>
                
            </div>
        </form>
        {
            records.length === 0 && !loading ?
                <section className="empty-view">
                    <header>No Records Found</header>
                </section>
                :
                <DataTable
                    columns={columns}
                    responsive={true}
                    noHeader
                    highlightOnHover
                    sortServer
                    paginationServer
                    defaultSortFieldId={1}
                    defaultSortAsc
                    progressComponent={<Spinner />}
                    progressPending={loading}
                    paginationTotalRows={totalNumber}
                    customStyles={customStyles}
                    onSort={(column, direction) => {
                        !cancelled && setSortBy(column.sortBy);
                        !cancelled && setDir(direction);
                    }}
                    data={records}
                    pagination
                    onChangePage={(page, totalRows) => {
                        !cancelled && setPageNumber(page);
                    }}
                    onChangeRowsPerPage={(currentRowsPerPage, currentPage) => {
                        !cancelled && setPageSize(currentRowsPerPage);
                    }}
                    paginationPerPage={pageSize}
                />
        }
    </>;

};