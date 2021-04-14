import express from "express";
// const jwt = require('jsonwebtoken');
// const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
// var cors = require('cors')
// router.use(bodyParser.urlencoded({ extended: false }));
// router.use(bodyParser.json());

import CognitoExpress from "cognito-express";
// var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
// const poolData = {UserPoolId: 'us-west-2_AKp5J1oGI', ClientId: '7gj1fb7ji190h1i6tf4jp38k51'}
// const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
// authenticatedRoute = express.Router();

//Initializing CognitoExpress constructor
const cognitoExpress = new CognitoExpress({
  region: "us-west-2",
  cognitoUserPoolId: "us-west-2_AKp5J1oGI",
  tokenUse: "access", //Possible Values: access | id
  tokenExpiration: 3600 //Up to default expiration of 1 hour (3600000 ms)
});

app.use(
  express.urlencoded({
    extended: true
  })
)

app.use(express.json())

var jwttoken = '';


app.use("/other", (req, res, next)=>{
    //Our middleware that authenticates all APIs under our 'authenticatedRoute' Router
      //I'm passing in the access token in header under key accessToken
    let accessTokenFromClient = jwttoken;
    cognitoExpress.validate(accessTokenFromClient, function(err, response) {
      if (!err) {
        res.locals.user = response;
        express.static("./other/dist")(req, res, next);
      }
      else {
        console.log('error'+err);
        return res.redirect('/');
      }
    })
  // if(jwttoken) {
  //   express.static("./other/dist")(req, res, next);
  // }
  // else {
  //   res.redirect('/')
  // }
})

app.post('/signin', (req, res) =>{
  jwttoken = req.body.jwt
  console.log(jwttoken);
  res.redirect('/')
  // res.send({'msg': 'Hello World!'})
})

app.get('/signin',(req, res) => {
  jwttoken = '';
  console.log('Token validity'+jwttoken);
  res.redirect('/')
})


app.use((req, res, next) => {
  console.log(req.path);
  if (req.path.startsWith("/other/"))
  {
    console.log("Match")
  }
  else
    express.static("./dist")(req, res, next);
});

app.use(router);

app.listen(8888, err => {
  if (err) return console.log(err);
})