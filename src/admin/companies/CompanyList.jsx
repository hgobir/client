import React, {useEffect, useMemo, useState} from "react";
// import ReactTable from 'react-table-6'
import {useTable, useSortBy, usePagination} from "react-table";
import MOCK_DATA from "../../resources/MOCK_DATA.json"
// import 'react-toastify/dist/ReactToastify.css';
import {accountService} from "@/_services";
import {Link} from "react-router-dom";
import {arrow} from "../../resources/images/arrow.png"


function CompanyList({ match }) {
    // console.log(`this is index ${i} and this is row ${row} this is row number ${page.size()}`)

    const { path } = match;
    const [companies, setCompanies] = useState([{
        companyId: "",
        name: "",
        description: "",
        sector: "",
        ceo: "",
        address: "",
        valuation: 0
    }])

    const [toggleDelete, setToggleDelete] = useState(false)
    const [companyIdToDelete, setCompanyIdToDelete] = useState(0)
    const [companyIdToEdit, setCompanyIdToEdit] = useState(0)
    const [updateCompanyCounter, setUpdateCompanyCounter] = useState(0)


    useEffect(() => {
        accountService.getCompanies()
            .then(response => response.json())
                .then(companiesFromServer => {
                // const usersFromServer = response.json()
                const jsonString = JSON.stringify(companiesFromServer);
                // const parsedJson = JSON.parse(companiesFromServer);

                // console.log(`this is parsedJson response from getAllCompanies ${parsedJson}`)
                // console.log(`this is jsonString response from getAllCompanies ${jsonString}`)
                console.log(`this is raw response from getAllCompanies ${companiesFromServer}`)

                const newCompanies = companiesFromServer.map((company) => {

                    const {companyId, name, description, sector, ceo, address, valuation} = company
                    return {
                        companyId: companyId,
                        name: name,
                        description: description,
                        sector: sector,
                        ceo: ceo,
                        address: address,
                        valuation: valuation
                    }
                })
                    // console.log(`\n\n this is new companies array \n\n ${JSON.stringify(newCompanies)}`)
                // JSON.parse(companiesFromServer)
                setCompanies(newCompanies)
            })
    }, []);

    function deleteCompany(id) {
        setCompanies(companies.map(x => {
            if (x.id === id) { x.isDeleting = true; console.log(`this is company in list ${x}`)}
            return x;
        }));
        accountService.deleteCompany(id).then(() => {
            setCompanies(companies => companies.filter(x => x.id !== id));
        });
    }

    // Add new car
    // const addCompany = (company) => {
    //     console.log("add company good sir!")
    //     console.log(`this is company passed from AddCompany component ${JSON.stringify(company)} this is name ${company.name}`)
    //     fetch(appConstants.STOCK_MODULATION_URL + `/v1/stockModulation/admin/company/createCompany/${company.name}/${company.description}/${company.sector}/${company.ceo}/${company.address}/${company.valuation}`,
    //         { method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(company)
    //         })
    //         .then(res => {
    //             // const stockCreated = res;
    //             //todo - not displaying stock properly fix when core project is completed!!
    //             console.log(`this is stock created from new company! ${JSON.stringify(res)}`)
    //             setUpdateCompanyCounter(updateCompanyCounter + 1)
    //         })
    //         .catch(err => console.error(err))
    // }


    const COLUMNS = [
        {
            Header: 'CompanyId',
            accessor: 'companyId'
        },
        {
            Header: 'Name',
            accessor: 'name'
        },
        {
            Header: 'Description',
            accessor: 'description'
        },
        {
            Header: 'Sector',
            accessor: 'sector'
        },
        {
            Header: 'CEO',
            accessor: 'ceo'
        },
        {
            Header: 'Address',
            accessor: 'address'
        },
        {
            Header: 'Valuation',
            accessor: 'valuation'
        }
    ,
        {
        id: 'view',
        sortable:false,
        filterable: false,
        width: 100,
        accessor: 'companyId',
        Cell: ({value, row}) => (
            <Link to={`${path}/view/${value}`} className="btn btn-sm btn-primary mr-1">View</Link>

            // <button>View</button>
        //     <EditCompany
        //         row={row}
        //         updateCompany={updateCompany}
        //         onClick={() => {
        //             // console.log("this element should be deleted! " + JSON.stringify(companyId))
        //             console.log("this element should be edit! " + value.valueOf())
        //             const companyIdSelected = Number(value.valueOf())
        //             setCompanyIdToEdit(companyIdSelected);
        //             onEditClick(companyIdSelected)
        //         }}
        //     />
        )
    }, {
        id: 'delete',
        // sortable:false,
        // filterable: false,
        width: 100,
        accessor: 'companyId',
        Cell: ({value}) => (
            <div>
                <button
                    className="btn btn-sm btn-danger"
                    style={{ width: '60px' }}
                    onClick={() => {
                        console.log("this element should be deleted! " + JSON.stringify(value))
                        //             console.log("this element should be deleted! " + value.valueOf())
                        //             const companyIdSelected = Number(value.valueOf())
                        //             setCompanyIdToDelete(companyIdSelected);
                        //             onDeleteClick(companyIdSelected)
                    }}
                >Delete</button>
            </div>

        )
    }
    ]

    // console.log(`this is company data used in table (actual company)\n\n ${companies}`)
    // console.log(`this is COMPANY ARRAY number ${companies.length}`)
    //
    // console.log(`this is company data used in table (mock data)\n\n ${MOCK_DATA}`)
    // console.log(`this is mock data ARRAY number ${MOCK_DATA.length}`)

    const columns = useMemo(() => COLUMNS, [])
    // const data = useMemo(() => MOCK_DATA, [])
    const data = useMemo(() => companies, [companies])

    const tableInstance = useTable({
        data: data,
        columns: columns,
    }, useSortBy, usePagination)

    const {getTableProps, getTableBodyProps, headerGroups, page, prepareRow, nextPage, previousPage, canNextPage, canPreviousPage, pageOptions,state} = tableInstance

    const {pageIndex} = state
    // console.log(`this is row number ${page.length}`)


    return (
        <>
            <h1>Companies</h1>
            <p>All companies from unsecure (admin only) api end point:</p>
            <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Add Company</Link>
            <table {...getTableProps()} className="table table-striped">
                <thead>
                {headerGroups.map((headerGroup) => (

                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                {column.render('Header')}
                            <span>
                                {column.isSorted ? (column.isSortedDesc ? 'DESC' : 'ASC') : ''}
                            </span>
                            </th>
                        ))}
                    </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {
                        page.map((row, i) => {
                            // console.log(`this is index ${i} and this is row ${row} this is row number ${page.size()}`)
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
export { CompanyList };