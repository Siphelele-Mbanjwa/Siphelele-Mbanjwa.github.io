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
if (contactSection) {
  contactSection.addEventListener("click", () => {
    alert("Feel free to email me or connect on GitHub!");
  });
}

// Fade-in animation for sections
window.addEventListener("DOMContentLoaded", () => {
  const fadeInElements = document.querySelectorAll(".fade-in");
  fadeInElements.forEach((el) => {
    el.style.opacity = 0;
    el.style.transform = "translateY(20px)";
    setTimeout(() => {
      el.style.transition = "opacity 1s ease-out, transform 1s ease-out";
      el.style.opacity = 1;
      el.style.transform = "translateY(0)";
    }, 300);
  });
});

