const video = document.getElementById('video');

//which runs all asyncronously
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models')

]).then(startVideo)
//access wecam from user
function startVideo(){
    navigator.getUserMedia(
        {video:{}},
        stream => video.srcObject = stream,
        err => console.error(err) //for some error
    )
}

video.addEventListener('play',()=>{

    //creating a canvas element using js
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize ={width: video.width, height: video.height}
    faceapi.matchDimensions(canvas, displaySize)

    setInterval(async () =>{
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()

        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0,0,canvas.width, canvas.height) // to delete canvas
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    },100)
})