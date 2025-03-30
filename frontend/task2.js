// frontend/task2.js

function submitAudience() {
  const ageGroup = document.getElementById('ageGroup').value;
  const interests = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
    .map(checkbox => checkbox.value);
  const location = document.getElementById('location').value;

  // Store audience data for later use (e.g., in budget allocation)
  localStorage.setItem('audienceData', JSON.stringify({ ageGroup, interests, location }));

  // Show the budget allocation section
  document.getElementById('step3').style.display = 'block';
}

function submitBudget() {
  const instagramBudget = parseInt(document.getElementById('instagramBudget').value) || 0;
  const facebookBudget = parseInt(document.getElementById('facebookBudget').value) || 0;
  const influencerBudget = parseInt(document.getElementById('influencerBudget').value) || 0;

  const totalBudget = instagramBudget + facebookBudget + influencerBudget;

  if (totalBudget !== 1000) {
    alert('Please allocate a total budget of $1,000.');
    return;
  }

  const audienceData = JSON.parse(localStorage.getItem('audienceData'));

  if (!audienceData) {
    alert('Please submit audience targeting first.');
    return;
  }

  // Send budget allocation and audience data to the backend
  fetch('/evaluate-task2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ // Opening curly brace for the object
      task: JSON.stringify(audienceData),
      answer: JSON.stringify({ instagramBudget, facebookBudget, influencerBudget }),
    }), // Closing curly brace for the object
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      document.getElementById('budgetResponse').textContent = data.feedback || 'No feedback available.';
      document.getElementById('budget-feedback').style.display = 'block';
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('budgetResponse').textContent = 'Error while processing request.';
      document.getElementById('budget-feedback').style.display = 'block';
    });
}