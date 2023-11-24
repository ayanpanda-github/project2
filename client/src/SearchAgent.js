import React from "react"
import Header from "./Header"
import { useState, useEffect, useContext } from "react"
import { Link, useNavigate, useLocation, useParams } from "react-router-dom"
import { Button, Card } from 'react-bootstrap'

export default function SearchAgent() {
    const [agent, setAgent] = useState()
    const [error, setError] = useState(true)

    const navigate = useNavigate()

    const checkUser = async (username, password) => {
        const res = await fetch(`http://localhost:3001/users/${agent}`);
        const data = await res.json();
        console.log(data)
        //console.log(data.username)
        if (data != null) {
            setError(false)
        } else {
            console.log("setting to true")
            setError(true)
        }
        //setListOfUsers(data);
    };

    function validateAgent(agent) {
        checkUser(agent)
    }

    return (
        <>
            <Header />
            <h1 className='centered'>Search for Agent's Tickets</h1>
            <div className="centered">
                <input className='input-holder' type="text" placeholder='username...' onChange={(event) => {
                    setAgent(event.target.value)
                }} />
                <Button variant="primary" onClick={() => validateAgent(agent)}>Log In</Button>
            </div>
            {error ? <h1 className="centered error">Agent Does Not Exist</h1> : navigate(`/helpdesk/agent-incidents/${agent}`, {
                state: {
                    username: agent,
                }
            })}
        </>
    )
}