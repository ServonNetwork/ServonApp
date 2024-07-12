const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//connect to db
const dbURI = "mongodb+srv://servonworker:test1234@servon.co9n1qq.mongodb.net/ServonNetwork?retryWrites=true&w=majority&appName=Servon"

let loged_in = false;

mongoose.connect(dbURI)
    .then((result) => console.log("connected to database"))
    .catch((err) => console.error(err));

//Profile Schema
const profileSchema = new Schema ({
    username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    donator: {
        type: Boolean,
        required: true
    },

    follower: {
        type: Number,
        required: false
    }
});

const Profile = mongoose.model('Profile', profileSchema);

//Login and Register Funcs
function registerUser(username, password){
    const profile = new Profile({
        username: username,
        password: password,
        donator: false,
        follower: 0
    })

    profile.save()
        .then((result) => {
            console.log(result)
        })
        .catch((err) => {
            console.log(err)
        })
}

function loginUser(username, password) {
    Profile.findOne({ username: username, password: password })
      .then((user) => {
        if (user && loged_in == false) {
          user_id = user._id;
          loged_in = true;
          console.log('Login successful:', user);
        }
        else if(user && loged_in == true){
          console.log("Alredy loged in")
        }
        else {
          console.log('Invalid username or password');
        }
      })
      .catch((err) => {
        console.error('Error logging in:', err);
      });
}

//Login Page
var Btn = document.getElementById("login_btn");
var usernameInput = document.getElementById("username_input");
var passwordInput = document.getElementById("password_input");

Btn.onclick = function() {
    if (Btn.textContent == "Register"){
        console.log("start")
        registerUser(usernameInput.value, passwordInput.value)
        console.log("end")
    }
    else if(Btn.textContent == "Login"){
        console.log("start")
        loginUser(usernameInput.value, passwordInput.value)
        console.log("end")
    }
}

module.exports = mongoose;