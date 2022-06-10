const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const date = require(__dirname + "/date.js");
const _ = require('lodash');



const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});
const day = date.getDate();

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);
const listSchema = {
  name: String,
  items: [itemsSchema]
};
const List = mongoose.model("List", listSchema);

const item1 = new Item({
  name: "Hit + button to add item."
});
const item2 = new Item({
  name: "Check the Box to delete them."
});
const item3 = new Item({
  name: "Happy To-Do Listing :)"
});
const defaultItems = [item1, item2, item3];






// app.get("/favicon.ico", function(req, res){
//     res.sendStatus(204);
// });

app.get("/", function(req, res) {

  Item.find({}, function(err, results) {

    if (results.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("successfully added the default items")
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        date: day,
        listTitle: "Regular",
        newItems: results
      });
    }
  });
});

app.get("/:customListName", function(req, res) {
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({
    name: customListName
  }, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        // Create a new List
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save((err, result) => { // Review the result parameter in the callback
        res.redirect("/" + customListName);
      });
      } else {
        //show the existing list
        res.render("list", {
          date: day,
          listTitle: foundList.name,
          newItems: foundList.items
        });
      }
    }


  });


})
app.get("/about", function(req, res) {
  res.render("about");
})

app.post("/", function(req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });
  if (listName === "Regular") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, function(err, foundList) {
      foundList.items.push(item);
      foundList.save((err, result) => { // Review the result parameter in the callback
       res.redirect("/" + listName);
     });
    });
  }



});
app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "Regular") {
    Item.findByIdAndRemove(checkedItemId, function(err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/");

      }
    });
  } else {
    List.findOneAndUpdate({
        name: listName
      }, {
        $pull: {
          items: {
            _id: checkedItemId
          }
        }
      },
      function(err, foundList) {
        if (!err) {
          res.redirect("/" + listName);
        }
      });
  }

});


app.listen("3000", function() {
  console.log("server started on port 3000.");
});
