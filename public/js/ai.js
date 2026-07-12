const sendBtn = document.getElementById("aksChatSend");
const input = document.getElementById("aksChatInput");
const chatBody = document.getElementById("aksChatBody");

let conversationHistory = [];

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});

// ── Markdown ko clean HTML me convert karne wala function ──
function formatBotReply(text) {
    let formatted = text;

    // Bold: **text** -> <b>text</b>
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");

    // Bullet points: lines starting with "* " ya "- " ko <li> banao
    const lines = formatted.split("\n");
    let html = "";
    let inList = false;

    lines.forEach(line => {
        const trimmed = line.trim();

        if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
            if (!inList) {
                html += "<ul class='aks-list'>";
                inList = true;
            }
            html += `<li>${trimmed.substring(2)}</li>`;
        } else {
            if (inList) {
                html += "</ul>";
                inList = false;
            }
            if (trimmed !== "") {
                html += `<p>${trimmed}</p>`;
            }
        }
    });

    if (inList) html += "</ul>";

    return html;
}

async function sendMessage() {

    const message = input.value.trim();

    if (!message) return;

    chatBody.innerHTML += `<div class="aks-msg user">${message}</div>`;
    input.value = "";
    chatBody.scrollTop = chatBody.scrollHeight;

    const typingId = "typing-" + Date.now();
    chatBody.innerHTML += `
        <div class="aks-msg bot" id="${typingId}">
            <span class="aks-typing-dots"><span></span><span></span><span></span></span>
        </div>
    `;
    chatBody.scrollTop = chatBody.scrollHeight;

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message,
                history: conversationHistory
            })
        });

        const data = await response.json();

        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();

        const formattedReply = formatBotReply(data.reply);

        chatBody.innerHTML += `<div class="aks-msg bot">${formattedReply}</div>`;
        chatBody.scrollTop = chatBody.scrollHeight;

        conversationHistory.push({ role: "user", text: message });
        conversationHistory.push({ role: "assistant", text: data.reply });

    } catch (err) {
        const typingEl = document.getElementById(typingId);
        if (typingEl) typingEl.remove();
        chatBody.innerHTML += `<div class="aks-msg bot">Sorry, something went wrong. Please try again.</div>`;
        chatBody.scrollTop = chatBody.scrollHeight;
    }
}