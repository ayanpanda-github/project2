import './App.css';
import { useState, useEffect, useContext } from "react"
import { Button, Card } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link, useNavigate, useLocation, useParams } from "react-router-dom"
import { UserContext } from './UserContext';
import Header from "./Header"
import axios from "axios"
import clsx from "clsx"
import BarChart from "./BarChart"

function HelpDesk(props) {
    const context = useContext(UserContext)
    const [name, setName] = useState("")
    const [logs, setLogs] = useState(null)
    const [allData, setAllData] = useState(null)
    const [logData, setLogData] = useState(null)
    const navigate = useNavigate()
    const location = useLocation()

    const [allUsers, setAllUsers] = useState(null)

    const colorMap = { "1": "green", "2": "yellow", "3": "red" }

    const [mapUsername, setMapUsername] = useState([])
    const [mapLogsLength, setMapLogsLength] = useState([])

    const [agentsPresent, setAgentsPresent] = useState(0)

    const params = useParams()

    useEffect(() => {
        fetch(`http://localhost:3001/users/${params.user}`)
            .then(res => res.json())
            .then(data => {
                //console.log(data)
                setLogs(data.logs)
                setAllData(data)
                //console.log(data._id)
            })

        fetch(`http://localhost:3001/users`)
            .then(res => res.json())
            .then(data => {
                setAllUsers(data)

                setAgentsPresent(data.length)

                data.forEach(person => {
                    setMapUsername(prevUsername => [...prevUsername, person.username])
                    setMapLogsLength(prevLength => [...prevLength, person.logs.length - 1])
                })
            })
    }, [params.user])

    const barData = {
        labels: mapUsername.slice(0,agentsPresent),
        // datasets is an array of objects where each object represents a set of data to display corresponding to the labels above. for brevity, we'll keep it at one object
        datasets: [
            {
                label: 'Popularity of colours',
                data: mapLogsLength.slice(0,agentsPresent),
                // you can set indiviual colors for each bar
                backgroundColor: [
                    "red"
                ],
                borderWidth: 1,
            }
        ],
    }

    /*
    {logs && logs.map(log => {
        if (log.agentOption === false) {
           return <h1>{log.name}</h1>
        } else {
            return null
        }
    })}

    {console.log(logs.length)}
    */

    function deleteLog(event) {
        console.log(allData._id)
        console.log(event.target.value)
        axios.delete(`http://localhost:3001/users/delete/${allData._id}/${event.target.value}`)
        window.location.reload();
    }

    function editLog(log) {

        console.log(log)

        navigate(`/helpdesk/new-ticket/${params.user}`, {
            state: {
                name: log.name,
                email: log.email,
                phone: log.phoneNumber,
                shortDesc: log.shortDesc,
                desc: log.desc,
                category: log.category,
                subcategory: log.subcategory,
                priority: log.priority,
                checked: log.agentOption,
                agent: log.agentAssign,
                user_id: allData._id,
                log_id: log.id
            }
        })
    }


    return (
        <>
            <Header username={params.user} />
            {allUsers && console.log(agentsPresent)}
            <h1 className='centered'>Welcome to your Helpdesk {params.user}</h1>
            
            {(logs && logs.filter(x => x.agentOption === true).length === 0) ? 
            <h1 className='centered'>No tickets have been assigned to you yet</h1> : 
            <h1 className='centered'>Here are all the tickets that were assigned to you</h1>}

            <br />
            {(logs && allData) && logs.map((log) => {
                // these will only be the tickets assigned to this agent (not all the tickets)
                if (log != null && log.name != null && log.agentOption === true) {

                    const styling = clsx("ticket", {
                        "safe": colorMap[log.priority] === "green",
                        "warning": colorMap[log.priority] === "yellow",
                        "danger": colorMap[log.priority] === "red"
                    })

                    return <div className={styling}>

                        <h1>{log.agentAssign}</h1>
                        <p>Category: {log.category}</p>
                        <p>Subcategory: {log.subcategory}</p>
                        <p>{log.desc}</p>
                        <p>{colorMap[log.priority]}</p>

                        <button value={log.id} onClick={deleteLog}>Delete</button>
                        <button onClick={() => editLog(log)}>Edit</button>
                    </div>
                } else {
                    return null
                }
            })}
            <BarChart chartData={barData} />
            <br />
            <Link to={`/login`}>Go back to Login</Link>
        </>
    )
}

export default HelpDesk