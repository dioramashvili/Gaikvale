const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { VertexAI } = require('@google-cloud/vertexai');

const app = express();
app.use(bodyParser.json());



// Set the environment variable for service account credentials.
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, '../rare-origin-455217-j5-908ff85bc27c.json');

// Initialize Vertex AI
const vertexAI = new VertexAI({ project: 'rare-origin-455217-j5', location: 'europe-central2' });
const model = vertexAI.preview.getGenerativeModel({ model: 'gemini-pro' });

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

// Step 1: Evaluate Public Announcement
app.post('/evaluate-announcement', async (req, res) => {
    const { announcement } = req.body;

    const prompt = `შენ ხარ გამოცდილ კრიზის მენეჯერი, რომელიც მუშაობს მუსიკალურ ფესტივალებზე. EchoWave-ის დაწყებამდე რამდენიმე საათით ადრე მთავარი არტისტი გაუქმდა. შეაფასე მოცემული საჯარო განცხადება და წარმოადგინე რეალისტური რეაქციები ქართული სოციალური მედიის მომხმარებლებისგან.

გამოხატე აზრი შემდეგ სტრუქტურით (markdown ფორმატში):

## 📣 ფანების რეაქციები:

**🟢 მხარდამჭერები:**
- [მომხრე კომენტარები გულშემატკივრებისგან]

**🔴 განაწყენებულები:**
- [კრიტიკული და გაბრაზებული კომენტარები]

**🟡 მედიის და ცნობისმოყვარეების კითხვა/რეაგირება:**
- [ნეიტრალური ან ჟურნალისტური ტონის კომენტარები]

## 💡 შენიშვნები:

- რამდენად ეფექტურია განცხადება?
- იყო თუ არა ინფორმაციულად სრული და დამამშვიდებელი?
- როგორ აღიქვამს ამას აუდიტორია?

📄 განცხადება:
${announcement}

გთხოვ, გამოეხმაურო მხოლოდ ზემოაღნიშნულ ტექსტს. წერე ქართულად და იყოს მარტივად წასაკითხი, ბუნებრივი და რეალისტური. გამოიყენე ემოციით დატვირთული, მაგრამ პროფესიონალურად გაფორმებული ენა.`;


    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const feedback = response.candidates[0].content.parts[0].text.trim() || 'No feedback returned.';

        res.json({ feedback });
    } catch (error) {
        console.error('Announcement Eval Error:', error);
        res.status(500).json({ feedback: 'Error while processing announcement.', error: error.message });
    }
});

// Step 2: Evaluate Damage Control Strategy
app.post('/evaluate-damage-control', async (req, res) => {
    const { fanResponse, sponsorPlan, backupPlan } = req.body;

    const prompt = `You're a senior crisis management expert for music festivals. A headlining artist canceled hours before EchoWave. Here's how the team is managing the backlash:

💬 Fan Twitter Response: Option ${fanResponse}
🤝 Sponsor Pressure Plan: ${sponsorPlan}
🎤 Backup Artist Strategy: ${backupPlan}

Evaluate this damage control plan and provide feedback in Georgian. Use markdown format. Be concise but insightful.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const feedback = response.candidates[0].content.parts[0].text.trim() || 'No feedback returned.';

        res.json({ feedback });
    } catch (error) {
        console.error('Damage Control Error:', error);
        res.status(500).json({ feedback: 'Error while processing damage control.', error: error.message });
    }
});


// Serve frontend and static files correctly
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '../public')));

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));