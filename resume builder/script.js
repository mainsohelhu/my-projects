function generateResume() {
  const color = document.getElementById('colorPicker').value;
  document.documentElement.style.setProperty('--accent-color', color);

  const photoInput = document.getElementById('photo');
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const education = document.getElementById('education').value.split('\n');
  const experience = document.getElementById('experience').value.split('\n');
  const skills = document.getElementById('skills').value.split(',');
  const projects = document.getElementById('projects').value.split('\n');
  const certifications = document.getElementById('certifications').value.split('\n');

  let skillsHTML = '';
  skills.forEach(s => {
    skillsHTML += `<div class="skill-bar"><div style="width:80%">${s.trim()}</div></div>`;
  });

  let photoHTML = '';
  if(photoInput.files && photoInput.files[0]){
    const reader = new FileReader();
    reader.onload = function(e){
      photoHTML = `<img src="${e.target.result}" alt="Profile Photo">`;
      renderResume(photoHTML, name, email, phone, education, experience, skillsHTML, projects, certifications);
    };
    reader.readAsDataURL(photoInput.files[0]);
  } else {
    renderResume(photoHTML, name, email, phone, education, experience, skillsHTML, projects, certifications);
  }
}

function renderResume(photoHTML, name, email, phone, education, experience, skillsHTML, projects, certifications){
  const resumeHTML = `
    <div class="resume-container">
      <div class="resume-sidebar">
        ${photoHTML}
        <h2>${name}</h2>
        <h3>Contact</h3>
        <p>${email}</p>
        <p>${phone}</p>
        <h3>Skills</h3>
        ${skillsHTML}
      </div>
      <div class="resume-main">
        <h2>Experience</h2>
        ${experience.map(e => `<p>• ${e}</p>`).join('')}
        <h2>Education</h2>
        ${education.map(e => `<p>• ${e}</p>`).join('')}
        <h2>Projects</h2>
        ${projects.map(p => `<p>• ${p}</p>`).join('')}
        <h2>Certifications & Achievements</h2>
        ${certifications.map(c => `<p>• ${c}</p>`).join('')}
      </div>
    </div>
  `;

  document.getElementById('resumeContent').innerHTML = resumeHTML;
  document.getElementById('resumePreview').style.display = 'block';
}

function downloadResume(){
  const resumeElement = document.getElementById('resumeContent');

  html2canvas(resumeElement, {scale:2}).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('resume.pdf');
  });
}

