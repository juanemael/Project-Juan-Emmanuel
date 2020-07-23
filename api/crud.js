const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');

app.use(express.json());

const props = [
    {id: 1, prop_title:'alvin', prop_address: 'alvin@1.id', prop_neighborhood: 'a123', country: 1, state: "asd", city: "asd", zip: "zxc", prop_type: "commercial", prop_status: "single", price: "1201001", list_info:"asdadsa", prop_image:"/asd/asd/asd.jpg"},
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

app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers' : '*'
    });
    next();
});

app.post('/api/add_property', (req,res)=>{
    var datetime = new Date();
    console.log("\n"+datetime)
    console.log("Incoming new POST HTTP request");
    upload(req,res,err => {
        const prop = {
            id: users.length + 1,
            prop_title: req.body.username,
            prop_address: req.body.email,
            prop_neighborhood: req.body.password,
            country: req.body.agreement_status,
            state: req.body.state,
            city: req.body.city,
            zip: req.body.zip,
            prop_type: req.body.prop_type,
            prop_status: req.body.prop_status,
            price: req.body.price,
            list_info: req.body.list_info,
            prop_image: req.file.prop_image
        }
        if (err) throw err
        props.push(prop);
        res.send(prop)
        console.log(users);
    })

})
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port} ...`)
});