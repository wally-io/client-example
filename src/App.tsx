import React, {useEffect, useState} from 'react'
import './App.scss'
import Http from "./utils/Http"
import {Button, FormControl, Row} from "react-bootstrap"
import {ethers} from "ethers"

import ERC20 from "erc-20-abi"

export const domain = process.env.REACT_APP_WALLY_API

const USDC_ADDRESS = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F"

function App() {
    const [amount, setAmount] = useState("")
    const [addressFrom, setAddressFrom] = useState("")
    const [addressTo, setAddressTo] = useState("")
    const [usdcBalanceFrom, setUsdcBalanceFrom] = useState("")
    const [usdcBalanceTo, setUsdcBalanceTo] = useState("")
    const [dappRegistrationLink, setDappRegistrationLink] = useState("")

    console.log("domain: ", domain)

    useEffect(() => {
        Http.post(domain!, "/auth/login", null, {email: "admin@rct.ai", password: "admin123"}, (response: any) => {
            localStorage.setItem("token", response.token)
            Http.get(domain!, "/wallet/dapp/connect/link", response.token, {dappId: "fa94d55a-00fb-41a4-b58a-d50b12092a87", dappUserIdentifier: "admin"}, (response: any) => {
                setDappRegistrationLink(response.path)
            }, (error) => {
                console.error(error)
            })
        }, (error) => {
            console.error(error)
        })
    }, [])

    const getUSDCBalance = async (address: string, set: any) => {
        let provider = ethers.getDefaultProvider('goerli')
        const contract = new ethers.Contract(USDC_ADDRESS, ERC20, provider);
        const balance = await contract.balanceOf(address)
        set(balance.toString())
    }

    const transferTokens = () => {
        const token = localStorage.getItem("token")!
        Http.post(domain!, "/transactions/create", token, {
            dappId: "fa94d55a-00fb-41a4-b58a-d50b12092a87",
            walletAddress: addressFrom,
            contractAddress: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
            method: "transfer",
            parameters: [addressTo, amount]
        }, (response: any) => {
        }, (error) => {
            console.error(error)
        })
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Hello world</h1>
            </header>
            <h4>Connect your wallet to DApp: {dappRegistrationLink}</h4>
            <Row>
                <h4> From: <FormControl value={addressFrom} onChange={(event) => setAddressFrom(event.target.value)}/></h4>
                <h4> USDC: {usdcBalanceFrom} <Button onClick={() => getUSDCBalance(addressFrom, setUsdcBalanceFrom)} /></h4>
            </Row>
            <Row>
                <h4> To: <FormControl value={addressTo} onChange={(event) => setAddressTo(event.target.value)}/></h4>
                <h4> USDC: {usdcBalanceTo} <Button onClick={() => getUSDCBalance(addressTo, setUsdcBalanceTo)} /> </h4>
            </Row>

            <Row>
                <h4> Transfer: <FormControl value={amount} onChange={(event) => setAmount(event.target.value)}/></h4>
                <h4> <Button onClick={transferTokens}> Transfer </Button> </h4>
            </Row>
        </div>
    )
}

export default App
