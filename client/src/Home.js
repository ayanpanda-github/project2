import './App.css';
import {useState, useEffect} from "react"
import {Button, Card} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Link, useNavigate} from "react-router-dom"

function Home() {
  const [listOfUsers, setListOfUsers] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const getUsers = async () => {
    const res = await fetch("http://localhost:3001/users");
    const data = await res.json();
    setListOfUsers(data);
  };

  const postUser = async () => {
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

  useEffect(() => {
    /*Axios.get("http://localhost:3001/users").then((response) => {
      setListOfUsers(response.data)
    })*/
    getUsers()
  }, [])

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
    postUser()
  }

  return (
    <div className="App">

    <h1 className="helpdesk-title">Welcome to the HelpDesk Application</h1>

      <section className='container'>

      <Card style={{color: 'green'}} className="login-card">
        <Card.Img src="https://picsum.photos/100/100" className="login-img"/>
        <Card.Body>
          <Card.Title>Log In Page</Card.Title>
          <Card.Text>Click here if you already have an account</Card.Text>
          <Button variant="primary" onClick={() => {
            navigate("/login")
          }}>Log In</Button>
        </Card.Body>
      </Card>

      <Card style={{color: 'green'}} className="login-card">
        <Card.Img src="https://picsum.photos/100/100" className="login-img"/>
        <Card.Body>
          <Card.Title>Sign Up Page</Card.Title>
          <Card.Text>Click here if you need to create an account</Card.Text>
          <Button variant="primary" onClick={() => {
            navigate("/signup")
          }}>Sign Up</Button>
        </Card.Body>
      </Card>

      </section>
    </div>


  );
}

export default Home;