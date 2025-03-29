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
      responseDiv.innerText = result.feedback || 'No feedback available.';
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
  
  // Submit sponsorship decision
  function submitSponsorship() {
    const decision = document.getElementById('sponsorship-decision').value;
    submitResponse('/sponsorship', { decision });
  }
  
  // Submit influencer choice
  function submitInfluencer() {
    const choice = document.getElementById('influencer-choice').value;
    submitResponse('/influencer', { choice });
  }
  
  // Submit soundcheck decision
  function submitSoundcheck() {
    const option = document.getElementById('soundcheck-option').value;
    submitResponse('/soundcheck', { option });
  }
  