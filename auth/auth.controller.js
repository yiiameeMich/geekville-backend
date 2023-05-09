const User = require("../user/user.model")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto')
require('dotenv').config()

sgMail.setApiKey(process.env.SENDGRID_API)

const generateAccessToken = (login, id) => {
  const payload = {
    login,
    id
  }
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: '24h'})
}

class authController {

  async register(req, res) {
    try {
      const userData = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber
      }

      const isLoginTaken = await User.findOne({username: userData.username})
      const isEmailTaken = await User.findOne({email: userData.email})
      const isPhoneNumberTaken = await User.findOne({phoneNumber: userData.phoneNumber})

      const validationCondition = isLoginTaken || isEmailTaken || isPhoneNumberTaken

      if (validationCondition && !validationCondition.isVerified) {
        await User.deleteOne({ _id: validationCondition._id })
      }

      if (isLoginTaken && isLoginTaken.isVerified) {
        return res.status(400).json({message: "This login is already taken"})
      }

      if (isEmailTaken && isEmailTaken.isVerified) {
        return res.status(400).json({message: "This email address is already taken"})
      }

      if (isPhoneNumberTaken && isPhoneNumberTaken.isVerified) {
        return res.status(400).json({message: "This phone number is already taken"})
      }

      const passwordHashed = bcrypt.hashSync(userData.password, 7)

      const newUser = await new User({
        username: userData.username,
        password: passwordHashed,
        email: userData.email,
        phoneNumber: userData.phoneNumber
      })

      await newUser.save()

      const token = generateAccessToken(newUser.username, newUser._id)

      const verificationToken = crypto.randomBytes(20).toString('hex');

      const msg = {
        to: `${newUser.email}`,
        from: process.env.SENDGRID_VERIFIED_SENDER,
        subject: 'GeekVille verification code',
        html: `    
            <div style="width: 100%; background: #090403; padding: 60px 0; text-align: center;">
              <h1 style="font-size: 48px; padding: 20px 0; color: #d9c79d; font-family: monospace;">GEEKVILLE</h1>  
              <h3 style="padding: 20px 0; color: #d9c79d; font-family: monospace; font-size: 18px;">Click the following button to verify your account:</h3>        
              <a href="${req.protocol}://${req.get('host')}/auth/verify/${verificationToken}" 
                 style="width: 250px; height: 40px; display: flex; align-items: center; 
                 justify-content: center; text-decoration: none; padding: 20px 0; margin: 0 auto;">
                <button style="width: 100%; height: 100%; font-family: monospace; font-size: 21px; 
                               border: 1px solid rgba(217, 199, 157, 0.6); 
                               border-radius: 8px; background: #d9c79d; font-weight: 700; cursor: pointer;"> 
                    VERIFY ACCOUNT
                </button>
              </a>
            </div>
            `,
      }

      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })

      await User.updateOne({ username: req.body.username }, { verificationToken: verificationToken });

      return res.json({
          token,
          username: newUser.username,
          bonuses: newUser.bonusesAmount,
          isVerified: newUser.isVerified,
      })

    } catch (error) {
      console.log(error)
      return res.status(400).json({message: "Registration error"})
    }

  }

  async verify(req, res) {
    try {
      const user = await User.findOne({ verificationToken: req.params.token });

      if (!user) {
        return res.status(404).json({ message: "Verification token not found" });
      }

      user.isVerified = true;

      await user.save();

      return res.redirect(`${process.env.GEEKVILLE_FRONT_URL}/verified`);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to verify account" });
    }
  }

  async login(req, res) {
    try {
      const userData = {
        username: req.body.username,
        password: req.body.password,
      }

      const user = await User.findOne({ username: userData.username })

      if (!user) {
        return res.status(400).json({ message: "This user does not exist or given data is incorrect" })
      }

      if (!user.isVerified) {
        return res.status(400).json({ message: "'This account isn't verified" })
      }

      const token = generateAccessToken(user.username, user._id)

      return res.json({
          token,
          username: user.username,
          bonuses: user.bonusesAmount,
          isVerified: user.isVerified,
          role: user.role,
      })
    } catch (error) {
      console.log(error)
      res.status(400).json({ message: "Authorization error" })
    }
  }
}

module.exports = new authController()