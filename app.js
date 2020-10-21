const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const ld = require("lodash");
const md5 = require("md5");
const multer = require("multer");
const path = require("path");
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/helpyDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// SET STORAGE ENGINE (STEP 1 MULTER)

const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: function (req, file, callback) {
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// INIT UPLOAD --- STEP 2

const upload = multer({
  storage: storage,
}).single("img");

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  contact: Number,
  skills: Array,
  password: String,
  post:String,
  img: Object,
  linkedin:String,
  twitter:String,
  instagram:String,
  website:String,
  birthday:String,
  gender:String,
  address:String,
  projects:Array
});

User = mongoose.model("user", userSchema);

var userObject = new Object();

app.get("/", (req, res) => {
  res.render("landing");
});

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    User.findOne({ email: req.body.email }, (err, result) => {
      if (!err) {
        if (md5(req.body.password) == result.password) {
          res.render("admin", { user: result });
        } else {
          res.send("<h1>Incorrect Password</h1>");
        }
      } else {
        console.log(err);
      }
    });
  });

app.post("/people", (req, res) => {
  User.find({ skills: ld.capitalize(req.body.query) }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      const col = Math.ceil(result.length / 4);

      res.render("people", {
        results: result,
        col: col,
        searched: req.body.query,
      });
      console.log(result);
    }
  });
});

app.post("/profile", (req, res) => {
  if (md5(req.body.created) == md5(req.body.confirmed)) {
    userObject.name = ld.capitalize(req.body.name);
    userObject.username = req.body.username;
    userObject.email = req.body.email;
    userObject.contact = req.body.contact;
    userObject.password = md5(req.body.confirmed);
    res.render("profile");
  } else {
    res.send("<h1>password dont match</h1>");
  }
});

app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    userObject.skills = ld
      .split(req.body.skills, ",")
      .map((e) => ld.capitalize(e));

    const user = new User({
      name: userObject.name,
      username: userObject.username,
      email: userObject.email,
      contact: userObject.contact,
      skills: userObject.skills,
      password: userObject.password,
      img: userObject.img,
    });
    user.save((err) => {
      err ? res.send(err) : res.render("admin",{user:user});
    });
  });

app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.render("profile", { msg: err });
    } else {
      userObject.img = req.file;
      res.render("skills");
    }
  });
});
app
  .route("/skills")
  .get((req, res) => {
    res.render("skills");
  })
  .post((req, res) => {
    res.render("skills");
  });

app.route("/users/:username").get((req, res) => {
  const requestedUser = req.params.username;

  User.findOne({ username: requestedUser }, (err, user) => {
    if (err) {
      res.send(err);
    } else {
      res.render("userProfile", { user: user });
    }
  });
});

app.post("/update/:username", (req, res) => {
  const requsername = req.params.username;
  User.findOne({username:requsername},(err,result)=>{
    if(err){
      console.log(err);
    }else{
      result.name = req.body.name
      result.post = req.body.post
      result.save()
      res.render("admin",{user:result})
    }
  })

});


app.post("/update/contact/:username",(req,res)=>{
 const requsername = req.params.username
 User.findOne({username:requsername},(err,result)=>{
   if(err){
     console.log(err);
   }else{
     result.contact = req.body.contact
     result.address = req.body.address
     result.email = req.body.email
     result.website = req.body.website
     result.linkedin = req.body.linkedin
     result.twitter = req.body.twitter
     result.instagram = req.body.instagram

     result.save()
     res.render("admin",{user:result})
   }
 })
})

app.post("/update/basic/:username",(req,res)=>{
  const requsername = req.params.username
  User.findOne({username:requsername},(err,result)=>{
    if(err){
      console.log(err);
    }else{
      result.birthday = req.body.birthday
      result.gender = req.body.gender
      result.save()
      res.render("admin",{user:result})
    }
  })
})


app.post("/update/projects/:username",(req,res)=>{
  const requsername = req.params.username
  User.findOne({username:requsername},(err,result)=>{
    console.log(result);
  })  
})

app.listen(process.env.PORT || 3000, () => {
  console.log("server started at port 3000....");
});
