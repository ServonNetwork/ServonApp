const mongoose = require('mongoose');

const dbURI = "mongodb+srv://servonworker:test1234@servon.co9n1qq.mongodb.net/?retryWrites=true&w=majority&appName=Servon"

mongoose.connect(dbURI)
    .then((result) => console.log("connected to database"))
    .catch((err) => console.error(err));