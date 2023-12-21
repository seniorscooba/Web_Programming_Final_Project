//import express, express router as shown in lecture code
import e, { Router } from 'express';
const router = Router();
import validation from '../validation.js';
import { registerUser, loginUser } from "../data/users.js";

router
  .route('/')
  .get(async (req, res) => {
    return res.json({ error: 'YOU SHOULD NOT BE HERE!' });
  });

router
  .route('/register')
  .get(async (req, res) => {
    res.status(200).render('register', {
      title: "Register Page"
    });
  })
  .post(async (req, res) => {
    try {
      let firstName = validation.checkName(req.body['firstNameInput'], 'first name');
      let lastName = validation.checkName(req.body['lastNameInput'], 'last name');
      let email = validation.checkEmail(req.body['emailAddressInput']);
      let password = validation.checkPassword(req.body['passwordInput'], 'password');
      let confirmPass = validation.checkPassword(req.body['confirmPasswordInput'], 'confirmation password');
      //let role = validation.checkRole(req.body['roleInput'], 'role');
      if (password !== confirmPass)
        throw "Passwords do not match";
      let dbResponse = await registerUser(firstName, lastName, email, password, null);
      if (dbResponse['insertedUser'] === true)
        res.status(200).redirect('login');
      else
        res.status(500).json();
    }
    catch (exception) {
      if (exception.message)
        res.status(500).send(exception.message);
      else
        res.status(500).send(exception);
    }
  });

router
  .route('/login')
  .get(async (req, res) => {
    res.status(200).render('login', {
      title: "Login Page",
    });
  })
  .post(async (req, res) => {
    try {
      let email = validation.checkEmail(req.body['emailAddressInput']);
      let password = validation.checkPassword(req.body['passwordInput']);
      if (email === undefined || password === undefined)
        return res.status(400).json();
      let userData = await loginUser(email, password);
      const dayFromNow = new Date();
      dayFromNow.setHours(dayFromNow.getHours() + 24);
      req.session.user = { _id: userData._id, firstName: userData.firstName, lastName: userData.lastName, emailAddress: email, role: userData.role };
      res.cookie('AuthState', '', { expires: dayFromNow });
      res.status(200).redirect('/posts');
    }
    catch (exception) {
      res.status(400).render('login', {
        errors: exception,
        error: exception,
        title: "Login Page",
        errorCode: 'Status Code: 400',
        hasErrors: true,
      });
    }
  });

router.route('/error').get(async (req, res) => {
  let errorCode = "403";
  let errorMsg = `User does not have permission to view the page`;
  res.status(403).render('error', {
    errorCode: `Error code ${errorCode}.`,
    errorMsg: errorMsg
  });
});

router.route('/logout').get(async (req, res) => {
  req.session.destroy();
  res.status(200).render('logout', {
    LogoutString: "You have been logged out.",
    title: "Logout Page",
  });
  const anHourAgo = new Date();
  anHourAgo.setHours(anHourAgo.getHours() - 1);
  res.cookie('AuthState', '', { expires: anHourAgo });
  res.clearCookie('AuthState');
});

export default router;