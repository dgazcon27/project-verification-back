var express = require("express");
var router = express.Router();
const fs = require("node:fs");
const bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET users listing. */
router.post("/login", function (req, res, next) {
  const { body } = req;
  try {
    const data = fs.readFileSync("./utils/users.json", "utf8");
    const parseData = JSON.parse(data)
    const user = parseData.find((item) => item.username == body.username)
    console.log(`INDEX: ${JSON.stringify(user)}`);
    if (!user) {
      console.log("Usuario no encontrado");
      return res.sendStatus(404)
    }

    if (!bcrypt.compareSync(body.password, user.password)) {
      console.log("Clave incorrecta");
      return res.sendStatus(400)
    }
    console.log("usuario autenticado");
    return res.sendStatus(200);
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(500)
  }
});

router.post("/", function (req, res, next) {
  const { body } = req;
  const salt = bcrypt.genSaltSync(saltRounds);
  const password = bcrypt.hashSync(body.password, salt);
  try {
    const data = fs.readFileSync("./utils/users.json", "utf8");
    const parseData = JSON.parse(data)
    const user = {
      username: body.username,
      password,
      image: body.image
    }
    let usersList = []
    if (parseData.length == 0) {
      usersList.push(user)
    } else {
      if (parseData.find(({username})=> username == body.username)) {
        return res.sendStatus(400);
      }
      parseData.push(user)
      usersList = parseData;
    }
    fs.writeFileSync("./utils/users.json", JSON.stringify(usersList))
    return res.sendStatus(201);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500)
  }

});

module.exports = router;
