const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = express.Router();

const app = express();

const basePath = path.join(__dirname, "../public");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(
  "mongodb+srv://admin-kalpit:kalpit@faceweb.p3ofotp.mongodb.net/authentication",
  { useNewUrlParser: true }
);

// For Registering to website userschema
const userSchema = {
  name: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  totalBalance: {
    type: Number,
    default: 3000,
  },
  attendence: {
    type: String,
    default: 1,
  },
};

// Storing SignUp Form Details to MonogoDB
const User = new mongoose.model("User", userSchema);

router.post("/signup", async (req, res) => {
  const { name, userName, password } = req.body; //Get name, username and password from Signup Form

  //Creating new user in collegection user
  const user = new User(req.body);

  const userExist = await User.findOne({ userName: userName });

  if (userExist) {
    return res.send("<h1> Username Already Exists! </h1>"); //Error Page
  } else {
    //Saving user's data to database
    await user.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/");
        console.log("SignUp Successful");
      }
    });
  }
});

//Login Form
router.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body; //Get username and password from Login Form
    if (userName && password) {
      const userLogin = await User.findOne({ userName: userName }); //Search for username in database

      if (userLogin) {
        const isMatch = password == userLogin.password; //check wheather password match with database password

        if (!isMatch) {
          return res.send("<h1> Enter Correct Login Details! </h1>"); //Error Page
        } else {
          console.log("User LogIn Success");
        }
      } else {
        return res.send("<h1> Login Details Does Not Exits! </h1>"); //Error Page
      }
    }
  } catch (err) {
    console.error(err);
  }
});

// Attendence Form
router.post("/attendence", async (req, res) => {
  try {
    const { userName } = req.body; //Get username from Attendence Form

    if (userName) {
      const userLogin = await User.findOne({ userName: userName }); //Search for username in database

      if (userLogin) {
        const currentAttendence = Number(userLogin.attendence);
        const newAttendence = currentAttendence + 1;
        var myquery = { attendence: userLogin.attendence };
        var newvalues = { $set: { attendence: newAttendence } };

        // Updating Attendence in Database
        await User.updateOne(myquery, newvalues, function (err, res) {
          if (err) throw err;
          console.log("Attendence Updated");
        });
      } else {
        return res.send("<h1> Enter Correct Details! </h1>"); //Error Page
      }
    }
  } catch (err) {
    console.error(err);
  }
});

// Payment Form
router.post("/payment", async (req, res) => {
  try {
    const { userName, amount } = req.body; //Get username and amount from Payment Form
    if (userName && amount) {
      const userLogin = await User.findOne({ userName: userName }); //Search for username in database

      if (userLogin) {
        if (amount > userLogin.totalBalance) {
          return res.send(
            "<h1> Amount for Payment is greater than Available Amount! </h1>"
          ); //Error Page
        } else {
          const newAmount = userLogin.totalBalance - amount;

          var myquery = { totalBalance: userLogin.totalBalance };
          var newvalues = { $set: { totalBalance: newAmount } };
          // Updating Amount in Database
          await User.updateMany(myquery, newvalues, function (err, data) {
            if (err) throw err;
            console.log("Payment Success");
          });
        }
      } else {
        return res.send("<h1> Enter Correct Details! </h1>"); //Error Page
      }
    }
  } catch (err) {
    console.error(err);
  }
});

app.use("/", router);

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is Running!");
});
