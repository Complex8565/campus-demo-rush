// ==========================================
// 1. STORY DATABASE (STATE MACHINE NODES)
// ==========================================
const storyNodes = {
  start: {
    location: "📍 Hostel Room 404",
    title: "The Alarm Betrayal",
    text: "You wake up and squint at your phone: 8:45 AM. Your mandatory Web Programming project demo starts at 9:00 AM sharp in Block 34. Your roommate is snoring peacefully, your laptop is at 14% battery, and your ID card is nowhere in sight.",
    choices: [
      {
        text: "Grab the laptop + charger and sprint out immediately",
        hint: "+2 mins | +Laptop & Charger",
        nextNode: "corridor_rush",
        timeAdd: 2,
        stressAdd: 10,
        addItem: "Laptop & Charger"
      },
      {
        text: "Spend 4 minutes searching under the bed for your ID card",
        hint: "+4 mins | +College ID",
        nextNode: "corridor_rush",
        timeAdd: 4,
        stressAdd: 5,
        addItem: "College ID"
      },
      {
        text: "Wake up your roommate to borrow their bike",
        hint: "+5 mins | Risky",
        nextNode: "roommate_trap",
        timeAdd: 5,
        stressAdd: 20
      }
    ]
  },

  roommate_trap: {
    location: "📍 Hostel Room 404",
    title: "Never Wake a Sleeping Engineer",
    text: "You shake your roommate awake. They blink twice, mutter 'Bro, attendance is a myth,' pull the blanket over their head, and refuse to hand over the keys. You wasted precious minutes!",
    choices: [
      {
        text: "Grab your laptop anyway and run for the stairs",
        hint: "+2 mins | +Laptop & Charger",
        nextNode: "corridor_rush",
        timeAdd: 2,
        stressAdd: 15,
        addItem: "Laptop & Charger"
      }
    ]
  },

  corridor_rush: {
    location: "📍 Hostel Ground Gate",
    title: "The Mess & E-Rickshaw Dilemma",
    text: "You burst out of the hostel building. Your stomach growls loudly, and there's a line of students waiting for campus e-rickshaws. Block 34 is a 10-minute brisk walk or a 3-minute ride.",
    choices: [
      {
        text: "Squeeze onto the overcrowded e-rickshaw",
        hint: "+3 mins | +15% Stress",
        nextNode: "block_gate",
        timeAdd: 3,
        stressAdd: 15
      },
      {
        text: "Grab a quick samosa at the canteen and power-walk",
        hint: "+6 mins | -15% Stress",
        nextNode: "block_gate",
        timeAdd: 6,
        stressAdd: -15
      },
      {
        text: "Full Naruto-sprint straight across the shortcut",
        hint: "+4 mins | +25% Stress",
        nextNode: "block_gate",
        timeAdd: 4,
        stressAdd: 25
      }
    ]
  },

  block_gate: {
    location: "📍 Block 34 Entrance",
    title: "The Final Boss: Strict Security Guard",
    text: "You reach the entrance of Block 34, completely out of breath. The security guard blocks the turnstile and asks for your College ID card before letting anyone upstairs.",
    choices: [
      {
        text: "Flash your College ID proudly",
        hint: "Requires: College ID",
        requiresItem: "College ID",
        nextNode: "lab_door",
        timeAdd: 1,
        stressAdd: -10
      },
      {
        text: "Show your UMS dashboard on your phone and beg politely",
        hint: "+4 mins | +20% Stress",
        nextNode: "lab_door",
        timeAdd: 4,
        stressAdd: 20
      },
      {
        text: "Try sneaking behind a group of seniors",
        hint: "High Risk",
        nextNode: "ending_detained",
        timeAdd: 5,
        stressAdd: 30
      }
    ]
  },

  lab_door: {
    location: "📍 Computer Lab 302",
    title: "The Viva Begins",
    text: "You reach the lab door. The professor looks at the wall clock and calls your team name next! You plug in your setup to present your Choose-Your-Path Story Engine.",
    choices: [
      {
        text: "Plug in your charger and launch the live GitHub Pages demo",
        hint: "Requires: Laptop & Charger",
        requiresItem: "Laptop & Charger",
        nextNode: "check_final_outcome",
        timeAdd: 1,
        stressAdd: 0
      },
      {
        text: "Run the demo on 4% battery without a charger",
        hint: "Pray it survives",
        nextNode: "ending_battery_dead",
        timeAdd: 1,
        stressAdd: 25
      }
    ]
  },

  // ==========================================
  // 2. MULTIPLE ENDINGS
  // ==========================================
  ending_topper: {
    location: "🏆 Lab 302 - Front Row",
    title: "ENDING 1: The Last-Minute Legend (30/30 Marks)",
    isEnding: true,
    endingType: "good",
    text: "You slide into your seat right before the deadline! Your laptop stays powered, your GitHub repo opens smoothly, and the professor laughs at your campus story choices. Full marks secured—time to finally get breakfast!",
    choices: []
  },

  ending_late_pass: {
    location: "😅 Lab 302 - Back Bench",
    title: "ENDING 2: Fashionably Late Survivor (22/30 Marks)",
    isEnding: true,
    endingType: "good",
    text: "You arrived past 9:00 AM sweating like you ran a marathon. The professor gives you a stern look for being late, but your code works cleanly enough to pass the viva with decent marks.",
    choices: []
  },

  ending_battery_dead: {
    location: "💀 Lab 302 - Black Screen",
    title: "ENDING 3: The 1% Battery Tragedy",
    isEnding: true,
    endingType: "bad",
    text: "Just as you say 'Sir, let me show you the JavaScript state machine...', your laptop screen goes completely black. You forgot your charger in the hostel. The professor asks you to come back next week.",
    choices: []
  },

  ending_detained: {
    location: "🚨 Security Desk",
    title: "ENDING 4: Caught at the Gate",
    isEnding: true,
    endingType: "bad",
    text: "The guard spots you trying to slip past without an ID card and makes you write an apology entry in the register for 15 minutes. By the time you're cleared, the lab session is over!",
    choices: []
  }
};

// ==========================================
// 3. GAME STATE & STORAGE MANAGEMENT
// ==========================================
const STORAGE_KEY = "campus_rush_save_v1";

let gameState = {
  currentNode: "start",
  minutesPast845: 0, // 0 = 8:45 AM, 15 = 9:00 AM
  stress: 20,
  inventory: []
};

function saveGame() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  const statusEl = document.getElementById("save-status");
  statusEl.textContent = "Progress saved ✓";
  setTimeout(() => {
    statusEl.textContent = "Auto-saved to browser";
  }, 1200);
}

function loadGame() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    gameState = JSON.parse(saved);
  }
}

function resetGame() {
  gameState = {
    currentNode: "start",
    minutesPast845: 0,
    stress: 20,
    inventory: []
  };
  saveGame();
  renderScene();
}

// ==========================================
// 4. HELPER FUNCTIONS & UI RENDERING
// ==========================================
function formatClock(minutesAdded) {
  const totalMinutes = 8 * 60 + 45 + minutesAdded;
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const formattedHrs = hrs < 10 ? "0" + hrs : hrs;
  const formattedMins = mins < 10 ? "0" + mins : mins;
  return `${formattedHrs}:${formattedMins} AM`;
}

function renderHUD() {
  const clockEl = document.getElementById("clock-display");
  const stressEl = document.getElementById("stress-display");
  const invListEl = document.getElementById("inventory-list");

  clockEl.textContent = formatClock(gameState.minutesPast845);
  clockEl.style.color = gameState.minutesPast845 > 15 ? "#ef4444" : "#38bdf8";

  stressEl.textContent = `${gameState.stress}%`;
  stressEl.style.color = gameState.stress >= 70 ? "#ef4444" : "#10b981";

  // Render Inventory
  invListEl.innerHTML = "";
  if (gameState.inventory.length === 0) {
    invListEl.innerHTML = `<span class="empty-inv">Empty (Grab your stuff!)</span>`;
  } else {
    gameState.inventory.forEach(item => {
      const chip = document.createElement("span");
      chip.className = "item-chip";
      chip.textContent = `🎒 ${item}`;
      invListEl.appendChild(chip);
    });
  }
}

function handleChoice(choice) {
  // Update time & stress
  gameState.minutesPast845 += choice.timeAdd || 0;
  gameState.stress = Math.max(0, Math.min(100, gameState.stress + (choice.stressAdd || 0)));

  // Add item if unlocked
  if (choice.addItem && !gameState.inventory.includes(choice.addItem)) {
    gameState.inventory.push(choice.addItem);
  }

  // Dynamic ending resolution based on clock time
  if (choice.nextNode === "check_final_outcome") {
    gameState.currentNode = gameState.minutesPast845 <= 15 ? "ending_topper" : "ending_late_pass";
  } else {
    gameState.currentNode = choice.nextNode;
  }

  saveGame();
  renderScene();
}

function renderScene() {
  renderHUD();

  const node = storyNodes[gameState.currentNode];
  const locationEl = document.getElementById("location-tag");
  const endingBadgeEl = document.getElementById("ending-badge");
  const titleEl = document.getElementById("scene-title");
  const textEl = document.getElementById("scene-text");
  const choicesEl = document.getElementById("choices-container");

  // Re-trigger subtle fade animation
  const card = document.querySelector(".story-card");
  card.style.animation = "none";
  card.offsetHeight; // force reflow
  card.style.animation = null;

  locationEl.textContent = node.location;
  titleEl.textContent = node.title;
  textEl.textContent = node.text;

  // Ending badge handling
  if (node.isEnding) {
    endingBadgeEl.classList.remove("hidden", "bad");
    if (node.endingType === "bad") endingBadgeEl.classList.add("bad");
    endingBadgeEl.textContent = node.endingType === "good" ? "SUCCESS ENDING" : "FAIL ENDING";
  } else {
    endingBadgeEl.classList.add("hidden");
  }

  // Render available choices
  choicesEl.innerHTML = "";

  if (node.isEnding) {
    const playAgainBtn = document.createElement("button");
    playAgainBtn.className = "choice-btn";
    playAgainBtn.innerHTML = `<span>🔄 Play Again to Unlock Other Endings</span><span class="choice-hint">4 Total Endings</span>`;
    playAgainBtn.onclick = resetGame;
    choicesEl.appendChild(playAgainBtn);
    return;
  }

  node.choices.forEach(choice => {
    // Only show choice if required item is in inventory (or no item required)
    if (choice.requiresItem && !gameState.inventory.includes(choice.requiresItem)) {
      return;
    }

    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.innerHTML = `
      <span>${choice.text}</span>
      <span class="choice-hint">${choice.hint || ""}</span>
    `;
    btn.onclick = () => handleChoice(choice);
    choicesEl.appendChild(btn);
  });
}

// ==========================================
// 5. EVENT LISTENERS & INIT
// ==========================================
document.getElementById("restart-btn").addEventListener("click", resetGame);
document.getElementById("clear-save-btn").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  resetGame();
});

loadGame();
renderScene();