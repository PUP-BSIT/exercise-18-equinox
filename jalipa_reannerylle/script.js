let nameInput = document.querySelector("#name");
let commentInput = document.querySelector("#comment");
let commentButton = document.querySelector("#comment_button");
let commentsSection = document.querySelector("#comment_sec");
let ascendingButton = document.querySelector("#ascending");
let descendingButton = document.querySelector("#descending");
let comments = [];

nameInput.addEventListener("input", toggleCommentButton);
commentInput.addEventListener("input", toggleCommentButton);
ascendingButton.addEventListener("click", sortAscend);
descendingButton.addEventListener("click", sortDescend);

function toggleCommentButton() {
  let nameValue = nameInput.value;
  let commentValue = commentInput.value;

  commentButton.disabled = !(nameValue.trim() && commentValue.trim());
}

function addComment() {
  let name = nameInput.value;
  let comment = commentInput.value;

  if (name.trim() || comment.trim()) {
    return;
  }

  let timestamp = new Date().toLocaleString();

  let commObj = {
    name: name,
    comment: comment,
    timestamp: timestamp,
  };

  comments.push(commObj);

  nameInput.value = "";
  commentInput.value = "";
  commentButton.setAttribute("disabled", "true");

  showComments();
}

function showComments() {
  commentsSection.innerHTML = "";

  for (let comment of comments) {
    let commentElement = document.createElement("div");
    commentElement.innerHTML = `<h4>${comment.name} - 
        ${comment.timestamp}</h4><p>${comment.comment}</p>`;
    commentsSection.appendChild(commentElement);
  }
}

function sortAscend() {
  comments.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  showComments();
}

function sortDescend() {
  comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  showComments();
}
