const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const cors = require('cors');
const crypto = require('crypto');
const User = require('./models/user');
const app = express();

require('dotenv').config();
const db = require('./config/db');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());


app.get('/login', async (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
     
    if (isMatch) {
      return res.json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ message: 'Invalid password' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Server error' });
  }
});


app.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    await user.save();

    res.redirect('/thankyou.html');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating user');
  }
});


app.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USERNAME,
      subject: 'Password Reset',
      text: `Dear user,\n\nPlease click on the following link to reset your password:  http://localhost:3000/reset-password?token=${token}\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nYour Website Team`,

    };

  await transporter.sendMail(mailOptions);
    return res.json({ message: 'Password reset instructions sent successfully' });

  } catch (error) {
    return res.status(500).json({ error: 'Error sending email' });
  }
});

app.get('/reset-password', async (req, res) => {
  res.sendFile(__dirname + '/public/reset-password.html');
});

app.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  console.log("toekn", token);
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      console.log("issue");
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }
    user.password = await bcrypt.compareSync(user.password, password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
