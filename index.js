const express = require('express');
const session = require('express-session');
const dataService = require('./services/data.service');
const app = express();


app.use(session({
    secret: 'randomsecurestring',
    resave: false,
    saveUninitialized: false
}));

app.use(express.json());


//Middleware
app.use((req, res, next) => {
    console.log("Middleware");
    next();
})

const logMiddleware = (req, res, next) => {
    console.log(req.body);
    next();
}
app.use(logMiddleware);

//AuthMiddleware - route specific
const authMiddleware = (req, res, next) => {
    if (!req.session.currentUser) {
        return res.json({
            statusCode: 401,
            status: false,
            message: "Please Log-In"
        })
    }
    else{
       next(); 
    }
}



//GET - READ
app.get('/', (req, res) => {
    res.status(401).send("THIS IS A GET METHOD");
});

//POST - CREATE
app.post('/', (req, res) => {
    res.send("THIS IS A POST METHOD");
});

//POST - login
app.post('/login', (req, res) => {
    // console.log(req.body);
    const result = dataService.login(req, req.body.acno, req.body.pswd);
    res.status(result.statusCode).json(result)
    // console.log(res.status(result.statusCode).json(result));
});


//POST - register
app.post('/register', (req, res) => {
    const result = dataService.register(req.body.uname, req.body.acno, req.body.pswd);
    res.status(result.statusCode).json(result)
    // console.log(res.status(result.statusCode).json(result));
});



//POST - deposit
app.post('/deposit',authMiddleware, (req, res) => {
    console.log(req.session.currentUser);
    const result = dataService.deposit(req.body.acno, req.body.pswd, req.body.amount);
    res.status(result.statusCode).json(result)
});



//POST - withdraw
app.post('/withdraw',authMiddleware, (req, res) => {
    const result = dataService.withdraw(req.body.acno, req.body.pswd, req.body.amount);
    res.status(result.statusCode).json(result)
});





//PUT - UPDATE/MODIFY WHOLE
app.put('/', (req, res) => {
    res.send("THIS IS A PUT METHOD");
});

//PATCH - UPDATE/MODIFY PARTIALY
app.patch('/', (req, res) => {
    res.send("THIS IS A PATCH METHOD");
});

// DELETE -  DELETE
app.delete('/', (req, res) => {
    res.send("THIS IS A DELETE METHOD");
});


app.listen(3000, () => {
    console.log("Server Started at port: 3000");
})