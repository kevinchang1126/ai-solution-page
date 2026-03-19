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



// --- Modal Logic ---
let currentScale = 1;
let isPortraitMode = false;
let isMobileAppMode = false;

function openModal(url, mobileMode = false) {
    if (!url || typeof url !== 'string') return;

    isMobileAppMode = mobileMode;

    const modal = document.getElementById('iframe-modal');
    const iframe = document.getElementById('content-iframe');

    const separator = url.includes('?') ? '&' : '?';
    const timestamp = new Date().getTime();
    const freshUrl = `${url}${separator}v=${timestamp}`;

    iframe.src = freshUrl;
    modal.classList.remove('hidden');
    modal.style.display = 'block'; // 強制顯示，抵抗 CMS css 覆蓋

    calculateModalLayout();
    window.addEventListener('resize', calculateModalLayout);
}

function closeModal() {
    const modal = document.getElementById('iframe-modal');
    const iframe = document.getElementById('content-iframe');
    modal.classList.add('hidden');
    modal.style.display = 'none'; // 強制隱藏
    iframe.src = '';
    isMobileAppMode = false;
    window.removeEventListener('resize', calculateModalLayout);
}

function calculateModalLayout() {
    const container = document.getElementById('iframe-container');
    if (!container) return;

    const w = window.innerWidth;
    const h = window.innerHeight;

    if (isMobileAppMode) {
        // 行動裝置比例 (例如 414x896)
        container.style.width = '414px';
        container.style.height = '896px';
        container.style.borderRadius = '32px';

        const scaleW = (w * 0.95) / 414;
        const scaleH = (h * 0.95) / 896;
        currentScale = Math.min(scaleW, scaleH, 1); // 不要放大超過原比例

        container.style.transform = `translate(-50%, -50%) scale(${currentScale})`;
        return;
    }

    const isMobile = w < 768 && h > w;
    isPortraitMode = isMobile;

    const baseWidth = 1440;
    const baseHeight = 900;

    container.style.width = '1440px';
    container.style.height = '900px';
    container.style.borderRadius = '12px';

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
