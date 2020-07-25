const Joi = require('joi');
const express = require('express');
const app = express();
const mysql = require('mysql');
app.use(express.json());

const users = [
    {id: 1, username:'alvin', email: 'alvin@1.id', password: 'a123', status: 1},
    {id: 2, username:'barney', email: 'barney@2.id', password: 'b123', status: 1},
    {id: 1, username:'cop', email: 'cop@3.id', password: 'c123', status: 1}
];

app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers' : '*'
    });
    next();
});

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mydb"
});
app.post('/api/users', (req, res)=>{
    const {error} = validateUsers(req.body);
    if(error) {
        return res.status(400).send(error.details[0].message);
    }
    console.log('Validation success and accepted');
    var datetime = new Date();
    console.log("\n"+datetime)
    console.log("Incoming new POST HTTP request");


    // CHECK IF THE EMAIL ALREADY EXISTS
    console.log('Check existing email: '+req.body.email);
    const check_user = users.find( u => u.email === req.body.email );
    if (check_user) {
        console.log('Email: '+req.body.email+' is already registered');

        var jsonRespond = {
            result: "",
            message: "Registration failed. Email "+req.body.email+" is already registered. Please use other email."
        }

        return res.status(404).json(jsonRespond);
    }

    console.log('Email ' + req.body.email + ' is available for registration');
    let sql = "INSERT INTO users(username,email,password,status) VALUES('"+req.body.username+"','"+req.body.email+"','"+req.body.password+"','"+req.body.agreement_status+"')";
    con.query(sql, (err,results) =>{
        if(err) throw err
        console.log("ACCOUNT REGISTERED !")
        res.send(results)
    })
    const user = {
        id: users.length + 1,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        status: req.body.agreement_status
    }
    users.push(user);
    // res.send(user)
    // console.log(users);
})

app.get('/api/login/:email/:password',(req,res)=>{
    var datetime = new Date();
    console.log('\n'+datetime)
    console.log("Incoming new GET HTTP request for LOGIN");
    console.log(req.body);

    const {error} = validateLogin(req.params);
    if(error){
        console.log('Validation error');
        var jsonRespond = {
            result: "",
            message: error.details[0].message
        }

        return res.status(400).json(jsonRespond);
    }
    console.log('Validation success and accepted');
    console.log('Check existing email: '+req.params.email+' and password: '+req.params.password);

    const checkUser = users.find( u => u.email === req.params.email && u.password === req.params.password );
    if (!checkUser) {
        var error_message = 'Invalid login detail. Email or password is not correct.';
        console.log(error_message);

        var jsonRespond = {
            result: "",
            message: error_message
        }

        return res.status(404).json(jsonRespond);
    }
    var jsonRespond = {
        result: checkUser,
        message: "Login success"
    }
    return res.json(jsonRespond);
})



app.get('/api/users', (req,res)=>{
    res.send(users);
})


function validateUsers(users){
    const schema = Joi.object({
        username: Joi.string().min(3),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'id'] } }),
        password: Joi.string().min(3),
        agreement_status: Joi.required()
    });

    return schema.validate(users);
}

function validateLogin(users){
    const schema = Joi.object({
        email: Joi.string().email({minDomainSegments: 2, tlds: {allow: ['com','net','id']}}),
        password: Joi.string().min(3)
    })
    return schema.validate(users);
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port} ...`)
});