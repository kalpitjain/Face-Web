document.getElementById("submit-button").addEventListener("click", function () {
  //On button click face recogination starts
  const getId = document.querySelector(".share").id; //gets the id of the page from where it event is call

  var userName = document.getElementById(getId).value;

  // Input video from webcam
  const video = document.getElementById("videoInput");

  // Loading Face API models
  Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
  ])
    .then(start)
    .catch((e) => console.log(e));

  function start() {
    console.log("Models Loaded");

    // Adding a Note to wait for facial models to load
    document.getElementById("note").innerHTML += "<h6> Please Wait! </h6>";

    // Playing Video after Model get Loaded
    navigator.getUserMedia(
      { video: {} },
      (stream) => (video.srcObject = stream),
      (err) => alert("Camera Permision Denied")
    );

    recognizeFaces();
  }

  // Function to Recognize Faces
  async function recognizeFaces() {
    const labeledDescriptors = await loadLabeledImages();

    // Storing the data for matching faces
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.5);

    //Starting Face Detection
    video.addEventListener("play", () => {
      //Stores the display size of the video
      const displaySize = { width: video.width, height: video.height };

      // Sets the Interval for Face Detection
      setInterval(async () => {
        const detections = await faceapi
          .detectAllFaces(video)
          .withFaceLandmarks()
          .withFaceDescriptors();

        // Matches the data with video output and return best match
        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
        const results = resizedDetections.map((d) => {
          return faceMatcher.findBestMatch(d.descriptor);
        });

        //If the result for the detection and labeled image are same it redirects to features page
        results.forEach((result, i) => {
          if (result.label.toString() === userName) {
            window.location.href = "features.html";
          }
        });
      }, 1000);
    });
  }

  // Function to load stored image data
  function loadLabeledImages() {
    const labels = [userName]; // userName should be the same as the name of the image

    //from the labels image data is loaded
    return Promise.all(
      labels.map(async (label) => {
        const descriptions = [];

        const image = `../labeled_images/${label}.jpg`; //format of image shoud be .jpg only

        try {
          const img = await faceapi.fetchImage(image); //fatches the image

          //Storing fatched image data
          const detections = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();

          //Pushing descriptors of fatched image to descriptions array
          descriptions.push(detections.descriptor);

          console.log(label + "'s Data Loaded ");

          //Removing Note
          document.getElementById("note").remove();

          //Enabling Camera Button
          document.getElementById("camera-button").disabled = false;

          //Returning Image's Label and Descriptions
          return new faceapi.LabeledFaceDescriptors(label, descriptions);
        } catch (error) {
          alert(
            error +
              "\n< 'No image of with name " +
              userName +
              ".jpg is found!' >"
          );
          window.location.href = "index.html";
        }
      })
    );
  }
});
