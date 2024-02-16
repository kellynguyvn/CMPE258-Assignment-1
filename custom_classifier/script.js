let model;

async function loadModel() {
    model = await tf.loadLayersModel('URL_TO_YOUR_MODEL/model.json');
    document.getElementById('classifyBtn').disabled = false;
}

async function classifyComment() {
    const commentInput = document.getElementById('commentInput').value;
    if (commentInput.length === 0) {
        alert("Please enter a comment.");
        return;
    }

    // Preprocess the comment as required by your model
    const processedComment = tf.tensor([commentInput]); // Simplified for example; adjust based on your model's needs

    const prediction = await model.predict(processedComment).data();
    const result = prediction[0] > 0.5 ? "Positive" : "Negative"; // Adjust based on your model's output
    document.getElementById('classificationResult').innerText = `Classification: ${result}`;
}

document.getElementById('classifyBtn').addEventListener('click', classifyComment);

loadModel();
