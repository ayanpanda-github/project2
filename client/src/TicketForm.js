import React, { isValidElement, useState, useEffect } from "react";
import { isPossiblePhoneNumber } from 'react-phone-number-input'
import Header from "./Header.js"
import Form from 'react-bootstrap/Form'
import { Button, Col, Row, InputGroup } from "react-bootstrap";
import { Link, useParams, useLocation } from "react-router-dom"
import axios from 'axios'

export default function TicketForm() {

    const location = useLocation()

    console.log(location)

    const { state: exists } = location

    // got form validation help from here: https://www.youtube.com/watch?v=EYpdEYK25Dc&t=416s
    const startValues = {
        name: (exists ? exists.name : ""), email: (exists ? exists.email : ""),
        phoneNumber: (exists ? exists.phone : ""), shortDesc: (exists ? exists.shortDesc : ""), desc: (exists ? exists.desc : ""),
        category: (exists ? exists.category : ""), subcategory: (exists ? exists.subcategory : ""),
        priority: (exists ? exists.priority : 1), agentOption: (exists ? exists.checked : false), agentAssign: (exists ? exists.agent : ""), id: (exists ? exists.log_id : "!")
    }

    const [agentThere, setAgentThere] = useState(false)

    const stateNames = {
        name: "name", email: "email", phoneNumber: "phone number", shortDesc: "short description", desc: "description",
        category: "category", subcategory: "subcategory", agentAssign: "agent"
    }

    const [formValues, setFormValues] = useState(startValues)
    const [formErrors, setFormErrors] = useState({})
    const [submit, setSubmit] = useState(false)
    const [validate, setValidate] = useState(false)

    const [formSuccess, setFormSuccess] = useState(false)

    function handleChange(event) {
        const { name, value } = event.target
        setFormValues({
            ...formValues,
            [name]: value
        })
        //console.log(formValues)
    }

    const params = useParams()

    // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    function makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }


    // source: https://bobbyhadz.com/blog/react-check-if-email-is-valid

    function isValid(email) {
        return /\S+@\S+\.\S+/.test(email);
    }

    /*

    function emailChange(event) {
        if (isValid(event.target.value)) {
            setEmailError(false)
        } else {
            setEmailError(true)
        }

        setEmail(event.target.value)
    }

    function phoneChange(event) {
        if (isPossiblePhoneNumber(event.target.value)) {
            setPhoneError(false)
            console.log("good")
        } else {
            console.log("bad")
            setPhoneError(true)
        }

        setPhoneNumber(event.target.value)
        console.log(phoneNumber)
    }
    */

    function assignAgent(event) {
        //console.log(event.target.checked)

        const { name } = event.target

        if (event.target.checked === false) {
            setFormValues({
                ...formValues,
                [name]: false
            })
        } else {
            setFormValues({
                ...formValues,
                [name]: true
            })
        }
    }

    function handleSubmit(event) {
        event.preventDefault()
        setFormErrors(checkVals(formValues))
        setSubmit(true)
    }

    useEffect(() => {
        //console.log(formErrors)
        if (Object.keys(formErrors).length === 0 && submit) {

            let existing = false

            // this is an existing ticket that needs to be updated
            if (formValues.id !== "!") {
                existing = true

                axios.patch(`http://localhost:3001/users/update/${exists.user_id}/${exists.log_id}/`, {
                    name: formValues.name, 
                    email: formValues.email, 
                    phone: formValues.phoneNumber,  
                    shortDesc: formValues.shortDesc,
                    desc: formValues.desc, 
                    category: formValues.category, 
                    subcategory: formValues.subcategory, 
                    priority: formValues.priority,
                    agentOption: formValues.agentOption, 
                    agentAssign: formValues.agentAssign, 
                    id: formValues.id,
                }, {
                    headers: { 'Content-type': 'application/json; charset=UTF-8' }
                }).then(response => {
                    console.log(response)
                }).catch(error => {
                    console.log(error)
                })
            }

            if (!existing) {
                formValues.id = makeid(10)
                // default when not assigned to agent
                if (formValues.agentOption === false) {
                    formValues.agentAssign = params.username
                }

                axios.patch(`http://localhost:3001/users/${formValues.agentAssign}/logs/`, {
                    addLog: formValues
                }, {
                    headers: { 'Content-type': 'application/json; charset=UTF-8' }
                }).then(response => {
                    console.log(response)
                }).catch(error => {
                    console.log(error)
                })
            }

            setFormSuccess(true)
            //console.log(formValues)
            // appendLog()
        } else {
            setFormSuccess(false)
        }
    }, [formErrors])

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`http://localhost:3001/users/${formValues.agentAssign}`);
                const data = await res.json();
                //console.log(data)
                if (data != null) {
                    setAgentThere(true)
                } else {
                    setAgentThere(false)
                }
            } catch (error) {
                console.log(error)
            }
        })()
    }, [validate, formValues.agentAssign])

    /*
    async function checkAgent(agent) {
        const res = await fetch(`http://localhost:3001/users/${agent}`);
        const data = await res.json();
        if (data != null) {
            return true
            //setAgentThere(true)
        } else {
            return false
            //setAgentThere(false)
        }
    }
    */

    function checkVals(values) {
        const errors = {}

        if (!isValid(values.email)) {
            errors.email = "Please use a valid email"
        }

        if (!isPossiblePhoneNumber(values.phoneNumber)) {
            errors.phoneNumber = "Please use a phone number in the format specified"
        }

        //console.log(formValues.desc)

        for (const value in formValues) {
            //console.log(formValues[value])
            if (value === "agentAssign") {
                if (formValues.agentOption === true) {
                    // make sure the field is filled when option to assign is selected
                    if (formValues[value] === "") {
                        errors[value] = `Please don't leave the ${stateNames[value]} as an empty field`
                        // make sure the agent tryign to assign to is an actual agent
                    } else {
                        setValidate(!validate)

                        if (!agentThere) {
                            errors[value] = "Please make sure the agent exists"
                        }
                        /*
                        checkAgent(formValues[value]).then((val) => {
                            console.log("The val is " + val)
                            if (val === false) {
                                errors[value] = "Please make sure the agent exists"
                            }
                        })
                        */

                    }
                }
            }

            if (formValues[value] === "" && value !== "agentAssign") {
                errors[value] = `Please don't leave the ${stateNames[value]} as an empty field`
            }
        }

        /*
        formValues.forEach(value => {
            if (value === "") {
                errors.value = `Please don't leave the ${stateNames[value]} as an empty field`
            }
        })
        */

        return errors
    }

    // got bootsrap template from here: https://react-bootstrap.github.io/forms/layout/

    return (
        <div className="ticket-form">
            <Form onSubmit={handleSubmit}>

                <Form.Group className="mb-3 w-50" controlId="formGridAddress1">
                    <Form.Label>Customer's Full Name </Form.Label>
                    <Form.Control name="name" defaultValue={exists ? exists.name : ""} onChange={handleChange} placeholder="Name" />
                    <p className="error">{formErrors.name}</p>
                </Form.Group>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>Customer's Email</Form.Label>
                        <Form.Control name="email" defaultValue={exists ? exists.email : ""} onChange={handleChange} placeholder="123@gmail.com" />
                        <p className="error">{formErrors.email}</p>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Customer's Phone Number</Form.Label>
                        <Form.Control name="phoneNumber" defaultValue={exists ? exists.phone : ""} onChange={handleChange} placeholder="+1234567890" />
                        <Form.Text id="passwordHelpBlock" muted>
                            Phone number should start with + and be followed by 11 digits
                        </Form.Text>
                        <p className="error">{formErrors.phoneNumber}</p>
                    </Form.Group>
                </Row>

                <Form.Group className="mb-3" controlId="formGridAddress2">
                    <Form.Label>Short Description</Form.Label>
                    <Form.Control name="shortDesc" defaultValue={exists ? exists.shortDesc : ""} onChange={handleChange} placeholder="Brief Description of Customer's Issue" />
                    <p className="error">{formErrors.shortDesc}</p>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGridAddress2">
                    <Form.Label>Description</Form.Label>
                    <Form.Control name="desc" defaultValue={exists ? exists.desc : ""} onChange={handleChange} as="textarea" rows="4" columns="3" placeholder="Full Description of Customer's Issue" />
                    <p className="error">{formErrors.desc}</p>
                </Form.Group>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridCity">
                        <Form.Label>Category</Form.Label>
                        <Form.Control name="category" defaultValue={exists ? exists.category : ""} onChange={handleChange} />
                        <p className="error">{formErrors.category}</p>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridZip">
                        <Form.Label>Subcategory</Form.Label>
                        <Form.Control name="subcategory" defaultValue={exists ? exists.subcategory : ""} onChange={handleChange} />
                        <p className="error">{formErrors.subcategory}</p>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridState">
                        <Form.Label>Priority Level</Form.Label>
                        <Form.Select name="priority" defaultValue={exists ? exists.priority : 1} value={formValues.priority} onChange={handleChange}>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                        </Form.Select>
                    </Form.Group>
                </Row>

                <Row className="mb-2">
                    <Form.Group as={Col} id="formGridCheckbox">
                        <Form.Check name="agentOption" defaultChecked={exists ? exists.checked : false} type="checkbox" label="Assign to Agent" onClick={assignAgent} />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridZip">
                        <Form.Label>Assign to Agent</Form.Label>
                        <Form.Control name="agentAssign" defaultValue={exists ? exists.agent : ""} disabled={exists ? !exists.checked : !formValues.agentOption} onChange={handleChange} />
                        <p className="error">{formErrors.agentAssign}</p>
                    </Form.Group>

                </Row>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
                {formSuccess && <p className="success">The ticket was successfully submitted!!!</p>}
            </Form>

            <br />
            <Link to={`/helpdesk/${params.username}`}>Go back to home</Link>
        </div>
    )
}

