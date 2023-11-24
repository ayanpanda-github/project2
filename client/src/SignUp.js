import './App.css';
import { useState, useRef, useEffect } from "react"
import { Button, Card } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import useTrait from "./useTrait.js"
import jwt_decode from "jwt-decode"

function SignUp() {
    const [listOfUsers, setListOfUsers] = useState([])
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    //const [lengthMet, setLengthMet] = useState(false)
    //const [usernameExists, setUsernameExists] = useState(false)
    const lengthMet = useTrait(false)
    const usernameExists = useTrait(false)
    const [success, setSuccess] = useState(false)

    const getUsers = async () => {
        const res = await fetch("http://localhost:3001/users");
        const data = await res.json();
        setListOfUsers(data);
        /*data.forEach(user => {
            if (username.toLowerCase() === user.username.toLowerCase()) {
                setUsernameExists(true)
            }
        })*/
    };

    const checkUser = async () => {
        const res = await fetch(`http://localhost:3001/users/${username}`);
        const data = await res.json();
        console.log(data)
        if (data != null) {
            console.log("The data is not null")
            //setUsernameExists(true)
            //currenUsernameExists.current = true
            //chkUsernameExists = true
            usernameExists.set(true)
            console.log("THER USERNAME IS " + usernameExists.get())
        } else {
            console.log("The data is null")
            //currenUsernameExists.current = false
            //chkUsernameExists = false
            usernameExists.set(false)
        }
    };

    const postUser = async (username, password) => {
        const res = await fetch("http://localhost:3001/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password,
                logs: [{}]
            })
        });
        const data = await res.json()
        setListOfUsers([...listOfUsers, {
            username,
            password,
        }])
        console.log(data)
    }

    /*
    useEffect(() => {
        if ((username.length < 5) || (password.length < 5)) {
            setLengthMet(false)
            console.log("Password length not met")
        } else {
            setLengthMet(true)
            console.log("Password length has been met")
            //checkUser()
        }
    }, [username, password])
    */

    function createUser() {
        /*Axios.post("http://localhost:3001/users", {
          username,
          password,
          logs: [{}]
        }).then((response) => {
          setListOfUsers([...listOfUsers, {
            username,
            password,
          },])
        })*/
        //setUsernameExists(false)
        setSuccess(false)

        //currenUsernameExists.current = false
        //currentLengthMet.current = false


        //let chkLengthMet = lengthMet
        //chkUsernameExists = usernameExists
        
        if ((username.length < 5) || (password.length < 5)) {
            lengthMet.set(false)
            //setLengthMet(false)
            //chkLengthMet = false
            //currentLengthMet.current = false
            console.log("Password length not met")
        } else {
            lengthMet.set(true)
            //setLengthMet(true)
            //chkLengthMet = true
            //currentLengthMet.current = true
            console.log("Password length has been met")
            //console.log("username exists before: " + currenUsernameExists.current)
            checkUser()
            //console.log("username exists after: " + currenUsernameExists.current)
        }
        
        

        //if (chkLengthMet) {
        if (lengthMet.get()) {
            checkUser().then(res => {
                console.log(res)
            }).catch(err => {
                console.error(err)
            }) 
        }

        console.log("username exists: " + usernameExists.get())
        console.log("Length met: " + lengthMet.get())

        
        if (!usernameExists.get() && lengthMet.get()) {
            postUser(username, password)
            console.log("user posted")
            setSuccess(true)
        }
        

        console.log("Success " + !success)
    }

    return (
        <div className="App">

            <h1 className="helpdesk-title">Sign Up</h1>

            <div>
                <div className='input-holder'>
                    <input type="text" placeholder='username...' onChange={(event) => {
                        setUsername(event.target.value)
                    }} />
                    <br />
                    <input type="text" placeholder='password...' onChange={(event) => {
                        setPassword(event.target.value)
                    }} />
                </div>
                <Button variant="primary" onClick={createUser}>Create User</Button>
                <br />
            </div>

            {!lengthMet.get() && <h1 className='error-text'>Please make sure your username and password are at least 5 characters long.</h1>}

            {usernameExists.get() && <h1 className='error-text'>An account with this username already exists in our database. Please choose a different username.</h1>}

            {(success) && <h1 className='success-text'>The user has successfully logged in to the system. Please log in now.</h1>}
        </div>

    );
}

export default SignUp;