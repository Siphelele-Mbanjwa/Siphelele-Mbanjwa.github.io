// Show welcome alert when the page loads
window.onload = function () {
  alert("Welcome to my portfolio website!");
};

// Highlight nav links on hover
const navLinks = document.querySelectorAll("nav a");
navLinks.forEach((link) => {
  link.addEventListener("mouseover", () => {
    link.style.color = "#00ffff";
  });
  link.addEventListener("mouseout", () => {
    link.style.color = "#ecf0f1"; // default color
  });
});

// Add a click interaction for the contact section
const contactSection = document.getElementById("contact");
contactSection.addEventListener("click", () => {
  alert("Feel free to email me or connect on GitHub!");
});
