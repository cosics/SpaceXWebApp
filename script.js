// script.js - Frontend Code
const API_BASE_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  const loginRegisterContainer = document.getElementById("login-and-register");
  const launchesContainer = document.getElementById("launches");
  const loginButton = document.querySelector(".button-login");
  const registerButton = document.querySelector(".button-register");

  if (localStorage.getItem("loggedInUser")) {
    showLaunches();
  }

  loginButton.addEventListener("click", login);
  registerButton.addEventListener("click", showRegisterForm);
});

function setupSearch() {
  const searchContainer = document.createElement("div");
  searchContainer.id = "search-container";
  searchContainer.style.margin = "10px auto";
  searchContainer.style.maxWidth = "600px";
  searchContainer.style.textAlign = "center";

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.id = "search-launch";
  searchInput.placeholder = "Search launch here";
  searchInput.style.width = "100%";
  searchInput.style.padding = "10px";
  searchInput.style.borderRadius = "8px";
  searchInput.style.border = "1px solid #ccc";

  searchInput.addEventListener("input", filterLaunches);
  searchContainer.appendChild(searchInput);

  const launchesSpace = document.getElementById("launches");
  launchesSpace.parentNode.insertBefore(searchContainer, launchesSpace);
}

function filterLaunches() {
  const query = document.getElementById("search-launch").value.toLowerCase();
  const launches = document.querySelectorAll(".launch");

  launches.forEach((launch) => {
    const name = launch.querySelector("h2").innerText.toLowerCase();
    launch.style.display = name.includes(query) ? "block" : "none";
  });
}

async function fetchLaunches() {
  const response = await fetch(`https://api.spacexdata.com/v4/launches`);
  const launches = await response.json();

  const launchesContainer = document.getElementById("launches");
  launchesContainer.innerHTML = "";

  launches.forEach((launch) => {
    const launchDiv = document.createElement("div");
    launchDiv.className = "launch";
    launchDiv.innerHTML = `
            <h2>${launch.name}</h2>
            <p><strong>Date:</strong> ${new Date(
              launch.date_utc
            ).toLocaleDateString()}</p>
            <p><strong>Details:</strong> ${
              launch.details || "No details available"
            }</p>
            ${
              launch.links.patch.small
                ? `<img src="${launch.links.patch.small}" alt="Mission launch" />`
                : ""
            }
            <button class="favorite-button" onclick="toggleFavorite('${
              launch.id
            }', this)">❤️</button>
        `;
    launchesContainer.appendChild(launchDiv);
  });

  setupSearch();
  loadUserFavorites();
}

function login() {
  const username = document.querySelector(".inputs input[type='text']").value;
  const password = document.querySelector(
    ".inputs input[type='password']"
  ).value;

  fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
      } else {
        localStorage.setItem("loggedInUser", username);
        showLaunches();
      }
    })
    .catch(() => alert("Error connecting to the server."));
}

function showRegisterForm() {
  document.getElementById("login-and-register").innerHTML = `
        <h1>Register</h1>
        <div class="inputs">
            <input type="text" id="reg-username" placeholder="Username" required>
            <input type="password" id="reg-password" placeholder="Password (min 6 chars)" required>
            <input type="text" id="reg-email" placeholder="Email" required>
            <input type="text" id="reg-fullname" placeholder="Full Name" required>
        </div>
        <button class="button button-register-submit" onclick="registerUser()">Register</button>
        <button class="button" onclick="location.reload()">Back to Login</button>
    `;
}

function registerUser() {
  const username = document.getElementById("reg-username").value;
  const password = document.getElementById("reg-password").value;
  const email = document.getElementById("reg-email").value;
  const fullname = document.getElementById("reg-fullname").value;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("Invalid email format!");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters long!");
    return;
  }

  fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email, fullname }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        alert(data.error);
      } else {
        document.getElementById("login-and-register").innerHTML = `
                    <h1>Registration Successful!</h1>
                    <button class="button" onclick="location.reload()">Login</button>
                `;
      }
    })
    .catch(() => alert("Error connecting to the server."));
}

function showLaunches() {
  document.getElementById("login-and-register").style.display = "none";
  document.getElementById("launches").style.display = "block";
  document.getElementById("logout-button").style.display = "block";
  fetchLaunches();
}

function logout() {
  localStorage.removeItem("loggedInUser");
  location.reload();
}

function toggleFavorite(launchId, button) {
  console.log(launchId);
  const username = localStorage.getItem("loggedInUser");
  if (!username) {
    alert("You need to log in first!");
    return;
  }

  fetch(`${API_BASE_URL}/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, launchId }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
      button.classList.toggle("favorited");
    })
    .catch(() => {
      console.error("Fetch error:", err);
      alert("Error adding to favorites.");
    });
}

async function loadUserFavorites() {
  const username = localStorage.getItem("loggedInUser");
  if (!username) {
    alert("You need to log in first!");
    return;
  }

  const response = await fetch(`http://localhost:3000/favorites/${username}`);
  const favorites = await response.json();

  if (!favorites.length) {
    alert("You have no favorite launches yet!");
    return;
  }
  const launchesResponse = await fetch("https://api.spacexdata.com/v4/launches");
  const launches = await launchesResponse.json();

  const favoritesContainer = document.getElementById("favorites-container");
  favoritesContainer.innerHTML = "<h2>Your Favorite Launches</h2>";

  favorites.forEach((favId) => {
    const launch = launches.find((l) => l.id === favId);
    if (launch) {
      const launchDiv = document.createElement("div");
      launchDiv.className = "launch";
      launchDiv.innerHTML = `
            <h3>${launch.name}</h3>
            <p>${launch.date_utc}</p>
            <button onclick="removeFromFavorites('${favId}')">❌ Remove</button>
        `;
      favoritesContainer.appendChild(launchDiv);
    }
  });
}

function removeFromFavorites(launchId) {
    const username = localStorage.getItem("loggedInUser");
    if (!username) return;

    fetch("http://localhost:3000/favorites/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, launchId })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        showFavorites(); // Refresh the favorites list
    })
    .catch(() => alert("Error removing from favorites."));
}
