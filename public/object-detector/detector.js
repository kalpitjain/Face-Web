let model;
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
let video = document.getElementById("webcam");

// setup camera for detection
const setupCamera = () => {
  navigator.mediaDevices
    .getUserMedia({
      video: {
        width: 640,
        height: 480,
      },
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((e) => alert(e + " for camera!"));
};

const detectObj = async () => {
  //Predict detected object from video
  const predictions = await model.detect(video);

  //Draw a Canvas
  context.drawImage(video, 0, 0, 640, 480);

  for (let n = 0; n < predictions.length; n++) {
    if (predictions[n].score > 0.6) {
      //Prediction should be greater than 60%
      const start = predictions[n].bbox[0];
      const end = predictions[n].bbox[1];
      var confidence = predictions[n].score;
      var obj = predictions[n].class;
      const size = [end[0] - start[0], end[1] - start[1]];

      // Render a rectangle over each detected face.
      context.beginPath();
      context.lineWidth = "5";
      context.strokeStyle = "red";
      context.rect(...predictions[n].bbox);

      context.font = "1.5rem Arial";
      context.stroke();

      context.fillText(
        confidence.toFixed(2) * 100 + "% " + obj,
        predictions[n].bbox[0],
        predictions[n].bbox[1] > 10 ? predictions[n].bbox[1] - 5 : 10
      );
    }
  }
};

setupCamera();

video.addEventListener(
  "loadeddata",
  async () => {
    // Load the cocoSsd Model
    model = await cocoSsd.load();
    setInterval(detectObj, 1);
  },
  false
);
