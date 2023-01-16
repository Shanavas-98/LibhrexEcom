
function myFunction() {
  // Create the modal element
  var modal = document.createElement("div");
  modal.classList.add("modal");
  // Set the modal content
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <p>Custom alert message</p>
    </div>
  `;
  // Add the modal element to the HTML document
  document.body.appendChild(modal);

  // Get the close button and add an onclick event to close the modal
  var closeBtn = modal.getElementsByClassName("close")[0];
  closeBtn.onclick = function() {
    modal.style.display = "none";
  }
}
