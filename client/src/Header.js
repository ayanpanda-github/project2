import './App.css';
import "bootstrap/dist/css/bootstrap.css"
import {Nav, Navbar} from "react-bootstrap"
import logo from "./help_pic.png"

export default function Header(props) {
    return (
        <div className="Header">
            <Navbar bg="color" variant="dark">
                <Navbar.Brand>
                    <img styles={{width: 250, height: 250}} src={logo} alt="help pic"/>
                    
                </Navbar.Brand>

                <Nav>
                    <Nav.Link href={`helpdesk/${props.username}`}>Home</Nav.Link>
                    <Nav.Link href={`new-ticket/${props.username}`}>Create New Incident</Nav.Link>
                    <Nav.Link href={`all-incidents/${props.username}`}>All My Incidents</Nav.Link>
                    <Nav.Link href="agent-incidents">Search Agents Incidents</Nav.Link>
                    <Nav.Link href="https://uwmadison.co1.qualtrics.com/jfe/form/SV_0PnoiV6iZcT9yE6">Suggest Feedback</Nav.Link>
                </Nav>
            </Navbar>
        </div>
    )
}