         document.addEventListener("DOMContentLoaded", function () {
             const chatForm = document.getElementById("chatForm");
             const userInput = document.getElementById("userInput");
             const chatMessages = document.getElementById("chatMessages");
             const sendButton = chatForm.querySelector("button");
         
             const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAz9Jzc-IFlC7TA096gwcbbQej8t8nwQSs";
         
             let conversation = [];
             let isFirstMessage = true;
         
             function showLoading() {
                 // Guarda el contenido original del botón
                 const icon = sendButton.querySelector("i");
                 if (icon) {
                     icon.style.display = "none"; // Oculta el ícono
                 }
         
                 // Añade un spinner dentro del botón
                 const spinner = document.createElement("div");
                 spinner.classList.add("spinner");
                 sendButton.appendChild(spinner);
         
                 sendButton.disabled = true; // Desactiva el botón
             }
         
             function removeLoading() {
                 // Elimina el spinner
                 const spinner = sendButton.querySelector(".spinner");
                 if (spinner) {
                     spinner.remove();
                 }
         
                 // Muestra el ícono original
                 const icon = sendButton.querySelector("i");
                 if (icon) {
                     icon.style.display = "block";
                 }
         
                 sendButton.disabled = false; // Reactiva el botón
             }
         
             async function sendMessage(message) {
                 let body;
         
                 if (isFirstMessage) {
                     body = JSON.stringify({
                         contents: {
                             role: "user",
                             parts: [{ text: message }]
                         }
                     });
                     isFirstMessage = false;
                 } else {
                     conversation.push({ role: "user", parts: [{ text: message }] });
                     body = JSON.stringify({ contents: conversation });
                 }
         
                 showLoading();
         
                 try {
                     const response = await fetch(apiUrl, {
                         method: "POST",
                         headers: { "Content-Type": "application/json" },
                         body: body
                     });
         
                     if (!response.ok) {
                         throw new Error(`Error: ${response.statusText}`);
                     }
         
                     const data = await response.json();
                     const textResponse = data.candidates[0]?.content.parts[0]?.text || "Sin respuesta.";
         
                     conversation.push({ role: "model", parts: [{ text: textResponse }] });
         
                     removeLoading();
                     addMessage("ai-message", textResponse);
                 } catch (error) {
                     console.error("Error al comunicarse con la API:", error);
                     removeLoading();
                     addMessage("ai-message", "Se produjo un error al procesar su solicitud.");
                 }
             }
         
             function addMessage(type, text) {
                 const messageElement = document.createElement("div");
                 messageElement.classList.add("message", type);
                 messageElement.innerHTML = formatText(text);
                 chatMessages.appendChild(messageElement);
         
                 // Desplazar al final del contenedor
                 scrollToBottom();
             }
         
             function formatText(text) {
                 text = text.replace(/```(\w+)?([\s\S]*?)```/g, function (_, title, code) {
                     const codeTitle = title ? `<div class="code-title">${title.charAt(0).toUpperCase() + title.slice(1)}</div>` : "";
                     const escapedCode = escapeHTML(code);
                     return `<div class="code-block">
                                 ${codeTitle}
                                 <pre><code>${escapedCode}</code></pre>
                                 <button class="copy-button" onclick="copyCode(this)"><i class="material-icons icon2">content_paste</i></button>
                             </div>`;
                 });
         
                 text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
                 text = text.replace(/\*\*([^\*]+)\*\*/g, "<strong>$1</strong>");
                 text = text.replace(/\*([^\*]+)\*/g, "<em>$1</em>");
                 text = text.replace(/###([^\n]+)/g, "<h3>$1</h3>");
         
                 return text;
             }
         
             function escapeHTML(text) {
                 return text.replace(/&/g, "&amp;")
                     .replace(/</g, "&lt;")
                     .replace(/>/g, "&gt;")
                     .replace(/"/g, "&quot;")
                     .replace(/'/g, "&#039;");
             }
         
             function copyCode(button) {
                 const code = button.previousElementSibling.textContent;
         
                 navigator.clipboard.writeText(code).then(() => {
                     button.textContent = "¡Copiado!";
                     setTimeout(() => (button.textContent = "Copiar código"), 2000);
                 }).catch(err => {
                     console.error("Error al copiar el código:", err);
                 });
             }
         
             function scrollToBottom() {
                 chatMessages.scrollTop = chatMessages.scrollHeight;
             }
         
             chatForm.addEventListener("submit", function (e) {
                 e.preventDefault();
                 const userMessage = userInput.value.trim();
                 if (userMessage) {
                     addMessage("user-message", userMessage);
                     sendMessage(userMessage);
                     userInput.value = "";
                 }
             });
         });
              document.getElementById("themeToggle").addEventListener("click", function () {
              const isDark = document.body.classList.toggle("dark-theme");
              const icon = this.querySelector("i");
              
              if (isDark) {
                  document.documentElement.style.setProperty("--background-light", "#1f2024");
                  document.documentElement.style.setProperty("--text-light", "#fff");
                  document.documentElement.style.setProperty("--message-light", "#252c32");
                  document.documentElement.style.setProperty("--border-light", "#333");
                  document.documentElement.style.setProperty("--user-message-light", "#252c32");
                  icon.textContent = "light_mode"; // Cambia el icono a "light_mode"
                  localStorage.setItem("theme", "dark"); // Guarda el tema oscuro
              } else {
                  document.documentElement.style.setProperty("--background-light", "#f6f9ff");
                  document.documentElement.style.setProperty("--text-light", "#333");
                  document.documentElement.style.setProperty("--message-light", "#e1eaf3");
                  document.documentElement.style.setProperty("--border-light", "#e0e0e0");
                  document.documentElement.style.setProperty("--user-message-light", "#d1ecf1");
                  icon.textContent = "dark_mode"; // Cambia el icono a "dark_mode"
                  localStorage.setItem("theme", "light"); // Guarda el tema claro
              }
              });
              
              // Al cargar la página, verifica el tema guardado en localStorage
              window.addEventListener("load", function () {
              const savedTheme = localStorage.getItem("theme");
              
              if (savedTheme === "dark") {
                  document.body.classList.add("dark-theme");
                  const icon = document.getElementById("themeToggle").querySelector("i");
                  icon.textContent = "light_mode"; // Cambia el icono a "light_mode"
                  document.documentElement.style.setProperty("--background-light", "#1f2024");
                  document.documentElement.style.setProperty("--text-light", "#fff");
                  document.documentElement.style.setProperty("--message-light", "#252c32");
                  document.documentElement.style.setProperty("--border-light", "#333");
                  document.documentElement.style.setProperty("--user-message-light", "#252c32");
              }
              });
