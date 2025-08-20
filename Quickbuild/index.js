function toggleIngredients() {
  let list = document.getElementById("ingredients");
  list.classList.toggle("hidden");
}

let currentStep = 0;
const steps = document.querySelectorAll("#steps li");
const progressBar = document.getElementById("progress");

function startCooking() {
  currentStep = 0;
  highlightStep();
}

function nextStep() {
  if (currentStep < steps.length - 1) {
    currentStep++;
    highlightStep();
  } else {
    alert("🎉 Congratulations! You finished cooking 🍰");
  }
}

function highlightStep() {
  steps.forEach((step, index) => {
    step.style.background = index === currentStep ? "#d1c4e9" : "transparent";
  });

  let progress = ((currentStep + 1) / steps.length) * 100;
  progressBar.style.width = progress + "%";
}
