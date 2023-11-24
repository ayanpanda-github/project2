const express = require("express")
const app = express()
const mongoose = require("mongoose")
const UserModel = require("./models/Users")
const bodyParser = require('body-parser')
const cors = require('cors')
const url = require("./url")

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
  }));

mongoose.connect(url)

app.route("/users").get(function(req, res) {
    UserModel.find({}, (err, result) => {
        if (err) {
            res.json(err)
        } else {
            res.json(result)
        }
    })
}).post(async (req, res) => {
    console.log(req.body)
    const user = req.body
    const createUser = new UserModel(user)

    await createUser.save((err) => {
        if (!err) {
            res.json("User was added")
        } else {
            res.json(err)
        }
    })
})

app.route("/users/:username").get(function(req, res){
    UserModel.findOne({username: req.params.username}, function(err, foundUser){
      if (!err){
        res.json(foundUser); 
      } else {
        res.json(err);
      }
    });
  });

  app.route("/users/:username/:password").get(function(req, res){
    UserModel.findOne({
      username: req.params.username,
      password: req.params.password
    }, function(err, foundUser){
      if (!err){
        res.json(foundUser); 
      } else {
        res.json(err);
      }
    });
  });

  app.route("/users/:username/logs/").patch(async (req, res) => {
    try {
      const username = req.params.username
      const updates = req.body

      const filter = {username: username}
      // only add if the log doesn't already exist
      const change = {$addToSet: {
        logs: updates.addLog
      }}

      const result = await UserModel.updateOne(filter, change)
      res.send(result)
    } catch (error) {
      console.log(error)
    }
  })

  app.route("/users/delete/:user_id/:log_id").delete(async (req, res) => {
    try {
      const user_id = req.params.user_id
      const log = req.params.log_id

      const filter = {_id: mongoose.Types.ObjectId(user_id)}
      const change = {$pull: {
        logs: {
          id: log
        }
      }}

      const result = await UserModel.updateOne(filter, change)
      res.send(result)
    } catch (error) {
      console.log(error)
    }    
  })

  app.route("/users/update/:user_id/:log_id").patch(async (req, res) => {
    try {
      const user_id = req.params.user_id
      const log = req.params.log_id

      const name = req.body.name
      const email = req.body.email
      const phone = req.body.phone
      const shortDesc = req.body.shortDesc
      const desc = req.body.desc
      const category = req.body.category
      const subcategory = req.body.subcategory
      const priority = req.body.priority
      const agentOption = req.body.agentOption
      const agentAssign = req.body.agentAssign
      const id = req.body.id

      const filter = {_id: mongoose.Types.ObjectId(user_id), "logs.id": log}
      const change = {
        $set: {
          "logs.$.name": name,
          "logs.$.email": email,
          "logs.$.phoneNumber": phone,
          "logs.$.shortDesc": shortDesc,
          "logs.$.desc": desc,
          "logs.$.category": category,
          "logs.$.subcategory": subcategory,
          "logs.$.priority": priority,
          "logs.$.agentOption": agentOption,
          "logs.$.agentAssign": agentAssign,
          "logs.$.id": id
        }
      }

      const result = await UserModel.updateOne(filter, change)
      res.send(result)
    } catch (error) {
      console.log(error)
    }
  })

app.listen(3001, () => {
    console.log("Server is running")
})