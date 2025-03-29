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

// Serve index.html as the default page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Route to evaluate user's answers for marketing posts
app.post('/evaluate', async (req, res) => {
  const { task, answer } = req.body;

  const prompt = `You are a digital marketing expert tasked with evaluating a response for the EchoWave event.
The objective is to create a high-impact social media post that:
1. Captures audience attention.
2. Highlights the event's unique features.
3. Encourages ticket sales.

Evaluate the following response for its creativity, relevance, and effectiveness:\n\nTask: ${task}\nUser’s Response: ${answer}\n\nProvide constructive feedback on how well the post meets these goals and suggest improvements.`;

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

// Route to handle sponsorship decision
app.post('/sponsorship', async (req, res) => {
  const { decision } = req.body;

  const prompt = `You are evaluating a sponsorship decision for the EchoWave event. Two sponsors have proposed:
1. BrewMax – A craft beer company with a large budget but not fully aligned with the indie music vibe.
2. GreenSip – An eco-friendly drink brand that fits the audience but has a smaller budget.

User Decision: ${decision}

Evaluate whether this decision supports the brand's long-term positioning and provide feedback on the reasoning.`;

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
      feedback: 'Error while processing sponsorship decision.',
      error: error.response?.data || error.message,
    });
  }
});

// Route to handle influencer decision
app.post('/influencer', async (req, res) => {
  const { choice } = req.body;

  const prompt = `You are choosing an influencer to promote the EchoWave event. 
Options:
1. IndieVibesDave – Niche audience, high engagement, but pricey.
2. SophieTheDancer – Large following but not aligned with the indie vibe.
3. TravelWithJackie – Festival-goers, but highest cost.

User Choice: ${choice}

Evaluate this choice for alignment with the target audience and expected ROI, and provide suggestions if another choice would be more effective.`;

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
      feedback: 'Error while processing influencer decision.',
      error: error.response?.data || error.message,
    });
  }
});

// Route to handle soundcheck issue
app.post('/soundcheck', async (req, res) => {
  const { option } = req.body;

  const prompt = `The EchoWave event headliner’s soundcheck video sounds off. Fans might notice. You have three options:
1. Post it as is – Authentic but might get negative feedback.
2. Add background music & effects – More polished but less "real."
3. Wait and post a different snippet – Safer, but delays hype.

User Choice: ${option}

Evaluate this decision and suggest the best approach to balance authenticity, quality, and audience engagement.`;

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
      feedback: 'Error while processing soundcheck decision.',
      error: error.response?.data || error.message,
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
