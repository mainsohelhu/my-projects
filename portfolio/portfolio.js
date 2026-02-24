
  (function () {
    emailjs.init("OXnkQF1fhvwP9zG6g");
  })();

document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault(); // stop page refresh

  emailjs.sendForm(
    "service_65tvp7d",
    "template_nbk9lal",
    this
  ).then(() => {
    alert("Email sent successfully!");
    this.reset();
  }, (error) => {
    alert("Failed to send email");
    console.log(error);
  });
});

const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    menu.classList.toggle("active");
});

document.querySelectorAll("#menu a").forEach(link => {
    link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        menu.classList.remove("active");
    });
});



