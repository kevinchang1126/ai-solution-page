/**
 * mockup.js — 鼎新數智分身 體驗元件
 * 三大場景：① 接單評估  ② 訂單變更  ③ 急單判斷
 *
 * 使用方式：
 *   const el = MockupApp.init();
 *   document.getElementById('container').appendChild(el);
 *
 * 配合遊戲框架：
 *   window.GAME.getBattle() → { name: '接單評估' | '訂單變更' | '急單判斷' }
 */

const MockupApp = {

  /* ────────────────────────────────────────────────
   * 三個場景資料
   * ──────────────────────────────────────────────── */
  SCENARIOS: [

    /* ═══════════════ 場景一：接單評估 ═══════════════ */
    {
      id: 0,
      label: '接單評估',
      icon: '📋',
      userMsg: '我們剛收到一級棒公司的採購單，請幫忙評估這張訂單能不能接嗎？',
      introTitle: '數智分身協助接單評估',
      introDesc: '傳統接單評估要人工翻查資料、靠個人經驗判斷，費時又容易漏掉細節。數智分身會自動串聯各系統，一次把評估工作全部做完：',
      introSteps: [
        ['辨識客戶採購圖檔', '文件識別 + OCR 引擎'],
        ['比對客戶資料', 'CRM + 客戶資料庫'],
        ['確認公司規章', '規章系統 + ERP 政策庫'],
        ['查詢庫存與備料', 'ERP 庫存 + 採購系統'],
        ['推估交期與利潤', 'ERP 生產 + 財務分析引擎'],
        ['建立訂單通知人員', 'ERP 訂單 + 通知 + CRM'],
      ],
      summaryStats: [
        { value: '6', label: '專責助理' },
        { value: '8', label: '串聯系統' },
        { value: '42.86%', small: true, label: '預估毛利' },
        { value: '10/16', small: true, label: '預計交期' },
      ],
      summaryNote: '全程自動完成，無需人工介入，相關部門已同步通知。',
      steps: [
        {
          id: 1, node: '辨識採購圖檔',
          agentName: '辨識助理', agentIcon: '🔍',
          agentColor: '#7C3AED', agentBg: '#F3E8FF',
          systems: [
            { name: '文件識別系統', api: 'Document AI', icon: '📄', bg: '#F0F0FF' },
            { name: 'OCR 引擎', api: 'Text Extraction', icon: '🔤', bg: '#FFF0FF' },
          ],
          bubbleText: `辨識助理處理中…\n\n✅ 採購圖檔解析完成（格式：PDF）\n\n• 客戶名稱：一級棒公司\n• 客戶代號：1080\n• 採購品號：Z_P\n• 採購數量：998 件\n• 訂單金額：NT$ 1,400 元`,
          tokens: { in: 1240, out: 89 },
        },
        {
          id: 2, node: '比對客戶資料',
          agentName: '客戶助理', agentIcon: '👤',
          agentColor: '#0066CC', agentBg: '#E8F0FF',
          systems: [
            { name: 'CRM 系統', api: 'Customer DB', icon: '🏢', bg: '#EFF6FF' },
            { name: '客戶資料庫', api: 'Master Data', icon: '🗄️', bg: '#F0FAFF' },
          ],
          bubbleText: `客戶助理查詢中…\n\n✅ 客戶資料確認存在\n• 客戶名稱：一級棒公司\n• 客戶代號：1080\n• 信用額度：NT$ 10,000,000\n• 目前信用餘額：NT$ 9,773,779\n\n信用額度充足，可支持本次訂單金額 NT$ 1,400 元。`,
          tokens: { in: 1580, out: 112 },
        },
        {
          id: 3, node: '確認公司規章',
          agentName: '查核助理', agentIcon: '📋',
          agentColor: '#DC2626', agentBg: '#FEE2E2',
          systems: [
            { name: '公司規章系統', api: 'Policy Engine', icon: '📜', bg: '#FFF5F5' },
            { name: 'ERP 政策庫', api: 'ERP Rules', icon: '⚙️', bg: '#FFF0E8' },
          ],
          bubbleText: `查核助理確認規章中…\n\n📌 比對結果：\n• 本次訂單金額：NT$ 1,400\n• 規章門檻：超過 NT$ 50,000 需主管確認\n\n✅ 未超過門檻，無需額外審批。\n\n符合公司規章，建議接單。`,
          tokens: { in: 1890, out: 134 },
        },
        {
          id: 4, node: '查詢庫存備料',
          agentName: '備料助理', agentIcon: '📦',
          agentColor: '#D97706', agentBg: '#FEF3C7',
          systems: [
            { name: 'ERP 庫存', api: 'Inventory API', icon: '🏭', bg: '#FFFBEB' },
            { name: '採購系統', api: 'Purchase API', icon: '🛒', bg: '#FFF7F0' },
          ],
          bubbleText: `備料助理盤點中…\n\n📦 庫存狀態：\n• 品號 Z_P：庫存 0，需生產\n• 品號 HDB010197L：庫存充足（998 件）✅\n\n⚠️ 缺料提醒：\n• 關鍵原料 AI-A01 目前缺貨（-10 件）\n• 可能影響生產進度，建議通知採購補充`,
          tokens: { in: 2140, out: 178 },
          bubbleType: 'alert',
        },
        {
          id: 5, node: '推估交期利潤',
          agentName: '分析助理', agentIcon: '📊',
          agentColor: '#059669', agentBg: '#D1FAE5',
          systems: [
            { name: 'ERP 生產系統', api: 'Production API', icon: '🏗️', bg: '#ECFDF5' },
            { name: '財務分析引擎', api: 'Finance API', icon: '💹', bg: '#F0FFF4' },
          ],
          bubbleText: `分析助理執行中…\n\n💰 利潤分析：\n• 銷貨單價：NT$ 1,400\n• 銷貨成本：NT$ 800\n• 預估毛利：NT$ 600\n• 毛利率：42.86%\n\n📅 交期推估：\n• 預計生產完成：2026/10/09\n• 預計出貨交期：2026/10/16\n\n✅ 生產週期符合客戶要求`,
          tokens: { in: 2680, out: 201 },
        },
        {
          id: 6, node: '建立訂單通知',
          agentName: '接單助理', agentIcon: '✅',
          agentColor: '#0066CC', agentBg: '#E8F0FF',
          systems: [
            { name: 'ERP 訂單系統', api: 'Order API', icon: '📝', bg: '#EFF6FF' },
            { name: '通知系統', api: 'Notify API', icon: '🔔', bg: '#FFFBEB' },
            { name: 'CRM 系統', api: 'Customer DB', icon: '🏢', bg: '#F0F9FF' },
          ],
          bubbleText: `接單助理生成訂單中…\n\n✅ 客戶訂單已建立\n• 訂單編號：#ORD-2026-10010\n• 客戶：一級棒公司（1080）\n• 金額：NT$ 1,400\n\n📢 已通知相關部門：\n☑ 採購（補充 AI-A01 缺料）\n☑ 財務（信用額度確認）\n☑ 生管（排程生產計畫）`,
          tokens: { in: 3358, out: 476 },
          bubbleType: 'success',
          showSummary: true,
        },
      ],
    },

    /* ═══════════════ 場景二：訂單變更 ═══════════════ */
    {
      id: 1,
      label: '訂單變更',
      icon: '🔄',
      userMsg: '一級棒公司剛打電話來，說想把之前的訂單數量從 998 件改成 1,500 件，交期也希望提前 7 天，請數智分身幫忙評估是否能配合。',
      introTitle: '數智分身協助訂單變更評估',
      introDesc: '客戶訂單變更涉及庫存、生產、合約等多個層面，傳統流程需各部門來回確認，費時費力。數智分身同步串聯各系統，快速給出評估結果：',
      introSteps: [
        ['解析變更申請內容', '文件識別 + 客戶系統'],
        ['查詢原始訂單資料', 'ERP 訂單系統 + CRM'],
        ['評估數量交期影響', 'ERP 庫存 + 生產排程'],
        ['審查合約與規章', '規章系統 + 合約管理'],
        ['計算追加費用差異', '財務系統 + ERP 定價'],
        ['發出變更確認通知', 'ERP 訂單 + 通知 + CRM'],
      ],
      summaryStats: [
        { value: '6', label: '專責助理' },
        { value: '7', label: '串聯系統' },
        { value: 'NT$45K', small: true, label: '追加報價' },
        { value: '3 天', small: true, label: '最多可提前' },
      ],
      summaryNote: '全程自動完成，已計算追加費用，業務端可直接確認報價。',
      steps: [
        {
          id: 1, node: '解析變更申請',
          agentName: '辨識助理', agentIcon: '🔍',
          agentColor: '#7C3AED', agentBg: '#F3E8FF',
          systems: [
            { name: '文件識別系統', api: 'Document AI', icon: '📄', bg: '#F0F0FF' },
            { name: '客戶系統', api: 'Customer API', icon: '👤', bg: '#F3E8FF' },
          ],
          bubbleText: `辨識助理處理中…\n\n✅ 訂單變更申請解析完成\n\n• 客戶：一級棒公司（1080）\n• 原始訂單：#ORD-2026-08820\n• 變更項目：\n  - 數量：998 件 → 1,500 件（+502 件）\n  - 交期：希望提前 7 天\n  - 新交期要求：2026/10/09`,
          tokens: { in: 1180, out: 96 },
        },
        {
          id: 2, node: '查詢原始訂單',
          agentName: '查詢助理', agentIcon: '🔎',
          agentColor: '#0066CC', agentBg: '#E8F0FF',
          systems: [
            { name: 'ERP 訂單系統', api: 'Order API', icon: '📝', bg: '#EFF6FF' },
            { name: 'CRM 系統', api: 'Customer DB', icon: '🏢', bg: '#F0FAFF' },
          ],
          bubbleText: `查詢助理查詢中…\n\n✅ 原始訂單資料確認\n• 訂單狀態：生產備料中\n• 目前已領料：600 件份\n• 已投入成本：NT$ 84,000\n• 原合約交期：2026/10/16\n\n已開始備料，變更需重新評估影響範圍。`,
          tokens: { in: 1420, out: 108 },
        },
        {
          id: 3, node: '評估影響範圍',
          agentName: '評估助理', agentIcon: '📊',
          agentColor: '#D97706', agentBg: '#FEF3C7',
          systems: [
            { name: 'ERP 庫存', api: 'Inventory API', icon: '🏭', bg: '#FFFBEB' },
            { name: '生產排程系統', api: 'Schedule API', icon: '🏗️', bg: '#FFF7F0' },
          ],
          bubbleText: `評估助理分析中…\n\n📊 數量與交期影響評估：\n• 追加 502 件需補充備料（約 3 天）\n• 生產線需重新調整排程\n\n⚠️ 交期評估：\n• 提前 7 天要求難以達成\n• 最多可配合提前 3 天（10/13 出貨）`,
          tokens: { in: 1960, out: 162 },
          bubbleType: 'alert',
        },
        {
          id: 4, node: '審查合約規章',
          agentName: '查核助理', agentIcon: '📋',
          agentColor: '#DC2626', agentBg: '#FEE2E2',
          systems: [
            { name: '規章系統', api: 'Policy Engine', icon: '📜', bg: '#FFF5F5' },
            { name: '合約管理', api: 'Contract API', icon: '📄', bg: '#FFF0E8' },
          ],
          bubbleText: `查核助理審查中…\n\n📋 合約與規章比對：\n• 訂單已開始生產，適用變更條款\n• 數量增加超過 20%，需重新報價\n• 提前交期可收取緊急排程費用\n\n✅ 符合變更作業規定，可受理此次變更。`,
          tokens: { in: 2210, out: 141 },
        },
        {
          id: 5, node: '計算費用差異',
          agentName: '財務助理', agentIcon: '💹',
          agentColor: '#059669', agentBg: '#D1FAE5',
          systems: [
            { name: '財務系統', api: 'Finance API', icon: '💰', bg: '#ECFDF5' },
            { name: 'ERP 定價', api: 'Pricing API', icon: '🏷️', bg: '#F0FFF4' },
          ],
          bubbleText: `財務助理計算中…\n\n💰 追加費用試算：\n• 502 件追加材料成本：NT$ 40,160\n• 緊急排程費用：NT$ 5,000\n• 追加報價合計：NT$ 45,160\n\n📋 新訂單總金額預估：NT$ 52,160\n毛利率：36.2%（含變更成本）`,
          tokens: { in: 2580, out: 187 },
        },
        {
          id: 6, node: '發出變更通知',
          agentName: '通知助理', agentIcon: '📣',
          agentColor: '#0066CC', agentBg: '#E8F0FF',
          systems: [
            { name: 'ERP 訂單系統', api: 'Order API', icon: '📝', bg: '#EFF6FF' },
            { name: '通知系統', api: 'Notify API', icon: '🔔', bg: '#FFFBEB' },
            { name: 'CRM 系統', api: 'Customer DB', icon: '🏢', bg: '#F0F9FF' },
          ],
          bubbleText: `通知助理執行中…\n\n✅ 訂單變更已受理\n• 訂單號：#ORD-2026-08820-R1\n• 預計出貨：2026/10/13（提前 3 天）\n\n📢 已通知相關部門：\n☑ 採購（補充 502 件追加備料）\n☑ 生管（重新排程調整）\n☑ 業務（確認追加報價 NT$45,160）`,
          tokens: { in: 3180, out: 423 },
          bubbleType: 'success',
          showSummary: true,
        },
      ],
    },

    /* ═══════════════ 場景三：急單評估 ═══════════════ */
    {
      id: 2,
      label: '急單評估',
      icon: '⚡',
      userMsg: '業務說一級棒公司有一批緊急訂單，數量不多但希望一個禮拜內就出貨，請數智分身快速評估看看能不能做到。',
      introTitle: '數智分身協助急單評估',
      introDesc: '客戶急單往往時間壓力大，傳統逐一確認產能、庫存、成本的方式緩不濟急。數智分身同步查詢所有系統，迅速給出能否接單的答案：',
      introSteps: [
        ['解析急單規格需求', '文件識別 + 客戶系統'],
        ['即時查詢生產產能', 'ERP 生產系統 + 排程'],
        ['緊急盤點現有庫存', 'ERP 庫存 + 採購系統'],
        ['評估緊急調度方案', '生產調度系統'],
        ['試算加急費用成本', '財務分析引擎 + ERP'],
        ['發出接單決策建議', 'ERP 訂單 + 通知 + CRM'],
      ],
      summaryStats: [
        { value: '6', label: '專責助理' },
        { value: '8', label: '串聯系統' },
        { value: '38.5%', small: true, label: '急單毛利' },
        { value: '10/14', small: true, label: '預計出貨' },
      ],
      summaryNote: '全程自動完成，確認產能可行，建議接受急單並通知相關部門準備。',
      steps: [
        {
          id: 1, node: '解析急單需求',
          agentName: '辨識助理', agentIcon: '🔍',
          agentColor: '#7C3AED', agentBg: '#F3E8FF',
          systems: [
            { name: '文件識別系統', api: 'Document AI', icon: '📄', bg: '#F0F0FF' },
            { name: '客戶系統', api: 'Customer API', icon: '👤', bg: '#F3E8FF' },
          ],
          bubbleText: `辨識助理處理中…\n\n⚡ 急單需求解析完成\n\n• 客戶：一級棒公司（1080）\n• 急單品號：Z_P\n• 急單數量：200 件\n• 需求交期：2026/10/14（7 天內）\n\n需求明確，開始評估可行性。`,
          tokens: { in: 1050, out: 82 },
        },
        {
          id: 2, node: '查詢生產產能',
          agentName: '生產助理', agentIcon: '🏭',
          agentColor: '#0D9488', agentBg: '#CCFBF1',
          systems: [
            { name: 'ERP 生產系統', api: 'Production API', icon: '🏗️', bg: '#ECFDF5' },
            { name: '排程系統', api: 'Schedule API', icon: '📅', bg: '#F0FFFC' },
          ],
          bubbleText: `生產助理查詢中…\n\n🏭 當前產能狀況：\n• 生產線佔用率：87%\n• 可插單時間窗：10/11 18:00 起\n• 預估生產工時：2 天（200 件）\n• 理論最快完工：10/13\n\n✅ 產能上可以安排，時間窗充裕。`,
          tokens: { in: 1340, out: 118 },
        },
        {
          id: 3, node: '盤點庫存備料',
          agentName: '備料助理', agentIcon: '📦',
          agentColor: '#D97706', agentBg: '#FEF3C7',
          systems: [
            { name: 'ERP 庫存', api: 'Inventory API', icon: '🏭', bg: '#FFFBEB' },
            { name: '採購系統', api: 'Purchase API', icon: '🛒', bg: '#FFF7F0' },
          ],
          bubbleText: `備料助理盤點中…\n\n📦 庫存狀態：\n• 品號 Z_P：現貨 0 件，需生產\n• 所需原料 AI-A01：現有 150 件份\n• 缺口：50 件份（可 3 天內到貨）\n\n⚠️ 原料到齊後才能開工，不影響最終交期。`,
          tokens: { in: 1720, out: 145 },
          bubbleType: 'alert',
        },
        {
          id: 4, node: '評估調度方案',
          agentName: '調度助理', agentIcon: '🔄',
          agentColor: '#DC2626', agentBg: '#FEE2E2',
          systems: [
            { name: '生產調度系統', api: 'Dispatch API', icon: '⚙️', bg: '#FFF5F5' },
          ],
          bubbleText: `調度助理評估中…\n\n🔄 緊急調度方案比較：\n\n方案 A（推薦）：等原料到貨後生產\n→ 最快 10/14 出貨（符合客戶要求）\n→ 成本正常\n\n方案 B：緊急採購替代料\n→ 最快 10/12 出貨（多 NT$ 8,000）\n\n✅ 方案 A 可在期限內完成，建議採用。`,
          tokens: { in: 2100, out: 175 },
        },
        {
          id: 5, node: '試算急單費用',
          agentName: '財務助理', agentIcon: '💹',
          agentColor: '#059669', agentBg: '#D1FAE5',
          systems: [
            { name: '財務分析引擎', api: 'Finance API', icon: '💰', bg: '#ECFDF5' },
            { name: 'ERP 定價', api: 'Pricing API', icon: '🏷️', bg: '#F0FFF4' },
          ],
          bubbleText: `財務助理計算中…\n\n💰 急單費用試算：\n• 標準售價：NT$ 1,400 元/件\n• 急單加價（15%）：+ NT$ 210\n• 急單售價：NT$ 1,610 元/件\n• 200 件總金額：NT$ 322,000\n\n毛利率估算：38.5%（含加急成本）\n✅ 毛利尚可，建議接受急單`,
          tokens: { in: 2490, out: 196 },
        },
        {
          id: 6, node: '發出接單建議',
          agentName: '接單助理', agentIcon: '✅',
          agentColor: '#0066CC', agentBg: '#E8F0FF',
          systems: [
            { name: 'ERP 訂單系統', api: 'Order API', icon: '📝', bg: '#EFF6FF' },
            { name: '通知系統', api: 'Notify API', icon: '🔔', bg: '#FFFBEB' },
            { name: 'CRM 系統', api: 'Customer DB', icon: '🏢', bg: '#F0F9FF' },
          ],
          bubbleText: `接單助理執行中…\n\n✅ 急單建議：接受\n• 急單號：#URG-2026-10014\n• 客戶：一級棒公司（1080）\n• 金額：NT$ 322,000\n• 預計出貨：2026/10/14\n\n📢 已通知相關部門：\n☑ 採購（確認 AI-A01 補料）\n☑ 生管（預留 10/11 產能時窗）\n☑ 業務（確認急單報價 NT$1,610）`,
          tokens: { in: 3240, out: 451 },
          bubbleType: 'success',
          showSummary: true,
        },
      ],
    },

  ], // end SCENARIOS

  /* ────────────────────────────────────────────────
   * 狀態
   * ──────────────────────────────────────────────── */
  currentScenario: 0,
  currentStep: 0,
  container: null,

  get scene() { return this.SCENARIOS[this.currentScenario]; },
  get steps() { return this.scene.steps; },
  get total() { return this.steps.length + 1; }, // +1 for intro (step 0)

  /* ────────────────────────────────────────────────
   * CSS（scoped under .mockup-root）
   * ──────────────────────────────────────────────── */
  css: `
    /* ─── 寬度限制：確保在寬容器裡保持行動裝置比例 ─── */
    .mockup-wrapper {
      width: 100%; height: 100%;
      display: flex; justify-content: center; align-items: stretch;
      overflow: hidden;
    }
    .mockup-root {
      --brand: #1565D8; --brand-dark: #0D47A1; --brand-light: #E8F0FE;
      --border: #E2E8F0; --text-primary: #0A1628;
      --text-secondary: #5A6A7E; --text-muted: #9AAAB8;
      --green: #16A34A; --orange: #D97706; --red: #DC2626;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang TC', 'Microsoft JhengHei', sans-serif;
      height: 100%; max-width: 480px; width: 100%; /* max-width 放大至 480px */
      display: flex; flex-direction: column;
      background: #F8FAFF; overflow: hidden;
      border-radius: 12px; text-align: left;
    }
    .mockup-root * { box-sizing: border-box; }

    /* ─── Scenario Tabs ─── */
    .mk-scenario-tabs { display: none; background: #F0F4F8; border-bottom: 1px solid var(--border); flex-shrink: 0; }
    .mk-tab { flex: 1; padding: 10px 4px; text-align: center; font-size: 13px; font-weight: 600; color: var(--text-muted); cursor: pointer; border-bottom: 3px solid transparent; transition: all 0.2s; user-select: none; }
    .mk-tab.active { color: var(--brand); border-bottom-color: var(--brand); background: #FFFFFF; }
    .mk-tab-icon { font-size: 16px; display: block; line-height: 1; margin-bottom: 4px; }

    /* ─── Scenario Banner ─── */
    .mk-scenario-banner { background: linear-gradient(135deg, var(--brand) 0%, #0D47A1 100%); padding: 8px 14px; display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
    .mk-scenario-icon { width: 28px; height: 28px; background: rgba(255,255,255,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
    .mk-scenario-title { font-size: clamp(13px, 4.5vw, 15px); font-weight: 700; color: white; line-height: 1.15; }
    .mk-scenario-node { font-size: clamp(11px, 3.5vw, 13px); color: rgba(255,255,255,0.75); display: flex; align-items: center; gap: 5px; margin-top: 3px; }
    .mk-scenario-dot { width: 6px; height: 6px; border-radius: 50%; background: #4ADE80; animation: mk-blink 1.5s ease infinite; }
    @keyframes mk-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

    /* ─── Progress Steps ─── */
    .mk-progress-wrap { background: #FFFFFF; padding: 8px 6px; border-bottom: 1px solid var(--border); flex-shrink: 0; }
    .mk-progress-steps { display: flex; align-items: flex-start; justify-content: center; width: 100%; }
    .mk-prog-step { display: flex; flex-direction: column; align-items: center; gap: 4px; width: 56px; }
    .mk-prog-circle { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; transition: all 0.35s; flex-shrink: 0; }
    .mk-prog-circle.done   { background: var(--brand); color: white; }
    .mk-prog-circle.active { background: var(--brand); color: white; box-shadow: 0 0 0 3px rgba(21,101,216,0.22); }
    .mk-prog-circle.todo   { background: #E8ECF2; color: var(--text-muted); }
    .mk-prog-label { font-size: clamp(10px, 3.5vw, 12px); color: var(--text-muted); text-align: center; line-height: 1.15; max-width: 52px; }
    .mk-prog-connector { width: 6px; height: 2px; background: var(--border); margin-top: 8px; flex-shrink: 0; transition: background 0.35s; }
    .mk-prog-connector.done { background: var(--brand); }

    /* ─── Content Area ─── */
    /* min-height:0 是讓 flex 子項可以收縮並觸發 overflow-y 滾動的關鍵 */
    .mk-content { flex: 1; overflow-y: auto; padding: 8px 8px 14px; display: flex; flex-direction: column; gap: 6px; min-height: 0; }
    .mk-content::-webkit-scrollbar { display: none; }

    /* ─── Orchestrator Banner ─── */
    .mk-orch-row { display: flex; align-items: center; gap: 8px; background: #FFF8EC; border: 1px solid #FDDEA0; border-radius: 8px; padding: 8px 12px; flex-shrink: 0; }
    .mk-orch-icon { width: 24px; height: 24px; background: linear-gradient(135deg, #F59E0B, #D97706); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }
    .mk-orch-text { font-size: clamp(13px, 4.5vw, 15px); color: #92400E; font-weight: 600; line-height: 1.15; }
    .mk-orch-sub  { font-size: clamp(11px, 3.5vw, 13px); color: #B45309; margin-top: 2px; }

    /* ─── Agent Network Viz ─── */
    .mk-viz-card { background: #FFFFFF; border: 1px solid var(--border); border-radius: 12px; padding: 10px; flex-shrink: 0; }
    .mk-viz-header { font-size: clamp(11px, 3.5vw, 13px); font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
    .mk-viz-pulse { width: 6px; height: 6px; border-radius: 50%; background: #22C55E; animation: mk-blink 1s infinite; }
    .mk-viz-layout { display: flex; align-items: center; }
    .mk-viz-agent-node { display: flex; flex-direction: column; align-items: center; gap: 6px; flex-shrink: 0; width: 60px; }
    .mk-viz-agent-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 18px; position: relative; }
    .mk-viz-agent-icon::after { content: ''; position: absolute; inset: -2px; border-radius: 14px; border: 2px solid currentColor; opacity: 0.25; animation: mk-ring 2s ease infinite; }
    @keyframes mk-ring { 0%,100%{transform:scale(1);opacity:0.25} 50%{transform:scale(1.1);opacity:0.08} }
    .mk-viz-agent-label { font-size: clamp(11px, 3.5vw, 13px); font-weight: 700; text-align: center; line-height: 1.15; }
    .mk-viz-lines { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 8px; padding: 0 4px; min-width: 0; }
    .mk-viz-line-row { display: flex; align-items: center; gap: 4px; }
    .mk-viz-line-track { flex: 1; height: 3px; background: #E8ECF2; position: relative; overflow: hidden; border-radius: 1.5px; }
    .mk-viz-line-track.active::before { content: ''; position: absolute; top: 0; left: -50%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, var(--pkt-color, var(--brand)), transparent); animation: mk-pkt 1.4s ease-in-out infinite; }
    @keyframes mk-pkt { 0%{left:-50%} 100%{left:150%} }
    .mk-viz-line-arrow { font-size: clamp(9px, 3vw, 11px); color: var(--text-muted); flex-shrink: 0; }
    .mk-viz-systems { display: flex; flex-direction: column; gap: 6px; flex-shrink: 0; }
    .mk-viz-sys-node { display: flex; align-items: center; gap: 6px; background: #F5F8FF; border: 1px solid #D6E4FF; border-radius: 8px; padding: 5px 8px; min-width: 100px; }
    .mk-viz-sys-icon { width: 20px; height: 20px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 11px; flex-shrink: 0; }
    .mk-viz-sys-name { font-size: clamp(11px, 3.5vw, 13px); font-weight: 700; color: #1E3A5F; line-height: 1.1; }
    .mk-viz-sys-api  { font-size: clamp(9px, 3vw, 11px); color: var(--text-muted); margin-top: 2px; }

    /* ─── Chat Messages ─── */
    .mk-msg-user-row { display: flex; justify-content: flex-end; flex-shrink: 0; }
    .mk-msg-user-bubble { background: var(--brand); color: white; border-radius: 16px 16px 4px 16px; padding: 10px 14px; max-width: 85%; font-size: clamp(13px, 4.5vw, 15px); line-height: 1.45; }
    .mk-msg-agent-row { display: flex; flex-direction: column; gap: 6px; }
    .mk-msg-agent-header { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; flex-shrink: 0; }
    .mk-agent-chip { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 14px; font-size: clamp(12px, 4vw, 14px); font-weight: 700; }
    .mk-agent-live { display: flex; align-items: center; gap: 4px; font-size: clamp(11px, 3.5vw, 13px); color: var(--green); font-weight: 600; }
    .mk-live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); animation: mk-blink 1s infinite; }
    .mk-chat-bubble { background: #FFFFFF; border: 1px solid var(--border); border-radius: 4px 14px 14px 14px; padding: 10px 14px; font-size: clamp(13px, 4.5vw, 15px); line-height: 1.5; color: var(--text-primary); flex-shrink: 0; }
    .mk-chat-bubble.alert   { background: #FFFBEB; border-color: #FDE68A; }
    .mk-chat-bubble.success { background: #F0FDF4; border-color: #BBF7D0; }
    .mk-chat-tokens { display: flex; align-items: center; gap: 6px; margin-top: 4px; flex-shrink: 0; }
    .mk-token-badge { display: inline-flex; align-items: center; gap: 3px; background: #F0F4F8; padding: 4px 8px; border-radius: 6px; font-size: clamp(10px, 3vw, 11px); color: var(--text-muted); font-weight: 600; }

    /* ─── Intro Card ───
       不設 display:flex，讓它是普通的 block element，
       高度自然由內容決定，使 mk-content 能正常滾動。 ─── */
    .mk-intro-card { background: #FFFFFF; border: 1px solid var(--border); border-radius: 12px; overflow: hidden; flex-shrink: 0; }
    .mk-intro-card-header { background: linear-gradient(135deg, var(--brand), var(--brand-dark)); padding: 10px 12px; color: white; font-size: clamp(13px, 4.5vw, 15px); font-weight: 700; display: flex; align-items: center; gap: 6px; }
    .mk-intro-card-body { padding: 8px 12px 12px; font-size: clamp(13px, 4.5vw, 15px); color: var(--text-secondary); line-height: 1.45; }
    .mk-flow-step { display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid #F0F4F8; }
    .mk-flow-step:last-child { border-bottom: none; }
    .mk-flow-num { width: 20px; height: 20px; background: var(--brand-light); color: var(--brand); border-radius: 50%; font-size: 10px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .mk-flow-step-name { font-size: clamp(13px, 4.5vw, 15px); font-weight: 600; color: var(--text-primary); }
    .mk-flow-step-sys  { font-size: clamp(11px, 3.5vw, 13px); color: var(--text-muted); margin-top: 2px; }

    /* ─── Summary Card ─── */
    .mk-summary-card { background: linear-gradient(135deg, #ECFDF5, #D1FAE5); border: 1px solid #6EE7B7; border-radius: 12px; padding: 12px; flex-shrink: 0; }
    .mk-summary-title { font-size: clamp(13px, 4.5vw, 15px); font-weight: 800; color: #065F46; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
    .mk-summary-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 8px; }
    .mk-stat-item { background: white; border-radius: 8px; padding: 6px 8px; text-align: center; }
    .mk-stat-value { font-size: 20px; font-weight: 800; color: var(--brand); }
    .mk-stat-value.sm { font-size: clamp(14px, 5vw, 17px); }
    .mk-stat-label { font-size: clamp(11px, 3.5vw, 13px); color: var(--text-muted); margin-top: 3px; }
    .mk-summary-note { font-size: clamp(11px, 3.5vw, 13px); color: #065F46; line-height: 1.4; }

    /* ─── Navigation ─── */
    .mk-nav-area { background: #FFFFFF; border-top: 1px solid var(--border); padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
    .mk-nav-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 20px; border: none; font-size: clamp(13px, 4.5vw, 15px); font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: inherit; }
    .mk-nav-btn-prev { background: #F0F4F8; color: var(--text-secondary); }
    .mk-nav-btn-next { background: var(--brand); color: white; }
    .mk-nav-btn.finish { background: var(--green); color: white; }
    .mk-nav-btn:hover:not(:disabled) { transform: scale(0.95); opacity: 0.9; }
    .mk-nav-btn:disabled { opacity: 0.35; cursor: not-allowed; }
    .mk-nav-center { text-align: center; }
    .mk-nav-counter { font-size: clamp(11px, 3.5vw, 13px); font-weight: 700; color: var(--text-primary); display: flex; justify-content: center; align-items: center; width: 40px; height: 40px; background: rgba(0,0,0,.04); border-radius: 100px; }
  `,

  /* ────────────────────────────────────────────────
   * init()：注入樣式、建立 DOM、返回 wrapper
   * ──────────────────────────────────────────────── */
  init() {
    // 若外部遊戲框架指定場景，切換到對應場景
    const battleData = (window.GAME && window.GAME.getBattle) ? window.GAME.getBattle() : null;
    if (battleData && (battleData.scene || battleData.name)) {
      const targetName = battleData.scene || battleData.name;
      const idx = this.SCENARIOS.findIndex(s => s.label === targetName);
      if (idx >= 0) {
        this.currentScenario = idx;
        this.currentStep = 0; // 強制重設至引言畫面
      }
    }

    // 注入樣式（避免重複）
    const styleId = 'mk-module-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = this.css;
      document.head.appendChild(style);
    }

    // 外層 wrapper（處理寬度限制 + 水平置中）
    const wrapper = document.createElement('div');
    wrapper.className = 'mockup-wrapper';

    // 主容器
    const root = document.createElement('div');
    root.className = 'mockup-root';
    root.innerHTML = `
      <div class="mk-scenario-tabs" id="mk-tabs"></div>
      <div class="mk-scenario-banner">
        <div class="mk-scenario-icon" id="mk-scene-icon">📋</div>
        <div>
          <div class="mk-scenario-title" id="mk-scene-title"></div>
          <div class="mk-scenario-node">
            <div class="mk-scenario-dot"></div>
            <span id="mk-node-name">說明</span>
          </div>
        </div>
      </div>
      <div class="mk-progress-wrap">
        <div class="mk-progress-steps" id="mk-progress"></div>
      </div>
      <div class="mk-content" id="mk-content"></div>
      <div class="mk-nav-area">
        <button class="mk-nav-btn mk-nav-btn-prev" id="mk-btn-prev" disabled>← 上一步</button>
        <div class="mk-nav-center">
          <div class="mk-nav-counter" id="mk-nav-counter"></div>
        </div>
        <button class="mk-nav-btn mk-nav-btn-next" id="mk-btn-next">下一步 →</button>
      </div>
    `;

    this.container = root;
    wrapper.appendChild(root);

    // 綁定導覽按鈕
    root.querySelector('#mk-btn-prev').addEventListener('click', () => this.prevStep());
    root.querySelector('#mk-btn-next').addEventListener('click', () => this.nextStep());

    this.renderTabs();
    this.renderAll();

    return wrapper;
  },

  /* ────────────────────────────────────────────────
   * renderTabs()：場景切換標籤列
   * ──────────────────────────────────────────────── */
  renderTabs() {
    const el = this.container.querySelector('#mk-tabs');
    el.innerHTML = this.SCENARIOS.map((s, i) => `
      <div class="mk-tab ${i === this.currentScenario ? 'active' : ''}"
           data-idx="${i}">
        <span class="mk-tab-icon">${s.icon}</span>${s.label}
      </div>
    `).join('');

    el.querySelectorAll('.mk-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const idx = parseInt(tab.dataset.idx);
        if (idx !== this.currentScenario) {
          this.currentScenario = idx;
          this.currentStep = 0;
          this.renderTabs();
          this.renderAll();
        }
      });
    });
  },

  /* ────────────────────────────────────────────────
   * renderAll()：更新場景 banner + 進度 + 內容
   * ──────────────────────────────────────────────── */
  renderAll() {
    // 更新 banner
    this.container.querySelector('#mk-scene-icon').textContent = this.scene.icon;
    this.container.querySelector('#mk-scene-title').textContent = this.scene.label;

    this.renderProgress();
    this.renderContent();
    this.updateNav();
  },

  /* ────────────────────────────────────────────────
   * renderProgress()
   * ──────────────────────────────────────────────── */
  renderProgress() {
    const el = this.container.querySelector('#mk-progress');
    let html = '';
    this.steps.forEach((s, idx) => {
      const realIdx = idx + 1; // step 0 is intro
      const state = realIdx < this.currentStep ? 'done' :
        realIdx === this.currentStep ? 'active' : 'todo';
      const label = s.node.length > 4 ? s.node.slice(0, 4) : s.node;
      html += `
        <div class="mk-prog-step">
          <div class="mk-prog-circle ${state}">${state === 'done' ? '✓' : idx + 1}</div>
          <div class="mk-prog-label">${label}</div>
        </div>`;
      if (idx < this.steps.length - 1) {
        html += `<div class="mk-prog-connector ${realIdx < this.currentStep ? 'done' : ''}"></div>`;
      }
    });
    el.innerHTML = html;
  },

  /* ────────────────────────────────────────────────
   * renderContent()：根據 currentStep 渲染主內容
   * ──────────────────────────────────────────────── */
  renderContent() {
    const cArea = this.container.querySelector('#mk-content');
    const nodeEl = this.container.querySelector('#mk-node-name');

    if (this.currentStep === 0) {
      // ── 引言畫面 ──
      const sc = this.scene;
      nodeEl.textContent = '說明';
      cArea.innerHTML = `
        <div class="mk-msg-user-row">
          <div class="mk-msg-user-bubble">${sc.userMsg}</div>
        </div>
        <div class="mk-intro-card">
          <div class="mk-intro-card-header">
            <span>${sc.icon}</span> ${sc.introTitle}
          </div>
          <div class="mk-intro-card-body">
            <p style="margin-bottom:5px;">${sc.introDesc}</p>
            ${sc.introSteps.map(([name, sys], i) => `
              <div class="mk-flow-step">
                <div class="mk-flow-num">${i + 1}</div>
                <div>
                  <div class="mk-flow-step-name">${name}</div>
                  <div class="mk-flow-step-sys">${sys}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else {
      // ── 各執行步驟 ──
      const step = this.steps[this.currentStep - 1];
      nodeEl.textContent = step.node;

      const orchHtml = `
        <div class="mk-orch-row">
          <div class="mk-orch-icon">🤖</div>
          <div>
            <div class="mk-orch-text">數智分身統籌協調</div>
            <div class="mk-orch-sub">正在呼叫 → ${step.agentName}</div>
          </div>
        </div>`;

      const vizHtml = this.renderViz(step);

      const agentHtml = `
        <div class="mk-msg-agent-row">
          <div class="mk-msg-agent-header">
            <div class="mk-agent-chip" style="background:${step.agentBg};color:${step.agentColor}">
              ${step.agentIcon} ${step.agentName}
            </div>
            <div class="mk-agent-live"><div class="mk-live-dot"></div>執行中</div>
          </div>
          ${vizHtml}
          <div class="mk-chat-bubble${step.bubbleType === 'alert' ? ' alert' : step.bubbleType === 'success' ? ' success' : ''}">
            ${step.bubbleText.replace(/\n/g, '<br>')}
          </div>
          <div class="mk-chat-tokens">
            <div class="mk-token-badge">🔵 Tokens</div>
            <div class="mk-token-badge">↑ ${step.tokens.in.toLocaleString()}</div>
            <div class="mk-token-badge">↓ ${step.tokens.out}</div>
          </div>
        </div>`;

      const summaryHtml = step.showSummary ? this.renderSummary() : '';

      cArea.innerHTML = orchHtml + agentHtml + summaryHtml;
    }

    cArea.scrollTop = 0;
  },

  /* ────────────────────────────────────────────────
   * renderViz()：Agent ↔ 系統可視化
   * ──────────────────────────────────────────────── */
  renderViz(step) {
    if (!step.agentName) return '';
    const sysNodes = step.systems.map(sys => `
      <div class="mk-viz-sys-node">
        <div class="mk-viz-sys-icon" style="background:${sys.bg}">${sys.icon}</div>
        <div>
          <div class="mk-viz-sys-name">${sys.name}</div>
          <div class="mk-viz-sys-api">${sys.api}</div>
        </div>
      </div>`).join('');
    const lineRows = step.systems.map(() => `
      <div class="mk-viz-line-row">
        <div class="mk-viz-line-track active" style="--pkt-color:${step.agentColor}"></div>
        <div class="mk-viz-line-arrow">▶</div>
      </div>`).join('');
    return `
      <div class="mk-viz-card">
        <div class="mk-viz-header"><div class="mk-viz-pulse"></div> 串聯企業系統</div>
        <div class="mk-viz-layout">
          <div class="mk-viz-agent-node">
            <div class="mk-viz-agent-icon" style="background:${step.agentBg};color:${step.agentColor}">${step.agentIcon}</div>
            <div class="mk-viz-agent-label" style="color:${step.agentColor}">${step.agentName}</div>
          </div>
          <div class="mk-viz-lines">${lineRows}</div>
          <div class="mk-viz-systems">${sysNodes}</div>
        </div>
      </div>`;
  },

  /* ────────────────────────────────────────────────
   * renderSummary()：完成摘要卡片
   * ──────────────────────────────────────────────── */
  renderSummary() {
    const sc = this.scene;
    const stats = sc.summaryStats.map(s => `
      <div class="mk-stat-item">
        <div class="mk-stat-value${s.small ? ' sm' : ''}">${s.value}</div>
        <div class="mk-stat-label">${s.label}</div>
      </div>`).join('');
    return `
      <div class="mk-summary-card">
        <div class="mk-summary-title">🎉 全程自動處理完成</div>
        <div class="mk-summary-stats">${stats}</div>
        <div class="mk-summary-note">${sc.summaryNote}</div>
      </div>`;
  },

  /* ────────────────────────────────────────────────
   * updateNav()：按鈕與計數器
   * ──────────────────────────────────────────────── */
  updateNav() {
    const total = this.steps.length + 1; // +1 for intro
    const btnPrev = this.container.querySelector('#mk-btn-prev');
    const btnNext = this.container.querySelector('#mk-btn-next');
    const counter = this.container.querySelector('#mk-nav-counter');

    counter.textContent = `${this.currentStep + 1}/${total}`;
    btnPrev.disabled = (this.currentStep === 0);

    if (this.currentStep === total - 1) {
      btnNext.textContent = '完成 ✓';
      btnNext.classList.add('finish');
    } else {
      btnNext.textContent = '下一步 →';
      btnNext.classList.remove('finish');
    }
  },

  /* ────────────────────────────────────────────────
   * 導覽
   * ──────────────────────────────────────────────── */
  nextStep() {
    const total = this.steps.length + 1;
    if (this.currentStep < total - 1) {
      this.currentStep++;
      this.renderProgress();
      this.renderContent();
      this.updateNav();
    } else if (window.GAME && window.GAME.mockupDone) {
      window.GAME.mockupDone();
    }
  },

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.renderProgress();
      this.renderContent();
      this.updateNav();
    }
  },
};