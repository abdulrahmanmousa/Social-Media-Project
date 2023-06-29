function getUserProfile() {
  let id = currenUserId();
  axios.get(`${baseUrl}/users/${id}`).then((response) => {
    const user = response.data.data;
    document.getElementById("main-email").innerHTML = user.email;
    document.getElementById("main-name").innerHTML = user.name;
    document.getElementById("main-username").innerHTML = user.username;
    document.getElementById("posts-count").innerHTML = user.posts_count;
    document.getElementById("comments-count").innerHTML = user.comments_count;
    document.getElementById("header-image").src = user.profile_image;
    document.getElementById("name-span").innerHTML = `${user.name}'s`;
  });
}
getUserProfile();
getUserPosts();

function profileClicked() {
  const user = getCurrentUser();
  userId = user.id;
  window.location = `profile.html?userid=${userId}`;
}

function currenUserId() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("userid");
  return id;
}
function getUserPosts() {
  id = currenUserId();
  axios.get(`${baseUrl}/users/${id}/posts`).then((response) => {
    const posts = response.data.data;

    document.getElementById("user-posts").innerHTML = "";

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

          <img
            src="${author.profile_image}"
            alt=""
            class="rounded-circle border border-3"
            style="height: 40px; width: 40px"
          />
          <b>${author.username}</b>

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
      document.getElementById("user-posts").innerHTML += content;
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
