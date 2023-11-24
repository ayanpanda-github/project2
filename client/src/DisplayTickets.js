import React, {useState, useEffect} from "react"
import { Link, useNavigate, useLocation, useParams } from "react-router-dom"
import Header from "./Header"
import axios from "axios"
import clsx from "clsx"

export default function DisplayTickets(props) {
    const [logs, setLogs] = useState(null)
    const [allData, setAllData] = useState(null)
    const navigate = useNavigate()

    const colorMap = { "1": "green", "2": "yellow", "3": "red" }

    const params = useParams()

    useEffect(() => {
        fetch(`http://localhost:3001/users/${params.username}`)
            .then(res => res.json())
            .then(data => {
                //console.log(data)
                setLogs(data.logs)
                setAllData(data)
                //console.log(data._id)
            })
    }, [params.user])

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
            
            {(logs && logs.length <= 1) ? 
            <h1 className='centered'>You currently don't have any tickets</h1> : 
            <h1 className='centered'>Here are all the tickets you have</h1>}

            <br />

            <div>
            {(logs && allData) && logs.map((log) => {
                // these include all the tickets
                if (log != null && log.name != null) {

                    const styling = clsx("ticket", {
                        "safe": colorMap[log.priority] === "green",
                        "warning": colorMap[log.priority] === "yellow",
                        "danger": colorMap[log.priority] === "red"
                    })

                    console.log(log)

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
            </div>
            <div><Link to={`/helpdesk/${params.username}`}>Go back to home</Link></div>
        </>
    )
}


