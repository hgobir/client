import {tradeService} from "@/_services/trade.service";
import React, {useContext, useEffect, useMemo, useState} from "react";
import {Link} from "react-router-dom";
import {usePagination, useSortBy, useTable} from "react-table";
import {accountService, alertService} from "@/_services";
import {UserContext} from "@/_helpers/user.context";


function OrderList({ match, location }) {
    // console.log(`this is index ${i} and this is row ${row} this is row number ${page.size()}`)

    const user = accountService.userValue;
    const {globalAvailableFunds, setGlobalAvailableFunds} = useContext(UserContext)

    const { path } = match;
    const { pathname } = location;

    // const fromSharePurchasePage = location.state !== null;

    console.log(`this is from context ${globalAvailableFunds}`)

    const [refreshCounter, setRefreshCounter] = useState(0)
    const [orders, setOrders] = useState([])
    const [correctDateFormat, setCorrectDateFormat] = useState('')
    const [correctTimeFormat, setCorrectTimeFormat] = useState('')
    const [symbol, setSymbol] = useState('')
    const [numberOfShares, setNumberOfShares] = useState(0)
    const ORDER_REFRESH_RATE = 60000;
    // const [sharePurchasePage, setSharePurchasePage] = useState(false)


    useEffect(() => {
        const interval = setInterval(() => {
            console.log(`logged every minute to test!`)
            setRefreshCounter(refreshCounter + 1)
        }, ORDER_REFRESH_RATE);
        return () => clearTimeout(interval);
    })


    // useEffect(() => {
    //     if(fromSharePurchasePage) {
    //         const { type } = match.params;
    //         const { symbol } = match.params;
    //         const { numberOfShares } = match.params;
    //
    //         // console.log(`this is symbol ${symbol} and this is numberOfShares ${numberOfShares}`)
    //         setSymbol(symbol)
    //         setNumberOfShares(numberOfShares)
    //         tradeService.executeOrder(type, symbol, numberOfShares, user.applicationUserId)
    //         alertService.clear()
    //         alertService.info('Order submitted to server.', { keepAfterRouteChange: false });
    //     }
    // }, []);

    useEffect(() => {
        console.log(`this is what application User is before getting orders!! -> ${user.applicationUserId}`)
        // if(pathname === "/user/orders" || refreshCounter > 0) {
            tradeService.getOrders(user.applicationUserId)
                .then(ordersFromServer => {
                    setOrders(ordersFromServer)
                })
        // }

    }, [refreshCounter]);

    useEffect(() => {

        accountService.updateAvailableFunds(user.applicationUserId)
            .then(newAvailableFunds => newAvailableFunds.text())
            .then(newAvailableFunds => {
                console.log(`this is available funds for application User -> ${newAvailableFunds}`)

                const oldUser = JSON.parse(localStorage.getItem("user"))
                const {applicationUserId, availableFunds, email,  enabled, firstName, lastName, locked, password, role, username, verified} = oldUser

                const newGlobalAvailableFunds = Number.parseFloat(newAvailableFunds)

                setGlobalAvailableFunds(newGlobalAvailableFunds)

                const newUser = {
                    applicationUserId: applicationUserId,
                    availableFunds: newGlobalAvailableFunds,
                    email: email,
                    enabled: enabled,
                    firstName: firstName,
                    lastName: lastName,
                    locked: locked,
                    password: password,
                    role: role,
                    username: username,
                    verified: verified
                }

                localStorage.setItem("user", JSON.stringify(newUser))

            })
        // }

    }, []);

    const COLUMNS = [
        {
            Header: 'Order Number',
            accessor: 'orderRequestId'
        },
        {
            Header: 'Stock',
            accessor: 'stock.symbol'
        },
        {
            Header: 'Amount of Shares',
            accessor: 'numberOfShares'
        },
        {
            Header: 'Status',
            accessor: 'orderStatus',
            Cell: ({value, row}) => {
                if(value === "PENDING") {
                    return <p style={{backgroundColor: "yellow"}}>PENDING</p>

                } else if(value === "SUCCESSFULLY_COMPLETED") {
                    return <p style={{backgroundColor: "green", width: "100%"}}>SUCCESSFUL</p>

                } else if(value === "USER_DOESNT_HAVE_ANY_SELLABLE_SHARES") {
                    return <p style={{backgroundColor: "red"}}>NO SHARES</p>

                } else if(value === "INITIATED") {
                    return <p style={{backgroundColor: "blue"}}>INITIATED</p>

                } else if(value === "USER_DOESNT_HAVE_ENOUGH_MONEY") {
                    return <p style={{backgroundColor: "red"}}>NOT ENOUGH MONEY</p>

                }else if(value === "USER_DOESNT_HAVE_ANY_MONEY") {
                    return <p style={{backgroundColor: "red"}}>NO MONEY</p>
                }else if(value === "USER_DOESNT_HAVE_ENOUGH_SELLABLE_SHARES") {
                    return <p style={{backgroundColor: "red"}}>NOT ENOUGH SHARES OWNED</p>
                }else if(value === "NOT_ENOUGH_AVAILABLE_SHARES_IN_MARKET") {
                    return <p style={{backgroundColor: "red"}}>NOT ENOUGH SHARES IN MARKET</p>
                }
            }
        },
        // {
        //     id:'date',
        //     Header: 'Date',
        //     accessor: 'orderPlacedTime',
        //     Cell: ({value, row}) => {
        //
        //         const newDate = new Date(value.toString())
        //
        //         // console.log(`this is date object ${newDate.toDateString()}`)
        //         // console.log(`this is time object ${newDate.toTimeString()}`)
        //         // setCorrectDateFormat(newDate.toDateString())
        //         // setCorrectTimeFormat(newDate.toLocaleTimeString())
        //         return newDate.toDateString();
        //     }
        // },
        // {
        //     id:'time',
        //     Header: 'Time',
        //     accessor: 'orderPlacedTime',
        //         Cell: ({value, row}) => {
        //
        //             const newDate = new Date(value.toString())
        //
        //             // console.log(`this is date object ${newDate.toDateString()}`)
        //             // console.log(`this is time object ${newDate.toTimeString()}`)
        //             // setCorrectDateFormat(newDate.toDateString())
        //             // setCorrectTimeFormat(newDate.toLocaleTimeString())
        //             return newDate.toLocaleTimeString();
        //         }
        // },
        // {
        //     id: 'view',
        //     sortable:false,
        //     filterable: false,
        //     width: 100,
        //     accessor: 'orderId',
        //     Cell: ({value, row}) => (
        //         <Link to={`user/orders/view/${value}`} className="btn btn-sm btn-primary mr-1">View</Link>
        //     )
        // }
    ]

    const columns = useMemo(() => COLUMNS, [])
    const data = useMemo(() => orders, [orders])

    const tableInstance = useTable({
        data: data,
        columns: columns,
    }, useSortBy, usePagination)

    const {getTableProps, getTableBodyProps, headerGroups, page, prepareRow, nextPage, previousPage, canNextPage, canPreviousPage, pageOptions,state} = tableInstance

    const {pageIndex} = state


    return (
        <>
            <h1>Orders</h1>
            <p>All orders submitted by {user.firstName}</p>
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
export { OrderList };