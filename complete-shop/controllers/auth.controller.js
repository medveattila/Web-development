//Itt lesznek az authenticationért felelős controllerek, amik kezelik a requesteket

const User = require("../models/user.model");
const authUtil = require("../util/authentication");
const validation = require("../util/validation");
const sessionFlash = require("../util/session-flash");

function getSignup(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = { //default empty values
      email: '',
      confirmEmail: '',
      password: '',
      fullname: '',
      street: '',
      postal: '',
      city: ''
    }
  }

  res.render("customer/auth/signup", {inputData: sessionData}); //a views mappához képesti relatív útvonal kell
}

async function signup(req, res, next) {
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body['confirm-email'],
    password: req.body.password,
    fullname: req.body.fullname,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city,
  };

  if (
    !validation.userDetailsAreValid(
      // !something = not something
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.street,
      req.body.postal,
      req.body.city
    ) ||
    !validation.emailIsConfirmed(req.body.email, req.body["confirm-email"]) //azért kell ['confirm-email'], mert a kötőjel a dot notationnál (req.body.confirm-email) nem jó
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: "Please check your input.",
        ...enteredData, //spread operator szétszedi az objectet key-value párokra
      },
      function () {
        res.redirect("/signup");
      }
    );
    return;
  }

  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city
  ); //egy új objektumot hozunk létre a User class alapján, req.body: a express.urlencoded miatt érhető el itt


  try {
    const existsAlready = await user.existsAlready(); //megnézzük, hogy van e már ilyen user

    console.log(existsAlready)

    if (existsAlready) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: "User exists already!",
          ...enteredData,
        },
        function () {
          res.redirect("/signup"); //jobb ha sessionokkal tároljuk a beírt adatokat, és redirectelünk egy get routhoz
        }
      );
      return;
    }
    //mivel az express a default error handling middleware-val nem kezeli alapból az async dolgok errorjait, nekünk kell az error handlingot megoldani
    await user.signup(); //az User classban definiált method
  } catch (error) {
    next(error);
    return; //így az error a default error handling middlewarebe fog menni
  }

  res.redirect("/login"); //jobb ilyen helyeken a redirect (resubmit elkerülése miatt)
}

function getLogin(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: '',
      password: ''
    }
  }

  res.render("customer/auth/login", {inputData: sessionData});
}

async function login(req, res, next) {
  const user = new User(req.body.email, req.body.password); //csak a emailt meg a passwordot nézzük, a többi itt undefined lesz
  let existingUser; //mert ha ezt a try blokkban definiálnánk, csak ott lehetne használni

  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    next(error);
    return;
  }

  

  const sessionErrorData = {
    errorMessage: "Invalid credentials!",
    email: user.email,
    password: user.password,
  };

  if (!existingUser) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect("/login");
    });
    return; //ha nincs ilyen user, nem folytatódik a function
  }

  const passwordIsCorrect = await user.hasMatchingPassword(existingUser.password); //az existinguser passwordját lekértük, az így hashed-ként jön ide

  console.log(passwordIsCorrect);


  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect("/login");
    });
    return;
  }

  authUtil.createUserSession(req, existingUser, function () {
    //ez az anonymous function az "action"
    res.redirect("/");
  });
}

function logout(req, res) {
  authUtil.destroyUserAuthSession(req);
  res.redirect("/login");
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
