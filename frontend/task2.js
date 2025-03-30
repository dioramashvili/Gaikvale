function submitAudience() {
  const ageGroup = document.getElementById('ageGroup').value;
  const interests = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
  const location = document.getElementById('location').value;

  const targeting = { ageGroup, interests, location };
  localStorage.setItem('audienceTargeting', JSON.stringify(targeting));

  // Show Step 3 section
  document.getElementById('step3').style.display = 'block';

  // Show Step 2 image
  const step2Image = document.getElementById('step2-image');
  if (step2Image) {
    step2Image.style.display = 'block';
  }
}

function submitBudget() {
  const instagramBudget = document.getElementById('instagramBudget').value;
  const facebookBudget = document.getElementById('facebookBudget').value;
  const influencerBudget = document.getElementById('influencerBudget').value;

  const answer = {
    instagramBudget,
    facebookBudget,
    influencerBudget
  };

  const task = localStorage.getItem('audienceTargeting');

  const responseDiv = document.getElementById('budgetResponse');
  responseDiv.innerText = 'Processing...';
  document.getElementById('budget-feedback').style.display = 'block';

  // ✅ MOCKED AI FEEDBACK INSTEAD OF BROKEN FETCH
  setTimeout(() => {
    responseDiv.innerHTML = `
      ✅ კამპანიის შეფასება:<br>
      აუდიტორია სწორად არის შერჩეული და ბიუჯეტი დაბალანსებულია 🎯
    `;

    // Show final image
    const finalImage = document.getElementById('final-image');
    if (finalImage) {
      finalImage.style.display = 'block';
    }

    // Show "Next Task" button
    document.getElementById('unlock-next-task').style.display = 'block';
  }, 1000);
}
