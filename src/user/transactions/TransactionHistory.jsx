import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import bears from "../../resources/images/—Pngtree—bear stock stock green green_3920679.png";
import bulls from "../../resources/images/—Pngtree—bull stock stock green green_3920678.png";

import { accountService, alertService, tradeService } from '@/_services';
import logo from "@/resources/images/logo";
// import {tradeService} from "@/_services/trade.service";

function TransactionHistory({ history, match }) {

    const { id } = match.params;
    const { type } = match.params;
    const user = accountService.userValue;

    //todo - validation on sell side to limit amount of shares avaialble to sell to total amount of shares owned!!


    const [stock, setStock] = useState({});
    const [company, setCompany] = useState({});
    const [portfolio, setPortfolio] = useState({});
    const [trade, setTrades] = useState([])

    const [correctDateFormat, setCorrectDateFormat] = useState('')
    const [correctTimeFormat, setCorrectTimeFormat] = useState('')
    //
    // const [marketCapitalisation, setMarketCapitalisation] = useState(0)
    const [totalInvested, setTotalInvested] = useState(0)
    const [sharesOwned, setSharesOwned] = useState(0)
    const [lastTimeInvested, setLastTimeInvested] = useState('')
    // const [confirmTransaction, setConfirmTransaction] = useState(false)
    // const [completeTransaction, setCompleteTransaction] = useState(false)


    // const increment = () => setNumberOfShares(numberOfShares + 1);
    // const decrement = () => setNumberOfShares(numberOfShares - 1);


    // const executeOrder = () => {
    //     const symbol = stock["symbol"];
    //     // console.log(`we have all the data to execute order ${type.toUpperCase()}, ${symbol}, ${numberOfShares}, ${user.applicationUserId}`)
    //     alertService.info(`${type.toUpperCase()} order for ${numberOfShares} units of ${symbol} has been submitted to server.`, { keepAfterRouteChange: false });
    //     setCompleteTransaction(true);
    //     tradeService.executeOrder(type, symbol, numberOfShares, user.applicationUserId)
    //     alertService.clear()
    // }
    //
    //
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
                setLastTimeInvested(portfolioFromServer["lastTimeTraded"])
            });


        tradeService.getTrades(user.applicationUserId, id)
            // .then(portfolio => portfolio.json())
            .then(tradesFromServer => {
                console.log(`we have trades ${JSON.stringify(tradesFromServer)}`)
                setTrades(tradesFromServer)
            });
    }, []);


    return (
        <>
            <div className="container">
                <div className="jumbotron jumbotron-fluid">
                    <div className="container">
                        <p className="lead">Your Purchasing history</p>
                        <h1 className="display-4" style={{fontWeight: "bolder"}}>{company.name}</h1>
                    </div>
                </div>

                {
                    trade.map((trade, index) => {

                        return (
                            <div key={index} className="row">
                                <div className="col-8">
                                    <div className="jumbotron">
                                        <h3 style={{fontWeight: "bolder"}}>Trade #{index + 1}</h3>
                                        <br/>
                                        <hr />
                                        <div className="list-group">
                                            <div
                                               className="list-group-item list-group-item-action flex-column align-items-start">
                                                <h4 className="mb-2">Financials</h4>
                                                {
                                                    trade.tradePosition === "LONG" ?
                                                        <p>
                                                            Bought <strong>{trade.tradeVolume}</strong> units of <strong>{stock.symbol}</strong> shares costing <strong>£{trade.totalCostOfTrade}</strong> total
                                                        </p>
                                                        :
                                                        <p>
                                                            Sold <strong>{trade.tradeVolume}</strong> units of <strong>{stock.symbol}</strong> shares for <strong>£{trade.totalCostOfTrade}</strong> total
                                                        </p>
                                                }
                                            </div>
                                            <div
                                               className="list-group-item list-group-item-action flex-column align-items-start">
                                                <div className="d-flex w-100">
                                                    <h4 className="mb-2">Execution Price</h4>
                                                </div>
                                                <p>
                                                    <strong>£{trade.stockPriceDuringTrade}</strong> per share
                                                </p>
                                            </div>
                                            <div
                                               className="list-group-item list-group-item-action flex-column align-items-start">
                                                <div className="d-flex w-100">
                                                    <h4 className="mb-2">Direction</h4>
                                                </div>
                                                <p>
                                                    <strong>{trade.tradePosition}</strong> trade
                                                </p>
                                            </div>
                                            <div
                                               className="list-group-item list-group-item-action flex-column align-items-start">
                                                <div className="d-flex w-100">
                                                    <h4 className="mb-2">Time</h4>
                                                </div>
                                                <p>
                                                    <strong>{new Date(trade.tradeExecutionTime).toLocaleTimeString()}</strong>
                                                </p>
                                            </div>
                                            <div
                                               className="list-group-item list-group-item-action flex-column align-items-start">
                                                <div className="d-flex w-100">
                                                    <h4 className="mb-2">Date</h4>
                                                </div>
                                                <p>
                                                    <strong>{new Date(trade.tradeExecutionTime).toDateString()}</strong>
                                                </p>
                                            </div>
                                            <div
                                               className="list-group-item list-group-item-action flex-column align-items-start">
                                                <div className="d-flex w-100">
                                                    <h4 className="mb-2">Broker Reference</h4>
                                                </div>
                                                <p>{trade.tradeExecutionReference}.</p>
                                            </div>
                                        </div>
                                        <hr />

                                    </div>

                                </div>
                        <div className="col-4 col-md-offset-2 text-center">
                            <div className="jumbotron justify-content-md-center position-relative">
                                {
                                    trade.tradePosition === "LONG" ?
                                        <img src={bulls} style={{display: "block",
                                            marginTop: "auto",
                                            marginBottom: "auto",
                                            width: "100%",
                                            backgroundColor: "#0c446c",
                                            color: "white",
                                            textAlign: "center",
                                            padding: "5px",
                                            borderWidth: "10px",
                                            borderStyle: "solid",
                                            borderColor: "green",
                                            borderRadius: "50%"}}/>
                                        :
                                        <img src={bears} style={{display: "block",
                                            marginTop: "auto",
                                            marginBottom: "auto",
                                            width: "100%",
                                            backgroundColor: "#0c446c",
                                            color: "white",
                                            textAlign: "center",
                                            padding: "5px",
                                            borderWidth: "10px",
                                            borderStyle: "solid",
                                            borderColor: "red",
                                            borderRadius: "50%"}}/>

                                }
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <p className="lead" style={{marginLeft: "auto", marginRight: "auto"}}>Trade Execution powered by</p>
                                <img style={{width: "17rem", display: "block", marginLeft: "auto", marginRight: "auto"}} src={logo} alt="Card image cap" />
                            </div>
                        </div>

                            </div>
                            )

                    })
                }


            </div>
        </>
    );
}
export { TransactionHistory };