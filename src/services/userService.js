const { v4: uuid } = require("uuid");
const User = require("../database/User");
const axios = require('axios');
const createNewUser = (newUser) => {
    /*const num = Math.floor((Math.random() * (9999 - 1000 + 1)) + 1000)
    const url = 'http://api.labsmobile.com/get/send.php?username=info@globalcoins.co&password=cs692gnMUCcXxQYWPDWnbKbF957uzqqC&msisdn=' + newUser.phone + '&message=Tu código de confirmación Comexpay es: ' + num
    axios.get(url)
    .then((response) => {
    })
    .catch((error) => {
    });*/
    console.log(newUser)


    const userToInsert = {
      ...newUser,
      createdAt: new Date().toLocaleString("en-US", { timeZone: "America/Bogota" }),
      updatedAt: new Date().toLocaleString("en-US", { timeZone: "America/Bogota" }),
      phoneCode: 0000
    };
    console.log(userToInsert)
    try {
      const createdUser = User.createNewUser(userToInsert);
      console.log(createdUser)
      return createdUser;
    } catch (error) {
      throw error;
    }
};

module.exports = {
    createNewUser,
  };