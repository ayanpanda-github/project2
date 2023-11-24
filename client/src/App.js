import './App.css';
import { BrowserRouter, Route, Switch, Link, Routes } from "react-router-dom"
import Home from "./Home.js"
import Login from "./Login.js"
import SignUp from "./SignUp.js"
import HelpDesk from "./HelpDesk.js"
import TicketForm from "./TicketForm.js"
import DisplayTickets from "./DisplayTickets.js"
import SearchAgent from "./SearchAgent.js"
import { UserProvider } from "./UserContext.js"
import { useEffect } from "react"

function App() {

  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/helpdesk/:user" element={<HelpDesk />} />
          <Route exact path="/helpdesk/new-ticket/:username" element={<TicketForm />} />
          <Route exact path="/helpdesk/all-incidents/:username" element={<DisplayTickets />} />
          <Route exact path="/helpdesk/agent-incidents" element={<SearchAgent />} />
          <Route exact path="/helpdesk/agent-incidents/:username" element={<DisplayTickets />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>

  );
}

export default App;
