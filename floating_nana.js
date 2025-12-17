(function () {
    // ========================================
    // 0. Inject Dependencies & Styles
    // ========================================

    // Load Marked.js if not present
    if (typeof marked === 'undefined') {
        var script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/marked@4.3.0/marked.min.js';
        document.head.appendChild(script);
    }

    // Load Google Fonts
    var fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Inject Custom Styles (Native CSS replacement for Tailwind)
    var style = document.createElement('style');
    style.textContent = `
        #nana-plugin-root {
            font-family: 'Noto Sans TC', sans-serif;
            --nana-blue-600: #2563eb;
            --nana-blue-700: #1d4ed8;
            --nana-indigo-600: #4f46e5;
            --nana-slate-50: #f8fafc;
            --nana-slate-100: #f1f5f9;
            --nana-slate-200: #e2e8f0;
            --nana-slate-300: #cbd5e1;
            --nana-slate-400: #94a3b8;
            --nana-slate-600: #475569;
            --nana-slate-700: #334155;
            --nana-slate-800: #1e293b;
            --nana-slate-900: #0f172a;
            --nana-white: #ffffff;
            --nana-green-400: #4ade80;
            --nana-green-500: #22c55e;
            --nana-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            --nana-shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        /* Utils */
        .hidden { display: none !important; }
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .justify-between { justify-content: space-between; }
        .justify-end { justify-content: flex-end; }
        .justify-start { justify-content: flex-start; }
        .gap-2 { gap: 0.5rem; }
        .gap-3 { gap: 0.75rem; }
        .absolute { position: absolute; }
        .relative { position: relative; }
        .fixed { position: fixed; }
        .w-full { width: 100%; }
        .h-full { height: 100%; }
        .object-cover { object-fit: cover; }
        .cursor-pointer { cursor: pointer; }
        .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
        .transition-opacity { transition-property: opacity; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
        .duration-300 { transition-duration: 300ms; }
        .opacity-0 { opacity: 0; }
        .pointer-events-none { pointer-events: none; }
        .text-white { color: var(--nana-white); }
        .flex-shrink-0 { flex-shrink: 0; }

        /* Iframe Modal */
        .nana-modal-overlay {
            position: fixed; top: 0; right: 0; bottom: 0; left: 0;
            z-index: 10000;
        }
        .nana-modal-backdrop {
            position: absolute; top: 0; right: 0; bottom: 0; left: 0;
            background-color: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(12px);
        }
        .nana-modal-close-btn {
            position: fixed; top: 1.25rem; right: 1.25rem; z-index: 10001;
            padding: 0.5rem; color: white; background-color: rgba(0, 0, 0, 0.5);
            border-radius: 9999px; border: 1px solid rgba(255, 255, 255, 0.2);
            cursor: pointer; transition: all 0.15s ease;
        }
        .nana-modal-close-btn:hover { color: #22d3ee; background-color: rgba(0, 0, 0, 0.7); }
        .nana-iframe-container {
            position: absolute; top: 50%; left: 50%;
            transform-origin: center; overflow: hidden; background-color: transparent;
            transition: transform 0.3s ease;
            border-radius: 12px;
        }
        .nana-iframe { width: 100%; height: 100%; border: 0; }

        /* Chat Window */
        .nana-chat-window {
            position: fixed; bottom: 6rem; right: 1.5rem;
            width: 24rem; height: 600px;
            max-width: calc(100vw - 3rem); max-height: calc(100vh - 8rem);
            background-color: white; border-radius: 1rem;
            box-shadow: var(--nana-shadow-2xl);
            border: 1px solid var(--nana-slate-200);
            z-index: 9999;
            display: flex; flex-direction: column; overflow: hidden;
            transform-origin: bottom right;
            text-align: left;
        }
        
        .nana-chat-header {
            background: linear-gradient(to right, var(--nana-blue-600), var(--nana-indigo-600));
            padding: 0.75rem 1rem; display: flex; align-items: center; justify-content: space-between;
            flex-shrink: 0;
            color: white;
            min-height: auto;
        }
        .nana-avatar-container {
            width: 2.5rem; height: 2.5rem; border-radius: 9999px;
            background-color: white; padding: 0.125rem; border: 1px solid #bfdbfe;
            overflow: hidden; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            flex-shrink: 0;
        }
        .nana-status-dot {
            position: absolute; bottom: 0; right: 0; width: 0.625rem; height: 0.625rem;
            background-color: var(--nana-green-400); border: 2px solid white; border-radius: 9999px;
        }
        .nana-header-close-btn {
            background: transparent; border: 0; cursor: pointer;
            color: rgba(255,255,255,0.8); padding: 0.25rem; border-radius: 9999px;
            transition: background-color 0.15s;
        }
        .nana-header-close-btn:hover { color: white; background-color: rgba(255,255,255,0.1); }

        .nana-messages-area {
            flex: 1; overflow-y: auto; padding: 1rem;
            background-color: var(--nana-slate-50);
            display: flex; flex-direction: column; gap: 1rem;
        }
        
        /* Rendered Messages */
        .nana-msg-bubble {
            max-width: 85%; border-radius: 1rem; padding: 0.75rem;
            font-size: 0.875rem; line-height: 1.625; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        .nana-msg-user {
            background-color: var(--nana-blue-600); color: white;
            border-bottom-right-radius: 0;
        }
        .nana-msg-bot {
            background-color: white; color: var(--nana-slate-700);
            border: 1px solid var(--nana-slate-200);
            border-bottom-left-radius: 0;
        }
        .nana-msg-bot a { color: var(--nana-blue-600); text-decoration: underline; }
        .nana-msg-bot a:hover { color: var(--nana-blue-700); }

        /* Suggestions */
        .nana-suggestions-area {
            padding: 0.5rem 1rem; background-color: var(--nana-slate-50);
            border-top: 1px solid var(--nana-slate-100);
            overflow-x: auto; display: flex; gap: 0.5rem; flex-shrink: 0;
        }
        .nana-suggestion-btn {
            white-space: nowrap; padding: 0.25rem 0.75rem;
            background-color: white; border: 1px solid var(--nana-slate-200);
            color: var(--nana-slate-600); border-radius: 9999px; font-size: 0.75rem;
            cursor: pointer; transition: background-color 0.15s;
        }
        .nana-suggestion-btn:hover { background-color: var(--nana-slate-100); }
        .nana-suggestion-btn.cyan {
            background-color: #ecfeff; border-color: #a5f3fc; color: #0891b2;
        }
        .nana-suggestion-btn.cyan:hover { background-color: #cffafe; }

        /* Input Area */
        .nana-input-area {
            padding: 1rem; background-color: white;
            border-top: 1px solid var(--nana-slate-100); flex-shrink: 0;
        }
        .nana-input-wrapper {
            display: flex; gap: 0.5rem; align-items: center;
        }
        .nana-input-field {
            flex: 1; padding: 0.5rem 1rem; background-color: var(--nana-slate-50);
            border: 1px solid var(--nana-slate-200); border-radius: 0.75rem;
            font-size: 0.875rem; outline: none; transition: box-shadow 0.15s;
        }
        .nana-input-field:focus { box-shadow: 0 0 0 2px var(--nana-blue-600); border-color: transparent; }
        .nana-input-field:disabled { background-color: var(--nana-slate-100); cursor: not-allowed; }
        
        .nana-send-btn {
            width: 2.5rem; height: 2.5rem; background-color: var(--nana-blue-600);
            color: white; border-radius: 0.75rem; display: flex; align-items: center; justify-content: center;
            border: 0; cursor: pointer; transition: background-color 0.15s;
            box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
            flex-shrink: 0;
        }
        .nana-send-btn:hover { background-color: var(--nana-blue-700); }
        .nana-send-btn:disabled { background-color: var(--nana-slate-400); cursor: not-allowed; }

        /* Floating Button */
        .nana-floating-container {
            position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 9999;
            display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem;
        }
        .nana-tooltip {
            background-color: var(--nana-slate-800); color: white;
            padding: 0.5rem 1rem; border-radius: 0.75rem;
            box-shadow: var(--nana-shadow-lg); border: 1px solid var(--nana-slate-700);
            font-size: 0.875rem; font-weight: 500; margin-bottom: 0.25rem;
            position: relative; cursor: pointer; transform-origin: bottom right;
        }
        .nana-tooltip-arrow {
            position: absolute; bottom: -6px; right: 1.5rem;
            width: 0.75rem; height: 0.75rem; background-color: var(--nana-slate-800);
            border-bottom: 1px solid var(--nana-slate-700);
            border-right: 1px solid var(--nana-slate-700);
            transform: rotate(45deg);
        }
        .nana-float-btn {
            position: relative; width: 4rem; height: 4rem;
            border: 0; background-color: transparent; padding: 0; cursor: pointer;
            transition: transform 0.3s ease;
        }
        .nana-float-btn:hover { transform: scale(1.1); }
        .nana-float-btn img {
            width: 100%; height: 100%; object-fit: cover;
            border-radius: 9999px; position: relative; z-index: 10;
            box-shadow: var(--nana-shadow-lg);
        }

        /* Ping Animation */
        .nana-ping-container {
            position: absolute; top: 0; right: 0; display: flex; height: 1rem; width: 1rem;
            z-index: 20; margin-top: -0.25rem; margin-right: -0.25rem;
        }
        .nana-ping-dot {
            position: relative; display: inline-flex; border-radius: 50%;
            height: 1rem; width: 1rem; background-color: var(--nana-green-500);
            border: 2px solid white;
            flex-shrink: 0; box-sizing: border-box;
        }
        .nana-ping-wave {
            position: absolute; display: inline-flex; height: 100%; width: 100%;
            border-radius: 9999px; background-color: var(--nana-green-400);
            opacity: 0.75; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes ping {
            75%, 100% { transform: scale(2); opacity: 0; }
        }

        /* Shared Animations */
        .chat-enter { animation: chatSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .chat-exit { animation: chatSlideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes chatSlideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes chatSlideDown { from { opacity: 1; transform: translateY(0) scale(1); } to { opacity: 0; transform: translateY(20px) scale(0.95); } }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .typing-dot {
            width: 6px; height: 6px; background-color: #94a3b8; border-radius: 50%;
            animation: typing 1.4s infinite ease-in-out both; margin: 0 2px;
        }
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes typing { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }

        .bubble-pulse { animation: bubblePulse 2s infinite; }
        @keyframes bubblePulse {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
            70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }
        
        /* Mobile Override */
        @media (max-width: 768px) {
            .nana-chat-window { bottom: 0; right: 0; width: 100%; height: 100%; max-width: none; max-height: none; border-radius: 0; }
        }
    `;
    document.head.appendChild(style);

    // ========================================
    // 1. Logic & State
    // ========================================

    // Wait for DOM
    function initNanaChat() {
        var WEBHOOK_URL = "https://n8n-gateway.zeabur.app/ai-solution-agent";
        var QUOTA_URL = "https://n8n-gateway.zeabur.app/ai-quota-check";
        var STORAGE_KEY = 'digiwin_ai_user_uid';

        function getPersistentSessionId() {
            var uid = localStorage.getItem(STORAGE_KEY);
            if (!uid) {
                uid = 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
                localStorage.setItem(STORAGE_KEY, uid);
            }
            return uid;
        }

        var chatState = {
            messages: [{ id: 1, text: '嗨，我是娜娜！想了解企業運用 AI 的方法嗎？歡迎提出你對企業 AI 想了解的問題！', sender: 'bot' }],
            loading: false,
            sessionId: getPersistentSessionId(),
            isOpen: false
        };

        // --- Global Functions attached to window for HTML event handlers ---

        window.toggleChat = function () {
            var modal = document.getElementById('nana-chat-modal');
            var tooltip = document.getElementById('nana-tooltip');
            if (!modal) return;

            chatState.isOpen = !chatState.isOpen;

            if (chatState.isOpen) {
                modal.classList.remove('hidden', 'chat-exit');
                modal.classList.add('chat-enter');
                if (tooltip) tooltip.classList.add('opacity-0', 'pointer-events-none');
                setTimeout(function () {
                    var input = document.getElementById('chat-input-popup');
                    if (input) input.focus();
                }, 300);
                var msgContainer = document.getElementById('chat-messages-main');
                if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;
            } else {
                modal.classList.remove('chat-enter');
                modal.classList.add('chat-exit');
                modal.addEventListener('animationend', function () {
                    if (!chatState.isOpen) modal.classList.add('hidden');
                }, { once: true });
                if (tooltip) tooltip.classList.remove('opacity-0', 'pointer-events-none');
            }
        };

        window.sendPopupQuery = function (text) {
            if (chatState.loading || !text || !text.trim()) return;

            chatState.messages.push({ id: Date.now(), text: text, sender: 'user' });
            chatState.loading = true;
            updateInputState(true);
            renderChat();

            var inputPopup = document.getElementById('chat-input-popup');
            if (inputPopup) inputPopup.value = '';

            fetch(WEBHOOK_URL, {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, chatInput: text, sessionId: chatState.sessionId }),
            })
                .then(function (response) {
                    if (!response.ok) throw new Error('Network error');
                    return response.json();
                })
                .then(function (data) {
                    var botText = getBotTextFromResponse(data);
                    if (!botText || botText === "{}") throw new Error("Empty response");
                    chatState.messages.push({ id: Date.now(), text: botText, sender: 'bot' });
                    finishRequest();
                })
                .catch(function (error) {
                    setTimeout(function () {
                        chatState.messages.push({ id: Date.now(), text: getFallbackResponse(text), sender: 'bot' });
                        finishRequest();
                    }, 800);
                });
        };

        window.handlePopupSubmit = function (e) {
            e.preventDefault();
            var val = document.getElementById('chat-input-popup').value;
            sendPopupQuery(val);
        };

        window.closeModal = function () {
            var modal = document.getElementById('iframe-modal');
            var iframe = document.getElementById('content-iframe');
            if (modal) modal.classList.add('hidden');
            if (iframe) iframe.src = '';
        };

        window.openModal = function (url) {
            if (!url) return;
            var modal = document.getElementById('iframe-modal');
            var iframe = document.getElementById('content-iframe');
            if (!modal || !iframe) return;

            var freshUrl = url + (url.includes('?') ? '&' : '?') + 'v=' + new Date().getTime();
            iframe.src = freshUrl;
            modal.classList.remove('hidden');
            calculateModalLayout();
        };

        // --- Helpers ---

        function finishRequest() {
            chatState.loading = false;
            updateInputState(false);
            renderChat();
            updateQuotaDisplay();
            var inputPopup = document.getElementById('chat-input-popup');
            if (inputPopup && window.innerWidth > 768) inputPopup.focus();
        }

        function renderChat() {
            var el = document.getElementById('chat-messages-main');
            if (!el) return;
            el.innerHTML = '';

            for (var i = 0; i < chatState.messages.length; i++) {
                var msg = chatState.messages[i];
                var isUser = msg.sender === 'user';
                var wrapper = document.createElement('div');
                wrapper.className = isUser ? 'flex justify-end' : 'flex justify-start';

                var avatarHTML = isUser ? '' :
                    '<div class="nana-avatar-container flex items-center justify-center mr-2 flex-shrink-0">' +
                    '<img src="./assets/images/nana-icon.png" alt="N" class="w-full h-full object-cover" onerror="this.style.display=\'none\'"/>' +
                    '</div>';

                var contentHTML = isUser ? msg.text : parseMarkdown(msg.text);
                var bubbleClass = isUser ? 'nana-msg-bubble nana-msg-user' : 'nana-msg-bubble nana-msg-bot';

                wrapper.innerHTML = avatarHTML + '<div class="' + bubbleClass + '">' + contentHTML + '</div>';
                el.appendChild(wrapper);
            }

            if (chatState.loading) {
                var loadingDiv = document.createElement('div');
                loadingDiv.className = "flex justify-start";
                loadingDiv.innerHTML = '<div class="nana-avatar-container mr-2 bg-blue-100 border border-blue-200"></div><div class="nana-msg-bubble nana-msg-bot flex gap-1 items-center"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
                el.appendChild(loadingDiv);
            }

            setTimeout(function () { if (el) el.scrollTop = el.scrollHeight; }, 0);
        }

        function parseMarkdown(text) {
            if (typeof marked !== 'undefined') {
                var renderer = new marked.Renderer();
                renderer.link = function (href, title, text) {
                    if (String(href).includes('iframe=true')) {
                        return '<a href="javascript:void(0)" onclick="openModal(\'' + href + '\')" title="開啟視窗">' + text + '</a>';
                    }
                    return '<a href="' + href + '" target="_blank">' + text + '</a>';
                };
                try {
                    return marked.parse(text, { renderer: renderer });
                } catch (e) { return text; }
            }
            return text;
        }

        function getBotTextFromResponse(data) {
            if (typeof data === 'string') return data;
            return data.output || data.text || data.message || JSON.stringify(data);
        }

        function getFallbackResponse(text) {
            var randomPick = function (arr) {
                return arr[Math.floor(Math.random() * arr.length)];
            };

            if (!text) return "請告訴我更多細節。";

            if (text.indexOf("企業要如何發展AI") !== -1 || text.indexOf("發展AI") !== -1) {
                return randomPick([
                    "企業發展 AI 的關鍵在於「數據驅動」與「場景落地」。建議從盤點企業內部的數據資產開始，並選擇高重複性、高價值的流程進行 AI 試點。若需要專業評估，歡迎點擊 [進一步諮詢](#contact)。",
                    "發展 AI 需要三個要素：算力、演算法與數據。對於企業而言，最重要的是找到合適的應用場景，例如智慧客服、自動化報表等。鼎新能協助您快速佈署，詳情請參考 [進一步諮詢](#contact)。"
                ]);
            }
            if (text.indexOf("企業為何重視AI的資安") !== -1 || text.indexOf("資安") !== -1) {
                return randomPick([
                    "AI 雖然強大，但若將機密數據上傳至公有雲，可能面臨外洩風險。因此，企業級 AI 必須重視「私有化部署」與「權限控管」，確保數據不出門。想了解安全的 AI 方案，請點擊 [進一步諮詢](#contact)。",
                    "資安是 AI 應用的基石。未經保護的 AI 模型可能會被惡意攻擊或竊取知識。鼎新的方案特別強調企業數據的隔離與加密。更多細節歡迎 [進一步諮詢](#contact)。"
                ]);
            }
            if (text.indexOf("鼎新有哪些企業AI方案") !== -1 || text.indexOf("方案") !== -1) {
                return randomPick([
                    "鼎新提供全方位的企業 AI 方案，包括：\n1. **ChatFile**：企業知識助理，解決文件檢索難題。\n2. **AI 助理**：針對採購、生管等場景的專屬助理。\n3. **企業AI私有化**：一站式企業AI解決方案\n\n想深入了解哪一項呢？或直接 [進一步諮詢](#contact)。",
                    "我們針對不同階段的企業提供對應方案：\n- L1 數位化：ERP + 流程自動化\n- L2 智慧化：AI 助理協助庶務\n- L3/L4 數智驅動：P-Agent 決策中樞\n\n想知道您的企業適合哪個階段？歡迎 [進一步諮詢](#contact)。"
                ]);
            }
            if (text.indexOf("體驗") !== -1) {
                return "沒問題，這是一個我們 AI 助理的實際操作展示：[立即體驗](https://www.digiwin.com/tw/dsc/METIS/AIassist/Demo/Demo_B.html?iframe=true)";
            }

            return "感謝您的詢問！由於目前連線較為繁忙，我暫時無法連接到雲端大腦。\n\n不過，針對您的企業轉型需求，我們建議您可以先評估目前的數位化成熟度。若希望能有專人為您詳細規劃，歡迎點擊 [進一步諮詢](#contact) 留下您的聯絡方式。";
        }

        function updateInputState(isLoading) {
            var input = document.getElementById('chat-input-popup');
            var btn = document.querySelector('#chat-form-popup button[type="submit"]');
            if (input) {
                input.disabled = isLoading;
                input.placeholder = isLoading ? "娜娜正在思考中..." : "輸入您的訊息...";
            }
            if (btn) btn.disabled = isLoading;
        }

        function updateQuotaDisplay() {
            try {
                fetch(QUOTA_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId: chatState.sessionId })
                })
                    .then(function (res) { return res.json(); })
                    .then(function (data) {
                        var input = document.getElementById('chat-input-popup');
                        if (input) input.placeholder = '輸入您的訊息... (今日剩餘: ' + data.remaining + ')';
                    })
                    .catch(function (e) { });
            } catch (e) { }
        }

        function calculateModalLayout() {
            var container = document.getElementById('iframe-container');
            if (!container) return;
            var w = window.innerWidth;
            var h = window.innerHeight;
            var isMobile = w < 768 && h > w;
            var scale = Math.min((isMobile ? h : w) * 0.95 / 1440, (isMobile ? w : h) * 0.95 / 900);
            container.style.transform = 'translate(-50%, -50%) ' + (isMobile ? 'rotate(90deg)' : '') + ' scale(' + scale + ')';
        }

        // ========================================
        // 2. Create & Insert HTML
        // ========================================
        var htmlContent =
            '<div id="nana-plugin-root">' +
            // Iframe Modal
            '<div id="iframe-modal" class="nana-modal-overlay hidden">' +
            '<div class="nana-modal-backdrop" onclick="closeModal()"></div>' +
            '<button onclick="closeModal()" class="nana-modal-close-btn">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>' +
            '</button>' +
            '<div id="iframe-container" class="nana-iframe-container" style="width: 1440px; height: 900px;">' +
            '<iframe id="content-iframe" src="" class="nana-iframe" title="Preview" sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"></iframe>' +
            '</div>' +
            '</div>' +

            // Chat Window
            '<div id="nana-chat-modal" class="nana-chat-window hidden">' +
            '<div class="nana-chat-header">' +
            '<div class="nana-header-content w-full flex items-center gap-3">' +
            '<div class="relative">' +
            '<div class="nana-avatar-container">' +
            '<img src="./assets/images/nana-icon.png" alt="Nana" class="w-full h-full object-cover" onerror="this.src=\'https://via.placeholder.com/40?text=Nana\'" />' +
            '</div>' +
            '<span class="nana-status-dot"></span>' +
            '</div>' +
            '<div class="flex flex-col justify-center">' +
            '<h3 class="nana-header-title font-bold text-white text-base" style="margin: 0; line-height: 1.2;">顧問娜娜</h3>' +
            '<p class="nana-header-subtitle text-blue-100 text-xs" style="margin: 0; line-height: 1.2;">企業 AI 解決方案專家</p>' +
            '</div>' +
            '</div>' +
            '<button onclick="toggleChat()" class="nana-header-close-btn">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"></path></svg>' +
            '</button>' +
            '</div>' +

            '<div id="chat-messages-main" class="nana-messages-area no-scrollbar"></div>' +

            '<div class="nana-suggestions-area no-scrollbar">' +
            '<button onclick="sendPopupQuery(\'企業要如何發展AI\')" class="nana-suggestion-btn">企業AI</button>' +
            '<button onclick="sendPopupQuery(\'企業為何重視AI的資安\')" class="nana-suggestion-btn">企業資安</button>' +
            '<button onclick="sendPopupQuery(\'鼎新有哪些企業AI方案\')" class="nana-suggestion-btn">鼎新方案</button>' +
            '<button onclick="sendPopupQuery(\'體驗企業AI助理\')" class="nana-suggestion-btn cyan">體驗企業助理</button>' +
            '</div>' +

            '<form id="chat-form-popup" onsubmit="handlePopupSubmit(event)" class="nana-input-area">' +
            '<div class="nana-input-wrapper">' +
            '<input type="text" id="chat-input-popup" placeholder="輸入您的訊息..." class="nana-input-field" />' +
            '<button type="submit" class="nana-send-btn">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>' +
            '</button>' +
            '</div>' +
            '</form>' +
            '</div>' +

            // Floating Button
            '<div id="floating-chat-btn" class="nana-floating-container">' +
            '<div id="nana-tooltip" class="nana-tooltip bubble-pulse" onclick="toggleChat()">' +
            '有問題可以問娜娜唷！' +
            '<div class="nana-tooltip-arrow"></div>' +
            '</div>' +
            '<button onclick="toggleChat()" class="nana-float-btn">' +
            '<img src="./assets/images/nana-animation.gif" alt="Nana" onerror="this.src=\'https://via.placeholder.com/64?text=Nana\'" />' +
            '<span class="nana-ping-container">' +
            '<span class="nana-ping-wave"></span>' +
            '<span class="nana-ping-dot"></span>' +
            '</span>' +
            '</button>' +
            '</div>' +
            '</div>';

        // Check if already injected
        if (!document.getElementById('nana-plugin-root')) {
            var targetElement = document.body || document.documentElement;
            targetElement.insertAdjacentHTML('beforeend', htmlContent);
        }

        // Init
        window.addEventListener('resize', calculateModalLayout);
        renderChat();
        updateQuotaDisplay();
    }

    // Initialize (handle different loading states)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNanaChat);
    } else {
        initNanaChat();
    }

})();
