const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Connect to the database
mongoose.connect('mongodb+srv://test:test@cluster0.d7fat.mongodb.net/todo?retryWrites=true&w=majority',
{ useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: true,
useUnifiedTopology: true });

//create a new schema - this is like a blueprint
var todoSchema = new mongoose.Schema({
  item: String
});

//create model
var Todo = mongoose.model('todo', todoSchema);
//create item

//var data= [{item: 'Learn react'},{item: 'Eat food'},{item: 'Take classes'},{item: 'Finish Assignments'}];
var urlEncodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app){
  app.get('/todo',function(req, res){
    //get data from mongodb and pass it to view
    Todo.find({}, function(err, data){
      if(err) throw err;
      res.render('todo',{todos: data});
    });
  });

  app.post('/todo',urlEncodedParser,function(req, res){
    //get data from the view and add it to mongodb
    var newTodo = Todo(req.body).save(function(err, data){
      if(err) throw err;
      res.json(data);
    });
  });

  app.delete('/todo/:item', function(req, res){
    //delete the requested item from mongodb
    Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err, data){
      if (err) throw err;
      res.json(data);
    });
    // data = data.filter(function(todo){
    //   return todo.item.replace(/ /g, '-') !== req.params.item;
    // });
    // res.json({todos: data});
  });

};
