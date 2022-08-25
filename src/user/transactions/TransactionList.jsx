import React, {useEffect, useMemo, useState} from "react";
import {usePagination, useSortBy, useTable} from "react-table";
import {tradeService} from "@/_services/trade.service";
import {accountService, alertService} from "@/_services";
import {Link} from "react-router-dom";

function TransactionList({ match }) {
    const user = accountService.userValue;

    const { path } = match;
    const [refreshCounter, setRefreshCounter] = useState(0)
    const [transactionRow, setTransactionRow] = useState([])
    const [transactions, setTransactions] = useState([])
    const TRANSACTION_REFRESH_RATE = 60000;

    useEffect(() => {
        //update current value
        if(refreshCounter > 0) {
            console.log(`refresh counter updated!!`)
            tradeService.getUpdatedValuesInTransactions(transactions)
                .then(transactionsFromServer => {
                    setTransactions(transactionsFromServer)
                })
        }
    }, [refreshCounter]);

    useEffect(() => {
        const interval = setInterval(() => {
            console.log(`logged every 1 minute to test!`)
            setRefreshCounter(refreshCounter + 1)
        }, TRANSACTION_REFRESH_RATE);
        return () => clearTimeout(interval);
    })

    useEffect(() => {

        //get transactions
        tradeService.getTransactions(user.applicationUserId)
            .then(transactionsFromServer => {

                const transformedTransactions = transactionsFromServer.map((transaction, index) => {
                    const {company, symbol, currentValue,  purchaseValue, numberOfTransactions, shareAmount, stockId, portfolioId} = transaction
                    return {
                        transactionId: index + 1,
                        symbol: symbol,
                        company: company,
                        currentValue: currentValue,
                        purchaseValue: purchaseValue,
                        numberOfTransactions: numberOfTransactions,
                        shareAmount: shareAmount,
                        stockId: stockId,
                        portfolioId: portfolioId
                    }
                })
                console.log(`this is transformedTransactions from map function ${JSON.stringify(transformedTransactions)}`)
                setTransactions(transformedTransactions)

            })

    }, []);


    const COLUMNS = [
        {
            Header: 'Transaction Number',
            accessor: 'transactionId'
        },
        {
            Header: 'Symbol',
            accessor: 'symbol'
        },
        {
            Header: 'Company',
            accessor: 'company'
        },
        {
            Header: 'Current Value',
            accessor: 'currentValue'
        },
        {
            Header: 'Purchase Value',
            accessor: 'purchaseValue'
        },
        {
            Header: 'Number of Transactions',
            accessor: 'numberOfTransactions'
        },
        {
            Header: 'Share Amount',
            accessor: 'shareAmount'
        },
        {
            id: 'view',
            sortable:false,
            filterable: false,
            width: 100,
            accessor: 'stockId',
            Cell: ({value, row}) => (
        //         // <Link  className="btn btn-sm btn-primary mr-1">View</Link>
                <Link to={`${path}/view/${value}`} className="btn btn-sm btn-info m-3">View Purchasing History</Link>
            )
        }
    ]

    const columns = useMemo(() => COLUMNS, [])
    const data = useMemo(() => (transactions), [transactions])
    //
    const tableInstance = useTable({
        data: data,
        columns: columns,
    }, useSortBy, usePagination)

    const {getTableProps, getTableBodyProps, headerGroups, page, prepareRow, nextPage, previousPage, canNextPage, canPreviousPage, pageOptions,state} = tableInstance

    const {pageIndex} = state

    return (
        <>
            <h1>General Overview</h1>
            <p>Overview of transactions completed:</p>
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
export { TransactionList };