let selectedCaptainId = null;
let selectedViceCaptainId = null;
let captainVotes = {};
let viceCaptainVotes = {};
let totalVotes = 5;
let votesCast = 0;

document.getElementById("total-votes-count").innerHTML= `Total Votes : <strong> ${totalVotes} </strong`;
// Candidate Data
const captainCandidates = [
  { name: "Bimosan Thapa", grade: "Grade - 10", photo: "photos/samplepp.jpg" },
  { name: "Ashmita K.C.", grade: "Grade - 10", photo: "photos/samplepp.jpg" },
];

const viceCaptainCandidates = [
  { name: "Sujan Pandey", grade: "Grade - 9", photo: "photos/samplepp.jpg" },
  { name: "Rojina Lama", grade: "Grade - 9", photo: "photos/samplepp.jpg" },
  { name: "Kamal Shrestha", grade: "Grade - 9", photo: "photos/samplepp.jpg" },
  { name: "Kamal Shresth", grade: "Grade - 9", photo: "photos/samplepp.jpg" },
  { name: "Kamal Shres", grade: "Grade - 9", photo: "photos/samplepp.jpg" },
  { name: "Kamal", grade: "Grade - 9", photo: "photos/samplepp.jpg" },
];

captainCandidates.forEach((c) => (captainVotes[c.name] = 0));
viceCaptainCandidates.forEach((c) => (viceCaptainVotes[c.name] = 0));

document.getElementById("start-btn").addEventListener("click", () => {
  const captainContainer = document.querySelector(".captain .card-container");
  const viceCaptainContainer = document.querySelector(
    ".vice-captain .card-container"
  );

  if (captainContainer && viceCaptainContainer) {
    // Generate captain cards
    captainCandidates.forEach((candidate) => {
      const card = createCandidateCard(candidate, candidate.name, "captain");
      captainContainer.appendChild(card);
    });

    // Generate vice-captain cards
    viceCaptainCandidates.forEach((candidate) => {
      const card = createCandidateCard(candidate, candidate.name, "vice");
      viceCaptainContainer.appendChild(card);
    });

    document.querySelector(".submit-btn").addEventListener("click", submitVote);
    document
      .querySelector(".finish-btn")
      .addEventListener("click", finishVoting);
    document
      .getElementById("see-result-btn")
      .addEventListener("click", showResults);
    document
      .getElementById("vote-more-btn")
      .addEventListener("click", revertToVoting);
  } else {
    console.error("One or more container elements are missing.");
  }

  window.addEventListener("beforeunload", (event) => {
    exportData();
    event.preventDefault();
    event.returnValue = "";
  });
  document.getElementById("start-btn").style.display = "none";
});

function createCandidateCard(candidate, id, role) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.id = candidate.name;
  card.dataset.role = role;

  const nameDiv = document.createElement("div");
  nameDiv.className = "name";
  nameDiv.textContent = candidate.name;

  const gradeDiv = document.createElement("div");
  gradeDiv.className = "grade";
  gradeDiv.textContent = candidate.grade;

  const photoDiv = document.createElement("div");
  photoDiv.className = "photo";
  photoDiv.style.backgroundImage = `url('${candidate.photo}')`;

  const voteBtn = document.createElement("button");
  voteBtn.className = "vote-btn";
  voteBtn.textContent = "Vote Me";

  voteBtn.addEventListener("click", () => {
    selectCandidate(card, role);
  });

  card.appendChild(nameDiv);
  card.appendChild(gradeDiv);
  card.appendChild(photoDiv);
  card.appendChild(voteBtn);

  return card;
}

function selectCandidate(card, role) {
  if (role === "captain") {
    const allCards = document.querySelectorAll(".captain .card");
    allCards.forEach((c) => c.classList.remove("selected"));
    card.classList.add("selected");
    selectedCaptainId = card.dataset.id;
  } else if (role === "vice") {
    const allViceCards = document.querySelectorAll(".vice-captain .card");
    allViceCards.forEach((c) => c.classList.remove("selected"));
    card.classList.add("selected");
    selectedViceCaptainId = card.dataset.id;
  }
}

function submitVote() {
  if (!selectedCaptainId || !selectedViceCaptainId) {
    alert("Please select both a Captain and a Vice-Captain.");
    return;
  }

  captainVotes[selectedCaptainId]++;
  viceCaptainVotes[selectedViceCaptainId]++;
  votesCast++;

  updateVoteDisplay();
  document
    .getElementById("vote-sound")
    .play()
    .catch((e) => {
      console.warn("Audio playback failed:", e);
    });

  alert("Your vote has been submitted successfully.");
  resetSelection();
}

function updateVoteDisplay() {
  document.getElementById("cast").textContent = votesCast;
  document.getElementById("remain").textContent = totalVotes - votesCast;
  if (votesCast >= totalVotes) {
    setTimeout(() => {
      disableVoting();
      alert("Voting is now closed. Thank you for participating!");
    }, 1000);
  }
}

function resetSelection() {
  const allCards = document.querySelectorAll(
    ".captain .card, .vice-captain .card"
  );
  allCards.forEach((c) => c.classList.remove("selected"));
  selectedCaptainId = null;
  selectedViceCaptainId = null;
}

function disableVoting() {
  const buttons = document.querySelectorAll(".vote-btn");
  buttons.forEach((btn) => {
    btn.disabled = true;
    btn.style.backgroundColor = "#ccc";
    btn.style.cursor = "not-allowed";
  });
  document.querySelector(".submit-btn").disabled = true;
}

function finishVoting() {
  const adminPassword = "sagar";
  const input = prompt("Enter admin password to finish voting:");

  if (input !== adminPassword) {
    alert("Incorrect password.");
    return;
  }

  const resultData = {
    captainVotes,
    viceCaptainVotes,
    totalVotes,
    votesCast,
    remainingVotes: totalVotes - votesCast,
  };
  disableVoting();
  exportData();
}

function showResults() {
  const adminPassword = "sagar";
  const input = prompt("Enter admin password to view results:");

  if (input !== adminPassword) {
    alert("Incorrect password.");
    return;
  }

  disableVoting();

  document.querySelectorAll(".captain .card").forEach((card) => {
    const name = card.dataset.id;
    const voteBtn = card.querySelector(".vote-btn");
    voteBtn.textContent = captainVotes[name] || 0;
  });

  document.querySelectorAll(".vice-captain .card").forEach((card) => {
    const name = card.dataset.id;
    const voteBtn = card.querySelector(".vote-btn");
    voteBtn.textContent = viceCaptainVotes[name] || 0;
  });

  document.getElementById("vote-more-btn").style.display = "inline-block";
  document.getElementById("see-result-btn").style.display = "none";
}

function revertToVoting() {
  const buttons = document.querySelectorAll(".vote-btn");
  buttons.forEach((btn) => {
    btn.disabled = false;
    btn.textContent = "Vote Me";
    btn.style.backgroundColor = "";
    btn.style.cursor = "pointer";
  });

  document.querySelector(".submit-btn").disabled = false;
  document.getElementById("vote-more-btn").style.display = "none";
  document.getElementById("see-result-btn").style.display = "inline-block";
}

function exportData() {
  const resultData = {
    captainVotes,
    viceCaptainVotes,
    totalVotes,
    votesCast,
    remainingVotes: totalVotes - votesCast,
  };

  const blob = new Blob([JSON.stringify(resultData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "voting_result_log.json";
  a.click();

  URL.revokeObjectURL(url);
}
