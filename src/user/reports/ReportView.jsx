import React, {useEffect, useMemo, useState} from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import xml from "../../resources/images/—Pngtree—xml file document icon_4166301.png";
import csv from "../../resources/images/—Pngtree—csv file document icon_4175842.png";

import { accountService, alertService, tradeService } from '@/_services';
import logo from "../../resources/images/logo.png";
import {usePagination, useSortBy, useTable, useRowSelect} from "react-table";
// import {Checkbox} from "@/_components/Checkbox";


function ReportView({ history, match }) {

    // const { id } = match.params;
    // const { type } = match.params;
    const user = accountService.userValue;

    const id = user.applicationUserId
    //todo - validation on sell side to limit amount of shares avaialble to sell to total amount of shares owned!!


    const [portfolios, setPortfolios] = useState([]);
    const [stockData, setStockData] = useState([]);
    const [reportType, setReportType] = useState("");
    const [reportRequested, setReportRequested] = useState(false);
    const [reportURL, setReportURL] = useState("");
    const [listOfStockData, setListOfStockData] = useState([]);


    useEffect(() => {
        tradeService.getPortfolios(user.applicationUserId)
            .then(portfoliosFromServer => {
                setPortfolios(portfoliosFromServer)
            })

        tradeService.getStockData()
            .then(stockDataFromServer => {
                setStockData(stockDataFromServer)
            })
    }, []);

    const COLUMNS = useMemo(() => [
        {
            Header: 'Symbol',
            accessor: 'symbol'
        }
    ],[]
    );



    const Checkbox = React.forwardRef(({ indeterminate, ...rest}, ref) => {

        const defaultRef = React.useRef()
        const resolvedRef = ref || defaultRef

        useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate
        }, [resolvedRef, indeterminate])

        return (
            <>
                <input type="checkbox" ref={resolvedRef} {...rest}/>
            </>
        )
    });

    const columns = useMemo(() => COLUMNS, [])
    const data = useMemo(() => stockData, [stockData])
    //
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page, // Instead of using 'rows', we'll use page,
        // which has only the rows for the active page

        // The rest of these things are super handy, too ;)
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        selectedFlatRows,
        state: { pageIndex, selectedRowIds },
    } = useTable(
        {
            columns,
            data
        },
        usePagination,
        useRowSelect,
        hooks => {
            hooks.visibleColumns.push(columns => [
                // Let's make a column for selection
                {
                    id: 'selection',
                    // The header can use the table's getToggleAllRowsSelectedProps method
                    // to render a checkbox
                    Header: ({ getToggleAllPageRowsSelectedProps }) => (
                        <div>
                            <Checkbox {...getToggleAllPageRowsSelectedProps()} />
                        </div>
                    ),
                    // The cell can use the individual row's getToggleRowSelectedProps method
                    // to the render a checkbox
                    Cell: ({ row }) => (
                        <div>
                            <Checkbox {...row.getToggleRowSelectedProps()} />
                        </div>
                    ),
                },
                ...columns,
            ])
        }
    )


    function sendReportRequest(reportType, reportFormat) {

        console.log(`this is reportType ${reportType}`)

        if(reportType === "stock") {

            const newStockDataList = selectedFlatRows.map(d => d.original)
            console.log(`this is amount of original ${JSON.stringify(newStockDataList, null, 2)}`)
            // setListOfStockData(newStockDataList)

            tradeService.getReport(user.applicationUserId, reportType, newStockDataList, reportFormat)
                .then(reportsFromServer => {
                    setReportURL(URL.createObjectURL(reportsFromServer));
                })

        } else {

            tradeService.getReport(user.applicationUserId, reportType, [], reportFormat)
                .then(reportsFromServer => {
                        setReportURL(URL.createObjectURL(reportsFromServer));
                    })

        }

        setReportRequested(true);

    }

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="jumbotron jumbotron-fluid">
                            <div className="container">
                                <h3 className="display-4" style={{fontWeight: "bold"}}>Reporting</h3>
                                <hr className={"my-4"}/>
                                <p className="lead">Generate reports from list of stocks or currently held shares from portfolio</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-6">
                        <div className="jumbotron jumbotron-fluid">
                            <div className="container">
                                <h3>Portfolio Report</h3>
                                <br/>
                                <ul className="list-group list-group-flush">
                                    {
                                        portfolios.map((portfolio, index) => {
                                            return <li key={index} className="list-group-item">{portfolio.stock.symbol}</li>
                                        })
                                    }
                                </ul>
                                <br/>
                                <Link to={`/user/portfolio`}  className="btn btn-outline-info" style={{width: "100%"}}>
                                    SEE DETAILED PORTFOLIO
                                </Link>
                            </div>
                        </div>
                        <div className="jumbotron jumbotron-fluid">
                            <div className="container" style={{height: "100%"}}>
                                <h3>Select which Report</h3>
                                <br />
                                <div className="custom-control custom-radio custom-control-inline">
                                    <input type="radio"
                                           id="customRadioInline1"
                                           name="customRadioInline1"
                                           className="custom-control-input"
                                            onClick={() => {
                                                setReportType("portfolio")
                                            }}/>
                                        <label className="custom-control-label" htmlFor="customRadioInline1">Portfolio Report</label>
                                </div>
                                <div className="custom-control custom-radio custom-control-inline">
                                    <input type="radio"
                                           id="customRadioInline2"
                                           name="customRadioInline1"
                                           className="custom-control-input"
                                           onClick={() => {
                                               setReportType("stock")
                                           }}/>
                                        <label className="custom-control-label" htmlFor="customRadioInline2">Stock Report</label>
                                </div>

                                <br />
                                <br />
                                <img src={csv} className="rounded float-left" alt="csv logo" style={{height: "150px", width: "150px"}}/>
                                <img src={xml} className="rounded float-right" alt="xml logo" style={{height: "170px", width: "170px", marginTop: "-11px"}}/>
                                <br />
                                <br />
                                <br />
                                <br />
                            </div>

                        </div>
                    </div>
                    <div className="col-6">
                        <div className="jumbotron jumbotron-fluid">
                            <div className="container">
                                <h3>Stock Report</h3>
                                <br/>

                                <table {...getTableProps()} className="table table-striped">
                                    <thead>
                                    {headerGroups.map(headerGroup => (
                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map(column => (
                                                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                            ))}
                                        </tr>
                                    ))}
                                    </thead>
                                    <tbody {...getTableBodyProps()}>
                                    {page.map((row, i) => {
                                        prepareRow(row)
                                        return (
                                            <tr {...row.getRowProps()}>
                                                {row.cells.map(cell => {
                                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                                })}
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                                <span>
                                Page{' '}
                                <strong>
                                    {pageIndex + 1} of {pageOptions.length}
                                </strong>{' '}
                            </span>
                                <button onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</button>
                                <button onClick={() => nextPage()} disabled={!canNextPage}>Next</button>
                                <p>Selected Rows: {Object.keys(selectedRowIds).length}</p>
                                <p>This is the report type: {reportType}</p>

                                <br/>

                                <br/>
                                <br/>
                                <Link to={`/user/stocks`}  className="btn btn-outline-info" style={{width: "100%"}}>
                                    SEE DETAILED STOCKS
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="col-12">
                    <div className="jumbotron jumbotron-fluid">
                        <div style={{display: "inline-block", width: "100%"}}>
                            {
                                !reportRequested ?
                                    <>
                                    <span className="btn-group p-10" role="group" aria-label="First group" style={{width: "47%"}}>
                                    <button onClick={()=> sendReportRequest(reportType, "xml")} className="btn btn-dark">
                                        GENERATE XML REPORT
                                    </button>
                                </span>
                                <span className="btn-group p-10" role="group" aria-label="Second group" style={{ width: "47%",  float: "right"}}>
                                <button onClick={()=> sendReportRequest(reportType, "csv")} className="btn btn-dark">
                                    GENERATE CSV REPORT
                                </button>
                            </span>
                                </>
                                :
                                <a href={reportURL} id={"viewReport"} target="_blank" className="btn btn-light" style={{ width: "100%"}}>
                                VIEW REPORT!
                                </a>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export { ReportView };