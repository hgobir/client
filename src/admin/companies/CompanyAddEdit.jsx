import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import stockticker from "../../resources/images/stock_ticker.png";
import value from "../../resources/images/value.png";

import { accountService, alertService } from '@/_services';

function CompanyAddEdit({ history, match }) {
    const { id } = match.params;
    const isAddMode = !id;
    const [edit, setEdit] = useState(false);
    const [stock, setStock] = useState({});

    const initialValues = {
        name: '',
        description: '',
        sector: '',
        ceo: '',
        address: '',
        valuation: 0
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('name is required'),
        description: Yup.string()
            .required('description is required'),
        sector: Yup.string()
            .required('sector is required'),
        ceo: Yup.string()
            .required('sector is required'),
        address: Yup.string()
            .required('address is required'),
        valuation: Yup.number()
            .required('valuation is required')
    });

    function onSubmit(fields, { setStatus, setSubmitting }) {
        setStatus();
        if (isAddMode) {
            createCompany(fields, setSubmitting);
        } else {
            updateCompany(id, fields, setSubmitting);
        }
    }

    useEffect(() => {

        console.log(`called every time edit toggle changed!!`)
        console.log(`this is what history parameter looks like ${JSON.stringify(history)} \n\n this is what match parameter looks like ${JSON.stringify(match)}`)

    }, [edit])

    //todo: need to implement create company method!!
    function createCompany(fields, setSubmitting) {
        accountService.createCompany(fields)
            .then(() => {
                alertService.success('company added successfully', { keepAfterRouteChange: true });
                history.push('.');
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    function updateCompany(id, fields, setSubmitting) {
        accountService.updateCompany(id, fields)
            .then(() => {
                alertService.success('Update successful', { keepAfterRouteChange: true });
                history.push('..');
            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    return (
        <>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                {({ errors, touched, isSubmitting, setFieldValue }) => {
                    useEffect(() => {
                        if (!isAddMode) {
                            // get user and set form fields
                            accountService.getCompanyById(id).then(company => company.json()).then(companyFromServer => {
                                console.log(`this is what companyFromServer looks like ${JSON.stringify(companyFromServer)}`)
                                const fields = ['name', 'description', 'sector', 'ceo', 'address', 'valuation'];
                                setStock(companyFromServer['stock'])
                                fields.forEach(field => setFieldValue(field, companyFromServer[field], false));
                            });
                        }
                    }, []);

                    return (
                        <Form>
                                <h1>{edit ? 'Edit Company' : isAddMode ? 'Add Company' : 'View Company'}</h1>
                            <br />
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" onClick={() => setEdit(!edit)}/>
                                    <label className="form-check-label" htmlFor="flexSwitchCheckDefault"
                                    >Edit?</label
                                    >
                                </div>

                            <br />
                            <div className="form-row">
                                <div className="form-group col-5">
                                    <label>Name</label>
                                    <Field name="name" type="text" className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} />
                                    <ErrorMessage name="name" component="div" className="invalid-feedback" />
                                </div>
                                <div className="form-group col-5">
                                    <label>sector</label>
                                    <Field name="sector" type="text" className={'form-control' + (errors.sector && touched.sector ? ' is-invalid' : '')} />
                                    <ErrorMessage name="sector" component="div" className="invalid-feedback" />
                                </div>
                                <div className="form-group col-5">
                                    <label>description</label>
                                    <Field name="description" type="textarea" className={'form-control' + (errors.description && touched.description ? ' is-invalid' : '')} />
                                    <ErrorMessage name="description" component="div" className="invalid-feedback" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-7">
                                    <label>ceo</label>
                                    <Field name="ceo" type="text" className={'form-control' + (errors.ceo && touched.ceo ? ' is-invalid' : '')} />
                                    <ErrorMessage name="ceo" component="div" className="invalid-feedback" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col">
                                    <label>address</label>
                                    <Field name="address" type="text" className={'form-control' + (errors.address && touched.address ? ' is-invalid' : '')} />
                                    <ErrorMessage name="address" component="div" className="invalid-feedback" />
                                </div>
                                <div className="form-group col">
                                    <label>valuation</label>
                                    <Field name="valuation" type="number" className={'form-control' + (errors.valuation && touched.valuation ? ' is-invalid' : '')} />
                                    <ErrorMessage name="valuation" component="div" className="invalid-feedback" />
                                </div>
                            </div>
                            <div className="form-group">
                                <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                                    {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                    Save
                                </button>
                                <Link to={isAddMode ? '.' : '..'} className="btn btn-link">Cancel</Link>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
            <br />
            <br />
            <div id="stockCarousel" className="carousel slide" style={{textAlign: "center"}} data-ride="carousel">
                {/*<ol className="carousel-indicators">*/}
                    {/*<li data-target="#stockCarousel" data-slide-to="0" className="active"/>*/}
                    {/*<li data-target="#stockCarousel" data-slide-to="1"/>*/}
                    {/*<li data-target="#demo" data-slide-to="2"></li>*/}
                    {/*<li data-target="#demo" data-slide-to="3"></li>*/}
                    {/*<li data-target="#demo" data-slide-to="4"></li>*/}
                    {/*<li data-target="#demo" data-slide-to="5"></li>*/}
                {/*</ol>*/}
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <div className="bg-white" >
                            <img src={stockticker}  alt="First Slide"/>
                        </div>
                        <div className="card text-white bg-dark mb-3" style={{position: "relative", top: "-245px"}}>
                            <div className="card-body">
                                Stock Ticker Symbol: <strong>{stock.symbol}</strong>
                            </div>
                        </div>
                    </div>
                    {/*<div className="carousel-item active">*/}
                    {/*    <div className="bg-white" >*/}
                    {/*        <img src={value}  alt="Second Slide"/>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>

                {/*<a className="carousel-control-prev"  href="#carouselExampleIndicators" role="button" data-slide="prev">*/}
                {/*    <span className="carousel-control-prev-icon" aria-hidden="true"/>*/}
                {/*    <span className="sr-only">Previous</span>*/}
                {/*</a>*/}
                {/*<a className="carousel-control-next" role="button" data-slide="next">*/}
                {/*    <span className="carousel-control-next-icon" aria-hidden="true"/>*/}
                {/*    <span className="sr-only">Next</span>*/}
                {/*</a>*/}
            </div>
        </>
    );
}

export { CompanyAddEdit };