const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname +"/date.js");
const app = express();
const Item = require(__dirname + "/models/items.js");

//const router = express.Router()

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));
const PORT = process.env.PORT || 3000;

//code for database
mongoose.set("strictQuery", false);  //to avoid that warning
mongoose.connect(process.env.MONGO_URI);


const workItems=[];

app.get("/",function(req,res){
    const day = date.getDate();
    //for database
    Item.find({}, (err, foundItems) => { 

        res.render("list", {listTitle: day, newItems:foundItems })
    })
    
    
})
app.post("/", function(req, res){
    const newItem = req.body.newItem;
    const item = new Item({
        name : newItem
    })
    item.save();
    res.redirect("/");

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

app.get("/about", function(req,res){
    res.render("about");
})
connectDB().then(() => {
    app.listen(PORT,function(){
        console.log("Server running at port 3000")
})
})
//module.exports = router;


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