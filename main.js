import bootstrap from "bootstrap";
import axios from "axios";

const baseUrl = "https://tarmeezacademy.com/api/v1";

setupUI();

function loginBtnClicked(user, pass) {
  user = document.getElementById("username-input").value;
  pass = document.getElementById("password-input").value;

  const params = {
    username: user,
    password: pass,
  };

  axios.post(`${baseUrl}/login`, params).then((response) => {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    const modal = document.getElementById("loginModal");

    const modalInstance = bootstrap.Modal.getInstance(modal);

    modalInstance.hide();
    setupUI();
    showAlert("Logged In Successfully!", "success");
  });
}

function registerBtnClicked(name, user, pass, picture) {
  name = document.getElementById("register-name-input").value;
  user = document.getElementById("register-username-input").value;
  pass = document.getElementById("register-password-input").value;
  picture = document.getElementById("profile-picture-input").files[0];

  const params = {
    name: name,
    username: user,
    password: pass,
  };

  let formData = new FormData();

  formData.append("name", name);
  formData.append("username", user);
  formData.append("password", pass);
  formData.append("image", picture);

  axios
    .post(`${baseUrl}/register`, formData)
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      const modal = document.getElementById("register-modal");

      const modalInstance = bootstrap.Modal.getInstance(modal);

      modalInstance.hide();

      setupUI();
      showAlert("New Account Created Successfully!", "success");
    })
    .catch((error) => {
      const message = error.response.data.message;
      showAlert(message, "danger");
    });
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  showAlert("Logged Out Successfully!", "success");
  setupUI();
}

function showAlert(myMessage, type) {
  const alertPlaceholder = document.getElementById("success-alert");
  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };
  // todo: hide the alert
  appendAlert(myMessage, type);
  setTimeout(() => {}, 3000);
}

function setupUI() {
  const token = localStorage.getItem("token");

  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");
  const logoutDiv = document.getElementById("logout-div");
  const addBtn = document.getElementById("add-button");
  let navUserName = document.getElementById("nav-username");
  const user = getCurrentUser();

  let image = document.getElementById("nav-img");

  if (token == null) {
    // user is guest, hide logout
    if (addBtn != null) {
      addBtn.style.setProperty("display", "none", "important");
    }
    loginBtn.style.visibility = "visible";
    registerBtn.style.visibility = "visible";
    logoutDiv.style.setProperty("display", "none", "important");
  } else {
    // logged in , hide buttons
    if (addBtn != null) {
      addBtn.style.display = "flex";
    }
    loginBtn.style.visibility = "hidden";
    registerBtn.style.visibility = "hidden";
    logoutDiv.style.display = "inline";
    navUserName.innerHTML = user.name;
    image.src = user.profile_image;
  }
}

function getCurrentUser() {
  let user = null;
  const storageUser = localStorage.getItem("user");

  if (storageUser != null) {
    user = JSON.parse(storageUser);
  }

  return user;
}

const urlParams = new URLSearchParams(window.location.search);

const id = urlParams.get("postId");
getPost();
function getPost() {
  axios.get(`${baseUrl}/posts/${id}`).then((response) => {
    const post = response.data.data;
    const comments = post.comments;
    const author = post.author;

    let commentsContents = ``;

    for (comment of comments) {
      commentsContents += `<div class="p-3 w-100 comment " >
  <img
    src="${comment.author.profile_image}"
    alt=""
    class="rounded-circle"
    style="width: 40px; height: 40px"
  />
  <div class=" p-3 rounded-1 w-100" style="background-color:#F0ECFF">
  <b style="font-size:20px">${comment.author.username}</b>
  <!-- comment body  -->

  <div style="margin-top:5px;color:#707070">
    ${comment.body}
  </div>
  <!-- comment body  -->
</div>
</div>

`;
    }

    const postContent = `
    <div class="row mt-5 d-flex justify-content-center">
    <div class="col-lg-9">
      <h1>
        <span id="username-span">${author.name} Post</span>

      </h1>
    </div>
  </div>

  <div class="d-flex justify-content-center mt-5">
    <div id="posts" class="posts col-9">
      <div class="card shadow mt-2">
        <div class="card-header">
        <span id="username-data" onclick="userClicked()">
        <img
          src="${author.profile_image}"
          alt=""
          class="rounded-circle border border-3"
          style="height: 40px; width: 40px"
        />
        <b>${author.username}</b>
        </span>
        </div>
        <div class="card-body">
          <img src="${post.image}" alt="" class="w-100" />

          <h6 style="color: rgb(172, 172, 172)" class="mt-1">${post.created_at}</h6>

          <h5>${post.title}</h5>
          <p>
            ${post.body}
          </p>
          <hr />
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-pen"
              viewBox="0 0 16 16"
            >
              <path
                d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"
              />
            </svg>

            <span>(${post.comments_count}) comments</span>
          </div>
        </div>
        <div class="d-flex align-items-center bg-primary flex-column mb-2" id="comments">
        ${commentsContents}
          </div>
          <div class="container  py-3">
          <div class="input-group" id="add-comment-div">
            <input
              type="text"
              id="comment-input"
              placeholder="add your comment here "
              class="form-control"
            />
            <button class="btn btn-outline-primary" type="button" onclick="createCommentClicked()">send</button>
          </div>
      </div>
    </div>
    
    <!-- posts cont -->
  </div>
  

</div>
  `;
    document.getElementById("post").innerHTML = postContent;
  });
}

function createCommentClicked() {
  let commentBody = document.getElementById("comment-input").value;
  let params = {
    body: commentBody,
  };
  let token = localStorage.getItem("token");
  let url = `${baseUrl}/posts/${id}/comments`;

  axios
    .post(url, params, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      getPost();
      showAlert("Comment Created Successfully", "success");
    })
    .catch((error) => {
      showAlert(error.response.data.message, "danger");
    });
}
