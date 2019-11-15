var app = require("express")(),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  pizza= require("./models/pizza");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);



var cart=[
  {
    name:String,
    image:String,
    ingredients:[],
    size:String,
    price:Number
  }
];

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
          name:foundPizza.name,
          image:foundPizza.image,
          ingredients:foundPizza.ingredients,
          size: req.body.size,
          price:parseInt(foundPizza.detail[req.body.size])
        };
        cart.push(temp);
        console.log(temp);
        res.redirect("/menu");
      }
    })
})

//GET ORDER FORM
app.get("/orderForm", (req, res) => {
  res.render("orderForm");
});


app.listen(3000, () => {
  console.log("server listening on port 3000");
});

