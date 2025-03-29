// General function to send POST requests
async function submitResponse(route, userInput) {
    const responseDiv = document.getElementById('feedback');
    responseDiv.innerText = 'Processing...';
  
    try {
      const response = await fetch(route, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInput),
      });
  
      const result = await response.json();
      responseDiv.innerHTML = result.feedback || 'No feedback available.'; // Use innerHTML for markdown
      responseDiv.innerHTML += `<br><br><button onclick="goToCrisis()">👉 გსურთ გაგრძელება?</button>`;
      getSponsorshipFeedback(); // Get sponsorship feedback after main task
    } catch (error) {
      responseDiv.innerText = 'Error while processing request.';
      console.error('Error:', error);
    }
  }
  
  // Submit task for evaluating social media post
  function submitTask() {
    const task = document.getElementById('task').innerText;
    const answer = document.getElementById('user-answer').value;
    submitResponse('/evaluate', { task, answer });
  }
  
  // Function to send the sponsorship decision to the backend
  function sendSponsorshipDecision(decision) {
    fetch('/evaluate-sponsorship', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ decision }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log('Sponsorship decision sent successfully.');
        } else {
          console.error('Error sending sponsorship decision:', data.error);
        }
      });
  }
  
  // Function to get the sponsorship feedback after the main task is completed
  function getSponsorshipFeedback() {
    fetch('/sponsorship-feedback')
      .then((response) => response.json())
      .then((data) => {
        console.log("Frontend Data:", data); // Check data from API
        if (data.feedback) {
          document.getElementById('feedback').innerHTML += '<br><br>Sponsorship Feedback:<br>' + data.feedback;
        }
      });
  }
  
// Trigger popup with delay and only once
let typingTimer;
const doneTypingInterval = 1000; // 1 second delay
let popupOpened = false; // Flag to track if popup is opened

document.getElementById('user-answer').addEventListener('input', () => {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(openSponsorPopupOnce, doneTypingInterval);
});

function openSponsorPopupOnce() {
  if (!popupOpened) {
    const sponsorPopup = window.open('/sponsor-popup.html', 'Sponsor Question', 'width=600,height=400');
    popupOpened = true; // Set flag to true
  }
}

function goToCrisis() {
  window.location.href = '/crisis.html';
}