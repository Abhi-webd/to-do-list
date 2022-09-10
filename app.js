//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

mongoose.connect("mongodb://localhost:27017/todoListDB",{useNewUrlParser:true});

const itemSchema = {
  name : String
};

const Item = mongoose.model("Item",itemSchema);

const item1 = new Item({
  name : "Welcome to todo list!"
});

const item2 = new Item({
  name : "Hit the + button to add a new item"
});

const item3 = new Item({
  name : "<-- Hit this to delete an item"
});

const defaultItems = [item1,item2,item3];



app.get("/", function(req, res) {

  Item.find({},function(err,foundItems){
    if(foundItems.length === 0){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("succesfully saved default items");
        }
      });
      res.render("/");
    }
    else{
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  })
  

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const item = new Item({
    name :itemName
  });
  item.save();
  res.redirect("/");  
 
});

app.post("/delete",function(req,res){
  const checkedItemid = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemid,function(err){
    if(!err){
      console.log("successfully removed");
      res.redirect("/");
    }
  });
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
