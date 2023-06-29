const baseUrl = "https://tarmeezacademy.com/api/v1";
let currentPage = 1;
let lastPage = 1;
getPosts();
setupUI();

function getPosts(reload = true, page = 1) {
  axios.get(`${baseUrl}/posts?limit=2&page=${page}`).then((response) => {
    const posts = response.data.data;

    lastPage = response.data.meta.last_page;
    if (reload) {
      document.getElementById("posts").innerHTML = "";
    }

    for (post of posts) {
      const author = post.author;

      let editButtonContent = "";
      let deleteButtonContent = "";
      user = getCurrentUser();
      let isMyPost = user != null && post.author.id == user.id;

      if (isMyPost) {
        editButtonContent = `          <button class="btn btn-secondary  mx-2" style="float:right;" onclick="editBtnClicked('${encodeURIComponent(
          JSON.stringify(post)
        )}')">Edit</button>`;
        deleteButtonContent = `          <button class="btn btn-danger" style="float:right;" onclick="deleteBtnClicked('${encodeURIComponent(
          JSON.stringify(post)
        )}')">Delete</button>`;
      }

      let content = `<div class="card shadow my-2">
        <div class="card-header">
        <span id="username-data" onclick="userClicked(${
          author.id
        })" style='cursor:pointer;'>
          <img
            src="${author.profile_image}"
            alt=""
            class="rounded-circle border border-3"
            style="height: 40px; width: 40px"
          />
          <b>${author.username}</b>
          </span>
          ${deleteButtonContent}
          ${editButtonContent}
        </div>

        <div class="card-body" onclick="postClicked(${
          post.id
        })" style="cursor:pointer;">


          <img src="${post.image}" alt="" class="w-100" />

          <h6 style="color: rgb(172, 172, 172)" class="mt-1">${
            post.created_at
          }</h6>

          <h5>${post.title || ""}</h5>
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
            <span id="post-tags-${post.id}">

            </span>
          </div>
        </div>
      </div>

    `;
      const currentPostTagsId = `post-tags-${post.id}`;
      document.getElementById("posts").innerHTML += content;
      document.getElementById(currentPostTagsId).innerHTML = "";
      for (tag of post.tags) {
        let tagsContent = `
      <button
                class="btn btn-sm rounded-5"
                style="background-color: gray; color: white"
              >
                ${tag.name}
              </button>
      `;
        document.getElementById(currentPostTagsId).innerHTML = tagsContent;
      }
    }
  });
}

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

function createNewPostClicked(title, body, image) {
  title = document.getElementById("post-title-input").value;
  body = document.getElementById("post-body-input").value;
  image = document.getElementById("post-image-input").files[0];
  let postId = document.getElementById("post-id-input").value;
  let url;
  let isCreate = postId == null || postId == "";

  console.log(isCreate);
  let formData = new FormData();

  formData.append("body", body);
  formData.append("title", title);
  formData.append("image", image);

  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "multipart/form-data",
    authorization: `Bearer ${token}`,
  };

  if (isCreate) {
    url = `${baseUrl}/posts`;
  } else {
    formData.append("_method", "put");

    url = `${baseUrl}/posts/${postId}`;
  }
  axios
    .post(url, formData, {
      headers: headers,
    })
    .then((response) => {
      const modal = document.getElementById("create-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("Post Created Successfully", "success");
      getPosts();
    })
    .catch((error) => {
      showAlert(error.response.data.message, "danger");
    });
}

// infinite scroll //

window.addEventListener("scroll", () => {
  const endOfPage =
    2 * window.innerHeight + window.scrollY >= document.body.offsetHeight;
  if (endOfPage && currentPage < lastPage) {
    currentPage += 1;
    getPosts(false, currentPage);
  }
});

// end infinite scroll //

function postClicked(postId) {
  window.location = `postDetails.html?postId=${postId}`;
}

function editBtnClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));

  document.getElementById("post-modal-submit-btn").innerHTML = "Update";

  document.getElementById("post-id-input").value = post.id;
  document.getElementById("post-modal-title").innerHTML = "Edit Post";
  document.getElementById("post-title-input").innerHTML = post.title;
  document.getElementById("post-body-input").innerHTML = post.body;

  let postModal = new bootstrap.Modal(
    document.getElementById("create-post-modal"),
    {}
  );
  postModal.toggle();
}

function deleteBtnClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  document.getElementById("delete-post-id-input").value = post.id;
  let postModal = new bootstrap.Modal(
    document.getElementById("delete-post-modal"),
    {}
  );
  postModal.toggle();
}

function addBtnClicked() {
  document.getElementById("post-modal-submit-btn").innerHTML = "Create";

  document.getElementById("post-id-input").value = "";
  document.getElementById("post-modal-title").innerHTML = "Create A New Post";
  document.getElementById("post-title-input").innerHTML = "";
  document.getElementById("post-body-input").innerHTML = "";

  let postModal = new bootstrap.Modal(
    document.getElementById("create-post-modal"),
    {}
  );
  postModal.toggle();
}
function confirmPostDelete() {
  const postId = document.getElementById("delete-post-id-input").value;
  console.log(postId);
  const token = localStorage.getItem("token");

  const headers = {
    authorization: `Bearer ${token}`,
  };
  axios
    .delete(`${baseUrl}/posts/${postId}`, {
      headers: headers,
    })
    .then((response) => {
      console.log(response);
      showAlert("Post Deleted Successfully", "success");

      const modal = document.getElementById("delete-post-modal");

      const modalInstance = bootstrap.Modal.getInstance(modal);

      modalInstance.hide();
      getPosts();
    })
    .catch((error) => {
      console.log(error);
      showAlert(error.response.data.error_message, "danger");
    });
}

function userClicked(userId) {
  window.location = `profile.html?userid=${userId}`;
}
function profileClicked() {
  const user = getCurrentUser();
  userId = user.id;
  window.location = `profile.html?userid=${userId}`;
}
