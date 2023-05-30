var express = require('express');
var redis = require('promise-redis')();
const crypto = require("crypto");
const DB = 'StayFitApp';
const app = express();
const bodyParser = require('body-parser');
const https = require('https');
const http = require('http');
const fs = require('fs');


// Load SSL certificate and private key
/*const options = {
  cert: fs.readFileSync('server.crt'),
  key: fs.readFileSync('server.key')
};*/

// Create HTTPS server
//const server = https.createServer(options, app);
const server = http.createServer(app);





//to handle static files, redirect to public folder
app.use(express.static(__dirname + '/public'));

// Configure body-parser middleware to parse JSON
app.use(bodyParser.json());


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

function getUsernameById(user_id) {
  /* Given a user_id, look for his username in the database*/
  return redis_cli.get(DB + ":credentials:" + user_id + ":username");
}

function retrieveUserInfo(username) {
  /* Retrieves user information from the database */
  return getIdByUsername(username).then((id) => {
    return redis_cli
    .multi()
    .get(DB + ':user_info:' + id + ':fullName')
    .get(DB + ':credentials:' + id + ':is_trainer')
    .get(DB + ':user_info:' + id + ':age')
    .get(DB + ':user_info:' + id + ':gender')
    .get(DB + ':user_info:' + id + ':location')
    .exec()
    .then(([fullName, isTrainer, age, gender, location]) => {
      return [fullName, isTrainer, age, gender, location];
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
        //console.log("Password saved successfully");
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
        //console.log("User exists in database and has id: " + id);
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
function createNewCredentials(username, password, isTrainer) {
  return new Promise((resolve, reject) => {
    let id = -1;

    get_and_incr_count("user_id_count")
      .then((count) => {
        //console.log("id : " + count);
        id = count;
        const save_id = DB+':username_to_id:' + username;
        return redis_cli.set(save_id, id.toString());
      })
      .then(() => {
        //console.log('Id count set successfully');
        const credential_query = DB+':credentials:' + id;
        redis_cli.set(credential_query + ':username', username).then(() => {
          const hash = hashPassword(password);
          setPassword(id, hash);
          setIsTrainer(id, isTrainer);
          resolve(id.toString()); // resolve the promise with the id value
        });
      })
      .catch((error) => {
        console.error(error);
        reject(error); // reject the promise with the error value
      });
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
          //console.log("Non-registered user.");
  
          return false
        }
      });
}
function saveUserInfo(user_id, fullName, age, location, gender) {
  const table_name = DB + ":user_info:" + user_id;

  const multi = redis_cli.multi();
  multi.set(table_name + ":fullName", fullName);
  multi.set(table_name + ":age", age);
  multi.set(table_name + ":location", location);
  multi.set(table_name + ":gender", gender);

  return new Promise((resolve, reject) => {
    multi.exec((err, replies) => {
      if (err) {
        reject(err);
      } else {
        resolve(replies);
      }
    });
  });
}
function saveClassOffer(class_id, title, category, creator, description, datetime, duration, level, price, maxUsers) {
  /* Save a class offer in the database. lass id is used as a key whereas the parameters title, 
  * creator, description, datetime and duration are the values stored. */
  const common_key = DB + ":class_offers:" +class_id;
  const keyValuePairs = [
    { key: common_key + ":title", value: title },
    { key: common_key + ":category", value: category },
    { key: common_key + ":creator", value: creator},
    { key: common_key + ":description", value: description },
    { key: common_key + ":datetime", value: datetime },
    { key: common_key + ":duration", value: duration },
    { key: common_key + ":level", value: level },
    { key: common_key + ":price", value: price },
    { key: common_key + ":maxUsers", value: maxUsers },
  ];
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
          //console.log('Class offer set successfully');
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
        //console.log("Element didn't exist before: " + element);
        return redis_cli.rpush(list, element)
          .then((reply) => {
            return reply;
          });
      }
      //console.log("Element existed before: " + element);
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

function add_recommended_class(user_id, class_id) {
  var classes_list = DB + ":recommended_classes:" + user_id;
  return addElementToList(classes_list, class_id);
}
function retrieveClassInfo(classId) {
  /* Retrieves class information from the database. It returns a promise that resolves a list 
  of class attributes.*/
  return redis_cli
    .multi()
    .get(DB + ':class_offers:' + classId + ':title')
    .get(DB + ':class_offers:' + classId + ':category')
    .get(DB + ':class_offers:' + classId + ':description')
    .get(DB + ':class_offers:' + classId + ':datetime')
    .get(DB + ':class_offers:' + classId + ':duration')
    .get(DB + ':class_offers:' + classId + ':creator')
    .get(DB + ':class_offers:' + classId + ':level')
    .get(DB + ':class_offers:' + classId + ':price')
    .get(DB + ':class_offers:' + classId + ':maxUsers')
    .exec()
    .then(([title, category, description, datetime, duration, creator, level, price, maxUsers]) => {
      return { title, category, description, datetime, duration, creator, level, price, maxUsers };
    })
    .catch((err) => {
      console.error(`Could not retrieve class with id ${classId}: ${err}`);
      throw err;
    });
}
function createClassesDict(classes_ids) {
  return new Promise((resolve, reject) => {
    const promises = [];
    const enrolled_classes_dict = {};
    
    for (const class_id of classes_ids) {
      let class_info;
      const promise = retrieveClassInfo(class_id)
        .then((class_obj) => {
           class_info = Object.assign({}, class_obj);
          return getUsernameById(class_obj.creator);
        })
        .then((username) => {
          class_info.creator = username;
          enrolled_classes_dict[class_id] = class_info;
          return class_info;
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

function deleteFromDB(prefix) {
  // Find keys with a common prefix
  redis_cli.keys(prefix + ':*', (err, keys) => {
    if (err) {
      console.error('Error:', err);
      return;
    }

    // Delete the matching keys
    if (keys.length > 0) {
      redis_cli.del(...keys, (err, result) => {
        if (err) {
          console.error('Error:', err);
          return;
        }
        console.log('Deleted keys:', result); // Output: Number of keys deleted
      });
    } else {
      console.log('No matching keys found.');
    }
  });
}

  
/*********** Express server. COMMUNICATION with clients*********/
// Handle POST requests for a signup route
app.post('/signup', (req, res) => {
  // Access the JSON data sent in the request body
  var username = req.body.username;
  var password = req.body.password;
  var isTrainer = req.body.isTrainer;
  var fullName = req.body.fullname;
  var age = req.body.age;
  var gender = req.body.gender;
  var location = req.body.location;
  // Logic to handle signup request
  existUsername(username).then((exists) => {
    //User already exists in the database
    if (!exists) {
      createNewCredentials(username, password, isTrainer)
      .then((user_id) => {
        return saveUserInfo(user_id, fullName, age, location, gender);
      })
      .then(() => {
        // Send a response to the client
      res.json({ type: "signup", message: 'Successful', content:{username: username, name: fullName, _isTrainer: isTrainer, age, location, gender}  });
      //console.log("Sign up of: " + username + " with password: " + password + " --> Succesful");
        }).catch((err) => {
          console.error(err);
      });
      
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
        retrieveUserInfo(username).then(([fullName, _isTrainer, age, gender, location]) => {
          //console.log("Sending login data to client");
          res.json({ type: 'login', message: 'Successful' , content:{username, name: fullName, _isTrainer, age, gender, location} });
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
  //console.log("publishing class " + JSON.stringify(class_object));
  
  // Take class id from database. Increment counter.
  get_and_incr_count("class_id_count").then((id) => {
    // Save class in database.
    var creator = class_object.creator;
    let trainer_id;
    getIdByUsername(creator)
      .then((creator_id) => {
        trainer_id = creator_id;
      return saveClassOffer(id, class_object.title, class_object.category, creator_id, class_object.description, class_object.datetime, class_object.duration, class_object.level, class_object.price, class_object.maxUsers)
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
      //console.log(username + " Enrolled successfully to a class.");
      retrieveClassInfo(class_id).then((class_obj) => {
        res.json({ type: "enrollment", message: "Successful", content: class_obj});
      })
      
     });
  });
});

app.post('/class_info', (req, res) => { 
  var class_id = req.body.class_id;
  retrieveClassInfo(class_id)
    .then((class_obj) => {
      res.json({ type: "class_info", message: "Successful", content: class_obj });
    })
    .catch((err) => {
      res.json({ type: "class_info", message: "Unuccessful" });
      console.error(err);
  } )
});

app.post('/my_enrollments', (req, res) => {
  
  var username = req.body.username;
  console.log("Enrollment list requested for user: " + username);
  getIdByUsername(username).then((user_id) => {
    return getList(DB + ":enrolled_classes:" + user_id);
  })
    .then((enrolled_classes_ids) => {
      //console.log("Classes ids list: "+ enrolled_classes_ids);
    return createClassesDict(enrolled_classes_ids);
  })
    .then((enrolled_classes_dict) => {
      //console.log("enrollments dict" + JSON.stringify(enrolled_classes_dict));
      res.json({type:"enrollments_list", message: "Successful", content: enrolled_classes_dict})
  })
  .catch(err => {
    console.log("Imposible to retreive enrolled classes dict from user " + username);
    res.json({ type: "enrollments_list", message: "Unsuccessful" });
    console.error(err);
  });
});

app.post('/my_recommendations', (req, res) => {
  
  var username = req.body.username;
  console.log("Recommendation list requested for user: " + username);
  getIdByUsername(username).then((user_id) => {
    return getList(DB + ":recommended_classes:" + user_id);
  })
    .then((rec_classes_ids) => {
      //console.log("Classes ids list: "+ rec_classes_ids);
    return createClassesDict(rec_classes_ids);
  })
    .then((rec_classes_dict) => {
      //console.log("Recommendations dict" + JSON.stringify(rec_classes_dict));
      res.json({type:"rec_list", message: "Successful", content: rec_classes_dict})
  })
  .catch(err => {
    console.log("Imposible to retreive recommended classes dict from user " + username);
    res.json({ type: "rec_list", message: "Unsuccessful" });
    console.error(err);
  });
});

app.post('/recommendation', (req, res) => {
  var user_id = req.body.user_id;
  var class_id = req.body.class_id;

  add_recommended_class(user_id, class_id)
    .then(() => {
      res.json({ type: 'recommendations', message: 'Succesful' })
    })
    .catch((err) => {
      res.json({ type: "recommendations", message: "Unsuccessful" });
      console.error(err);
    });
});



// Start the server on port 9026
app.listen(9026, () => {
  console.log('Server running on port 9026');
  //const prefix = DB + ':class_offers';
  //deleteFromDB(prefix)
  
   
});


