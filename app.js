var app = require("express")(),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  pizza= require("./models/pizza"),
  order= require("./models/orderList"),
  user= require("./models/user"),
  methodOverride = require("method-override"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  passportLocalMongooe = require("passport-local-mongoose");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

//PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "This is super pizza bros",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser()); /* ###encodes the data */
passport.deserializeUser(user.deserializeUser());   /* ###decodes the data  */ 

//PASSING CURRENT USER LOGIN INFO IN ALL PAGES
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    next();
})

//GLOBAL VARIABLES

var cartflag=0;
var grandTotal;
var subTotal;
var cart=[
];
var currentOrder=[];

//FUNCTIONS

function total(){
  grandTotal=0;
  subTotal=0;
  var temp=0;
  for(var i=0;i<cart.length;i++)
  {
    temp= temp+ (parseInt(cart[i].quantity)*parseInt(cart[i].price))
  }
  subTotal=temp;
  grandTotal=subTotal+Math.floor(subTotal*.05);
  console.log(grandTotal);
}

function isloggedIN(req, res, next){
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect("/login");
}

// ROUTES


app.get("/", (req, res) => {
  res.render("home");
});


//INDEX-view all pizzas
app.get("/menu", (req, res) => {
  pizza.find({},(err,allpizzas)=>{
    if(err){
      console.log(err);
    }else{
      res.render("menu",{pizzas: allpizzas});
    }
  })
});

//GET CART
app.get("/cart", (req, res) => {
  total();
  res.render("cart",{cart:cart,subTotal:subTotal,grandTotal:grandTotal});
});

//Cart-add to cart
app.post("/cart/:id",(req,res)=>{
    pizza.findById(req.params.id,(err,foundPizza)=>{
      if(err)
      {
        res.redirect("/menu");
      }
      else{
        var temp={
          "name":foundPizza.name,
          "ingredients":foundPizza.ingredients,
          "size": req.body.size,
          "price":parseInt(foundPizza.detail[req.body.size]),
          "image":foundPizza.image,
          "quantity":1
        };
        var i=0;
        for(i=0;i<cart.length;i++)
        {
          if((cart[i].name==temp.name)&&(cart[i].size==temp.size)){
            cart[i].quantity=parseInt(cart[i].quantity)+1;
            // item.price=parseInt(item.price)*2;
            cartflag=1;
            break;
          }
          else{
            cartflag=0;
          }
        }
        if(cartflag==0)
        {
          cart.push(temp);
          console.log(temp);
        }
        // res.redirect("/menu");
      }
    })
})

//DECREASE CART ITEM
app.post("/cart/decrease/:name/:size",(req,res)=>{
  var tname=req.params.name;
    var tsize=req.params.size;
    for(var i=0;i<cart.length;i++)
    {
      if((cart[i].name==tname)&&(cart[i].size==tsize))
      {
        cart[i].quantity=parseInt(cart[i].quantity)-1;
        if(parseInt(cart[i].quantity)==0)
        {
          cart.splice(i,1)
        }
        break;
      }
    }
    res.redirect("/cart");
})

//INCREASE CART ITEM
app.post("/cart/increase/:name/:size",(req,res)=>{
  var tname=req.params.name;
    var tsize=req.params.size;
    for(var i=0;i<cart.length;i++)
    {
      if((cart[i].name==tname)&&(cart[i].size==tsize))
      {
        cart[i].quantity=parseInt(cart[i].quantity)+1;
        break;
      }
    }
    res.redirect("/cart");
})


//GET ORDER FORM
app.get("/orderForm", (req, res) => {
  res.render("orderForm");
});

//Place order
app.post("/placeOrder",(req,res)=>{
  var fname = req.body.firstName;
  var lname = req.body.lastName;
  var femail= req.body.email;
  var fmobileNo=req.body.mobileNo;
  var faddress=req.body.address;
  var fpinCode=req.body.pin;
  var fcart=cart;
  var ftotal=grandTotal;
  var newOrder={
    firstName:fname,
    lastName:lname,
    email:femail,
    mobileNo:fmobileNo,
    address:faddress,
    pinCode:fpinCode,
    cart:fcart,
    grandTotal:ftotal
  };
  order.create(newOrder,(err,savedOrder)=>{
    if(err){
      console.log(err)
    }else{
      // console.log(savedOrder);
      currentOrder.push(savedOrder);
      res.redirect("/invoice");
    }
  });
});

//GET INVOICE
app.get("/invoice", (req, res) => {
  console.log(currentOrder[0]);
  res.render("invoice",{order:currentOrder[0]});
});

//GET CANCEL FORM
app.get("/cancelForm", (req, res) => {
  res.render("cancelForm");
});

//GET INVOICE FOR CANCELLATION REQUEST FROM CANCEL FORM
app.post("/invoice/cancel",(req,res)=>{
  var id=req.body.Id
  console.log(req.body);
  order.findById(req.body.Id,(err,foundOrder)=>{
    if(err)
    {
      console.log("err")
      res.render("orderNotFound")
    }
    else{
      console.log("found order is " + foundOrder);
      res.render("invoice",{order:foundOrder});
    }
  })
});

//DESTROY ROUTE- CANCEL REQUEST FROM INVOICE
app.post("/cancelOrder/:id",(req,res)=>{
  order.findByIdAndRemove(req.params.id,(err,foundOrder)=>{
    if(err)
    {
      res.redirect("/invoice");
    }
    else{
       res.render("confirmCancel")
    }
  })
})

//GET ADD-PIZZA FORM
app.get("/addPizza", (req, res) => {
  res.render("addPizza");
});

//GET SIGNUP FORM
app.get("/signup", (req, res) => {
  res.render("signup");
});

//POST REQUEST FROM SIGNUP
app.post("/signup",(req,res)=>{
  var fusername = req.body.username;
  var fpassword = req.body.password;
  user.register(new user({username:fusername}),fpassword,(err,user)=>{
    if(err){
      console.log(err)
      return res.render("signup");
    }
    passport.authenticate("local")(req,res,()=>{
      return res.redirect("/");
    })
  });
});

//GET LOGIN FORM
app.get("/login", (req, res) => {
  res.render("login");
});

//POST REQUEST FROM LOGIN
app.post("/login",passport.authenticate("local",{
  successRedirect:"/",
  failureRedirect:"/login",
}),(req,res)=>{
//empty
});

//LOGOUT
app.get("/logout", function(req, res) {
  req.logout();
  res.render("home");
});

//PROFILE
app.get("/profile", function(req, res) {
  res.render("profile");
});

app.get("/orderHistory", function(req, res) {
  res.render("orderHistory");
});

app.listen(3000, () => {
  console.log("server listening on port 3000");
});

