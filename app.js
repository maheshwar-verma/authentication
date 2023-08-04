//jshint esversion:6
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");

const app=express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser: true});

const saltRounds=10;
const userSchema={
    email: String,
    password: String
};
const User=new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
 res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/logout",function(req,res){
    res.render("home");
})
app.post("/register",function(req,res){
    bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
        
        const newUser=new User({
            email: req.body.username,
            password: hash
        });
        try{
            newUser.save();
            res.render("secrets");
        }
        catch(err){
             console.log(err);
        }
    });
    
    
});
app.post("/login",async function(req,res){
  const username=req.body.username;
  const password=req.body.password;

  const foundUser=await User.findOne({email: username});
  try{
      if(foundUser){
          bcrypt.compare(req.body.password, foundUser.password).then(function(result) {
            // result == true
            if(result===true){
              res.render("secrets");
            }
            else{
                res.send("Wrong password");
            }
        });

    }
    else{
        res.send("User doesn't exist.Please register first.");
    }

  }
  catch(err){
    console.log(err);
  }

});


app.listen(3000,function(req,res){
    console.log("This server is running on PORT 3000");
});