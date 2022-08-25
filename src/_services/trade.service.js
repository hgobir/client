import {BehaviorSubject} from 'rxjs';
import config from 'config';
import {fetchWrapper, history } from "@/_helpers";
import {appConstants} from "@/_constants";

const userSubject = new BehaviorSubject(null);
const baseUrl = `${config.apiUrl}`;

export const tradeService = {

    getStocks,
    getStock,
    getStockData,
    executeOrder,
    getOrders,
    getPortfolio,
    getPortfolios,
    getSpecificPortfolio,
    getTransactions,
    getUpdatedValuesInTransactions,
    getTrades,
    getReport,
    user: userSubject.asObservable(),
    get userValue() { return userSubject.value }
}

function executeOrder(type, symbol, numberOfShares, applicationUserId) {
    let jwtToken = localStorage.getItem("jwt")
    return fetchWrapper.post(`${appConstants.SERVER_URL}/api/v1/server/orderRequests/execute/${type}/${symbol}/${numberOfShares}/${applicationUserId}`, {}, jwtToken)
}

function getStocks() {
    let jwtToken = localStorage.getItem("jwt")
    return fetchWrapper.get(`${appConstants.SERVER_URL}/api/v1/server/stocks`, {'Authorization': jwtToken})
        .then(res => res.json())
        .then((stocks) => {
            // console.log(`this is stocks retrieved from api ${JSON.stringify(stocks)}`)
            return stocks;
        })
}

function getStockData() {
    let jwtToken = localStorage.getItem("jwt")
    return fetchWrapper.get(`${appConstants.SERVER_URL}/api/v1/server/stocks/stockData`, {'Authorization': jwtToken})
        .then(res => res.json())
        .then((stockData) => {
            // console.log(`this is stocks retrieved from api ${JSON.stringify(stocks)}`)
            return stockData;
        })
}

function getStock(id) {
    let jwtToken = localStorage.getItem("jwt")
    return fetchWrapper.get(`${appConstants.SERVER_URL}/api/v1/server/stocks/${id}`, {'Authorization': jwtToken})
        .then(res => res.json())
        .then((stock) => {
            // console.log(`this is stocks retrieved from api ${JSON.stringify(stocks)}`)
            return stock;
        })
}

function getOrders(id) {
    let jwtToken = localStorage.getItem("jwt")
    return fetchWrapper.get(`${appConstants.SERVER_URL}/api/v1/server/orderRequests/${id}`, {'Authorization': jwtToken})
        .then(res => res.json())
        .then((orders) => {
            // console.log(`this is stocks retrieved from api ${JSON.stringify(stocks)}`)
            return orders;
        })
}

function getPortfolio(applicationUserId, stockId) {
    let jwtToken = localStorage.getItem("jwt")
    return fetchWrapper.get(`${appConstants.SERVER_URL}/api/v1/server/portfolio/${applicationUserId}/${stockId}`, {'Authorization': jwtToken})
        .then(res => res.json())
        .then((portfolio) => {
            console.log(`this is portfolio retrieved from api ${JSON.stringify(portfolio)}`)
            return portfolio;
        })
}

function getPortfolios(applicationUserId) {
    let jwtToken = localStorage.getItem("jwt")
    return fetchWrapper.get(`${appConstants.SERVER_URL}/api/v1/server/portfolio/${applicationUserId}`, {'Authorization': jwtToken})
        .then(res => res.json())
        .then((portfolio) => {
            // console.log(`this is stocks retrieved from api ${JSON.stringify(stocks)}`)
            return portfolio;
        })
}

function getSpecificPortfolio(portfolioId) {
    let jwtToken = localStorage.getItem("jwt")
    return fetchWrapper.get(`${appConstants.SERVER_URL}/api/v1/server/portfolio/specific/${portfolioId}`, {'Authorization': jwtToken})
        .then(res => res.json())
        .then((portfolio) => {
            // console.log(`this is stocks retrieved from api ${JSON.stringify(stocks)}`)
            return portfolio;
        })
}

function getTransactions(applicationUserId) {
    let jwtToken = localStorage.getItem("jwt")
    return fetchWrapper.get(`${appConstants.SERVER_URL}/api/v1/server/transactions/${applicationUserId}`, {'Authorization': jwtToken})
        .then(res => res.json())
        .then((transactions) => {
            console.log(`this is transactions retrieved from api ${JSON.stringify(transactions)}`)
            return transactions;
        })
}

function getUpdatedValuesInTransactions(transactions) {
    let jwtToken = localStorage.getItem("jwt")
    return fetchWrapper.post(`${appConstants.SERVER_URL}/api/v1/server/transactions/getCurrentValues`, transactions, jwtToken)
        .then(res => res.json())
        .then((updatedTransactions) => {
            console.log(`this is stocks retrieved from api ${JSON.stringify(updatedTransactions)}`)
            return updatedTransactions;
        })
}

function getTrades(applicationUserId, stockId) {
    let jwtToken = localStorage.getItem("jwt")
    return fetchWrapper.get(`${appConstants.SERVER_URL}/api/v1/server/trade/${applicationUserId}/${stockId}`, {'Authorization': jwtToken})
        .then(res => res.json())
        .then((updatedTrades) => {
            console.log(`this is trades retrieved from api ${JSON.stringify(updatedTrades)}`)
            return updatedTrades;
        })
}

function getReport(applicationUserId, reportType, stockDataSelection, reportFormat) {
    let jwtToken = localStorage.getItem("jwt")
    // console.log(`this is values about to passed into fetch ${applicationUserId} , ${reportType}, ${reportFormat}, ${stockDataSelection}`)
    return fetchWrapper.post(`${appConstants.SERVER_URL}/api/v1/server/reports/${applicationUserId}/${reportType}/${reportFormat}`, stockDataSelection, jwtToken)
        // .then(res => res.bodyUsed)
        .then(res => res.blob())
        .then((report) => {
            // console.log(`this is type of blob report retrieved from api ${report.type}`)
            // console.log(`this is size of blob report retrieved from api ${report.size}`)
            return report;
        })
}
