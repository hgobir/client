import {tradeService} from "@/_services/trade.service";
import React, {useContext, useEffect, useMemo, useState} from "react";
import {Link} from "react-router-dom";
import {usePagination, useSortBy, useTable} from "react-table";
import {accountService, alertService} from "@/_services";


function PortfolioList({ match, location }) {

    const user = accountService.userValue;

    const { path } = match;
    const { pathname } = location;
    const [portfolios, setPortfolios] = useState([])

    useEffect(() => {
        tradeService.getPortfolios(user.applicationUserId)
            .then(portfoliosFromServer => {
                setPortfolios(portfoliosFromServer)
            })

    }, []);


    const COLUMNS = [
        {
            Header: 'Portfolio Number',
            accessor: 'portfolioId'
        },
        {
            Header: 'Stock',
            accessor: 'stock.symbol'
        },
        {
            Header: 'Amount of Shares',
            accessor: 'unit'
        },
        {
            Header: 'Time',
            accessor: 'lastTimeTraded'
        },
        {
            id: 'view',
            sortable:false,
            filterable: false,
            width: 100,
            accessor: 'portfolioId',
            Cell: ({value, row}) => (
                <Link to={`${path}/view/${value}`} className="btn btn-sm btn-primary mr-1">View</Link>
            )
        }
    ]

    const columns = useMemo(() => COLUMNS, [])
    const data = useMemo(() => portfolios, [portfolios])

    const tableInstance = useTable({
        data: data,
        columns: columns,
    }, useSortBy, usePagination)

    const {getTableProps, getTableBodyProps, headerGroups, page, prepareRow, nextPage, previousPage, canNextPage, canPreviousPage, pageOptions,state} = tableInstance

    const {pageIndex} = state


    return (
        <>
            <h1>Portfolio</h1>
            <p>{user.firstName}'s Portfolio</p>
            <table {...getTableProps()} className="table table-striped">
                <thead>
                {headerGroups.map((headerGroup) => (

                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                {column.render('Header')}
                                <span>
                                {column.isSorted ? (column.isSortedDesc ? '  ↓' : '  ↑') : ''}
                            </span>
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {
                    page.map((row, i) => {
                        // console.log(`this is index ${i} and this is row ${row} this is row number ${page.size()}`)*/}
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {
                                    row.cells.map(cell => {
                                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    })
                                }
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
            <div>
                <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </span>
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</button>
                <button onClick={() => nextPage()} disabled={!canNextPage}>Next</button>
            </div>
        </>
    )
}
export { PortfolioList };