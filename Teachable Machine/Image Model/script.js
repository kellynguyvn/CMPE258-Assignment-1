let model;

window.onload = async () => {
    model = await tf.loadLayersModel('YOUR_MODEL_URL/model.json');
    document.getElementById('predictButton').disabled = false;
};

document.getElementById('predictButton').addEventListener('click', async () => {
    const imageUpload = document.getElementById('imageUpload');
    let image = tf.browser.fromPixels(await loadImage(imageUpload.files[0]));
    image = tf.image.resizeBilinear(image, [224, 224]); // Resize to match model expected input
    image = image.expandDims(0).toFloat().div(tf.scalar(127)).sub(tf.scalar(1)); // Normalize image
    const prediction = await model.predict(image).data();
    const result = prediction[0] > prediction[1] ? 'Dog' : 'Cat';
    document.getElementById('predictionResult').innerText = `Prediction: ${result}`;
});

function loadImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.src = reader.result;
            img.onload = () => resolve(img);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
