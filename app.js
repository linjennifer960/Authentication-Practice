var express             = require("express"),
    mongoose            = require("mongoose"),
    passport            = require("passport"),
    bodyParser          = require("body-parser"),
    User                = require("./models/user"),
    LocalStrategy       = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");


mongoose.connect("mongodb://localhost/auth_demo_app", {useMongoClient:true});
mongoose.Promise = global.Promise;



var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(require("express-session")({
    secret: "Cats are the best",
    resave: false,
    saveUninitialized: false
}));

//setup passport
app.use(passport.initialize());
app.use(passport.session());

//create new local strategy, using the user.authenticate method that comes from passport local mongoose
passport.use(new LocalStrategy(User.authenticate()));

//responsible for taking data from session and encoding/decoding them
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// ============================
// ROUTES
// ============================
app.get("/", function(req, res){
    res.render("home");
});

//when we have a request, it will run isLoggedIn before doing anything else
app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
})

// Auth routes
//show signup form
app.get("/register", function(req, res){
    res.render("register");
});

//handle user sign up
app.post("/register", function(req, res){
    //make new user object, not saved to db yet, only pass in username, we dont save pwd to db
    //pass the pwd separately, hash that password and stores that in db
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        // can change local to twitter or fb
        //this will log the user in
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        });
    });
});

//LOGIN ROUTES
//render login form
app.get("/login", function(req, res){
    res.render("login");
});

//login logic
//middleware: code that runs before final route callback
//when app gets post request to /login, it will run that code immediately
app.post("/login", passport.authenticate("local",{
    successRedirect: "/secret",
    failureRedirect:"/login"
})  ,function(req, res){
    
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        //next refers to the secret page
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started");
});