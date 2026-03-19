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
        line-height: 1.5;
        color: #334155;
        /* 不設 position/z-index，讓子元素自己 fixed 定位，避免干擾父層 */
        pointer-events: none;
    }

    #nana-plugin-root * {
        box-sizing: border-box;
    }

    /* --- Iframe Modal (全螢幕彈窗) --- */
    .nana-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(12px);
        z-index: 9800;
        display: none;
        pointer-events: auto;
    }

    .nana-modal-overlay.active {
        display: block;
    }

    .nana-modal-close-btn {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 100000;
        padding: 8px;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        color: white;
        cursor: pointer;
        transition: all 0.2s;
    }

    .nana-modal-close-btn:hover {
        color: #22d3ee;
        background: rgba(0, 0, 0, 0.7);
    }

    .nana-iframe-wrapper {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 1440px;
        height: 900px;
        border-radius: 12px;
        background: transparent;
        overflow: hidden;
        transform-origin: center;
        transition: transform 0.3s;
    }

    .nana-iframe-wrapper iframe {
        width: 100%;
        height: 100%;
        border: 0;
    }

    /* --- Chat Box (聊天視窗) --- */
    .nana-chat-box {
        position: fixed;
        bottom: 100px;
        right: 24px;
        width: 384px;
        height: 600px;
        max-width: calc(100vw - 3rem);
        max-height: calc(100vh - 8rem);
        background: white;
        border-radius: 16px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        border: 1px solid #e2e8f0;
        z-index: 99990;
        display: none; /* 原本是 flex 但預設隱藏 */
        flex-direction: column;
        overflow: hidden;
        transform-origin: bottom right;
        pointer-events: auto; /* 恢復點擊 */
    }

    /* 顯示狀態由 JS 控制 class */
    .nana-chat-box.active {
        display: flex;
    }

    /* Header */
    .nana-chat-header {
        background: linear-gradient(to right, #2563eb, #4f46e5);
        /* blue-600 to indigo-600 */
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
    }

    .nana-avatar-wrap {
        position: relative;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: white;
        padding: 2px;
        border: 1px solid #bfdbfe;
        overflow: hidden;
    }

    .nana-avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
    }

    .nana-status-dot {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 10px;
        height: 10px;
        background: #4ade80;
        border: 2px solid white;
        border-radius: 50%;
    }

    .nana-header-info {
        margin-left: 12px;
    }

    .nana-header-title {
        font-weight: bold;
        color: white;
        font-size: 16px;
        margin: 0;
    }

    .nana-header-desc {
        color: #dbeafe;
        font-size: 12px;
        margin: 0;
    }

    /* Messages Area */
    .nana-messages-area {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        background-color: #f8fafc;
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    /* Message Bubbles */
    .msg-row {
        display: flex;
        width: 100%;
    }

    .msg-row.bot {
        justify-content: flex-start;
    }

    .msg-row.user {
        justify-content: flex-end;
    }

    .msg-bubble {
        max-width: 85%;
        padding: 12px;
        border-radius: 16px;
        font-size: 14px;
        line-height: 1.6;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .msg-bubble.bot {
        background: white;
        color: #334155;
        border: 1px solid #e2e8f0;
        border-bottom-left-radius: 0;
    }

    .msg-bubble.user {
        background: #2563eb;
        color: white;
        border-bottom-right-radius: 0;
    }

    /* 確保 markdown 內的連結顏色正確 */
    .msg-bubble.user a {
        color: #e0f2fe;
        text-decoration: underline;
    }

    .msg-bubble.bot a {
        color: #2563eb;
        text-decoration: underline;
    }

    /* Suggestions */
    .nana-suggestions {
        padding: 8px 16px;
        background: #f8fafc;
        border-top: 1px solid #f1f5f9;
        overflow-x: auto;
        display: flex;
        gap: 8px;
        flex-shrink: 0;
    }

    .suggestion-btn {
        white-space: nowrap;
        padding: 4px 12px;
        background: white;
        border: 1px solid #e2e8f0;
        color: #475569;
        border-radius: 9999px;
        font-size: 12px;
        cursor: pointer;
        transition: 0.2s;
    }

    .suggestion-btn:hover {
        background: #f1f5f9;
    }

    /* Input Area */
    .nana-input-area {
        padding: 16px;
        background: white;
        border-top: 1px solid #f1f5f9;
        flex-shrink: 0;
    }

    .nana-input-group {
        display: flex;
        gap: 8px;
    }

    .nana-input {
        flex: 1;
        padding: 8px 16px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        font-size: 14px;
        outline: none;
    }

    .nana-input:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    }

    .nana-send-btn {
        width: 40px;
        height: 40px;
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: 0.2s;
    }

    .nana-send-btn:hover {
        background: #1d4ed8;
    }

    .nana-send-btn:disabled {
        background: #94a3b8;
        cursor: not-allowed;
    }

    /* --- Floating Button (懸浮按鈕) --- */
    .nana-float-wrapper {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 99980;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 8px;
        pointer-events: auto; /* 恢復點擊 */
    }

    .nana-tooltip {
        background: #1e293b;
        color: white;
        padding: 8px 16px;
        border-radius: 12px;
        font-size: 14px;
        margin-bottom: 4px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        position: relative;
        cursor: pointer;
    }

    .nana-tooltip::after {
        content: '';
        position: absolute;
        bottom: -6px;
        right: 24px;
        width: 12px;
        height: 12px;
        background: #1e293b;
        transform: rotate(45deg);
    }

    .nana-float-btn {
        position: relative;
        width: 64px;
        height: 64px;
        border: none;
        background: transparent;
        padding: 0;
        cursor: pointer;
        transition: transform 0.3s;
    }

    .nana-float-btn:hover {
        transform: scale(1.1);
    }

    .nana-float-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    /* --- Animations --- */
    .chat-enter {
        animation: chatSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .chat-exit {
        animation: chatSlideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes chatSlideUp {
        from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
        }

        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    @keyframes chatSlideDown {
        from {
            opacity: 1;
            transform: translateY(0) scale(1);
        }

        to {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
        }
    }

    .typing-dot {
        width: 6px;
        height: 6px;
        background-color: #94a3b8;
        border-radius: 50%;
        animation: typing 1.4s infinite ease-in-out both;
        margin: 0 2px;
    }

    .typing-dot:nth-child(1) {
        animation-delay: -0.32s;
    }

    .typing-dot:nth-child(2) {
        animation-delay: -0.16s;
    }

    @keyframes typing {

        0%,
        80%,
        100% {
            transform: scale(0);
        }

        40% {
            transform: scale(1);
        }
    }

    .bubble-pulse {
        animation: bubblePulse 2s infinite;
    }

    @keyframes bubblePulse {
        0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
        }

        70% {
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
        }

        100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
        }
    }

    .hidden {
        display: none !important;
    }
    `;
    document.head.appendChild(style);

    // ========================================
    // 1. Logic & State
    // ========================================

    // 等待 DOM 準備好
    function initNanaChat() {
        var WEBHOOK_URL = "https://digiwin.marketing/ai-solution-agent";
        var QUOTA_URL = "https://digiwin.marketing/ai-quota-check";
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

        // Global Functions
        window.nanaToggleChat = function () {
            var modal = document.getElementById('nana-chat-modal');
            var tooltip = document.getElementById('nana-tooltip');
            if (!modal) return;

            chatState.isOpen = !chatState.isOpen;

            if (chatState.isOpen) {
                modal.classList.remove('hidden'); // 移除隱藏
                modal.classList.remove('chat-exit');
                modal.classList.add('active'); // 增加 active 來顯示 (flex)
                modal.classList.add('chat-enter');
                if (tooltip) tooltip.style.opacity = '0';
                setTimeout(function () {
                    var input = document.getElementById('chat-input-popup');
                    if (input) input.focus();
                }, 300);
                var msgContainer = document.getElementById('chat-messages-main');
                if (msgContainer) msgContainer.scrollTop = msgContainer.scrollHeight;
            } else {
                modal.classList.remove('chat-enter');
                modal.classList.add('chat-exit');
                // 動畫結束後隱藏
                setTimeout(function () {
                    if (!chatState.isOpen) {
                        modal.classList.remove('active');
                        modal.classList.add('hidden');
                        if (tooltip) tooltip.style.opacity = '1';
                    }
                }, 300);
            }
        };

        window.nanaSendPopupQuery = function (text) {
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
                body: JSON.stringify({ message: text, sessionId: chatState.sessionId, pageUrl: window.location.href }),
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

        window.nanaHandlePopupSubmit = function (e) {
            e.preventDefault();
            var val = document.getElementById('chat-input-popup').value;
            nanaSendPopupQuery(val);
        };

        window.nanaCloseModal = function () {
            var modal = document.getElementById('nana-iframe-modal');
            var iframe = document.getElementById('nana-content-iframe');
            if (modal) modal.classList.remove('active');
            if (iframe) iframe.src = '';
        };

        window.nanaOpenModal = function (url) {
            if (!url) return;
            var modal = document.getElementById('nana-iframe-modal');
            var iframe = document.getElementById('nana-content-iframe');
            if (!modal || !iframe) return;

            var separator = url.indexOf('?') !== -1 ? '&' : '?';
            var freshUrl = url + separator + 'v=' + new Date().getTime();
            iframe.src = freshUrl;
            modal.classList.add('active'); // 使用 CSS class 控制顯示
            nanaCalculateModalLayout();
        };

        window.addEventListener('message', function (event) {
            if (event.data === 'scrollToContact') {
                window.nanaCloseModal();
                setTimeout(function () { scrollToId('contact'); }, 100);
            }
        });

        // Helper Functions
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

                // 建立外層容器
                var wrapper = document.createElement('div');
                wrapper.className = isUser ? 'msg-row user' : 'msg-row bot'; // 對應您的原生 CSS class

                // 建立頭像 (僅機器人有)
                if (!isUser) {
                    var avatarDiv = document.createElement('div');
                    avatarDiv.className = 'nana-avatar-wrap';
                    avatarDiv.innerHTML = '<img src="https://event.digiwin.com/hubfs/%E5%A8%9C%E5%A8%9C%E5%B9%AB%E6%88%91/%E5%A8%9C%E5%A8%9C%E5%B9%AB%E6%88%91%2BMETIS-1.png" class="nana-avatar-img"/>';
                    wrapper.appendChild(avatarDiv);
                }

                // 建立訊息氣泡
                var bubble = document.createElement('div');
                bubble.className = isUser ? 'msg-bubble user' : 'msg-bubble bot';

                // ★★★ 安全性修正核心 ★★★
                if (isUser) {
                    // 使用者訊息：使用 textContent (防止 HTML 注入/XSS)
                    bubble.textContent = msg.text;
                } else {
                    // 機器人訊息：使用 innerHTML (因為需要 Markdown)
                    bubble.innerHTML = parseMarkdown(msg.text);
                }

                wrapper.appendChild(bubble);
                el.appendChild(wrapper);
            }
            if (chatState.loading) {
                var loadingDiv = document.createElement('div');
                loadingDiv.className = "msg-row bot";
                loadingDiv.innerHTML = '<div class="nana-avatar-wrap" style="margin-right:8px; border:none; padding:0;"></div><div class="msg-bubble bot" style="display:flex; gap:4px; align-items:center;"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
                el.appendChild(loadingDiv);
            }

            setTimeout(function () { if (el) el.scrollTop = el.scrollHeight; }, 0);
        }

        function scrollToId(id) {
            var el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }

        function parseMarkdown(text) {
            if (!text) return '';
            var processed = text;

            // 1. Placeholder protection for existing links to avoid double-linking
            var placeholders = [];
            processed = processed.replace(/(\[[^\]]*\]\([^)]*\)|href=["'][^"']*["'])/g, function (match) {
                placeholders.push(match);
                return '__PLACEHOLDER_' + (placeholders.length - 1) + '__';
            });

            // 2. Auto-link raw URLs
            processed = processed.replace(/(https?:\/\/[^\s"']+)/g, function (url) {
                return '[查看更多](' + url + ')';
            });

            // 3. Restore placeholders
            processed = processed.replace(/__PLACEHOLDER_(\d+)__/g, function (match, index) {
                return placeholders[index];
            });

            // 4. Keyword linking
            processed = processed.replace(/\[(進一步諮詢|與我們聯繫|向我們諮詢)\](?!\()/g, '[$1](#contact)');

            if (typeof marked !== 'undefined') {
                var renderer = new marked.Renderer();
                renderer.link = function (href, title, text) {
                    var safeHref = String(href || '');
                    var isIframe = safeHref.indexOf('iframe=true') !== -1;

                    // Note: Classes are handled by CSS (.msg-bubble.bot a)
                    if (isIframe) {
                        return '<a href="' + safeHref + '" onclick="event.preventDefault(); window.nanaOpenModal(\'' + safeHref + '\')" title="在視窗中開啟">' + text + '</a>';
                    }
                    if (safeHref.indexOf('#') === 0) {
                        var targetId = safeHref.substring(1);
                        return '<a href="' + safeHref + '" onclick="event.preventDefault(); scrollToId(\'' + targetId + '\')">' + text + '</a>';
                    }
                    return '<a href="' + safeHref + '" target="_blank" rel="noopener noreferrer">' + text + '</a>';
                };

                try {
                    return marked.parse(processed, { renderer: renderer });
                } catch (e) {
                    return text;
                }
            }
            return processed;
        }

        function getBotTextFromResponse(data) {
            if (typeof data === 'string') return data;
            return data.output || data.text || data.message || JSON.stringify(data);
        }

        function getFallbackResponse(text) {
            return "感謝您的詢問！由於目前連線較為繁忙，請稍後再試或直接聯繫我們。";
        }

        function updateInputState(isLoading) {
            var input = document.getElementById('chat-input-popup');
            var btn = document.querySelector('.nana-send-btn');
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

        function nanaCalculateModalLayout() {
            var container = document.getElementById('nana-iframe-container');
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
        // HTML Construction (Using simple classes now)
        var htmlContent =
            '<div id="nana-plugin-root">' +
            // Modal Overlay
            '<div id="nana-iframe-modal" class="nana-modal-overlay">' +
            '<div class="absolute inset-0" onclick="window.nanaCloseModal()"></div>' +
            '<button onclick="window.nanaCloseModal()" class="nana-modal-close-btn">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>' +
            '</button>' +
            '<div id="nana-iframe-container" class="nana-iframe-wrapper">' +
            '<iframe id="nana-content-iframe" src="" title="Preview"></iframe>' +
            '</div>' +
            '</div>' +

            // Chat Box
            '<div id="nana-chat-modal" class="nana-chat-box hidden">' +
            // Header
            '<div class="nana-chat-header">' +
            '<div class="flex items-center" style="display:flex; align-items:center;">' +
            '<div class="nana-avatar-wrap">' +
            '<img src="https://event.digiwin.com/hubfs/%E5%A8%9C%E5%A8%9C%E5%B9%AB%E6%88%91/%E5%A8%9C%E5%A8%9C%E5%B9%AB%E6%88%91%2BMETIS-1.png" class="nana-avatar-img" />' +
            '<span class="nana-status-dot"></span>' +
            '</div>' +
            '<div class="nana-header-info">' +
            '<h3 class="nana-header-title">顧問娜娜</h3>' +
            '<p class="nana-header-desc">企業 AI 解決方案專家</p>' +
            '</div>' +
            '</div>' +
            '<button onclick="window.nanaToggleChat()" style="background:transparent; border:none; color:white; cursor:pointer;">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>' +
            '</button>' +
            '</div>' +

            // Messages
            '<div id="chat-messages-main" class="nana-messages-area"></div>' +

            // Suggestions
            '<div class="nana-suggestions">' +
            '<button onclick="window.nanaSendPopupQuery(\'企業要如何發展AI\')" class="suggestion-btn">企業AI</button>' +
            '<button onclick="window.nanaSendPopupQuery(\'企業為何重視AI的資安\')" class="suggestion-btn">企業資安</button>' +
            '<button onclick="window.nanaSendPopupQuery(\'鼎新有哪些企業AI方案\')" class="suggestion-btn">鼎新方案</button>' +
            '<button onclick="window.nanaSendPopupQuery(\'體驗企業AI助理\')" class="suggestion-btn" style="background:#ecfeff; color:#0891b2; border-color:#a5f3fc;">體驗企業助理</button>' +
            '</div>' +

            // Input
            '<form id="chat-form-popup" onsubmit="window.nanaHandlePopupSubmit(event)" class="nana-input-area">' +
            '<div class="nana-input-group">' +
            '<input type="text" id="chat-input-popup" placeholder="輸入您的訊息..." class="nana-input" />' +
            '<button type="submit" class="nana-send-btn">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>' +
            '</button>' +
            '</div>' +
            '</form>' +

            // AI Disclaimer
            '<div style="padding: 0 16px 8px; background: white; text-align: center; flex-shrink: 0;">' +
            '<p style="font-size: 12px; color: #94a3b8; margin: 0;">由AI生成的內容可能出錯，僅供參考。</p>' +
            '</div>' +
            '</div>' +

            // Floating Button
            '<div id="floating-chat-btn" class="nana-float-wrapper">' +
            '<div id="nana-tooltip" class="nana-tooltip" onclick="window.nanaToggleChat()">' +
            '有問題可以問娜娜唷！' +
            '</div>' +
            '<button onclick="window.nanaToggleChat()" class="nana-float-btn">' +
            '<img src="https://event.digiwin.com/hubfs/%E5%A8%9C%E5%A8%9C%E5%B9%AB%E6%88%91/%E5%8B%95%E6%85%8B%E5%A8%9C%E5%A8%9C.gif" class="nana-float-img" />' +
            '</button>' +
            '</div>' +
            '</div>';

        var targetElement = document.body || document.getElementsByTagName('body')[0] || document.documentElement;
        targetElement.insertAdjacentHTML('beforeend', htmlContent);

        window.addEventListener('resize', nanaCalculateModalLayout);
        renderChat();
        updateQuotaDisplay();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNanaChat);
    } else {
        initNanaChat();
    }
})();