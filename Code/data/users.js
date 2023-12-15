import validation from '../validation.js';
import { users } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import bcrypt, { compare } from 'bcrypt';

export const registerUser = async (
  firstName,
  lastName,
  emailAddress,
  password,
  role
) => {

  try {
    const newUser = {};
    newUser.firstName = validation.checkName(firstName, 'First name');
    newUser.lastName = validation.checkName(lastName, 'Last name');
    newUser.emailAddress = validation.checkEmail(emailAddress);
    const usersCollection = await users();
    const existingEmail = await usersCollection.findOne({ emailAddress: emailAddress });
    if (existingEmail) throw "Email already exists!";
    newUser.password = validation.checkPassword(password, "Password");
    newUser.role = validation.checkRole(role, "Role");

    // hash password using bcrypt
    const saltRounds = 16;
    newUser.password = await bcrypt.hash(password, saltRounds);

    // insert the user's first name, last name, email address, hashed password and role into the database.
    const newInsertInformation = await usersCollection.insertOne(newUser);
    if (!newInsertInformation.insertedId) throw 'Insert failed!';
    return { 'insertedUser': true }
  }
  catch (exception) {
    throw exception;
  }

};

export const loginUser = async (emailAddress, password) => {
  emailAddress = validation.checkEmail(emailAddress);
  password = validation.checkPassword(password);
  // query the db for the email address
  const usersCollection = await users();
  // Query the db for the emailAddress supplied, if it is not found, throw an error stating "Either the email address or password is invalid".
  const user = await usersCollection.findOne({ emailAddress: emailAddress });
  if (!user) throw "Either the email address or password is invalid";
  // If the emailAddress supplied is found in the DB, you will then use bcrypt to compare the hashed password in the database with the password input parameter.
  const saltRounds = 16;
  let comparedPassword = await bcrypt.compare(password, user.password);
  if (comparedPassword === true) {
    return { firstName: user.firstName, lastName: user.lastName, emailAddress: emailAddress, role: user.role };
  }
  else
    throw "Either the email address or password is invalid";
};
