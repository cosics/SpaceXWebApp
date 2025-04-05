// const API_BASE_URL = "http://localhost:3000";

// document.addEventListener("DOMContentLoaded", () => {
//     const loginRegisterContainer = document.getElementById("login-and-register");
//     const launchesContainer = document.getElementById("launches");
//     const loginButton = document.querySelector(".button-login");
//     const registerButton = document.querySelector(".button-register");

//     if (localStorage.getItem("loggedInUser")) {
//         showLaunches();
//     }

//     loginButton.addEventListener("click", login);
//     registerButton.addEventListener("click", showRegisterForm);
// });

// function setupSearch() {
//     const searchContainer = document.createElement('div');

//     searchContainer.id = 'search-container';
//     searchContainer.style.margin = '10px auto';
//     searchContainer.style.maxWidth = '600px';
//     searchContainer.style.textAlign = 'center';

//     // To be removed when login and register features are implemented
//     // searchContainer.style.display = 'none';

//     const searchInput = document.createElement('input');
//     searchInput.type = 'text';
//     searchInput.id = 'search-launch';
//     searchInput.placeholder = 'Search launch here';
//     searchInput.style.width = '100%';
//     searchInput.style.padding = '10px';
//     searchInput.style.borderRadius = '8px';
//     searchInput.style.border = '1px solid #ccc';

//     searchContainer.addEventListener("input", filterLaunches);

//     searchContainer.appendChild(searchInput);

//     const launchesSpace = document.getElementById('launches');
//     launchesSpace.parentNode.insertBefore(searchContainer, launchesSpace);
// }

// function filterLaunches() {
//     const query = document.getElementById('search-launch').value.toLowerCase();
//     const launches = document.querySelectorAll(".launch");

//     launches.forEach(launch => {
//         const name = launch.querySelector('h2').innerText.toLowerCase();

//         if(name.includes(query)) {
//             launch.style.display = 'block';
//         } else {
//             launch.style.display = 'none';
//         }
//     })
// }

// // Fetch SpaceX Launches
// async function fetchLaunches() {
//     const response = await fetch(`https://api.spacexdata.com/v4/launches`);
//     const launches = await response.json();

//     const launchesContainer = document.getElementById('launches');
//     launchesContainer.innerHTML = ""; // Clear before appending

//     launches.forEach(launch => {
//         const launchDiv = document.createElement('div');
//         launchDiv.className = 'launch';

//         // Create an expandable section
//         launchDiv.innerHTML = `
//             <h2>${launch.name}</h2>
//             <p><strong>Date:</strong> ${new Date(launch.date_utc).toLocaleDateString()}</p>
//             <p><strong>Details:</strong> ${launch.details || 'No details available'}</p>
//             ${launch.links.patch.small ? `<img src="${launch.links.patch.small}" alt="Mission launch" />` : ''}
//         `;

//         launchesContainer.appendChild(launchDiv);
//     });

//     setupSearch();
// }

// fetchLaunches();

// function login() {
//     const username = document.querySelector(".inputs input[type='text']").value;
//     const password = document.querySelector(".inputs input[type='password']").value;

//     fetch("http://localhost:3000/users")
//         .then(res => {
//             console.log(res);
//             return res.json();
//         })
//         .then(users => {
//             const user = users.find(u => u.username === username && u.password === password);
//             if (user) {
//                 localStorage.setItem("loggedInUser", username);
//                 showLaunches();
//             } else {
//                 alert("Invalid credentials!");
//             }
//         })
//         .catch((err) => alert("Error connecting to the server."));
// }

// function showRegisterForm() {
//     document.getElementById("login-and-register").innerHTML = `
//         <h1>Register</h1>
//         <div class="inputs">
//             <input type="text" id="reg-username" placeholder="Username" required>
//             <input type="password" id="reg-password" placeholder="Password" required>
//             <input type="text" id="reg-email" placeholder="Email" required>
//             <input type="text" id="reg-fullname" placeholder="Full Name" required>
//         </div>
//         <button class="button button-register-submit" onclick="registerUser()">Register</button>
//         <button class="button" onclick="location.reload()">Back to Login</button>
//     `;
// };

// function registerUser() {
//     const username = document.getElementById("reg-username").value;
//     const password = document.getElementById("reg-password").value;
//     const email = document.getElementById("reg-email").value;
//     const fullname = document.getElementById("reg-fullname").value;

//     fetch("http://localhost:3000/users", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, password, email, fullname })
//     })
//     .then(res => res.json())
//     .then(data => {
//         if (data.error) {
//             alert(data.error);
//         } else {
//             document.getElementById("login-and-register").innerHTML = `
//                 <h1>Registration Successful!</h1>
//                 <button class="button" onclick="location.reload()">Login</button>
//             `;
//         }
//     })
//     .catch((err) => {
//         alert("Error connecting to the server.")
//     });
// }

// function showLaunches() {
//     document.getElementById("login-and-register").style.display = "none";
//     document.getElementById("launches").style.display = "block";
//     document.getElementById("logout-button").style.display = "block";
//     // document.body.innerHTML += '<button class="button button-logout" onclick="logout()">Logout</button>';
// }

// function logout() {
//     localStorage.removeItem("loggedInUser");
//     location.reload();
// }

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
    launch.style.display = name.includes(query) ? "flex" : "none";
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
            <button class="favorite-button" onclick="addToFavorites('${
              launch.id
            }', this)">❤️</button>
        `;
    launchesContainer.appendChild(launchDiv);
  });

  setupSearch();
  loadUserFavorites();
}
// function login() {
//     const username = document.querySelector(".inputs input[type='text']").value;
//     const password = document.querySelector(".inputs input[type='password']").value;

//     fetch("http://localhost:3000/users")
//         .then(res => {
//             console.log(res);
//             return res.json();
//         })
//         .then(users => {
//             const user = users.find(u => u.username === username && u.password === password);
//             if (user) {
//                 localStorage.setItem("loggedInUser", username);
//                 showLaunches();
//             } else {
//                 alert("Invalid credentials!");
//             }
//         })
//         .catch((err) => alert("Error connecting to the server."));
// }

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
  document.getElementById("launches").style.display = "flex";
  document.getElementById("logout-button").style.display = "block";
  fetchLaunches();
}

function logout() {
  localStorage.removeItem("loggedInUser");
  location.reload();
}

function addToFavorites(launchId) {
  const username = localStorage.getItem("loggedInUser");
  if (!username) {
    alert("You need to log in first!");
    return;
  }

  fetch("http://localhost:3000/favorites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, launchId }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Server response:", data);
      alert(data.message);
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      alert("Error adding to favorites.");
    });

  loadUserFavorites();
}

async function loadUserFavorites() {
  const username = localStorage.getItem("loggedInUser");
  if (!username) {
    alert("You need to log in first!");
    return;
  }

  const response = await fetch(`http://localhost:3000/favorites/${username}`);
  const favorites = await response.json();
  console.log("Favorites received:", favorites); // 🔍 Debugging

  if (!favorites.length) {
    alert("You have no favorite launches yet!");
    return;
  }
  const launchesResponse = await fetch(
    "https://api.spacexdata.com/v4/launches"
  );
  const launches = await launchesResponse.json();

  const favoritesContainer = document.getElementById("favorites-container");
//   favoritesContainer.innerHTML = "<h2>Your Favorite Launches</h2>";

  favorites.forEach((favId) => {
    console.log("Checking launch ID:", favId); // 🛠 Debugging
    const launch = launches.find((l) => l.id === favId);
    if (launch) {
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
    body: JSON.stringify({ username, launchId }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message);
      showFavorites();
      location.reload(); // Refresh the favorites list
    })
    .catch(() => {
        alert("Error removing from favorites.");
        location.reload();
    });
}
