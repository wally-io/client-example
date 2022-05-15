import React, {useEffect, useState} from 'react'
import './App.scss'
import Http from "./utils/Http"

const domain = process.env.REACT_APP_WALLY_API

function App() {
    const [dappRegistrationLink, setDappRegistrationLink] = useState("")

    console.log("domain: ", domain)

    useEffect(() => {
        Http.post(domain!, "/auth/login", null, {email: "admin@rct.ai", password: "admin123"}, (response: any) => {
            localStorage.setItem("token", response.token)
            Http.get(domain!, "/wallet/dapp/connect/link", response.token, {dappId: "fa94d55a-00fb-41a4-b58a-d50b12092a87", appUserIdentifier: "admin"}, (response: any) => {
                setDappRegistrationLink(response.path)
            }, (error) => {
                console.error(error)
            })
        }, (error) => {
            console.error(error)
        })
    }, [])


    return (
        <div className="App">
            <header className="App-header">
                <h1>Hello world</h1>
            </header>
            <h4>Connect your wallet to DApp: {dappRegistrationLink}</h4>
        </div>
    )
}

export default App
