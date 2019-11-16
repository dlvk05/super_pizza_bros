var app = require("express")(),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  pizza= require("./models/pizza");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);


var cartflag=0;
var cart=[
];

console.log(cart);

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
        cart.forEach(item=>{
          if(item.name==temp.name){
            item.quantity=parseInt(item.quantity)+1;
            // item.price=parseInt(item.price)*2;
            cartflag=1;
          }
          else{
            cartflag=0;
          }
        });
        if(cartflag==0)
        {
          cart.push(temp);
        }
        console.log(temp);
        res.redirect("/menu");
      }
    })
})

//GET CART
app.get("/cart", (req, res) => {
  res.render("cart",{cart:cart});
});


//GET ORDER FORM
app.get("/orderForm", (req, res) => {
  res.render("orderForm");
});


//GET ADD-PIZZA FORM
app.get("/addPizza", (req, res) => {
  res.render("addPizza");
});


//GET LOGIN FORM
app.get("/login", (req, res) => {
  res.render("login");
});

//GET SIGNUP FORM
app.get("/signup", (req, res) => {
  res.render("signup");
});

app.listen(3000, () => {
  console.log("server listening on port 3000");
});

