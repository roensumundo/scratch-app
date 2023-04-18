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

redis_cli.set(DB + ":test","hello world").then(() => {
  console.log("Setting test succesfull");
})





redis_cli.on('connect', function() {
    console.log('Connected to redis');
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

function retrieveUserInfo(id) {
    /* Retrieves user information from the database */
    
    return DB
      .multi()
      .get(DB+':credentials:' + id + ':username')
      .get(DB+':credentials:' + id + ':is_teacher')
      .exec()
      .then(([username, isTeacher]) => {
        return { username: username,  is_teacher: JSON.parse(isTeacher) };
      });
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
function createNewCredentials(username, password) {
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
          
        });
        // Create a random session token
        //const session_token = Math.random().toString(16);
        // Saves session token and sends it to the client
        //DB.set(credential_query + ':token', session_token);
        //DB.set('GR:token_to_id:' + session_token, id);
        //sendToken(session_token, connection_id);
  
        // Save connection's id and user's id in the local records. 
        //updateRecords(connection_id, id);
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
  
/* Express server. COMMUNICATION with clients */

// Handle POST requests for a signup route
app.post('/signup', (req, res) => {
  // Access the JSON data sent in the request body
  const username = req.body.username;
  const password = req.body.password;

  // Logic to handle signup request
  // ... (here you can implement your own signup logic)
  existUsername(username).then((exists) => {
    if (!exists) {
      createNewCredentials(username, password);
      // Send a response to the client
      res.json({ type: "signup", message: 'Succesful' });
      console.log("Sign up of: " + username + " with password: " + password + " --> Succesful");
    } else {
      // Send a response to the client
      res.json({ type: "signup", message: 'Error' });
      console.log("Sign up of: " + username + " with password: " + password + " --> Unsuccesful");
    }
  });
});

// Handle POST requests for a login route
app.post('/login', (req, res) => {
  // Access the JSON data sent in the request body
  const username = req.body.username;
  const password = req.body.password;

  // Logic to handle login request
  // ... (here you can implement your own login logic)
  existUsername(username).then((exists) => {
    if (exists) {
      checkPassword(username, password).then((result) => {
      if (result == 'logged') {
        // Send a response to the client
        res.json({ type: 'login', message: 'Successful' });
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

// Start the server on port 9026
app.listen(9026, () => {
  console.log('Server running on port 9026');
});