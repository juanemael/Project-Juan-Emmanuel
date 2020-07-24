const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');

app.set('view engine', 'ejs')
app.use(express.json());

const props = [
    {id: 1, prop_title:'alvin', prop_address: 'alvin@1.id', prop_neighborhood: 'a123', country: 1, state: "asd", city: "asd", zip: "zxc", prop_type: "commercial", prop_status: "single", price: "1201001", list_info:"asdadsa"}
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

app.get('/api/show',(req,res)=>{
    res.render('crud_prop', props)
})

app.post('/api/add_property', (req,res)=>{
    var datetime = new Date();
    console.log("\n"+datetime)
    console.log("Incoming new POST HTTP request");
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
        price: req.body.price,
        list_info: req.body.list_info,
    }
        props.push(prop);
        res.send(prop)
        console.log(props);

})

app.put('/api/props/:id', (req,res)=>{

    const checkProp = props.find( p => p.id === req.body.id);
    if (!checkProp) return res.status(404).send('ID: '+req.body.id+ ' not found.');
    if(req.body.opt === "1")
    {
        checkProp.prop_title = req.body.content;
        return res.send(checkProp);
    } else if(req.body.opt === "2"){
        checkProp.prop_address = req.body.content;
        return res.send(checkProp);
    } else if(req.body.opt === "3"){
        checkProp.prop_neighborhood = req.body.content;
        return res.send(checkProp);
    } else if(req.body.opt === "4"){
        checkProp.country = req.body.content;
        return res.send(checkProp);
    } else if(req.body.opt === "5"){
        checkProp.state = req.body.content;
        return res.send(checkProp);
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

    console.log("Course ID "+req.params.id+" telah berhasil dihapus");

    // RETURN DELETED COURSE
    return res.send(prop);
})

app.listen(port, () => {
    console.log(`Listening on port ${port} ...`)
});