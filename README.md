# HelpDesk MERN Web App

## Summary

<img width="941" alt="Help_img" src="https://user-images.githubusercontent.com/54414848/185546891-704e95af-19ec-4898-a969-907cb81dfd82.png">

This was an attempt to recreate the ticketing system used by Cherwell above with the MERN stack (MongoDB, Express.js, React.js, Node.js). It features a login and signup page to create and authenticate a help desk agent. On each agent's help desk page, they can create their own tickets, assign tickets to other agents, view their tickets, view other agents' tickets, edit or delete their own tickets, view the number of tickets other agents have by viewing a bar graph, and lastly details on how the site can be improved can be submitted by filling out the Qualtrics survey.

## Code Details (Technical)

On the server side, in Users.js, the UserModel requires the user to have a username, a password, and a logs array which contains all the tickets a user has. Using this model, in index.js I set up REST API routes that allowed me to view all the agents, search for specific agents, and add, edit, and delete tickets from the logs array. 

On the client side, I can fill out a form using TicketForm.js. This contains error validation to make sure all the fields are filled out in a certain format, and if an agent decides to create a ticket for another agent, the agent they are creating a ticket for must exist in the database. Also, in HelpDesk.js, these tickets can also be edited or deleted by communicating with the REST API routes. Lastly, on the help desk home page, the Chart.js library was used to create a bar graph that dispays the number of tickets all the other users have. On the tab for Search Agent Incidents, we can populate all the tickets from the logs array for a valid agent that the current agent has searched for. The last Navbar item "Suggest Feedback" contains the link to a Qualtrics survey.

## Further Improvements

- Fix the Navbar routing
- Figure out the issue of the useState hook being asynchronous in the login and signup page
- Find how to use JWT in Google OAuth
- Improve the UI of the site
