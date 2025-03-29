const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Serve frontend and static files correctly
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '../public')));

// Replace with your Gemini API key
const GEMINI_API_KEY = 'AIzaSyDG2DK8trtuI7t_IwOBIW1yemNzVCUYAHo';

// Define the Gemini API endpoint with the correct model
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-001:generateContent?key=${GEMINI_API_KEY}`;

// Variable to store sponsorship feedback
let sponsorshipFeedback = null;

// Serve index.html as the default page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Route to evaluate user's answers for marketing posts
app.post('/evaluate', async (req, res) => {
  const { task, answer } = req.body;

  const prompt = `You are a digital marketing expert. Provide feedback in Georgian on the following marketing post for the EchoWave event. Evaluate its creativity, relevance, and effectiveness. Format your response using markdown, and in the following structure:

  ## ანალიზი:

  **დადებითი მხარეები:**
  - [List positive aspects using bullet points]

  **გასაუმჯობესებელი მხარეები:**
  - [List areas for improvement using bullet points]

  **რეკომენდაციები:**
  - [Provide specific recommendations using bullet points]

  **Note:** Focus solely on the provided text. Do not judge the user for the absence of media files, as this is not part of their input.

  Task: ${task}\nUser’s Response: ${answer}\n\nKeep your response concise and in Georgian.`;

  try {
    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    const response = await axios.post(GEMINI_API_URL, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const feedback =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text.trim() ||
      'No feedback available.';

    res.json({ feedback });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({
      feedback: 'Error while processing request.',
      error: error.response?.data || error.message,
    });
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
    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    const response = await axios.post(GEMINI_API_URL, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log("Gemini API Response:", response.data); // Debugging

    sponsorshipFeedback =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text.trim() ||
      'No feedback available.';

    res.json({ success: true }); // Send a success message
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
});

// Route to get the stored sponsorship feedback
app.get('/sponsorship-feedback', (req, res) => {
  console.log("Sponsorship Feedback:", sponsorshipFeedback); // Debugging
  res.json({ feedback: sponsorshipFeedback });
  sponsorshipFeedback = null; // Clear the feedback after sending
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));