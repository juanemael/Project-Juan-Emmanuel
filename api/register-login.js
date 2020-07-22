const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());

const users = [
    {id: 1, username:'alvin', email: 'alvin@1.id', password: 'a1', status: 1},
    {id: 2, username:'barney', email: 'barney@2.id', password: 'b2', status: 1},
    {id: 1, username:'cop', email: 'cop@3.id', password: 'c3', status: 1}
];

app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers' : '*'
    });
    next();
});
app.post('/api/users', (req, res)=>{
    const {error} = validateUsers(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    var datetime = new Date();
    console.log("\n"+datetime)
    console.log("Incoming new POST HTTP request");

    const user = {
        id: users.length + 1,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        status: req.body.status
    }
    users.push(user);
    res.send(user)
    console.log(users);
})

app.get('/api/users', (req,res)=>{
    res.send(users);
})


function validateUsers(users){
    const schema = Joi.object({
        username : Joi.string().min(3).required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: Joi.string().min(3).required(),
        status: Joi.required()
    });

    return schema.validate(users);
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port} ...`)
});