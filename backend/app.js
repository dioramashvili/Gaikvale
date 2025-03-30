const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { VertexAI } = require('@google-cloud/vertexai');

const app = express();
app.use(bodyParser.json());

// Serve frontend and static files correctly
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '../public')));

// Set the environment variable for service account credentials.
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, '../rare-origin-455217-j5-908ff85bc27c.json');

// Initialize Vertex AI
const vertexAI = new VertexAI({ project: 'rare-origin-455217-j5', location: 'europe-central2' });
const model = vertexAI.preview.getGenerativeModel({ model: 'gemini-pro' });

// Variable to store sponsorship feedback
let sponsorshipFeedback = null;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Route to evaluate user's answers for marketing posts
app.post('/evaluate', async (req, res) => {
    const { task, answer } = req.body;

    const prompt = `## ანალიზი:

**დადებითი მხარეები:**
- [List positive aspects using bullet points, each on a new line]

**გასაუმჯობესებელი მხარეები:**
- [List areas for improvement using bullet points, each on a new line]

**რეკომენდაციები:**
- [Provide specific recommendations using bullet points, each on a new line]

**Note:** Focus solely on the provided text. Do not judge the user for the absence of media files, as this is not part of their input.

Task: ${task}\nUser’s Response: ${answer}\n\nKeep your response concise and in Georgian, but prioritize readability through proper markdown formatting and breaklines.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const feedback = response.candidates[0].content.parts[0].text.trim() || 'No feedback available.';

        res.json({ feedback });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ feedback: 'Error while processing request.', error: error.message });
    }
});

// Route to get the sponsor offer question
app.get('/sponsor-question', (req, res) => {
    const question = `You are evaluating a sponsorship decision for the EchoWave event. Two sponsors have proposed:
    1. BrewMax – A craft beer company with a large budget but not fully aligned with the indie music vibe.
    2. GreenSip – An eco-friendly drink brand that fits the audience but has a smaller budget.
    Which sponsor do you choose and why?`;
    res.json({ question });
});

// Route to evaluate the sponsorship decision
app.post('/evaluate-sponsorship', async (req, res) => {
    const { decision } = req.body;

    const prompt = `Evaluate whether this sponsorship decision supports the brand's long-term positioning and provide feedback on the reasoning. Format your response using markdown. \n\nUser Decision: ${decision}\n\nKeep your response concise and in Georgian.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        sponsorshipFeedback = response.candidates[0].content.parts[0].text.trim() || 'No feedback available.';

        res.json({ success: true }); // Send a success message
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Route to get the stored sponsorship feedback
app.get('/sponsorship-feedback', (req, res) => {
    res.json({ feedback: sponsorshipFeedback });
    sponsorshipFeedback = null; // Clear the feedback after sending
});

//Route to evaluate task2
app.post('/evaluate-task2', async (req, res) => {
    const { task, answer } = req.body;

    const prompt = `You are an expert marketing strategist, specializing in digital advertising for music events. 

The user is planning an ad campaign for the EchoWave event. They have defined their target audience and allocated a budget across different platforms. Your task is to provide detailed feedback on their choices, covering both audience targeting and budget allocation.

Here is the information provided by the user:

**Target Audience:**

* **Age Group:** [User's selected age group]
* **Interests:** [List of user's selected interests, separated by commas]
* **Location:** [User's selected location]

**Budget Allocation (Total: $1,000):**

* **Instagram Ads:** $[User's Instagram budget]
* **Facebook Ads:** $[User's Facebook budget]
* **Influencer Partnerships:** $[User's Influencer budget]

**Your Feedback Should Include:**

1.  **Audience Targeting Analysis:**
    * Evaluate the coherence and effectiveness of the selected age group, interests, and location for a music event like EchoWave.
    * Discuss if the chosen audience aligns with the likely attendees of an indie music event.
    * Give specific feedback about the selected interests.
2.  **Budget Allocation Evaluation:**
    * Assess the balance and distribution of the budget across Instagram, Facebook, and influencer partnerships.
    * Consider the relevance of each platform to the target audience and the event's nature.
    * Provide feedback about the percentage of the budget that is allocated to each section.
3.  **Recommendations:**
    * Suggest any adjustments or improvements to the audience targeting or budget allocation.
    * Offer strategic advice on maximizing the campaign's impact.
4.  **Overall Strategy:**
    * Give an overall opinion of the users marketing strategy.

Format your response using markdown and write in georgian. Keep your response concise and focused.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const feedback = response.candidates[0].content.parts[0].text.trim() || 'No feedback available.';
        res.json({ feedback });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ feedback: 'Error while processing request.', error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));