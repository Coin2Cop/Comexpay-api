const express = require("express");
const path = require('path');
const cors = require('cors')
const fileUpload = require('express-fileupload')
const mongoose = require("mongoose")
//const apicache = require("apicache");
require("dotenv").config();
const v1ComexpayRouter = require("./v1/routes/comexpayRoutes");
const { swaggerDocs: V1SwaggerDocs } = require("./v1/swagger");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3002;
//const cache = apicache.middleware;

app.use(fileUpload())
app.use(express.static('files'))
app.use('/recursos', express.static(path.join(__dirname+'/files')))
console.log(path.join(__dirname + '/files'))

app.use(express.urlencoded({ extend: true, limit: '100mb' }));
app.use(express.json({limit: '100mb'}));
//app.use(cache("2 minutes"));
//app.use(cors());

const allowedOrigins = ['https://comexpay.co', 'https://app.comexpay.co'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Permite el envío de cookies
}));


app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

app.set("trust proxy", 1); // '1' si tienes un proxy, o 'true' para confiar en todos


app.use("/api/v1/comexpayRoutes", v1ComexpayRouter);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDb"))
  .catch((error) => console.error(error))

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  V1SwaggerDocs(app, PORT);
});
