var express = require('express');
var http = require('http');
var redis = require('promise-redis')();
const crypto = require("crypto");
const DB = 'StayFitApp';
const app = express();
const bodyParser = require('body-parser');

//initialize a simple http server
const server = http.createServer( app );

//to handle static files, redirect to public folder
app.use(express.static(__dirname + '/public'));

// Configure body-parser middleware to parse JSON
app.use(bodyParser.json());

//When starting the app, send the login page to the client
app.get('/', (req, res) => {
  res.sendFile( __dirname+'/public/login/login.html');
});

app.get('/main', (req, res) => {
  res.sendFile(__dirname+'/public/main/main.html');
});
app.get('/explore', (req, res) => {
  res.sendFile(__dirname+'/public/explore/explore.html');
});
  
var redis_cli = redis.createClient({
  password: 'qjZNOGmQEyYMpatAxDSDFizuQ45q4WH4',
  host: 'redis-13549.c3.eu-west-1-1.ec2.cloud.redislabs.com',
  port: 13549
  }

);

redis_cli.on('connect', function() {
  console.log('Connected to redis');
  /* TESTING */
});


/* --------------------------------------- CRYPTO UTILS -----------------------------------------*/

function hashPassword(password) {
    /* Hash function that takes a password and a salt, and returns a hashed password 
    * using md5. */
    const salt = "a secret";
    const hash = crypto.createHash('md5');
    hash.update(password + salt);
    return hash.digest('base64');
  }

/* --------------------------------------REDIS COMMUNICATION------------------------------------- */

function getIdByUsername(username) {
    /* Given a username, it gets their id from the database*/
    return redis_cli.get(DB+':username_to_id:' + username);
}

function retrieveUserInfo(username) {
  /* Retrieves user information from the database */
  return getIdByUsername(username).then((id) => {
    return redis_cli
    .multi()
    .get(DB + ':credentials:' + id + ':full_name')
    .get(DB + ':credentials:' + id + ':is_trainer')
    .exec()
    .then(([fullName, isTrainer]) => {
      return [fullName, isTrainer];
});
  })
  
}

function getPassword(id) {
    /* Given an id, get the hashed password from database.  */
    var password_query = DB + ':credentials:' + id + ':password';
    return redis_cli.get(password_query);
}

function setPassword(id, hashedPassword) {
    /*Saves hashed password in the database*/
    const credential_query = DB+':credentials:' + id;
    redis_cli.set(credential_query + ':password', hashedPassword).then(() => {
        console.log("Password saved successfully");
    });
   
}

function setIsTrainer(id, isTrainer) {
  /* Save in database a boolean to control if it is a trainer account or not. */
  const credential_query = DB+':credentials:' + id; 
  redis_cli.set(credential_query + ':is_trainer', isTrainer);
}

function setFullName(id, fullname) {
  /* Save user's full name in the database. */
  const credential_query = DB+':credentials:' + id; 
  redis_cli.set(credential_query + ':full_name', fullname);
}

function checkPassword(username, password) {
    /* Given a username that already exists in the database, it first retrieves the 
    * corresponding id, and then it checks if the password is correct. 
    * Returns "logged" when correct and "error" when incorrect. */
    
    return getIdByUsername(username)
      .then((id) => {
        console.log("User exists in database and has id: " + id);
        return getPassword(id)
          .then((hash) => {
            // compare hashes
            const hashed_p = hashPassword(password);
            if (hash == hashed_p) {
              // Update local records. 
              //updateRecords(connection_id, id)
              /*DB.get("GR:credentials:" + id + ":token").then((token) => {
                sendToken(token, connection_id);
              })
              */
              return "logged";
            } else {
              console.log("Password non valid.");
              //sendLoginError(connection_id);
              return "error";
            }
          });
      });
}
function get_and_incr_count(counter) {
    /* Gets from and increments in the database the given counter */
    if (counter == "user_id_count" || counter == "class_id_count") {
        return redis_cli.incr(DB +':' +counter);
    } else {
        console.log("Error: " + counter + " counter doesn't exist in this database");
    }
}
function createNewCredentials(username, password, isTrainer, fullName) {
    /* Given a username that doesn't exist in the database, it first retrieves the 
    * id counter, and assigns an id to the user. Then, it stores the username and the id 
    * in the database. It also creates a session token. Finally, it also stores the password in the database. 
    * Returns "registered" if everything went right. */
    let id = -1;
    
    return get_and_incr_count("user_id_count")
      .then((count) => {
        // New count after increment
        console.log("id : " + count);
        id = count;
        // Saves the username and its id in the database
        const save_id = DB+':username_to_id:' + username;
        return redis_cli.set(save_id, id.toString());
      })
      .then(() => {
        console.log('Id count set successfully');
        // Save username and id in credentials table 
        const credential_query = DB+':credentials:' + id;
        redis_cli.set(credential_query + ':username', username).then(() => {
          // Hash password
          const hash = hashPassword(password);
          
          // Save password in credentials table
          setPassword(id, hash);
          setIsTrainer(id, isTrainer);
          setFullName(id, fullName);
          
        });
        return "registered";
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function existUsername( username) {
    /* Checks if the user already exists in the database. If so, check if password matches. 
    * Elsewise sets the new user and its password. 
    */ 
    var key = DB+':username_to_id:' + username;
    return redis_cli.exists(key)
      .then((reply) => {
        if (reply === 1) {
          // Key exists, get its value
          return true
        } else {
          // Key does not exist in the database
          console.log("Non-registered user.");
  
          return false
        }
      });
}

function saveClassOffer(class_id, title, creator, description, datetime, duration) {
  /* Save a class offer in the database. lass id is used as a key whereas the parameters title, 
  * creator, description, datetime and duration are the values stored. */
  console.log("Class id = " + class_id);
  const common_key = DB + ":class_offers:" +class_id;
  const keyValuePairs = [
    { key: common_key + ":title" , value: title},
    { key: common_key + ":creator", value: creator},
    { key: common_key + ":description", value: description },
    { key: common_key + ":datetime", value: datetime },
    { key: common_key + ":duration", value: duration }
  ];
  console.log("keyValuePairs = " + JSON.stringify(keyValuePairs));
  return new Promise((resolve, reject) => {
    const multi = redis_cli.multi();

    keyValuePairs.forEach(pair => {
      multi.set( pair.key, pair.value);
    });
    multi.exec((err, replies) => {
      if (err) {
        reject(err);
      } else {
        const failedReply = replies.find(reply => !reply || reply.toString().toLowerCase() !== 'ok');

        if (failedReply) {
          console.log("Failed to set value for key: " + failedReply)
          reject(new Error(`Failed to set value for key ${failedReply}`));
        } else {
          console.log('Class offer set successfully');
          resolve();
        }
      }
    });
  });
}

function addElementToList(list, element) {
  /* Given a list name and an element, it first checks the element didn't already exist 
   in the list and adds it if so. If the list doesn't exist, Redis creates an empty list 
   with the name provided and adds the element all followed.  */
  return redis_cli.lrange(list, 0, -1)
    .then((reply) => {
      if (!reply.includes(element)) {
        console.log("Element didn't exist before: " + element);
        return redis_cli.rpush(list, element)
          .then((reply) => {
            return reply;
          });
      }
      console.log("Element existed before: " + element);
      return Promise.resolve(0);
    });
}

function getElementFromList(list_path, index) {
  return redis_cli.lindex(list_path, index).then((element) => {
    return element;
  });
}
function getList(listName) {
  return new Promise((resolve, reject) => {
    redis_cli.lrange(listName, 0, -1, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function enroll_to_class(user_id, class_id) {
  var users_list = DB + ":class_offers:" + class_id + ":enrolled_users";
  users_promise = addElementToList(users_list, user_id);

  var classes_list = DB + ":enrolled_classes:" + user_id;
  classes_promise = addElementToList(classes_list, class_id);
  return Promise.all([users_promise, classes_promise]);
}

function createClassesDict(classes_ids) {
  return new Promise((resolve, reject) => {
    const enrolled_classes_dict = {};
    const promises = [];

    for (const class_id in classes_ids) {
      const promise = retrieveClassInfo(class_id)
        .then(([title, description, datetime, duration, creator]) => {
          enrolled_classes_dict[class_id] = { title, description, datetime, duration, creator };
        })
        .catch((err) => {
          console.log("Could not retrieve info from class: " + class_id);
          console.error(err);
        });
      promises.push(promise);
    }

    Promise.all(promises)
      .then(() => {
        resolve(enrolled_classes_dict);
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
}

function saveSubscription(subscriptor_id, trainer_id ) {
  var subscription = DB + ":subscriptions:" + subscriptor_id;
  addElementToList(subscription, trainer_id);
  var followers = DB + ":followers:" + trainer_id;
  addElementToList(followers, subscriptor_id);
}

  
/*********** Express server. COMMUNICATION with clients*********/
// Handle POST requests for a signup route
app.post('/signup', (req, res) => {
  // Access the JSON data sent in the request body
  var username = req.body.username;
  var password = req.body.password;
  var isTrainer = req.body.isTrainer;
  var fullName = req.body.fullname;
  // Logic to handle signup request
  existUsername(username).then((exists) => {
    //User already exists in the database
    if (!exists) {
      createNewCredentials(username, password, isTrainer, fullName);
      // Send a response to the client
      res.json({ type: "signup", message: 'Successful', content:{username: username, name: fullName, _isTrainer: isTrainer}  });
      console.log("Sign up of: " + username + " with password: " + password + " --> Succesful");
    } else {
      // Send a response to the client
      res.json({ type: "signup", message: 'Error. This username already exists. Choose another username.' });
      console.log("Sign up of: " + username + " with password: " + password + " --> Unsuccesful");
    }
  });
});

// Handle POST requests for a login route
app.post('/login', (req, res) => {
  // Access the JSON data sent in the request body
  var username = req.body.username;
  var password = req.body.password;
  
  // Logic to handle login request
  // ... (here you can implement your own login logic)
  existUsername(username).then((exists) => {
    if (exists) {
      checkPassword(username, password).then((result) => {
      if (result == 'logged') {
        // Send a response to the client
        retrieveUserInfo(username).then(([fullName, _isTrainer]) => {
          res.json({ type: 'login', message: 'Successful' , content:{username: username, name: fullName, _isTrainer: _isTrainer} });
        });
      } else {
        // Send a response to the client
        res.json({ type: 'login', message: 'Wrong password' });
        }
      });
    } else {
      res.json({ type: 'login', message: 'User dont exist' });
    }  
      
  });
  
});

app.post('/publish_class', (req, res) => {
  var class_object = req.body;
  console.log("publishing class " + JSON.stringify(class_object));
  
  // Take class id from database. Increment counter.
  get_and_incr_count("class_id_count").then((id) => {
    // Save class in database.
    var creator = class_object.creator;
    let trainer_id;
    getIdByUsername(creator)
      .then((creator_id) => {
        trainer_id = creator_id;
      return saveClassOffer(id, class_object.title, creator_id, class_object.description, class_object.datetime, class_object.duration)
     })
    .then(() => {
      // We save the class' id in a record in the database to have a follow up 
      return addElementToList(DB + ":classes_record", id); 
    })
    .then(() => {
      return addElementToList(DB + ":published_classes:" + trainer_id, id)
    })
    .then(() => {
      res.json({ type: 'saved_class', id: id, message: 'Successful' });
    })
    .catch((error) => {
      console.log("Error publishing class: " + error.message);
      res.json({ type: 'saved_class', id: null, message: 'Unsuccessful' });
  });
  });

});


app.post('/enrollment', (req, res) => {
  var username = req.body.username;
  var class_id = req.body.class_id;
  getIdByUsername(username).then((user_id) => {
    enroll_to_class(user_id, class_id).then(() => {
      console.log(username + " Enrolled successfully to a class.");
      res.json({type:"enrollment", message: "Successful"})
     });
  });
});

app.post('/my_enrollments', (req, res) => {
  var username = req.body.username;
  getIdByUsername(username).then((user_id) => {
    return getList(DB + ":enrolled_classes:" + user_id);
  })
  .then((enrolled_classes_ids) => {
    return createClassesDict(enrolled_classes_ids);
  })
    .then((enrolled_classes_dict) => {
      res.json({type:"enrollments_list", message: "Successful", content: enrolled_classes_dict})
  })
  .catch(err => {
    console.log("Imposible to retrive enrolled classes dict from user " + username);

    console.error(err);
  });
});


// Start the server on port 9026
app.listen(9026, () => {
  console.log('Server running on port 9026');
   
});