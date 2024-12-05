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
          
          icon.addEventListener("click", (event) => {
            event.stopPropagation();
            showMessageBox(event, phoneNumber);
          });

          // Replace phone number with span and icon
          const textNode = document.createTextNode(phoneNumber);
          span.appendChild(textNode);
          span.appendChild(icon);

          // Replace phone number in DOM with the new span
          el.innerHTML = el.innerHTML.replace(phoneNumber, span.outerHTML);
        }
      });
    });
  }
}

// Event delegation to handle icon clicks
document.body.addEventListener("click", (event) => {
  if (event.target.tagName === "IMG" && event.target.style.cursor === "pointer") {
    event.stopPropagation();
    const phoneNumber = event.target.previousSibling.textContent; 
    showMessageBox(event, phoneNumber);
  }
});

// Function to show message box near clicked icon
function showMessageBox(event, phoneNumber) {
  const existingBox = document.getElementById("messageBox");
  if (existingBox) existingBox.remove();

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
    <textarea id="userMessage" placeholder="Enter your message" style="width: 100%; height: 50px; margin-bottom: 10px;"></textarea>
    <div style="text-align: right;">
      <button id="sendMessage" style="padding: 5px 10px; background-color: #0498fb; color: white;">Send</button>
      <button id="closeMessageBox" style="padding: 5px 10px; background-color: #0498fb; color: white; margin-left: 5px;">Close</button>
    </div>
  `;

  const rect = event.target.getBoundingClientRect();
  messageBox.style.top = `${rect.top + window.scrollY + 30}px`;
  messageBox.style.left = `${rect.left + window.scrollX}px`;

  document.body.appendChild(messageBox);

  document.getElementById("sendMessage").addEventListener("click", () => {
    const message = document.getElementById("userMessage").value.trim();
    if (message) {
      // Make an HTTP request to your backend API
      fetch('http://localhost:3000/send-message', { // Replace with your actual backend URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          body: message,
          to: phoneNumber,
        }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.sid) {
            alert(`Message sent successfully to ${phoneNumber}`);
          } else {
            alert(`Failed to send message: ${data.error}`);
          }
          messageBox.remove();
        })
        .catch(err => {
          alert(`Error: ${err.message}`);
          messageBox.remove();
        });
    } else {
      alert("Please enter a message!");
    }
  });

  // Close the message box when the "Close" button is clicked
  document.getElementById("closeMessageBox").addEventListener("click", () => {
    messageBox.remove();
  });
}




/* 
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
*/
