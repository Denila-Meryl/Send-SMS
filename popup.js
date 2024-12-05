document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('insertIcon').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
          chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: insertIcons, 
        });
      }
    });
  });
});

function insertIcons() {
  const phoneRegex = /\b\d{2,4}([- ]?)\d{3,4}\1\d{3,4}\b|\b\d{3}([- ]?)\d{3}\1\d{4}\b|\b\d{2,4}([- ]?)\d{3,7}\1\d{3,7}\b|\b\d{10,11}\b/g;
  const bodyText = document.body.innerHTML;
  const matches = bodyText.match(phoneRegex);

  if (matches) {
    matches.forEach((phoneNumber) => {
      const elements = document.body.querySelectorAll("*:not(script):not(style)");
      elements.forEach((el) => {
        if (el.children.length === 0 && el.textContent.includes(phoneNumber)) {
          const span = document.createElement("span");
          span.style.display = "inline-flex";
          span.style.alignItems = "center";

          const icon = document.createElement("img");
          icon.src = chrome.runtime.getURL("image/msg.png");
          icon.style.width = "15px";
          icon.style.height = "15px";
          icon.style.cursor = "pointer";
          icon.style.marginLeft = "5px";
         

          //Add the event listener to show the message box when the icon is clicked
          icon.addEventListener("click", (event) => {
            event.stopPropagation();
            showMessageBox(event, phoneNumber);
          });

          // Replace the phone number with a span and icon
          const textNode = document.createTextNode(phoneNumber);
          span.appendChild(textNode);
          span.appendChild(icon);

          // Replace the phone number in the DOM with the new span
          el.innerHTML = el.innerHTML.replace(phoneNumber, span.outerHTML);
        }
      });
    });
  }
}
/*
function showMessageBox(event, phoneNumber) {

  // Remove any existing message box
  const existingBox = document.getElementById("messageBox");
  if (existingBox) existingBox.remove();

  // Create a new message box
  const messageBox = document.createElement("div");
  messageBox.id = "messageBox";
  messageBox.style.position = "absolute";
  messageBox.style.backgroundColor = "floralwhite";
  messageBox.style.border = "black";
  messageBox.style.padding = "10px";
  messageBox.style.zIndex = 1000;
  messageBox.style.borderRadius = "5px";
  messageBox.style.width = "250px";

  messageBox.innerHTML = `
    <p><strong>Send Message to:</strong> ${phoneNumber}</p>
    <textarea id="userMessage" placeholder="Enter your message" style="width: 100%; height: 100px; margin-bottom: 10px;"></textarea>
    <div style="text-align: right;">
      <button id="sendMessage" style="padding: 5px 10px; background-color: #0498fb; color: white;">Send</button>
      <button id="closeMessageBox" style="padding: 5px 10px; background-color: #0498fb; color: white; margin-left: 5px;">Close</button>
    </div>
  `;

  // Position the message box near the clicked icon
  const rect = event.target.getBoundingClientRect();
  messageBox.style.top = `${rect.top + window.scrollY + 30}px`;
  messageBox.style.left = `${rect.left + window.scrollX}px`;

  document.body.appendChild(messageBox);

  
  document.getElementById("sendMessage").addEventListener("click", () => {
    const message = document.getElementById("userMessage").value.trim();
    if (message) {
      alert(`Message sent to ${phoneNumber}: ${message}`);
      messageBox.remove();
    } else {
      alert("Please enter a message!");
    }
  });

 
  document.getElementById("closeMessageBox").addEventListener("click", () => {
    messageBox.remove();
  });
}
  
*/

