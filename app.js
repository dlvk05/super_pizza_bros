var app = require("express")(),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  pizza= require("./models/pizza"),
  order= require("./models/orderList"),
  methodOverride = require("method-override");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);


var cartflag=0;
var grandTotal;
var subTotal;
var cart=[
];
var currentOrder=[];

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
app.get("/invoice/cancel",(req,res)=>{
  var id=req.body.Id
  console.log(req.body);
  order.findById(req.body.orderId,(err,foundOrder)=>{
    if(err)
    {
      console.log("in err")
      res.render("notFound")
    }
    else{
      console.log("found order is " + foundOrder);
      res.render("invoice",{order:foundOrder});
    }
  })
});

//DESTROY ROUTE- CANCEL REQUEST FROM INVOICE
app.delete("/cancelOrder/:id",(req,res)=>{
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


//GET LOGIN FORM
app.get("/login", (req, res) => {
  res.render("login");
});

//GET SIGNUP FORM
app.get("/signup", (req, res) => {
  res.render("signup");
});

//GET CANCEL ORDER FORM
app.get("/cancelForm", (req, res) => {
  res.render("cancelForm");
});

app.listen(3000, () => {
  console.log("server listening on port 3000");
});

