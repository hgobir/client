import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import stockticker from "../../resources/images/stock_ticker.png";
import value from "../../resources/images/value.png";

import { accountService, alertService, tradeService } from '@/_services';
// import {tradeService} from "@/_services/trade.service";

function StockBuySell({ history, match }) {

    const { id } = match.params;
    const { type } = match.params;
    const user = accountService.userValue;

    //todo - validation on sell side to limit amount of shares avaialble to sell to total amount of shares owned!!


    const [stock, setStock] = useState({});
    const [company, setCompany] = useState({});
    const [portfolio, setPortfolio] = useState({});
    const [numberOfShares, setNumberOfShares] = useState(0)

    const [marketCapitalisation, setMarketCapitalisation] = useState(0)
    const [totalInvested, setTotalInvested] = useState(0)
    const [sharesOwned, setSharesOwned] = useState(0)
    const [grossSum, setGrossSum] = useState(0)
    const [confirmTransaction, setConfirmTransaction] = useState(false)
    const [completeTransaction, setCompleteTransaction] = useState(false)


    const increment = () => setNumberOfShares(numberOfShares + 1);
    const decrement = () => setNumberOfShares(numberOfShares - 1);


    const executeOrder = () => {
        const symbol = stock["symbol"];
        // console.log(`we have all the data to execute order ${type.toUpperCase()}, ${symbol}, ${numberOfShares}, ${user.applicationUserId}`)
        alertService.info(`${type.toUpperCase()} order for ${numberOfShares} units of ${symbol} has been submitted to server.`, { keepAfterRouteChange: false });
        setCompleteTransaction(true);
        tradeService.executeOrder(type, symbol, numberOfShares, user.applicationUserId)
        alertService.clear()
    }


    useEffect(() => {
        accountService.getCompanyById(Number.parseInt(id))
            .then(company => company.json())
            .then(companyFromServer => {
                setStock(companyFromServer['stock'])
                setCompany(companyFromServer)
        });

        tradeService.getPortfolio(user.applicationUserId, id)
            // .then(portfolio => portfolio.json())
            .then(portfolioFromServer => {
                console.log(`we have portfolio ${JSON.stringify(portfolioFromServer)}`)
                setPortfolio(portfolioFromServer)
                setSharesOwned(portfolioFromServer["unit"])
                setTotalInvested(portfolioFromServer["totalInvested"])
        });
    }, []);

    useEffect(() => {
        setMarketCapitalisation(stock.currentValue * stock.currentVolume)
    }, [stock]);


    useEffect(() => {
        if(numberOfShares > 0) {
            setGrossSum(stock.currentValue * numberOfShares)
        } else if(numberOfShares === 0) {
            setGrossSum(0)
        }
    }, [numberOfShares, grossSum]);

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="jumbotron jumbotron-fluid">
                            <div className="container">
                                {
                                    !confirmTransaction ?
                                        <>
                                            <p className="lead">{type.substring(0,1).toUpperCase() + type.substring(1)} Stock?</p>
                                            <h1 className="display-4" style={{fontWeight: "bolder"}}>{company.name} [{stock.symbol}]</h1>
                                        </>
                                    :
                                        !completeTransaction ?
                                        <>
                                            <p className="lead">{company.name}</p>
                                            <h3 className="display-4" style={{fontWeight: "bold"}}>Please confirm {type === "buy" ? "purchase" : "sale"} of {numberOfShares} [{stock.symbol}] share(s)</h3>
                                        </>
                                            :
                                        <>
                                            <p className="lead">{company.name}</p>
                                            <h3 className="display-4" style={{fontWeight: "bold"}}>Order submitted</h3>
                                        </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <br />
                <div className="row">
                    {
                        !confirmTransaction ?
                            <div className="col-6">
                                <div className="card-header">
                                    Shares
                                </div>
                                <div className="card-body">
                                    <table className="table table-hover table-striped">
                                        <tbody>
                                        <tr>
                                            <td style={{fontWeight: "bolder"}}>Total Invested</td>
                                            <td>{totalInvested}</td>
                                        </tr>
                                        <tr>
                                            <td style={{fontWeight: "bolder"}}>Shares Owned</td>
                                            <td>{sharesOwned}</td>
                                        </tr>
                                        <tr>
                                            <td style={{fontWeight: "bolder"}}>Gross Sum</td>
                                            <td>{grossSum}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="card-footer">
                                    <div style={{display: "inline-block"}}>
                                        <div className="btn-group m-2 mr-5" role="group" aria-label="First group">

                                            <button className="btn btn-outline-danger"
                                                    onClick={() => {
                                                        numberOfShares > 0 && decrement()
                                                    }}>
                                                -
                                            </button>
                                        </div>
                                        <span>{numberOfShares}</span>
                                        <div className="btn-group m-2 ml-5" role="group" aria-label="Second group">

                                            <button className="btn btn-outline-success" onClick={() => {increment()}}>
                                                +
                                            </button>

                                        </div>
                                    </div>
                                    <div style={{display: "inline-block", float: "right"}}>
                                        {
                                            type === "buy" ?
                                                <button  onClick={() => setConfirmTransaction(true)} className="btn btn-success" style={{display: "block", height: "100%", width: "100%", color: "white", fontWeight: "bolder", textAlign: "center", fontSize: "25px"}}>
                                                    BUY
                                                </button>
                                                :
                                                <button  onClick={() => setConfirmTransaction(true)} className="btn btn-danger" style={{display: "block", height: "100%", width: "100%", color: "white", fontWeight: "bolder", textAlign: "center", fontSize: "25px"}}>
                                                    SELL
                                                </button>
                                        }

                                    </div>
                                </div>
                            </div>
                        :
                            <div className="col-6">
                                <div className="card-header">
                                    Confirm Transaction
                                </div>
                                <div className="card-body">
                                    <table className="table table-hover table-striped">
                                        <tbody>
                                        <tr>
                                            <td style={{fontWeight: "bolder"}}>Price per Share</td>
                                            <td>{stock.currentValue}</td>
                                        </tr>
                                        <tr>
                                            <td style={{fontWeight: "bolder"}}>Total Cost of Trade</td>
                                            <td>{grossSum}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="card-footer" style={{height: "90px"}}>
                                    {
                                        !completeTransaction ?
                                        <div style={{display: "inline-block", float: "right"}}>
                                            <div className="btn-group m-2 mr-3" role="group" aria-label="First group">
                                                <Link to={`/user/stocks/view/${id}`} className="btn btn-danger" style={{display: "block", height: "100%", width: "100%", color: "white", fontWeight: "bolder", textAlign: "center", fontSize: "20px"}}>
                                                    Cancel
                                                </Link>
                                            </div>
                                            <div className="btn-group m-2 ml-3" role="group" aria-label="Second group">
                                                <button onClick={() => executeOrder()}
                                                        className="btn btn-success"
                                                        style={{display: "block", height: "100%", width: "100%", color: "white", fontWeight: "bolder", textAlign: "center", fontSize: "20px"}}
                                                    // onClick={() => executeOrder()}
                                                >
                                                    Confirm
                                                </button>
                                            </div>
                                        </div>
                                            :
                                        <div style={{display: "block"}}>
                                            <div className="btn-group m-2 mr-3" role="group" aria-label="First group">
                                                <Link to={`/user/orders`} className="btn btn-warning" style={{display: "block", height: "100%", width: "100%", color: "white", fontWeight: "bolder", textAlign: "center", fontSize: "20px"}}>
                                                    Check Pending Orders
                                                </Link>
                                            </div>
                                        </div>

                                    }

                                </div>
                            </div>
                    }
                    <div className="col-6 col-md-offset-4">
                        <div className="card">
                            <div className="card-header">
                                Stock Information
                            </div>
                            <div className="card-body">
                                <table className="table table-hover table-striped">
                                    <tbody>
                                    <tr>
                                        <td style={{fontWeight: "bolder"}}>Close</td>
                                        <td>{stock.close}</td>
                                    </tr>
                                    <tr>
                                        <td style={{fontWeight: "bolder"}}>Open</td>
                                        <td>{stock.open}</td>
                                    </tr>
                                    <tr>
                                        <td style={{fontWeight: "bolder"}}>Value</td>
                                        <td>{stock.currentValue}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <br />
            </div>
            </>
    );
}
export { StockBuySell };