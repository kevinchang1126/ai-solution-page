// --- Roadmap Switching Logic ---
function switchRoadmap(index) {
    // 1. Reset all tabs to inactive state
    for (let i = 1; i <= 3; i++) {
        const tab = document.getElementById(`tab-${i}`);
        if (tab) {
            const inactive = tab.querySelector('.inactive-state');
            const activeWrapper = tab.querySelector('.active-state-wrapper');

            if (inactive && activeWrapper) {
                inactive.classList.remove('hidden');
                activeWrapper.classList.remove('active');
            }
        }
        const diagram = document.getElementById(`diagram-${i}`);
        if (diagram) {
            diagram.classList.add('hidden');
        }
    }

    // 2. Set selected tab to active state
    const selectedTab = document.getElementById(`tab-${index}`);
    if (selectedTab) {
        const inactive = selectedTab.querySelector('.inactive-state');
        const activeWrapper = selectedTab.querySelector('.active-state-wrapper');

        if (inactive && activeWrapper) {
            inactive.classList.add('hidden');
            activeWrapper.classList.add('active');
        }
    }

    // 3. Show corresponding diagram with delay for fade in
    const selectedDiagram = document.getElementById(`diagram-${index}`);
    if (selectedDiagram) {
        selectedDiagram.classList.remove('hidden');
        // Trigger reflow to restart animation if needed, though 'hidden' toggle resets it usually
        selectedDiagram.style.animation = 'none';
        selectedDiagram.offsetHeight; /* trigger reflow */
        selectedDiagram.style.animation = null;
    }
}

function getPersistentSessionId() {
    const STORAGE_KEY = 'digiwin_ai_user_uid'; // 定義儲存的 key
    let uid = localStorage.getItem(STORAGE_KEY);
    if (!uid) {
        uid = 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
        localStorage.setItem(STORAGE_KEY, uid);
    }
    return uid;
}

// 狀態變數
const chatState = {
    messages: [{ id: 1, text: '嗨，我是娜娜！想了解企業運用 AI 的方法嗎？歡迎提出你對企業 AI 想了解的問題！', sender: 'bot' }],
    loading: false,
    sessionId: getPersistentSessionId()
};
// 更新 UI 上的額度顯示
async function updateQuotaDisplay() {
    const input = document.getElementById('chat-input-main');
    if (!input) return;

    try {
        const response = await fetch(QUOTA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId: chatState.sessionId
            })
        });

        if (response.ok) {
            const data = await response.json();
            const remaining = data.remaining;
            // ✅ 更新 Placeholder
            input.placeholder = `輸入您的訊息... (今日剩餘額度: ${remaining}/20)`;

            // 如果沒額度了，直接鎖定輸入框
            if (remaining <= 0) {
                input.disabled = true;
                input.placeholder = "今日額度已用完";
                const btn = document.querySelector('#chat-form-main button[type="submit"]');
                if (btn) btn.disabled = true;
            }
        }
    } catch (e) {
        console.error("無法取得額度", e);
    }
}

// --- 聊天邏輯 ---
const WEBHOOK_URL = "https://n8n-gateway.zeabur.app/ai-solution-agent";
const QUOTA_URL = "https://n8n-gateway.zeabur.app/ai-quota-check";
function getFallbackResponse(text) {
    const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    if (!text) return "請告訴我更多細節。";

    if (text.includes("企業要如何發展AI") || text.includes("發展AI")) {
        return randomPick([
            "企業發展 AI 的關鍵在於「數據驅動」與「場景落地」。建議從盤點企業內部的數據資產開始，並選擇高重複性、高價值的流程進行 AI 試點。若需要專業評估，歡迎點擊 [進一步諮詢](#contact)。",
            "發展 AI 需要三個要素：算力、演算法與數據。對於企業而言，最重要的是找到合適的應用場景，例如智慧客服、自動化報表等。鼎新能協助您快速佈署，詳情請參考 [進一步諮詢](#contact)。"
        ]);
    }
    if (text.includes("企業為何重視AI的資安") || text.includes("資安")) {
        return randomPick([
            "AI 雖然強大，但若將機密數據上傳至公有雲，可能面臨外洩風險。因此，企業級 AI 必須重視「私有化部署」與「權限控管」，確保數據不出門。想了解安全的 AI 方案，請點擊 [進一步諮詢](#contact)。",
            "資安是 AI 應用的基石。未經保護的 AI 模型可能會被惡意攻擊或竊取知識。鼎新的方案特別強調企業數據的隔離與加密。更多細節歡迎 [進一步諮詢](#contact)。"
        ]);
    }
    if (text.includes("鼎新有哪些企業AI方案") || text.includes("方案")) {
        return randomPick([
            "鼎新提供全方位的企業 AI 方案，包括：\n1. **ChatFile**：企業知識助理，解決文件檢索難題。\n2. **AI 助理**：針對採購、生管等場景的專屬助理。\n3. **企業AI私有化**：一站式企業AI解決方案\n\n想深入了解哪一項呢？或直接 [進一步諮詢](#contact)。",
            "我們針對不同階段的企業提供對應方案：\n- L1 數位化：ERP + 流程自動化\n- L2 智慧化：AI 助理協助庶務\n- L3/L4 數智驅動：P-Agent 決策中樞\n\n想知道您的企業適合哪個階段？歡迎 [進一步諮詢](#contact)。"
        ]);
    }
    if (text.includes("體驗")) {
        return "沒問題，這是一個我們 AI 助理的實際操作展示：[立即體驗](https://www.digiwin.com/tw/dsc/METIS/AIassist/Demo/Demo_B.html?iframe=true)";
    }

    return "感謝您的詢問！由於目前連線較為繁忙，我暫時無法連接到雲端大腦。\n\n不過，針對您的企業轉型需求，我們建議您可以先評估目前的數位化成熟度。若希望能有專人為您詳細規劃，歡迎點擊 [進一步諮詢](#contact) 留下您的聯絡方式。";
}

// 渲染聊天訊息
function renderChat() {
    const el = document.getElementById('chat-messages-main');
    if (!el) return;

    el.innerHTML = '';

    chatState.messages.forEach(msg => {
        const isUser = msg.sender === 'user';
        const wrapper = document.createElement('div');
        wrapper.className = `flex ${isUser ? 'justify-end' : 'justify-start'}`;

        let avatarHTML = '';
        if (!isUser) {
            avatarHTML = `
            <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 flex-shrink-0 border border-blue-200 overflow-hidden">
               <img src="https://event.digiwin.com/hubfs/%E5%A8%9C%E5%A8%9CQ%E5%9C%96_%E7%84%A1%E5%BA%95%E5%9C%96.png" alt="Nana" class="w-full h-full object-cover bg-indigo-50" />
            </div>`;
        }

        let contentHTML = msg.text;
        if (!isUser) {
            contentHTML = parseMarkdown(contentHTML);
        }

        wrapper.innerHTML = `
            ${avatarHTML}
            <div class="max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm prose-lite ${isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none bot-msg'}">
                ${contentHTML}
            </div>
        `;
        el.appendChild(wrapper);
    });

    if (chatState.loading) {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = "flex justify-start";
        loadingDiv.innerHTML = `
            <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 border border-blue-200 overflow-hidden">
                 <img src="https://event.digiwin.com/hubfs/%E5%A8%9C%E5%A8%9CQ%E5%9C%96_%E7%84%A1%E5%BA%95%E5%9C%96.png" class="w-full h-full object-cover bg-indigo-50" />
            </div>
            <div class="bg-white p-4 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm flex gap-1 items-center">
                <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
            </div>
         `;
        el.appendChild(loadingDiv);
    }

    requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
    });
}

// Markdown 解析
function parseMarkdown(text) {
    if (!text) return '';
    let processed = text;

    const placeholders = [];
    processed = processed.replace(/(\[[^\]]*\]\([^)]*\)|href=["'][^"']*["'])/g, (match) => {
        placeholders.push(match);
        return `__PLACEHOLDER_${placeholders.length - 1}__`;
    });

    processed = processed.replace(/(https?:\/\/[^\s"']+)/g, (url) => `[查看更多](${url})`);
    processed = processed.replace(/__PLACEHOLDER_(\d+)__/g, (_, index) => placeholders[index]);
    processed = processed.replace(/\[(進一步諮詢|與我們聯繫|向我們諮詢)\](?!\()/g, `[$1](#contact)`);

    if (typeof marked !== 'undefined') {
        const renderer = new marked.Renderer();
        renderer.link = (href, title, text) => {
            const safeHref = String(href || '');
            const isIframe = safeHref.includes('iframe=true');

            if (isIframe) {
                return `<a href="${safeHref}" data-iframe="true" onclick="event.preventDefault(); openModal('${safeHref}')" title="在視窗中開啟">${text}</a>`;
            }
            if (safeHref.startsWith('#')) {
                const targetId = safeHref.substring(1);
                return `<a href="${safeHref}" onclick="event.preventDefault(); scrollToId('${targetId}')">${text}</a>`;
            }
            return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${text}</a>`;
        };
        try {
            return marked.parse(processed, { renderer });
        } catch (e) {
            return text;
        }
    }
    return processed;
}

// 鎖定/解鎖 UI 狀態
function updateInputState(isLoading) {
    const input = document.getElementById('chat-input-main');
    const btn = document.querySelector('#chat-form-main button[type="submit"]');
    const suggestions = document.querySelectorAll('.suggestion-btn');

    if (input) {
        input.disabled = isLoading;
        input.placeholder = isLoading ? "娜娜正在思考中..." : "輸入您的訊息...";
    }
    if (btn) {
        btn.disabled = isLoading;
    }

    suggestions.forEach(s => {
        s.disabled = isLoading;
    });
}

// 發送訊息
async function sendQuery(text) {
    // 防止重複送出
    if (chatState.loading) return;
    if (!text || !text.trim()) return;

    chatState.messages.push({ id: Date.now(), text: text, sender: 'user' });
    chatState.loading = true;

    // 立即更新 UI 為鎖定狀態
    updateInputState(true);
    renderChat();

    const inputMain = document.getElementById('chat-input-main');
    if (inputMain) inputMain.value = '';

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, chatInput: text, sessionId: chatState.sessionId }),
        });

        if (!response.ok) {
            if (response.status === 404) {
                console.error('Webhook not found (404). Please ensure the N8N workflow is Active.');
            }
            throw new Error(`Network error: ${response.status}`);
        }

        const data = await response.json();

        let botText = "";
        if (typeof data === 'string') {
            botText = data;
        } else if (data.output) {
            botText = data.output;
        } else if (data.text) {
            botText = data.text;
        } else if (data.message) {
            botText = data.message;
        } else if (data.answer) {
            botText = data.answer;
        } else if (Array.isArray(data) && data.length > 0) {
            if (data[0].output) botText = data[0].output;
            else if (data[0].text) botText = data[0].text;
            else botText = JSON.stringify(data);
        } else {
            botText = JSON.stringify(data);
        }

        if (!botText || botText === "{}") throw new Error("Empty response content");

        chatState.messages.push({ id: Date.now(), text: botText, sender: 'bot' });

    } catch (error) {
        console.log("Webhook failed, using fallback", error);
        await new Promise(r => setTimeout(r, 800));
        const fallback = getFallbackResponse(text);
        chatState.messages.push({ id: Date.now(), text: fallback, sender: 'bot' });
    } finally {
        chatState.loading = false;
        updateInputState(false);
        renderChat();
        updateQuotaDisplay();

        if (inputMain && window.innerWidth > 768) {
            inputMain.focus();
        }
    }
}

function handleChatSubmit(e) {
    e.preventDefault();
    const val = document.getElementById('chat-input-main').value;
    sendQuery(val);
}

// --- 滾動控制 ---
function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) {
        const headerOffset = 60;
        const elementPosition = el.getBoundingClientRect().top;
        const startPosition = window.pageYOffset || document.documentElement.scrollTop;
        const offsetPosition = elementPosition + startPosition - headerOffset;

        // [修改說明] 自定義動畫配置：設定 800ms 的滾動時間與 easeOutCubic 緩動效果
        const duration = 800; // ms
        const startTime = performance.now();

        function scrollAnimation(currentTime) {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);

            // [修改說明] 使用 easeOutCubic 算法計算當前位置，創造由快變慢的滑動感
            const ease = 1 - Math.pow(1 - progress, 3);

            window.scrollTo(0, startPosition + (offsetPosition - startPosition) * ease);

            if (timeElapsed < duration) {
                requestAnimationFrame(scrollAnimation);
            }
        }

        requestAnimationFrame(scrollAnimation);
    }
    const menu = document.getElementById('mobile-menu');
    if (menu && !menu.classList.contains('hidden')) menu.classList.add('hidden');
}

function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

// Intersection Observer (Floating Visibility)
document.addEventListener("DOMContentLoaded", function () {
    const chatForm = document.getElementById('chat-form-main');
    if (chatForm) {
        chatForm.addEventListener('submit', handleChatSubmit);
    }

    const observer = new IntersectionObserver(([entry]) => {
        const floatContainer = document.getElementById('floating-chat-container');
        if (!entry.isIntersecting) {
            floatContainer.classList.remove('hidden');
        } else {
            floatContainer.classList.add('hidden');
        }
    }, { threshold: 0.1 });

    const target = document.getElementById('solutions');
    if (target) observer.observe(target);

    renderChat();
    updateQuotaDisplay();
});

// --- Modal Logic ---
let currentScale = 1;
let isPortraitMode = false;

function openModal(url) {
    if (!url || typeof url !== 'string') return;

    const modal = document.getElementById('iframe-modal');
    const iframe = document.getElementById('content-iframe');

    const separator = url.includes('?') ? '&' : '?';
    const timestamp = new Date().getTime();
    const freshUrl = `${url}${separator}v=${timestamp}`;

    iframe.src = freshUrl;
    modal.classList.remove('hidden');

    calculateModalLayout();
    window.addEventListener('resize', calculateModalLayout);
}

function closeModal() {
    const modal = document.getElementById('iframe-modal');
    const iframe = document.getElementById('content-iframe');
    modal.classList.add('hidden');
    iframe.src = '';
    window.removeEventListener('resize', calculateModalLayout);
}

function calculateModalLayout() {
    const container = document.getElementById('iframe-container');
    if (!container) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const isMobile = w < 768 && h > w;
    isPortraitMode = isMobile;

    const baseWidth = 1440;
    const baseHeight = 900;
    const availableW = isMobile ? h : w;
    const availableH = isMobile ? w : h;

    const scaleW = (availableW * 0.95) / baseWidth;
    const scaleH = (availableH * 0.95) / baseHeight;

    currentScale = Math.min(scaleW, scaleH);

    container.style.transform = `translate(-50%, -50%) ${isPortraitMode ? 'rotate(90deg)' : ''} scale(${currentScale})`;
}

window.addEventListener('message', (event) => {
    if (event.data === 'scrollToContact') {
        closeModal();
        setTimeout(() => {
            scrollToId('contact');
        }, 100);
    }
});

// --- Particle Animation ---
(function () {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let width, height, particlesArray;
    let mouse = { x: undefined, y: undefined, radius: 250 };
    // [新增] 追蹤當前被吸附的粒子數量
    let attractedCount = 0;

    window.addEventListener('mousemove', function (e) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    window.addEventListener('mouseout', function () { mouse.x = undefined; mouse.y = undefined; });

    class Particle {
        constructor(x, y, size, color) {
            this.x = x; this.y = y; this.size = size; this.color = color;
            this.baseX = x; this.baseY = y;
            this.density = (Math.random() * 30) + 1;
            this.phase = Math.random() * Math.PI * 2;
        }
        draw() {
            let scale = 1 + Math.sin(Date.now() * 0.003 + this.phase) * 0.2;
            ctx.beginPath();
            // [修改] 增加 shadowBlur 提升亮度與可見度
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.color;
            ctx.arc(this.x, this.y, Math.max(0, this.size * scale), 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
            // 重置 shadow 避免影響其他繪製 (如線條)
            ctx.shadowBlur = 0;
        }
        update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = mouse.radius;
            // [修改] 定義緩衝區半徑，粒子會停留在這個距離附近
            const bufferRadius = 60;

            if (mouse.x && distance < maxDistance && attractedCount < 15) {
                attractedCount++;
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;

                // [修改] 彈簧/緩衝邏輯
                // force = 0 當 distance == bufferRadius (平衡點)
                let force = (distance - bufferRadius) / maxDistance;

                // [修改] 減速係數：數字越小，移動越緩慢平滑
                const damping = 1.5;

                const directionX = forceDirectionX * force * this.density * damping;
                const directionY = forceDirectionY * force * this.density * damping;

                this.x += directionX;
                this.y += directionY;
            } else {
                // [修改] 回到原位的速度更緩慢，營造呼吸感
                if (this.x !== this.baseX) this.x -= (this.x - this.baseX) / 25;
                if (this.y !== this.baseY) this.y -= (this.y - this.baseY) / 25;
            }
            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        // [修改] 顏色改為不透明度更高，或更亮的顏色
        const colors = ['rgba(255, 255, 255, 1)', 'rgba(34, 211, 238, 1)', 'rgba(96, 165, 250, 1)'];
        let numberOfParticles = (width * height) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            // [修改] 稍微加大粒子尺寸
            let size = (Math.random() * 4) + 2;
            let x = Math.random() * width;
            let y = Math.random() * height;
            let color = colors[Math.floor(Math.random() * colors.length)];
            particlesArray.push(new Particle(x, y, size, color));
        }
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            // 優化：只計算靠近滑鼠的粒子
            let dx_mouse = mouse.x - particlesArray[a].x;
            let dy_mouse = mouse.y - particlesArray[a].y;
            let dist_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse);

            // 只有當粒子在滑鼠吸引範圍內時，才去檢查是否要連線
            if (dist_mouse < mouse.radius) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                        + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));

                    // [修改] 兩粒子距離小於特定值時畫線
                    if (distance < (width / 7) * (height / 7) && distance < 10000) { // 100*100 = 10000 px distance
                        opacityValue = 1 - (distance / 10000);
                        ctx.strokeStyle = 'rgba(147, 197, 253,' + opacityValue + ')'; // Light blue lines
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }
    }

    function resolveCollisions() {
        for (let a = 0; a < particlesArray.length; a++) {
            // 只檢測靠近滑鼠的粒子
            if (!mouse.x) continue;
            let p1 = particlesArray[a];
            let d1x = p1.x - mouse.x;
            let d1y = p1.y - mouse.y;
            // 如果粒子不在滑鼠半徑範圍內，跳過 (優化效能)
            if (Math.sqrt(d1x * d1x + d1y * d1y) > mouse.radius) continue;

            for (let b = a + 1; b < particlesArray.length; b++) {
                let p2 = particlesArray[b];
                let dx = p1.x - p2.x;
                let dy = p1.y - p2.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                // 最小距離 = 兩粒子半徑和 + 緩衝空間 (例如 20px)
                let minDistance = p1.size + p2.size + 20;

                if (distance < minDistance) {
                    // 產生碰撞/推開效果
                    let angle = Math.atan2(dy, dx);
                    let force = 1; // 推開的力量

                    let tx = Math.cos(angle) * force;
                    let ty = Math.sin(angle) * force;

                    p1.x += tx;
                    p1.y += ty;
                    p2.x -= tx;
                    p2.y -= ty;
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height);
        attractedCount = 0;
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        // [新增] 處理粒子間的碰撞/分離
        resolveCollisions();
        // [修改] 加入連線功能
        connect();
    }

    window.addEventListener('resize', function () {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        init();
    });

    init();
    animate();
})();
