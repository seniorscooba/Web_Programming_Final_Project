import validation from '../validation.js';
import { users } from '../config/mongoCollections.js';
import bcrypt, { compare } from 'bcrypt';

export const registerUser = async (
  firstName,
  lastName,
  emailAddress,
  password,
  role
) => {

  try {
    // create new user
    const newUser = {};
    newUser.firstName = validation.checkName(firstName, 'First name');
    newUser.lastName = validation.checkName(lastName, 'Last name');
    newUser.emailAddress = validation.checkEmail(emailAddress);
    const usersCollection = await users();
    const existingEmail = await usersCollection.findOne({ emailAddress: emailAddress });
    if (existingEmail) throw "Email already exists!";
    newUser.password = validation.checkPassword(password, "Password");
    
    // hash password using bcrypt
    const saltRounds = 16;
    newUser.password = await bcrypt.hash(password, saltRounds);
    // insert user info to database
    const newInsertInformation = await usersCollection.insertOne(newUser);
    if (!newInsertInformation.insertedId) throw 'Insert failed!';
    return { '_id': newInsertInformation.insertedId }
  }
  catch (exception) {
    throw exception;
  }
};

export const loginUser = async (emailAddress, password) => {
  // attempt login
  emailAddress = validation.checkEmail(emailAddress);
  password = validation.checkPassword(password);
  const usersCollection = await users();
  const user = await usersCollection.findOne({ emailAddress: emailAddress });
  if (!user) throw "Either the email address or password is invalid";
  // compare passwords
  const saltRounds = 16;
  let comparedPassword = await bcrypt.compare(password, user.password);
  if (comparedPassword === true) {
    return { firstName: user.firstName, lastName: user.lastName, emailAddress: emailAddress, role: user.role };
  }
  else {
    throw "Either the email address or password is invalid";
  }
};