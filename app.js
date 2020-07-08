const mysql 		 	 = require("mysql");
const dotenv 			 = require("dotenv");
const bcrypt 		 	 = require("bcrypt");
const express 		 	 = require("express");
const passport 		 	 = require("passport");
const flash 		 	 = require("express-flash");
const session 		 	 = require("express-session");
const methodOverride 	 = require("method-override");

const app			 	 = express();

dotenv.config({ path: "./.env" });

const initializePassport = require("./passport-config");
initializePassport(
	passport, 
	//This will need to be changed for mySQL
	email => users.find(user => user.email === email),
	id => users.find(user => user.id === id)
);


app.set("view engine", "ejs");

app.use("/public", express.static("public"));
app.use(express.urlencoded({extended: false}));
app.use(flash());
app.use(session({
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.get("/", function(req, res){
	res.render("home");
});
app.get("/home", function(req, res){
	res.render("home");
});

app.get("/login", function(req, res){
	res.render("login");
});
app.post("/login", passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect: "/login",
	failureFlash: true
}))

app.get("/register", function(req, res){
	res.render("register");
});
app.post("/register", async function(req, res){
	try{
		const hashedPassword = bcrypt.hash(req.body.password, 10);
		// Insert user info into database
		// fname: req.body.fname
		// lname: req.body.lname
		// email: req.body.email
		// password: hashedPassword
		
		res.redirect("/login");
	} catch{
		res.redirect("/register");
	}
});

//middleware
function checkAuthenticated(req, res, next){
	if(req.isAuthenticated){
	   	  return next();
	   }
	res.redirect("/login");
}
function checkNotAuthenticated(req, res, next){
	if(req.isAuthenticated){
	   	 return res.redirect("/");
	   }
	next();
}

app.delete("/logout", function(req, res){
	req.logout();
	res.redirect("/login");
})

app.listen(3000, function(){
	console.log("Server listening on port 3000");
});

//Log out by <form action="/logout?_method=DELETE" method="POST"><button type="submit">LogOut</button></form>