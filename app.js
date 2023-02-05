const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname +"/date.js");
const app = express();

//const router = express.Router()

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));

//code for database
mongoose.set("strictQuery", false);  //to avoid that warning
mongoose.connect("mongodb://localhost:27017/todolistDB");

const listSchema = {
    name : String
};
const Item = mongoose.model("Item", listSchema);

/*const item1 = new Item({
    name:"Welcome to your ToDo List"
})

const item2 = new Item({
    name : "Do Laundry"
})

const item3 = new Item({
    name : "Do Assignment"
})


const defaultItems = [item1,item2,item3];


*/



const workItems=[];

app.get("/",function(req,res){
    const day = date.getDate();
    //for database
    Item.find({}, (err, foundItems) => { 

        /*if(foundItems.length === 0){
            Item.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Items added in database Successfully!")
                }
            })
            res.redirect("/"); 
        } */
       // else{
        res.render("list", {listTitle: day, newItems:foundItems })
      //  }
    })
    
    
})
app.post("/", function(req, res){
    const newItem = req.body.newItem;
    const item = new Item({
        name : newItem
    })
    item.save();
    res.redirect("/");

    /*if(req.body.list === "Work"){
        workItems.push(item);
        res.redirect("/work");
    }
    else{
    //items.push(item);
    res.redirect("/");
    } */

})
app.post("/delete", function(req,res){
    const deletedItemID = req.body.deletedItem;
    Item.findByIdAndRemove(deletedItemID,function(err){
        if(err){
        console.log(err)
        }
        else{
            console.log("Item Deleted Sucessfully")
        }
    })
    res.redirect("/");
})

app.get("/work", function(req,res){
    res.render("list", {listTitle: "Work List", newItems:workItems});
})
app.post("/work", function(req,res){
    const item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");

})
app.get("/about", function(req,res){
    res.render("about");
})

app.listen(3000,function(){
    console.log("Server running at port 3000")
})
//module.exports = router;