const express = require('express')
const shortid = require('shortid')
const server = express()

server.use(express.json()) //middleware to read json for req.body

let users = [
    {
        id: shortid.generate(), // hint: use the shortid npm package to generate it
        name: "Jane Doe", // String, required
        bio: "Not Tarzan's Wife, another Jane",  // String, required
    },
    {
        id: shortid.generate(),
        name: 'Francus',
        bio: 'Francus Nastus the boyfriend'
    }
]

// ```````````GET```````````````
server.get('/',(req, res) => {
    res.json("Hi")
    throw new Error('BROKEN') // Express will catch this on its own
  })

// get users
server.get('/api/users', (req, res) => {
    if (users) {
        res.json(users)
    } else {
      throw new Error(res.status(500).json({ errorMessage: 'The users information could not be retrieved' }))
    }
})

// get specific user by id
server.get('/api/users/:id', (req, res) => {
    const id = req.params.id
    const user = users.find(user => user.id === id)

    if (!user) {
        res.status(404).json({ message: "The user with the specified ID does not exist." })
    }
    else {
        res.json(user)
    }

   throw new Error(res.status(500).json({ errorMessage: "The user information could not be retrieved." }))
})

//````````POST````````````` 
// post new user
server.post('/api/users', (req, res) => {
    const newUser = req.body

    newUser.id = shortid.generate()

    if (!newUser.name || !newUser.bio) {
        res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' })
    } else {
        users.push(newUser)
        res.status(201).json(newUser)
    }

    throw new Error(res.status(500).json({ errorMessage: "There was an error while saving the user to the database" }))
})

// ````````DELETE```````````
server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const deleted = users.find(user => user.id === id)

    if (!deleted) {
        res.status(404).json({ message: "The user with the specified ID does not exist." })
    } else {
        users = users.filter(user => user.id !== id)
        res.json(deleted)
    }

   throw new Error(res.status(500).json({ errorMessage: "The user could not be removed" }))
})

// `````````PUT```````````
server.put('/api/users/:id', (req, res) => {
    const id = req.params.id
    const changes = req.body

    let updated = users.find(user => user.id === id)

    if(!updated){
        res.status(404).json({message: "The user with the specified ID does not exist."})
    }else if(!updated.name || !updated.bio){
        res.status(400).json({errorMessage: "Please provide name and bio for the user."})
    }else{
        updated = Object.assign(updated, changes)
        res.status(200).json(updated)
    }

   throw new Error(res.status(500).json({errorMessage: "The user information could not be modified." }))
})



// `````port and server set-up :
const port = 8000
server.listen(port, () => console.log(`server running on port ${port}`))