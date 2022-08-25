import React, {useEffect, useMemo, useState} from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import stockticker from "../../resources/images/stock_ticker.png";
import value from "../../resources/images/value.png";

import { accountService, alertService, tradeService } from '@/_services';
import logo from "../../resources/images/logo.png";


function PortfolioView({ history, match }) {

    const { id } = match.params;
    const { type } = match.params;
    const user = accountService.userValue;

    //todo - validation on sell side to limit amount of shares avaialble to sell to total amount of shares owned!!


    const [stock, setStock] = useState({});
    // const [stockInPortfolio, setStockInPortfolio] = useState(0);

    const [company, setCompany] = useState({});
    const [portfolio, setPortfolio] = useState({});
    const [profitLoss, setProfitLoss] = useState(0)
    const [value, setValue] = useState(0)
    const [volume, setVolume] = useState(0)
    const [profitLossFlag, setProfitLossFlag] = useState('')
    const [stockDataId, setStockDataId] = useState(0)
    const [numberOfShares, setNumberOfShares] = useState(0)
    const [correctDateFormat, setCorrectDateFormat] = useState('')
    const [correctTimeFormat, setCorrectTimeFormat] = useState('')

    const [currentCostOfPosition, setCurrentCostOfPosition] = useState(0)
    const [previousPerSharePrice, setPreviousPerSharePrice] = useState(0)
    const [refreshCounter, setRefreshCounter] = useState(0)
    const STOCK_REFRESH_RATE = 36000;

    useEffect(() => {

        if(refreshCounter > 0) {

            const stockDataJson = JSON.parse(JSON.stringify(stock));
            const {stockDataId, symbol, value,  volume} = stockDataJson
            setStockDataId(Number.parseInt(stockDataId))

            tradeService.getStock(stockDataId)
                .then(stockFromServer => {
                    setStock(stockFromServer)
                    const newCost = stockFromServer.value * portfolio.unit
                    setCurrentCostOfPosition(newCost)
                    const newDelta = newCost - portfolio.totalInvested
                    console.log(`this is new cost of trade on current prices ${newCost}`)
                    console.log(`this is new delta of trade on current prices ${newDelta}`)
                    setProfitLoss(newDelta)
                    setProfitLossFlag(newDelta < 0 ? "LOSS" : "PROFIT")
                    setValue(stockFromServer.value)
                    setVolume(stockFromServer.volume)
                })
        }

    }, [refreshCounter]);

    useEffect(() => {
        const interval = setInterval(() => {
            console.log(`logged every minute to test!`)
            setRefreshCounter(refreshCounter + 1)
        }, STOCK_REFRESH_RATE);
        return () => clearTimeout(interval);
    })


    useEffect(() => {

        // console.log(`about to get portfolio data`)
        tradeService.getSpecificPortfolio(id)
            // .then(portfolio => portfolio.json())
            .then(portfolioFromServer => {
                // console.log(`we have portfolio ${JSON.stringify(portfolioFromServer)}`)
                setPortfolio(portfolioFromServer)
                setStock(portfolioFromServer.stock)
                setStockDataId(Number.parseInt(portfolioFromServer.stock.stockId))
                setNumberOfShares(Number.parseInt(portfolioFromServer.unit))
                setPreviousPerSharePrice(portfolioFromServer.lastPerShareTradedPrice)
                const newDate = new Date(portfolioFromServer.lastTimeTraded.toString())

                setCorrectDateFormat(newDate.toDateString())
                setCorrectTimeFormat(newDate.toLocaleTimeString())

                accountService.getCompanyById(Number.parseInt(portfolioFromServer.stock.stockId))
                    .then(company => company.json())
                    .then(companyFromServer => {
                        setCompany(companyFromServer)
                    });

                tradeService.getStock(Number.parseInt(portfolioFromServer.stock.stockId))
                    .then(stockFromServer => {
                        setStock(stockFromServer)
                        const initialCost = stockFromServer.value * portfolioFromServer.unit
                        setCurrentCostOfPosition(initialCost)
                        const newDelta = initialCost - portfolioFromServer.totalInvested
                        setProfitLoss(newDelta)
                        setProfitLossFlag(newDelta < 0 ? "LOSS" : "PROFIT")
                        setValue(stockFromServer.value)
                        setVolume(stockFromServer.volume)
                    })
            });
    }, []);

    useEffect(() => {

        // console.log(`every time  stock is mutated im called!! - this is value ${Number.parseFloat(stock.value)} and this is units ${portfolio.unit}`)

        setCurrentCostOfPosition((Number.parseFloat(stock.value)) * portfolio.unit)


        // console.log(`this is current price of trade ${(Number.parseFloat(stock.value)) * portfolio.unit}`)

        // setProfitLossCalculation(p)
    }, [stock]);


    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="jumbotron jumbotron-fluid">
                            <div className="container">
                                <>
                                    <p className="lead">Your {company.name} Portfolio</p>
                                    <h3 className="display-4" style={{fontWeight: "bold"}}>Currently own {numberOfShares} [{stock.symbol}] share(s)</h3>
                                </>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-8">
                        <div className="jumbotron jumbotron-fluid">
                            <div className="container">
                                <h4 className="display-4">Key Information</h4>
                                <ul>
                                    <li className="lead">
                                        <strong>Full Name:</strong> {company.name}
                                    </li>
                                    <li className="lead">
                                        <strong>Headquarters: </strong>{company.address}
                                    </li>
                                    <li className="lead">
                                        <strong>Valuation:</strong> {company.valuation}</li>
                                    <li className="lead">
                                        <strong>CEO: </strong>{company.ceo}
                                        </li>
                                    <li className="lead">
                                        <strong>Sector:</strong> {company.sector}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="jumbotron jumbotron-fluid">
                            <div className="container">
                                <div className="row" style={{textAlign: "center"}}>
                                    {/*<div>*/}
                                    <p className="lead" style={{marginLeft: "auto", marginRight: "auto"}}>Data powered by affiliated brokers</p>
                                    <img style={{width: "12rem", display: "block", marginLeft: "auto", marginRight: "auto"}} src={logo} alt="Card image cap" />
                                    {/*</div>*/}
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>

                <div className="row">
                    <div className="col-6">
                        <div className="card-header">
                            Portfolio Breakdown
                        </div>
                        <div className="card-body">
                            <table className="table table-hover table-striped">
                                <tbody>
                                <tr>
                                    <td style={{fontWeight: "bolder"}}>Total Invested</td>
                                    <td>£{portfolio.totalInvested}</td>
                                </tr>
                                <tr>
                                    <td style={{fontWeight: "bolder"}}>Shares Owned</td>
                                    <td>{numberOfShares} unit(s)</td>
                                </tr>
                                <tr>
                                    <td style={{fontWeight: "bolder"}}>Date of last Trade</td>
                                    <td>{correctDateFormat}</td>
                                </tr>
                                <tr>
                                    <td style={{fontWeight: "bolder"}}>Time of last Trade</td>
                                    <td>{correctTimeFormat}</td>
                                </tr>
                                <tr>
                                    <td style={{fontWeight: "bolder"}}>Share Price of Trade</td>
                                    <td>£{previousPerSharePrice}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="card-footer">
                            <div style={{display: "block"}}>
                                <div className="btn-group m-2" role="group" aria-label="First group" style={{width: "100%"}}>
                                    <Link to={`/user/transactions/view/${stockDataId}`}  className="btn btn-outline-warning" style={{width: "100%"}}>
                                        VIEW TRANSACTIONS
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="card">
                            <div className="card-header">
                                Live Stock Information
                            </div>
                            <div className="card-body">
                                <table className="table table-hover table-striped">
                                    <tbody>
                                    <tr>
                                        <td style={{fontWeight: "bolder"}}>Value</td>
                                        <td>£{value}</td>
                                    </tr>
                                    <tr>
                                        <td style={{fontWeight: "bolder"}}>Volume</td>
                                        <td>{volume} unit(s)</td>
                                    </tr>
                                    <tr>
                                        <td style={{fontWeight: "bolder"}}>Symbol</td>
                                        <td>{stock.symbol}</td>
                                    </tr>
                                    <tr>
                                        <td style={{fontWeight: "bolder"}}>Current Cost of Position</td>
                                        <td>£{currentCostOfPosition}</td>
                                    </tr>

                                    <tr>
                                        <td style={{fontWeight: "bolder"}}>Profit / Loss</td>

                                        {
                                            profitLoss < 0 ?
                                                <td style={{backgroundColor: "red"}}>{profitLoss} Loss</td>
                                                :

                                                <td style={{backgroundColor: "green"}}>{profitLoss} Profit</td>

                                        }

                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="card-footer">
                                <div style={{display: "inline-block"}}>
                                    <div className="btn-group m-2" role="group" aria-label="First group">
                                        <Link to={`/user/stocks/sell/${stockDataId}`}  className="btn btn-outline-danger">
                                            SELL SHARES
                                        </Link>
                                    </div>
                                    <div className="btn-group m-2" role="group" aria-label="Second group">
                                        <Link to={`/user/stocks/buy/${stockDataId}`} className="btn btn-outline-success">
                                            BUY SHARES
                                        </Link>
                                    </div>
                                </div>
                            </div>


                                {/*<div style={{display: "inline-block"}}>*/}
                                {/*    <div className="btn-group m-2" role="group" aria-label="First group">*/}
                                {/*        <Link to={`/user/transactions/${stockDataId}`}  className="btn btn-outline-warning">*/}
                                {/*            VIEW TRANSACTIONS*/}
                                {/*        </Link>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                        </div>
                    </div>
                </div>
                <br />
            </div>
        </>
    );
}
export { PortfolioView };