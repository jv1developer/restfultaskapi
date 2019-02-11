// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();

var mongoose = require('mongoose');

// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the title of
//   our db in mongodb -- this should match the title of the db you are going to use for your project.
// "basic_mongoose" is the title of the DB in mongo.exe
// { useNewUrlParser: true } = override any deprecation errors
mongoose.connect('mongodb://localhost/restful_task_api', { useNewUrlParser: true });

// Use native promises
mongoose.Promise = global.Promise;

// "title" and "description" must match request form titles:
var TaskSchema = new mongoose.Schema({
    title: {type: String, required: true, minlength: [3, 'title must be at least 3 characters']},
    description: {type: String, required: true, minlength: [3, 'description must be at least 3 characters']},
    completed: {type: Boolean, required: true},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
   })
   mongoose.model('Task', TaskSchema); // We are setting this Schema in our Models as 'Task'
   var Task = mongoose.model('Task') // We are retrieving this Schema from our Models, titled 'Task'

// Require body-parser (to receive post data from clients)
const bodyParser = require('body-parser');
// Integrate body-parser with our App
app.use(bodyParser.json());
// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
// Root Request

// This is the route that we already have in our server.js
// When the task presses the submit button on index.ejs it should send a post request to '/tasks'.  In
//  this route we should add the task to the database and then redirect to the root route (index view).

var session = require('express-session');

//...


app.use(session({ cookie: { maxAge: 60000 }, 
                  secret: 'woot',
                  resave: false, 
                  saveUninitialized: false}));

const flash = require('express-flash');
app.use(flash());
app.post('/tasks', function (req, res){  
  var task = new Task(req.body);
    task.save(function(err){
        if(err){
            // if there is an error upon saving, use console.log to see what is in the err object 
            console.log("We have an error!", err);
            // adjust the code below as needed to create a flash message with the tag and content you would like
            for(var key in err.errors){
                req.flash('registration', err.errors[key].message);
            }
            // redirect the task to an appropriate route
            res.redirect('/');
        }
        else {
          console.log('***************NEW TASK ADDED TO DB')  
          res.redirect('/');
        }
    });
});

// // The route title "tasks" matches the collection title in mongo.exe.
// app.post('/tasks', function(req, res) {
//   console.log("POST DATA", req.body);
//   // create a new Task with the title and description corresponding to those from req.body
//   var task = new Task({title: req.body.title, description: req.body.description});
//   // Try to save that new task to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
//   task.save(function(err) {
//     // if there is an error console.log that something went wrong!
//     if(err) {
//       console.log('*****something went wrong*****');
//     } 
//     else { // else console.log that we did well and then redirect to the root route
//       console.log('*****successfully added a task!*****');
//       res.redirect('/');
//     }
//   })
// })

// The root route -- we want to get all of the tasks from the database and then render the index view passing it all of the tasks
app.get('/', function(req, res) {
    Task.find({}, function(err, tasks) {
      // This is the method that finds all of the tasks from the database
      // Notice how the first parameter is the options for what to find and the second is the
      //   callback function that has an error (if any) and all of the tasks
      // Keep in mind that everything you want to do AFTER you get the tasks from the database must
      //   happen inside of this callback for it to be synchronous 
      // Make sure you handle the case when there is an error, as well as the case when there is no error

    var people = tasks;

    // This is where we will retrieve the tasks from the database and include them in the view page we will be rendering.
    res.render('index', {people: people});
    })
  })

// The specific route -- get just the matching task:
app.get('/specific', function(req, res) {
  Task.find({title:'John'}, function(err, tasks) {
    // This is the method that finds all of the tasks from the database
    // Notice how the first parameter is the options for what to find and the second is the
    //   callback function that has an error (if any) and all of the tasks
    // Keep in mind that everything you want to do AFTER you get the tasks from the database must
    //   happen inside of this callback for it to be synchronous 
    // Make sure you handle the case when there is an error, as well as the case when there is no error

  console.log('*****You have accessed the SPECIFIC route.*****');

  var person = tasks;

  // This is where we will retrieve the tasks from the database and include them in the view page we will be rendering.
  res.render('specific', {person: person});
  })
})

// The findOne route -- get the first matching task:
app.get('/findone', function(req, res) {
  Task.findOne({title:'John'}, function(err, tasks) {
    // This is the method that finds all of the tasks from the database
    // Notice how the first parameter is the options for what to find and the second is the
    //   callback function that has an error (if any) and all of the tasks
    // Keep in mind that everything you want to do AFTER you get the tasks from the database must
    //   happen inside of this callback for it to be synchronous 
    // Make sure you handle the case when there is an error, as well as the case when there is no error

  console.log('*****You have accessed the FIND ONE route.*****');

  var one = tasks;

  // This is where we will retrieve the tasks from the database and include them in the view page we will be rendering.
  res.render('findone', {one: one});
  })
})

app.post('/deleteATask', function(req, res) {
  Task.remove({title: req.body.title, description: req.body.description}, function(err){
    // This is the method that finds all of the tasks from the database
    // Notice how the first parameter is the options for what to find and the second is the
    //   callback function that has an error (if any) and all of the tasks
    // Keep in mind that everything you want to do AFTER you get the tasks from the database must
    //   happen inside of this callback for it to be synchronous 
    // Make sure you handle the case when there is an error, as well as the case when there is no error
    if(err) {
      console.log('*****There is at least 1 error! Please fix it.*****');
    } 
    else 
      { // else console.log that we did well and then redirect to the root route
      console.log('*****The process went through. Check DB to see if task successfully got DELETED.*****');
    }

  // This is where we will retrieve the tasks from the database and include them in the view page we will be rendering.
  res.redirect('/');
  })
})

app.post('/updateATask', function(req, res) {

  console.log('*****attempting to change '+req.body.title+' to',req.body.newtitle);
  Task.update({title:req.body.title}, {$set: {'title':req.body.newtitle}}, function(err){
    // This is the method that finds all of the tasks from the database
    // Notice how the first parameter is the options for what to find and the second is the
    //   callback function that has an error (if any) and all of the tasks
    // Keep in mind that everything you want to do AFTER you get the tasks from the database must
    //   happen inside of this callback for it to be synchronous 
    // Make sure you handle the case when there is an error, as well as the case when there is no error
    if(err) {
      console.log('*****There is at least 1 error! Please fix it.*****');
    } 
    else 
      { // else console.log that we did well and then redirect to the root route
      console.log('*****The process went through. Check DB to see if task successfully got UPDATED.*****');
    }

  // This is where we will retrieve the tasks from the database and include them in the view page we will be rendering.
  res.redirect('/');
  })
})

app.get('/tasksAPI', function(req, res){
  Task.find({}, function(err, tasks){
      if(err){
         console.log("Returned error", err);
         res.json({message: "Error", error: err})
      }
      else {
         res.json({message: "Success", data: tasks})
      }
   })
})

app.post('/new/:title/:description/:completed', function(req, res){
    console.log('********'+req.params.title+", "+req.params.description+req.params.completed);  
    var task = new Task(req.params);
    task.save(function(err){
        if(err){
            console.log("We have an error!", err);
            for(var key in err.errors){
                req.flash('registration', err.errors[key].message);
            }
            res.json({message: "Error", error: err})
        }
        else {
          console.log('***************NEW TASK ADDED TO DB')  
          res.redirect('/tasksAPI')
        }
    });
  })    

app.get('/remove/:title/:description', function(req, res) {
  Task.remove({title: req.params.title, description: req.params.description}, function(err){
    // This is the method that finds all of the tasks from the database
    // Notice how the first parameter is the options for what to find and the second is the
    //   callback function that has an error (if any) and all of the tasks
    // Keep in mind that everything you want to do AFTER you get the tasks from the database must
    //   happen inside of this callback for it to be synchronous 
    // Make sure you handle the case when there is an error, as well as the case when there is no error
    if(err) {
      console.log('*****There is at least 1 error! Please fix it.*****');
    } 
    else 
      { // else console.log that we did well and then redirect to the root route
      console.log('*****The process went through. Check DB to see if task successfully got DELETED.*****');
    }

  // This is where we will retrieve the tasks from the database and include them in the view page we will be rendering.
  res.redirect('/tasksAPI');
  })
})

app.get('/removeTask/:id', function(req, res) {
  console.log('**********'+req.params.id);
  Task.remove({_id: req.params.id}, function(err){
    // This is the method that finds all of the tasks from the database
    // Notice how the first parameter is the options for what to find and the second is the
    //   callback function that has an error (if any) and all of the tasks
    // Keep in mind that everything you want to do AFTER you get the tasks from the database must
    //   happen inside of this callback for it to be synchronous 
    // Make sure you handle the case when there is an error, as well as the case when there is no error
    if(err) {
      console.log('*****There is at least 1 error! Please fix it.*****');
    } 
    else 
      { // else console.log that we did well and then redirect to the root route
      console.log('*****The process went through. Check DB to see if task successfully got DELETED.*****');
    }

  // This is where we will retrieve the tasks from the database and include them in the view page we will be rendering.
  res.redirect('/tasksAPI');
  })
})

app.delete('/tasksAPI/:id', function(req, res) {
  console.log('**********'+req.params.id);
  //You can use "remove" or "deleteOne" below and it will still work, although the former will trigger an error message.
  Task.deleteOne({_id: req.params.id}, function(err){
    // This is the method that finds all of the tasks from the database
    // Notice how the first parameter is the options for what to find and the second is the
    //   callback function that has an error (if any) and all of the tasks
    // Keep in mind that everything you want to do AFTER you get the tasks from the database must
    //   happen inside of this callback for it to be synchronous 
    // Make sure you handle the case when there is an error, as well as the case when there is no error
    if(err) {
      console.log('*****There is at least 1 error! Please fix it.*****');
    } 
    else 
      { // else console.log that we did well and then redirect to the root route
      console.log('*****The process went through. Check DB to see if task successfully got DELETED.*****');
    }

  // This is where we will retrieve the tasks from the database and include them in the view page we will be rendering.
  res.redirect('/tasksAPI');
  })
})

app.get('/:title', function(req, res) {
  Task.findOne({title:req.params.title}, function(err, tasks){
    if(err){
       console.log("Returned error", err);
       res.json({message: "Error", error: err})
    }
    else {
       res.json({message: "Success", data: tasks})
    }
  })
})

app.get('/update/:id/:newtitle', function(req, res) {

  console.log('*****attempting to change '+req.params.id+' to',req.params.newtitle);
  Task.update({_id:req.params.id}, {$set: {'title':req.params.newtitle}}, function(err){
    // This is the method that finds all of the tasks from the database
    // Notice how the first parameter is the options for what to find and the second is the
    //   callback function that has an error (if any) and all of the tasks
    // Keep in mind that everything you want to do AFTER you get the tasks from the database must
    //   happen inside of this callback for it to be synchronous 
    // Make sure you handle the case when there is an error, as well as the case when there is no error
    if(err) {
      console.log('*****There is at least 1 error! Please fix it.*****');
    } 
    else 
      { // else console.log that we did well and then redirect to the root route
      console.log('*****The process went through. Check DB to see if task successfully got UPDATED.*****');
    }

  // This is where we will retrieve the tasks from the database and include them in the view page we will be rendering.
  res.redirect('/tasksAPI');
  })
})

app.put('/tasksAPI/:id/:newtitle', function(req, res) {

  console.log('*****attempting to change '+req.params.id+' to',req.params.newtitle);
  Task.update({_id:req.params.id}, {$set: {'title':req.params.newtitle}}, function(err){
    // This is the method that finds all of the tasks from the database
    // Notice how the first parameter is the options for what to find and the second is the
    //   callback function that has an error (if any) and all of the tasks
    // Keep in mind that everything you want to do AFTER you get the tasks from the database must
    //   happen inside of this callback for it to be synchronous 
    // Make sure you handle the case when there is an error, as well as the case when there is no error
    if(err) {
      console.log('*****There is at least 1 error! Please fix it.*****');
    } 
    else 
      { // else console.log that we did well and then redirect to the root route
      console.log('*****The process went through. Check DB to see if task successfully got UPDATED.*****');
    }

  // This is where we will retrieve the tasks from the database and include them in the view page we will be rendering.
  res.redirect('/tasksAPI');
  })
})

// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})