import React, {useEffect, useMemo, useRef, useState} from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import {accountService, alertService, tradeService} from '@/_services';
import {Button, Modal} from "react-bootstrap";
import {usePagination, useSortBy, useTable} from "react-table";

function Update({ history }) {

    /*
        todo: need to implement confirm email user journey - sending confirmation token to new email to confirm
     */

    const user = accountService.userValue;
    const {verified, applicationUserId} = user

    const [show, setShow] = useState(false);
    const [textarea, setTextarea] = useState("");
    const [creditCards, setCreditCards] = useState([])

    // textInput must be declared here so the ref can refer to it
    const textInput = useRef("");

    function handleClick() {
        textInput.current.focus();
    }
    useEffect(() => {
        accountService.getCreditCards(applicationUserId)
            .then(response => response.json())
            .then(creditCardsFromServer => {
                setCreditCards(creditCardsFromServer)
            })
    }, []);

    const COLUMNS = [
        {
            Header: 'Credit Card',
            accessor: 'creditCardId'
        },
        {
            Header: 'Ends in',
            accessor: 'creditCardNumberStr'
        }
    ]

    const columns = useMemo(() => COLUMNS, [])
    const data = useMemo(() => creditCards, [creditCards])
    //
    const tableInstance = useTable({
        data: data,
        columns: columns,
    }, useSortBy, usePagination)

    const {getTableProps, getTableBodyProps, headerGroups, page, prepareRow, nextPage, previousPage, canNextPage, canPreviousPage, pageOptions,state} = tableInstance

    const {pageIndex} = state

    const handleSend = (event) => {


        alert('this isvalue in textarea: ' + textarea);

        accountService.sendUnregisterEmail(applicationUserId, textarea)

        event.preventDefault();


    };

    const handleChange = (event) => {
        setTextarea(event.target.value)
        // console.log(`this is what is inside text area \n\n ${textInput.current.toString()}`)
    };
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const initialValues = {
        username: user.username,
        // title: user.title,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: '',
        confirmPassword: ''
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .required('Username is required'),
        // title: Yup.string()
        //     .required('Title is required'),
        firstName: Yup.string()
            .required('First Name is required'),
        lastName: Yup.string()
            .required('Last Name is required'),
        email: Yup.string()
            .email('Email is invalid')
            .required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters'),
        confirmPassword: Yup.string()
            .when('password', (password, schema) => {
                if (password) return schema.required('Confirm Password is required');
            })
            .oneOf([Yup.ref('password')], 'Passwords must match')
    });

    function onSubmit(fields, { setStatus, setSubmitting }) {

        console.log("about to update user!!")
        setStatus();
        accountService.updateUser(user.applicationUserId, fields)
            .then(() => {
                alertService.success('Update successful', { keepAfterRouteChange: true });
                history.push('.');
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    const [isDeleting, setIsDeleting] = useState(false);
    function onDelete() {
        if (confirm('Are you sure?')) {
            setIsDeleting(true);
            accountService.delete(user.id)
                .then(() => alertService.success('Account deleted successfully'));
        }
    }

    return (
        <>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                {({ errors, touched, isSubmitting }) => (
                    <Form>
                        <span>
                            <h1 style={{display: "inline-block"}}>Update Account Details</h1>
                            {
                                verified === true ?
                                <button  className="btn btn-success" style={{display: "inline-block", height: "100%", color: "white", fontWeight: "bolder", textAlign: "center", fontSize: "25px", float: "right"}}>
                                    VERIFIED
                                </button>
                                    :
                                <Link to={`/user/creditCard`}   className="btn btn-danger" style={{display: "inline-block", height: "100%", color: "white", fontWeight: "bolder", textAlign: "center", fontSize: "25px", float: "right"}}>
                                    ACCOUNT NOT VERIFIED - CLICK TO VERIFY
                                </Link>
                            }
                        </span>
                        <br />
                        <br />
                        <br />
                        <div className="form-group">
                            <label>Username</label>
                            <Field name="username" type="text" className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} disabled/>
                            <ErrorMessage name="username" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-row">
                            {/*<div className="form-group col">*/}
                            {/*    <label>Title</label>*/}
                            {/*    <Field name="title" as="select" className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')}>*/}
                            {/*        <option value=""></option>*/}
                            {/*        <option value="Mr">Mr</option>*/}
                            {/*        <option value="Mrs">Mrs</option>*/}
                            {/*        <option value="Miss">Miss</option>*/}
                            {/*        <option value="Ms">Ms</option>*/}
                            {/*    </Field>*/}
                            {/*    <ErrorMessage name="title" component="div" className="invalid-feedback" />*/}
                            {/*</div>*/}
                            <div className="form-group col-5">
                                <label>First Name</label>
                                <Field name="firstName" type="text" className={'form-control' + (errors.firstName && touched.firstName ? ' is-invalid' : '')} />
                                <ErrorMessage name="firstName" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-5">
                                <label>Last Name</label>
                                <Field name="lastName" type="text" className={'form-control' + (errors.lastName && touched.lastName ? ' is-invalid' : '')} />
                                <ErrorMessage name="lastName" component="div" className="invalid-feedback" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <Field name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                            <ErrorMessage name="email" component="div" className="invalid-feedback" />
                        </div>
                        <h3 className="pt-3">Change Password</h3>
                        <p>Leave blank to keep the same password</p>
                        <div className="form-row">
                            <div className="form-group col">
                                <label>Password</label>
                                <Field name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                <ErrorMessage name="password" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col">
                                <label>Confirm Password</label>
                                <Field name="confirmPassword" type="password" className={'form-control' + (errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : '')} />
                                <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                            </div>
                        </div>
                        <br />
                        <div className="form-group">
                            <button type="submit" disabled={isSubmitting} className="btn btn-primary mr-2">
                                {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Update
                            </button>
                            {/*<button type="button" onClick={() => onDelete()} className="btn btn-danger mr-2" style={{ width: '75px' }} disabled={isDeleting}>*/}
                            {/*    {isDeleting*/}
                            {/*        ? <span className="spinner-border spinner-border-sm"></span>*/}
                            {/*        : <span>Delete</span>*/}
                            {/*    }*/}
                            {/*</button>*/}
                            <Button variant="warning" onClick={handleShow} >
                                Request Unregister
                            </Button>
                            <Link to="." className="btn btn-link">Cancel</Link>
                        </div>
                    </Form>
                )}
            </Formik>
            <br />
            <br />

            {
                verified &&
                    <>
                        <hr className="my-4" />

                        <br />

                        <h3>Credit Cards</h3>
                        {/*<h3>view credit cards?</h3>*/}
                        {/*<h3>register another credit card?</h3>*/}
                        <br />
                        <Link to={`/user/creditCard`} className="btn btn-sm btn-success mb-2">Add another card</Link>
                        <br />
                        <br />
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

                        <br />
                        <br />

                        <hr className="my-4" />

                        <br />

                        <h3>Transactions</h3>

                        <div style={{display: "block"}}>
                            <div className="btn-group m-2 p-5" role="group" aria-label="First group" style={{width: "100%"}}>
                                <Link to={`/user/transactions`}  className="btn btn-outline-warning" style={{width: "100%"}}>
                                    VIEW ALL TRANSACTIONS
                                </Link>
                            </div>
                        </div>
                    </>
            }

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Please email admin to request unregister</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label htmlFor="recipient-name" className="col-form-label">Recipient:</label>
                            <input type="text" className="form-control" id="recipient-name" placeholder="alphatrader@mail.com" disabled/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="message-text" className="col-form-label">Message:</label>
                            <textarea className="form-control" id="message-text" onChange={handleChange} value={textarea}></textarea>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSend}>Send</Button>
                </Modal.Footer>
            </Modal>
            <br />
            <br />
        </>
    )
}

export { Update };