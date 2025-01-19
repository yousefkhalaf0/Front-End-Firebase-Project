// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, onSnapshot, query, where } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
let firebaseConfig = {
  apiKey: "AIzaSyAIK50wzgI01PFv0JdwnQEMnokSA779GnM",
  authDomain: "iti-firebase-course.firebaseapp.com",
  projectId: "iti-firebase-course",
  storageBucket: "iti-firebase-course.firebasestorage.app",
  messagingSenderId: "162473629659",
  appId: "1:162473629659:web:c26fca2b849336b617f9fe",
};

// Initialize Firebase
let app = initializeApp(firebaseConfig);
let auth = getAuth(app);
let db = getFirestore(app);


// start signup logic
var signUpAlertMessage = document.getElementById("signUpAlert");

function validateForm(name, email, password) {
  let nameRegex = /^[A-Za-z ]{3,}$/;
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let passwordRegex = /^(?=.*\d)[A-Za-z\d]{6,}$/;

  let isValid = true;

  let nameInput = document.getElementById("inputName");
  if (!nameRegex.test(name)) {
    nameInput.classList.add("is-invalid");
    nameInput.classList.remove("is-valid");
    isValid = false;
  } else {
    nameInput.classList.add("is-valid");
    nameInput.classList.remove("is-invalid");
  }

  let emailInput = document.getElementById("inputEmailSignUp");
  if (!emailRegex.test(email)) {
    emailInput.classList.add("is-invalid");
    emailInput.classList.remove("is-valid");
    isValid = false;
  } else {
    emailInput.classList.add("is-valid");
    emailInput.classList.remove("is-invalid");
  }

  let passwordInput = document.getElementById("inputPasswordSignUp");
  if (!passwordRegex.test(password)) {
    passwordInput.classList.add("is-invalid");
    passwordInput.classList.remove("is-valid");
    isValid = false;
  } else {
    passwordInput.classList.add("is-valid");
    passwordInput.classList.remove("is-invalid");
  }

  return isValid;
};

async function handleSignUp(name, email, password) {
  if (!validateForm(name, email, password)) return;

  let userCredential = await createUserWithEmailAndPassword(auth, email, password);
  signUpAlertMessage.innerHTML = `
      <div class="container alert alert-success" role="alert">
        <i class="bi bi-check-square-fill me-2"></i>
        Account created successfully!
      </div>`;
  location.replace("/pages/sign_in_page.html");
};

function signUp() {
  let signUpForm = document.getElementById("signUpForm");

  signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let name = document.getElementById("inputName").value.trim();
    let email = document.getElementById("inputEmailSignUp").value.trim();
    let password = document.getElementById("inputPasswordSignUp").value;

    handleSignUp(name, email, password);
  });
};
// end signup logic


// start signin logic
var signInAlertMessage = document.getElementById("signInAlert");

async function handleSignIn(email, password) {
  try {
    let userCredential = await signInWithEmailAndPassword(auth, email, password);
    signInAlertMessage.innerHTML = `
      <div class="alert alert-success" role="alert">
        <i class="bi bi-check-square-fill me-2"></i>
        Welcome back, ${userCredential.user.email}!
      </div>`;
    location.replace("/pages/main_page.html");
  } catch (error) {
    signInAlertMessage.innerHTML = `
      <div class="alert alert-danger" role="alert">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        May email or password is not correct!
      </div>`;
  }
};

function signIn() {
  let signInForm = document.getElementById("signInForm");

  signInForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (signInForm.checkValidity()) {
      let email = document.getElementById("inputEmailSignIn").value.trim();
      let password = document.getElementById("inputPasswordSignIn").value;
      handleSignIn(email, password);
    } else {
      signInForm.classList.add("was-validated");
    }
  });
};
// end signin logic


// start main logic
function signOut() {
  let signOutButton = document.getElementById("signOutButton");

  signOutButton.addEventListener("click", () => {
    auth.signOut().then(() => {
      location.replace("/pages/sign_in_page.html");
    });
  });
};

// add or update task
async function addTask() {
  let user = auth.currentUser;

  if (!user) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'You must be logged in to add a task.',
    });
    return;
  }

  let titleInput = document.getElementById("tTitle").value.trim();
  let descriptionInput = document.getElementById("tDiscreption").value.trim();
  let taskId = document.getElementById("taskID").value;

  if (titleInput === "" || descriptionInput === "") {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Title and description cannot be empty.',
    });
    return;
  }

  // Update task
  if (taskId) {
    await updateDoc(doc(db, "tasks", taskId), {
      title: titleInput,
      description: descriptionInput,
    });
    Swal.fire({
      icon: 'success',
      title: 'Task updated successfully',
      showConfirmButton: false,
      timer: 1500
    });
    clearInputs();
  }

  // Add new task
  else {
    let q = query(collection(db, "tasks"), where("title", "==", titleInput), where("userId", "==", user.uid));
    let querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      Swal.fire({
        icon: 'error',
        title: 'Duplicate Task',
        text: 'A task with this title already exists. Please choose a different title.',
      });
      return;
    }

    await addDoc(collection(db, "tasks"), {
      title: titleInput,
      description: descriptionInput,
      status: "pending",
      userId: user.uid, // Add the userId field
    });
    Swal.fire({
      icon: 'success',
      title: 'Task added successfully',
      showConfirmButton: false,
      timer: 1500
    });
    clearInputs();
  }
};

// Display tasks
function getTasks(filter = "all", searchQuery = "") {
  let user = auth.currentUser;

  if (!user) {
    return;
  }

  let q = query(collection(db, "tasks"), where("userId", "==", user.uid));
  onSnapshot(q, (querySnapshot) => {

    let tasksContainer = document.getElementById("importingCards");
    tasksContainer.innerHTML = '';

    let filteredTasks = [];
    querySnapshot.forEach((doc) => {
      let task = doc.data();
      task.id = doc.id;

      if (filter !== "all" && task.status !== filter) {
        return;
      }

      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return;
      }

      filteredTasks.push(task);
    });

    if (filteredTasks.length === 0) {
      tasksContainer.innerHTML = `<img id="noTaskImg" src="/resources/no-task.png" alt="No-task-yet" class="d-block mx-auto mt-5" style="max-width: 15%;">`;
    } else {
      filteredTasks.forEach((task) => {
        let badge = task.status === "completed" ? "text-bg-success" : "text-bg-warning";
        let taskCard = `
          <section class="taskCard col-lg-4 col-md-6 col-sm-12">
            <div class="card border-secondary" style="max-width: 35rem;" onclick="toggleTaskStatus('${task.id}')">
              <h5 class="card-header">${task.title}</h5>
                <div class="card-body" style="height: 200px; overflow-y: auto;">
                <p class="card-text">${task.description}</p>
              </div>
              <div class="card-footer text-end">
                <span id="tBadge" class="badge ${badge} rounded-pill">${task.status}</span>
                <button class="btn btn-warning btn-sm" onclick="event.stopPropagation(); editTask('${task.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="event.stopPropagation(); deleteTask('${task.id}')">Delete</button>
              </div>
            </div>
          </section>`;
        tasksContainer.innerHTML += taskCard;
      });
    }
  });
};

// display tasks on search
function search() {
  document.getElementById("searchField").addEventListener("input", (e) => {
    let searchQuery = e.target.value.trim();
    let filter = document.querySelector(".dropdown-item.active")?.getAttribute("data-filter") || "all";
    getTasks(filter, searchQuery);
  });
};

// display tasks on filter
function filter() {
  document.querySelectorAll(".dropdown-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      let filter = e.target.getAttribute("data-filter");
      let searchQuery = document.getElementById("searchField").value.trim();

      document.querySelector(".dropdown-toggle").textContent = e.target.textContent;

      document.querySelectorAll(".dropdown-item").forEach((el) => el.classList.remove("active"));
      e.target.classList.add("active");

      getTasks(filter, searchQuery);
    });
  });
};

// toggle status
async function toggleTaskStatus(taskId) {
  let docRef = doc(db, "tasks", taskId);
  let docSnap = await getDoc(docRef);

  let currentStatus = docSnap.data().status;
  let newStatus = currentStatus === "pending" ? "completed" : "pending";
  let badge = newStatus === "completed" ? "text-bg-success" : "text-bg-warning";

  await updateDoc(docRef, { status: newStatus });

  // struggled with this
  let taskCard = document.querySelector(`[onclick="toggleTaskStatus('${taskId}')"]`);
  if (taskCard) {
    let statusBadge = taskCard.querySelector('#tBadge');
    statusBadge.textContent = newStatus;
    statusBadge.className = `badge ${badge} rounded-pill`;
  }
};

// Edit task
async function editTask(taskId) {
  let docRef = doc(db, "tasks", taskId);
  let docSnap = await getDoc(docRef);

  let task = docSnap.data();
  document.getElementById("tTitle").value = task.title;
  document.getElementById("tDiscreption").value = task.description;
  document.getElementById("taskID").value = taskId;
  document.getElementById("saveButton").textContent = "Update Task";
};

// Delete task
async function deleteTask(taskId) {
  let user = auth.currentUser;

  if (!user) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'You must be logged in to delete a task.',
    });
    return;
  }

  let result = await Swal.fire({
    title: 'Are you sure?',
    text: 'You are about to delete this task. This action cannot be undone!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel',
  });

  if (result.isConfirmed) {
    try {
      await deleteDoc(doc(db, "tasks", taskId));
      Swal.fire({
        icon: 'success',
        title: 'Task deleted successfully',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete the task. Please try again.',
      });
    }
  }
};

// Clear inputs
function clearInputs() {
  document.getElementById("taskID").value = "";
  document.getElementById("tTitle").value = "";
  document.getElementById("tDiscreption").value = "";
  document.getElementById("saveButton").textContent = "Add Task";
};
// end main logic

export { signUp, signIn, signOut, addTask, getTasks, deleteTask, editTask, toggleTaskStatus, search, filter };