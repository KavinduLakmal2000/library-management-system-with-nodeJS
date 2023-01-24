const express = require('express');
const bodyParser = require('body-parser');
const {MongoClient} = require('mongodb');
let alert = require('alert'); 
//const { use } = require('passport');
//const { application } = require('express');


const uri = "mongodb+srv://kavinduLakmal:21871@cluster0.pccgpzv.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

var username;
var password;
var radio;

const app = express();
app.use(bodyParser.urlencoded({ extended: true })); 
const port = 8080;

app.use(express.static(__dirname+'/public'));


// ==================================================================================== login =================================================
app.post("/ulogin", async (req, res) => {
    
    client.connect();

     username = req.body.uname;
     password = req.body.pword;
     radio = req.body.rad;

     const result = await client.db("unilib").collection("register").findOne({ User_Name: username, Password: password, Position: radio});

    // console.log(radio);
    if(radio == "student"){
    
    if(result){        
        console.log(`loging done as a student`);
        res.sendFile(__dirname + "/public/student_home.html");
       
    }
    else{
        console.log(`login faild! try again!`);
        alert("check details and try again!");
        res.sendFile(__dirname + "/public/login.html");
    }  
}
else if(radio == "staff"){
    if(result){        
        console.log(`loging done as a staff`);
        res.sendFile(__dirname + "/public/staff.html");
       
    }
    else{
        console.log(`login faild! try again!`);
        alert("check details and try again!");
        res.sendFile(__dirname + "/public/login.html");
    }  
}

else{
    if(result){        
        console.log(`loging done as a admin`);
        res.sendFile(__dirname + "/public/admin.html");
       
    }
    else{
        console.log(`login faild! try again!`);
        alert("check details and try again!");
        res.sendFile(__dirname + "/public/login.html");
    }  
}
 
  
});


//===============================================================================register============================================================


app.post("/regi", async (req, res) => {

    var firstname = req.body.fname;
    var lastname = req.body.lname;
    var pw1 = req.body.pw1;
    var pw2 = req.body.pw2;
    var Pos =req.body.pos;
    var Age = req.body.age;

    if(pw1 == pw2){
    client.connect();
    await client.db("unilib").collection("register").insertOne({

        User_Name: firstname,
        Last_Name: lastname,
        Password: pw1,
        Position: Pos,
        Age: Age
    });

   
    console.log(`data has been uploaded`);
    res.sendFile(__dirname + "/public/index.html");
    alert("Welcome to UNI-LIB");

}
else{ 
    console.log(`check db connection`);
    res.sendFile(__dirname + "/public/register.html");
    alert("Check passwords again!");
}


});

//==============================================================================================================================================

app.get("/", function (req, res) {
        res.sendFile(__dirname + "/public/index.html");
    
});

app.listen(port, () => {
    console.log(`Server running on port${port}`);
  });
