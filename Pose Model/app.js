let model;
const webcamElement = document.getElementById('webcam');

async function loadModel() {
    // Assuming you've hosted your model and it's accessible via a URL
    model = await tf.loadLayersModel(' teachablemachine.withgoogle.com/models/EIln0Scux/model.json');
    console.log("Model loaded.");
    startPredicting();
}

async function setupWebcam() {
    return new Promise((resolve, reject) => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                webcamElement.srcObject = stream;
                webcamElement.addEventListener('loadedmetadata', () => {
                    resolve(webcamElement);
                });
            })
            .catch((error) => {
                console.error('Error accessing the webcam', error);
                reject(error);
            });
    });
}

async function predict() {
    // Ensure the model and webcam are ready
    if (model && webcamElement.readyState === 4) {
        // Process the video frame and make a prediction
        const prediction = tf.tidy(() => {
            // Convert the pixels to a TensorFlow.js tensor
            const img = tf.browser.fromPixels(webcamElement);
            // Resize and normalize the image to match your model's expected input
            const resized = tf.image.resizeBilinear(img, [224, 224]).toFloat();
            const offset = tf.scalar(127.5);
            const normalized = resized.sub(offset).div(offset);
            // Make a prediction
            const batched = normalized.expandDims(0);
            return model.predict(batched);
        });

        // Convert the model's prediction to usable data
        const probabilities = await prediction.array();
        const highestProbabilityIndex = probabilities[0].indexOf(Math.max(...probabilities[0]));

        // Update the UI based on the prediction
        let resultText = '';
        switch(highestProbabilityIndex) {
            case 0:
                resultText = 'Rock';
                break;
            case 1:
                resultText = 'Paper';
                break;
            case 2:
                resultText = 'Scissors';
                break;
            default:
                resultText = 'Unknown';
        }

        document.getElementById('console').innerText = `Prediction: ${resultText}`;

        // Clean up
        tf.dispose(prediction);
    }

    window.requestAnimationFrame(predict);
}

async function run() {
    await setupWebcam();
    await loadModel();
}

run().catch(console.error);
