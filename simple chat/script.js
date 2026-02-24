function sendMessage() {
  const input = document.getElementById("input");
  const messages = document.getElementById("messages");

  if (input.value === "") return;

  // create message bubble
  const msg = document.createElement("div");
  msg.className = "message";
  msg.innerText = input.value;

  messages.appendChild(msg);
  input.value = "";

  // auto scroll down
  messages.scrollTop = messages.scrollHeight;
}
function handleEvent(event) {
    if(event.key === "Enter"){
        sendMessage()
    }
}