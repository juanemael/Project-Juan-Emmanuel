const express = require('express');
const app = express();
const multer = require('multer');
const Joi = require('joi');
const mysql = require('mysql');
const path = require('path');

app.set('view engine', 'ejs')
app.use(express.json());

const props = [
    {id: 1, prop_title:'alvin', prop_address: 'alvin@1.id', prop_neighborhood: 'a123', country: 1, state: "asd", city: "asd", zip: "zxc", prop_type: "commercial", prop_status: "single", price: 1201001, list_info:"asdadsa"}
];

const storage = multer.diskStorage({
    destination : path.join(__dirname + './../public/prop_images'),
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() +
            path.extname(file.originalname));
    }
})
const upload = multer({
    storage : storage
}).single('file');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mydb"
});

app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers' : '*'
    });
    next();
});

app.get('/api/props/:id',(req,res)=>{
    // const prop = props.find( p => p.id === parseInt(req.params.id) );
    // if (!prop) return res.status(404).send('ID not found.');
    let sql = "SELECT * from crud WHERE id='"+parseInt(req.params.id)+"'";
    con.query(sql, (err,results) =>{
        if(err) throw err
        console.log("GET ACCOUNT ID: '"+req.params.id+"' NOW !");
        return res.send(results);
    })
    // return res.send(prop);
})

app.get('/api/props',(req,res)=>{
    let sql = "SELECT * from crud";
    con.query(sql, (err,results) =>{
        if(err) throw err
        console.log("GET ACCOUNT NOW !");
        return res.send(results);
    })
    // res.send(props);
})

app.post('/api/add_property', (req,res)=>{
    var datetime = new Date();
    console.log("\n"+datetime)
    console.log("Incoming new POST HTTP request");
    let sql = "INSERT INTO crud(prop_title,prop_address,prop_neighborhood,country,state,city,zip,prop_type,prop_status,price,list_info) VALUES('"+req.body.prop_title+"','"+req.body.prop_address+"','"+req.body.prop_neighborhood+"','"+req.body.country+"','"+req.body.state+"','"+req.body.city+"','"+req.body.zip+"','"+req.body.prop_type+"','"+req.body.prop_status+"','"+parseInt(req.body.price)+"','"+req.body.list_info+"')";
    con.query(sql, (err,results) =>{
        if(err) throw err
        console.log("PROPERTY REGISTERED !")
        res.send(results)
    })
    const prop = {
        id: props.length + 1,
        prop_title: req.body.prop_title,
        prop_address: req.body.prop_address,
        prop_neighborhood: req.body.prop_neighborhood,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city,
        zip: req.body.zip,
        prop_type: req.body.prop_type,
        prop_status: req.body.prop_status,
        price: parseInt(req.body.price),
        list_info: req.body.list_info,
    }
        props.push(prop);
        // res.send(prop)
        // console.log(props);

})

app.get('/api/props',(req,res)=>{

})

app.put('/api/props/:id', (req,res)=>{

    var opt = parseInt(req.body.option);
    const {error} = validateProps(req.body);
    if( error ){
        // 400 Bad Request
        return res.status(400).send(error.details[0].message);
    }
    const checkProp = props.find( p => p.id === parseInt(req.body.id));
    if (!checkProp) return res.status(404).send('ID: '+req.body.id+ ' not found.');
    if(opt === 1)
    {
        checkProp.prop_title = req.body.content;
        let sql = "UPDATE crud SET prop_title='"+req.body.content+"' WHERE id='"+req.body.id+"'";
        con.query(sql, (err,results) =>{
            if(err) throw err
            console.log("PROPERTY UPDATED !")
        })
    } else if(opt === 2){
        checkProp.prop_address = req.body.content;
        let sql = "UPDATE crud SET prop_address='"+req.body.content+"' WHERE id='"+req.body.id+"'";
        con.query(sql, (err,results) =>{
            if(err) throw err
            console.log("PROPERTY UPDATED !")
        })
    } else if(opt === 3){
        checkProp.prop_neighborhood = req.body.content;
        let sql = "UPDATE crud SET prop_neighborhood='"+req.body.content+"' WHERE id='"+req.body.id+"'";
        con.query(sql, (err,results) =>{
            if(err) throw err
            console.log("PROPERTY UPDATED !")
        })
    } else if(opt === 5){
        checkProp.country = req.body.content;
        let sql = "UPDATE crud SET country='"+req.body.content+"' WHERE id='"+req.body.id+"'";
        con.query(sql, (err,results) =>{
            if(err) throw err
            console.log("PROPERTY UPDATED !")
        })
    } else if(opt === 6){
        checkProp.state = req.body.content;
        let sql = "UPDATE crud SET state='"+req.body.content+"' WHERE id='"+req.body.id+"'";
        con.query(sql, (err,results) =>{
            if(err) throw err
            console.log("PROPERTY UPDATED !")
        })
    }

    return res.send(checkProp);

})
const port = process.env.PORT || 3000;

app.delete('/api/props/:id',(req,res)=>{
    console.log(req.params.id)
    const prop = props.find( p => p.id === parseInt(req.params.id) );
    if( !prop ) return res.status(404).send('The course with the given ID was not found.');

    // DELETE COURSE
    const index = props.indexOf(prop);
    props.splice(index, 1);
    let sql = "DELETE crud FROM crud WHERE id='"+req.params.id+"'";
    con.query(sql, (err,results) =>{
        if(err) throw err
        console.log("PROPERTY DELETED !")
    })
    console.log("Course ID "+req.params.id+" telah berhasil dihapus");

    // RETURN DELETED COURSE
    return res.send(prop);
})

function validateProps(course){
    const schema = Joi.object({
        id: Joi.required(),
        content: Joi.string().min(3).required(),
        option: Joi.required()
    });

    return schema.validate(course);
}

app.listen(port, () => {
    console.log(`Listening on port ${port} ...`)
});