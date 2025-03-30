// Step 1: Handle Public Announcement Submission
async function submitAnnouncement() {
    const announcement = document.getElementById('announcement').value;
    const responseBox = document.getElementById('announcementResponse');
    const section = document.getElementById('announcement-feedback');
  
    responseBox.innerText = 'Processing...';
    section.style.display = 'block';
  
    try {
      const res = await fetch('/evaluate-announcement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ announcement }),
      });
  
      const data = await res.json();
      responseBox.innerHTML = data.feedback || 'No response from AI.';
    } catch (err) {
      console.error('Announcement error:', err);
      responseBox.innerText = 'Error while processing.';
    }
  }
  
  // Step 2: Reveal Damage Control Form
  function showDamageControl() {
    document.getElementById('step2').style.display = 'block';
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
  
  // Step 2: Submit Damage Control Responses
  async function submitDamageControl() {
    const fanResponse = document.querySelector('input[name="fanResponse"]:checked')?.value;
    const sponsorPlan = document.getElementById('sponsorPlan').value;
    const backupPlan = document.getElementById('backupPlan').value;
    const feedbackBox = document.getElementById('damageResponse');
    const section = document.getElementById('damage-feedback');
  
    if (!fanResponse) {
      alert('Please select how you respond to fans.');
      return;
    }
  
    feedbackBox.innerText = 'Processing...';
    section.style.display = 'block';
  
    try {
      const res = await fetch('/evaluate-damage-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fanResponse, sponsorPlan, backupPlan }),
      });
  
      const data = await res.json();
      feedbackBox.innerHTML = data.feedback || 'No response from AI.';
    } catch (err) {
      console.error('Damage control error:', err);
      feedbackBox.innerText = 'Error while processing.';
    }
}