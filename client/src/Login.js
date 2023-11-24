import './App.css';
import { useState, useEffect, useContext } from "react"
import { Button, Card } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Link, useNavigate, Router, useNavigationType} from "react-router-dom"
import {UserContext} from "./UserContext.js"
import jwt_decode from "jwt-decode"
import google_client_id from './google_client';

function Login() {
    const [listOfUsers, setListOfUsers] = useState([])
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [failure, setFailure] = useState(true)
    const [userData, setUserData] = useState({})

    const [checker, setChecker] = useState(false)

    function handleCallbackResponse(response) {
        console.log("Encoded JWT token: " + response.credential)
        var obj = jwt_decode(response.credential)
        // fix error of set not updating right away
        //setUsername(obj.name)
        //setPassword(obj.sub)
        //postUser(obj.name, obj.sub)

        console.log(obj)
    }
  
    
    // help from here https://www.youtube.com/watch?v=roxC8SMs7HU
    useEffect(() => {
      // eslint-disable-next-line no-undef
      google.accounts.id.initialize({
        client_id: google_client_id,
        callback: handleCallbackResponse
      })

      // eslint-disable-next-line no-undef
      google.accounts.id.renderButton(
        document.getElementById("signIn"),
        {theme: "outline", size: "large"}
      )
    }, [])

    const context = useContext(UserContext)

    const navigate = useNavigate()

    const checkUser = async (username, password) => {
        const res = await fetch(`http://localhost:3001/users/${username}/${password}`);
        const data = await res.json();
        console.log(data)
        //console.log(data.username)
        if (data != null) {
            setFailure(false)
            setUserData(data)
            setChecker(false)
        } else {
            console.log("setting to true")
            setFailure(true)
            setChecker(true)
        }
        //setListOfUsers(data);
    };

    function validateUser() {
        checkUser(username, password)
        console.log(failure + " what")
    }

    if (failure) {
        return (
            <div className="App">
    
                <h1 className="helpdesk-title">Log In Page</h1>
    
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
                    <Button variant="primary" onClick={validateUser}>Log In</Button>
                    <br />
                    <div className="g-signin2" id="signIn"></div>
                    {checker &&  <h2 className="error">The Log In attempt has failed. Please try again</h2>}
                </div>
            </div>
    
        );
    } else {
        return (
            <>
            {console.log("You doing anything?")}
            {context.modifyUser(userData)}  
            {navigate(`/helpdesk/${username}`, {
                state: {
                    username: userData.username,
                    password: userData.password,
                    logs: userData.logs
                }
            })}
            
            </>
        )
    }
}

export default Login;