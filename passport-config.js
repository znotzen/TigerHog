const mysql 		= require("mysql");
const dotenv 		= require("dotenv");
const bcrypt 		= require("bcrypt");
const localStrategy = require("passport-local").Strategy;

dotenv.config({ path: "./.env" });

var connection = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.USER,
	password: process.env.PASSWORD,
	database: process.env.DATABASE 
});

function initialize(passport, getUserByEmail, getUserById){
	const authenticateUser = async (email, password, done) => {
		//getUserByEmail will be a function we create
		//Will return user by email or 
		//Return null if there is no user with this email
		const user = getUserByEmail(email);
		if(user == null){
			return done(null, false, { message: "No user found with that email" });
		}
		
		
		//user.password will need to be replaced
		try{
			if(bcrypt.compare(password, user.password)){
			   	   return done(null, user);
			   } else{
				   return done(null, false, { message: "Password Incorrect" });
			   }
		} catch(err){
			return done(err);
		}
	}
	passport.use(new localStrategy({ usernameField: "email" }, authenticateUser));
	passport.serializeUser((user, done) => done(null, user.id));
	passport.deserializeUser((id, done) => done(null, getUserById(id)));
}

module.exports = initialize;