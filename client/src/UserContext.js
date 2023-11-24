import React, {useState, createContext} from "react"

const UserContext = createContext()

function UserProvider(props) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [logs, setLogs] = useState({})

    const user = {
        username: username,
        password: password,
        logs: logs,
        modifyUser: modifyUser
    }

    function modifyUser(updateUser) {
        setUsername(updateUser.username)
        setPassword(updateUser.password)
        setLogs(updateUser.logs)
    }

    return (
        <UserContext.Provider value={user}>
            {props.children}
        </UserContext.Provider>
    )
}

export {UserContext, UserProvider}