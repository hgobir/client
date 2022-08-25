import React, {useEffect, useMemo, useState} from "react";
import {useTable, useSortBy, usePagination} from "react-table";

import {Link} from "react-router-dom";
import {tradeService} from "@/_services/trade.service";



function StockList({ match }) {
    // console.log(`this is index ${i} and this is row ${row} this is row number ${page.size()}`)

    const { path } = match;
    const [refreshCounter, setRefreshCounter] = useState(0)
    const [stocks, setStocks] = useState([])
    const STOCK_REFRESH_RATE = 300000;

    useEffect(() => {
        tradeService.getStocks()
            .then(stocksFromServer => {
                setStocks(stocksFromServer)
            })
    }, [refreshCounter]);

    useEffect(() => {
        const interval = setInterval(() => {
            console.log(`logged every minute to test!`)
            setRefreshCounter(refreshCounter + 1)
        }, STOCK_REFRESH_RATE);
        return () => clearTimeout(interval);
    })


    const COLUMNS = [
        {
            Header: 'Stock Number',
            accessor: 'stockId'
        },
        {
            Header: 'Symbol',
            accessor: 'symbol'
        },
        {
            Header: 'Current Value',
            accessor: 'currentValue'
        },
        {
            Header: 'Current Volume',
            accessor: 'currentVolume'
        },
        {
            Header: 'Gains',
            accessor: 'gains'
        },
        {
            id: 'view',
            sortable:false,
            filterable: false,
            width: 100,
            accessor: 'stockId',
            Cell: ({value, row}) => (
                <Link to={`${path}/view/${value}`} className="btn btn-sm btn-primary mr-1">View</Link>
            )
        }
    ]

    const columns = useMemo(() => COLUMNS, [])
    const data = useMemo(() => stocks, [stocks])
    //
    const tableInstance = useTable({
        data: data,
        columns: columns,
    }, useSortBy, usePagination)

    const {getTableProps, getTableBodyProps, headerGroups, page, prepareRow, nextPage, previousPage, canNextPage, canPreviousPage, pageOptions,state} = tableInstance

    const {pageIndex} = state


    return (
        <>
            <h1>Stocks</h1>
            <p>All stocks from secure (user only) api end point:</p>
            {/*<Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Add Company</Link>*/}
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
export { StockList };