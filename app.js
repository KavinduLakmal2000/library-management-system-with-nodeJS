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

app.engine('html', require('ejs').renderFile);

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

//================================================================== students comment upload ============================================================================


app.post("/student_com", async (req, res) => {

    var username = req.body.usrname;
    var com = req.body.comment;

    client.connect();
   const result = await client.db("unilib").collection("Student Comments").insertOne({
        User_Name: username,
        Comment: com
    });

    if(result){
        alert("Your comment has been posted!");
        res.sendFile(__dirname + "/public/student_home.html");
    }

    else{
        alert("pls try again!");
    }



});

//========================================================================= Show students profile ===================================================================
app.post("/profile", async (req, res) => {
    
    client.connect();

    const result = await client.db("unilib").collection("register").findOne({ User_Name: username});
     console.log(result);
     //const myJSON = JSON.stringify(result); //converting obj to string

     const objectArray = Object.entries(result);

    res.write('<html><head><title>Students Account Data</title> <link rel="StyleSheet" href="/CSS/profile.css"> </head><body>');
    res.write('<h1>STUDENT ACCOUNT DETAILS</h1>');
    res.write('<br>');
    res.write('<table id="pro">');
    res.write('<tr><th>Account</th><th>Details</th></tr>');

     objectArray.forEach(([key, value]) => {
       
        //res.write('<p>'+key+'</p>');
        //res.write('<p>'+value+'</p>');

       
        res.write('<tr><td>'+key+'</td><td>'+value+'</td></tr>');

     });
       
    res.end('</body></html>');   

});
// ==================================================================== admin books upload ==========================================================

app.post("/admin", async (req, res) => {

    var bookname = req.body.bname;
    var author = req.body.aut;
    var date = req.body.date;
    var country = req.body.country;

    client.connect();
    await client.db("unilib").collection("Computing books").insertOne({

       Book_Name: bookname,
       Author: author,
       Year: date,
       County: country
    });

    console.log(`data has been uploaded`);
    res.sendFile(__dirname + "/public/admin.html");
    alert("Book has been uploaded!");
});

// ==================================================================== books sherching1 ============================================================
app.post("/comp", async (req, res) => {

    var b_name = req.body.bookname1;

    const result = await client.db("unilib").collection("Computing books").findOne({ Book_Name: b_name});

    if(result){

        const objectArray = Object.entries(result);

        res.write('<html><head><title>Book Details</title> <link rel="StyleSheet" href="/CSS/profile.css"> </head><body>');
        res.write('<h1>'+b_name+'</h1>');
        res.write('<br>');
        res.write('<table id="pro">');
        res.write('<tr><th>Book</th><th>Details</th></tr>');
        
        objectArray.forEach(([key, value]) => {

            res.write('<tr><td>'+key+'</td><td>'+value+'</td></tr>');
    
         });

        res.end('</body></html>');
    }
    else{
        alert("Book is not found! try again!")
    }
});

// ================================================================= books serching2 ============================================================

app.post("/bus", async (req, res) => {

    var b_name = req.body.bookname1;

    const result = await client.db("unilib").collection("Business Books").findOne({ Book_Name: b_name});

    if(result){

        const objectArray = Object.entries(result);

        res.write('<html><head><title>Book Details</title> <link rel="StyleSheet" href="/CSS/profile.css"> </head><body>');
        res.write('<h1>'+b_name+'</h1>');
        res.write('<br>');
        res.write('<table id="pro">');
        res.write('<tr><th>Book</th><th>Details</th></tr>');
        
        objectArray.forEach(([key, value]) => {

            res.write('<tr><td>'+key+'</td><td>'+value+'</td></tr>');
    
         });

        res.end('</body></html>');
    }
    else{
        alert("Book is not found! try again!");
    }
});

// ========================================================================= books serching3 =======================================================

app.post("/engi", async (req, res) => {

    var b_name = req.body.bookname1;

    const result = await client.db("unilib").collection("Engineering Books").findOne({ Book_Name: b_name});

    if(result){

        const objectArray = Object.entries(result);

        res.write('<html><head><title>Book Details</title> <link rel="StyleSheet" href="/CSS/profile.css"> </head><body>');
        res.write('<h1>'+b_name+'</h1>');
        res.write('<br>');
        res.write('<table id="pro">');
        res.write('<tr><th>Book</th><th>Details</th></tr>');
        
        objectArray.forEach(([key, value]) => {

            res.write('<tr><td>'+key+'</td><td>'+value+'</td></tr>');
    
         });

        res.end('</body></html>');
    }
    else{
        alert("Book is not found! try again!")
    }
});



app.get("/", function (req, res) {
       res.sendFile(__dirname + "/public/index.html");
     
    
});

app.listen(port, () => {
    console.log(`Server running on port${port}`);
  });
