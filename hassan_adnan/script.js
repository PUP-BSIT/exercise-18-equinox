let nameInput = document.querySelector("#name");
let commentInput = document.querySelector("#comment");
let commentButton = document.querySelector("#comment_button");
let commentsSection = document.querySelector(".team-comment-sorted");
let ascendingButton = document.querySelector("#ascending_button");
let descendingButton = document.querySelector("#descending_button");
let comments = [];

nameInput.addEventListener("input", toggleCommentButton);
commentInput.addEventListener("input", toggleCommentButton);
ascendingButton.addEventListener("click", sortCommentsAscending);
descendingButton.addEventListener("click", sortCommentsDescending);

function toggleCommentButton() {
    let nameValue = nameInput.value;
    let commentValue = commentInput.value;

    commentButton.disabled = !(nameValue.trim() && commentValue.trim());
}

function addComment() {
    let name = nameInput.value;
    let comment = commentInput.value;

    if (name.trim()|| comment.trim())return;
    

    let timestamp = new Date().toLocaleString();

    let commentObj = {
        name: name,
        comment: comment,
        timestamp: timestamp,
    };

    comments.push(commentObj); 

    nameInput.value = '';
    commentInput.value = '';
    commentButton.setAttribute('disabled', 'true');

    displayComments();
}

function displayComments() {

    commentsSection.innerHTML = '';

    for (let comment of comments) {
        let commentElement = document.createElement('div');
        commentElement.innerHTML = `<h4>${comment.name} - 
        ${comment.timestamp}</h4><p>${comment.comment}</p>`;
        commentsSection.appendChild(commentElement);
    }
}

function sortCommentsAscending() {
    comments.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    displayComments();
}

function sortCommentsDescending() {
    comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    displayComments();
}
