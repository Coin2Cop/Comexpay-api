const temporal = require("../database/models/temporalModel");
const User = require("../database/models/userModel");
const nodemailer = require('nodemailer');
const axios = require('axios');

const recuperar = (req, res) => {
    const { body } = req;
    if (
      !body.email
    ) {
      res.status(400).send({
        status: "FAILED",
        data: {
          error:
            "One of the following keys is missing or is empty in request body: 'email'",
        },
      });
    }
    const user = User;
    try{
      user.find({email: body.email}).then((data) => {
        const num = Math.floor((Math.random() * (99999 - 10000 + 1)) + 10000)




        const url = "http://31.220.84.241/comexpay/dashboard/template/comexpay/pages/verificacion/recuperar.html?email="+body.email
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            //type: 'OAuth2',
            user: process.env.MAIL_USERNAME,
            pass: "pfnd syob xhxf uhdr",
            /*clientId: process.env.OAUTH_CLIENTID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN*/
          }
        });
        const mailOptions = {
          from: process.env.EMAL_TO,
          to: body.email,
          subject: 'Recuperar contraseña COMEXPAY',
          text: 'tu codigo de confirmacion es: '+num+' entra al siguiente enlace y sigue las instrucciones '+url
        };
  
        transporter.sendMail(mailOptions, function(err, data) {
          if (err) {
            console.log("Error " + err);
          } else {
            console.log("Email sent successfully");
          }
        });
  
  
      }).catch((error) => {
        res.status(401).send({ status: "FAILED", data: [] })
      });
  
    } catch (error) {
      res
        .status(error?.status || 500)
        .send({ status: "FAILDED", data: { error: error?.message || error } });
    }
  }