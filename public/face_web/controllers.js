// Toggle Button Controls
var x = document.getElementById("login");
var y = document.getElementById("signup");
var z = document.getElementById("button");

// Function to move Signup Form to Login Form's place
function signup() {
  x.style.right = "35rem";
  y.style.right = "2.8rem";
  z.style.left = "7rem";
  x.style.opacity = "0";
  y.style.opacity = "1";
  x.style.zIndex = "-1";
  y.style.zIndex = "1";
}

// Function to move Login Form to its original Place
function login() {
  x.style.right = "2.8rem";
  y.style.right = "35rem";
  z.style.left = "0rem";
  y.style.opacity = "0";
  x.style.opacity = "1";
  y.style.zIndex = "-1";
  x.style.zIndex = "1";
}

// Video Button Controls
var camVideo = document.getElementById("videoInput");

function playPause() {
  if (camVideo.paused) {
    camVideo.play();
  } else {
    camVideo.pause();
  }
}
