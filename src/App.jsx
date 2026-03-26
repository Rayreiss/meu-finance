// ============================================================
//  💰 FinanceApp — Controle Financeiro Pessoal
//  Stack: React + Recharts + Lucide
//  Persistência: localStorage
// ============================================================

import { useState, useEffect, useReducer, useMemo, useCallback, useRef } from "react";
import {
  LayoutDashboard, TrendingUp, Home, ShoppingCart, CreditCard,
  BarChart3, Target, Plus, Trash2, Edit2, Download, Upload,
  AlertTriangle, Wallet, ArrowUpRight, ArrowDownRight,
  X, ChevronLeft, ChevronRight, Bell, CheckCircle2,
  PiggyBank, Zap, Search, Calendar, Coffee, Car,
  Heart, Shirt, Smile, MoreHorizontal, DollarSign,
  Moon, Sun, RefreshCw, TrendingDown, Shield
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line
} from "recharts";

// ─────────────────────────────────────────────
//  ESTILOS GLOBAIS
// ─────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:       #07090F;
  --s1:       #0E1118;
  --s2:       #141923;
  --s3:       #1C2333;
  --border:   rgba(255,255,255,0.07);
  --border2:  rgba(255,255,255,0.12);
  --primary:  #7C83F5;
  --primary2: rgba(124,131,245,0.15);
  --success:  #3DD598;
  --success2: rgba(61,213,152,0.15);
  --danger:   #FF6B6B;
  --danger2:  rgba(255,107,107,0.15);
  --warning:  #FFB547;
  --warning2: rgba(255,181,71,0.15);
  --info:     #38BDF8;
  --info2:    rgba(56,189,248,0.15);
  --text:     #E8EAF2;
  --text2:    #8B93B0;
  --text3:    #4A5270;
  --r:        14px;
  --r-sm:     10px;
  --r-lg:     20px;
  --shadow:   0 4px 24px rgba(0,0,0,0.4);
}

html, body { background: var(--bg); color: var(--text); font-family: 'Outfit', sans-serif; font-size: 15px; line-height: 1.5; overflow-x: hidden; }

.fin-app { min-height: 100vh; display: flex; flex-direction: column; width: 100%; overflow-x: hidden; }

/* ── NAVEGAÇÃO ── */
.nav-bottom {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 100;
  background: rgba(14,17,24,0.96); backdrop-filter: blur(24px);
  border-top: 1px solid var(--border);
  display: flex; justify-content: space-around; align-items: center;
  padding: 8px 0 max(12px, env(safe-area-inset-bottom));
}
.nav-btn {
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  padding: 6px 10px; border-radius: 12px; border: none; background: transparent;
  color: var(--text3); cursor: pointer; transition: all 0.2s;
  font-family: 'Outfit', sans-serif; font-size: 10px; font-weight: 500;
  min-width: 48px;
}
.nav-btn svg { width: 20px; height: 20px; stroke-width: 1.8; }
.nav-btn:hover { color: var(--text2); }
.nav-btn.active { color: var(--primary); }
.nav-btn.active .nav-dot {
  display: block; width: 4px; height: 4px; border-radius: 2px;
  background: var(--primary); margin: 0 auto;
}
.nav-dot { display: none; }

@media (min-width: 768px) {
  .nav-bottom { display: none; }
  .nav-side {
    position: fixed; top: 0; left: 0; bottom: 0; z-index: 100;
    width: 220px; background: var(--s1); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; padding: 24px 12px;
  }
  .nav-logo {
    display: flex; align-items: center; gap: 10px;
    padding: 0 12px; margin-bottom: 28px;
  }
  .nav-logo-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: var(--primary2); display: flex; align-items: center; justify-content: center;
  }
  .nav-logo-text { font-size: 17px; font-weight: 800; letter-spacing: -0.3px; }
  .nav-side-btn {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; border-radius: 10px; border: none; background: transparent;
    color: var(--text2); cursor: pointer; transition: all 0.2s;
    font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 500;
    width: 100%; text-align: left; margin-bottom: 2px;
  }
  .nav-side-btn svg { width: 18px; height: 18px; flex-shrink: 0; stroke-width: 1.8; }
  .nav-side-btn:hover { background: var(--s2); color: var(--text); }
  .nav-side-btn.active { background: var(--primary2); color: var(--primary); }
  .main { margin-left: 220px; }
}

.main { padding-bottom: 80px; }
@media (min-width: 768px) { .main { padding-bottom: 0; } }

.page { padding: 20px 16px; max-width: 860px; margin: 0 auto; }
@media (min-width: 768px) { .page { padding: 28px 32px; } }

/* ── CARDS ── */
.card {
  background: var(--s1); border: 1px solid var(--border);
  border-radius: var(--r); padding: 20px;
}
.card-sm { padding: 14px 16px; }
.card + .card { margin-top: 12px; }

/* ── TIPOGRAFIA ── */
h1 { font-size: clamp(24px, 6vw, 32px); font-weight: 800; letter-spacing: -0.5px; line-height: 1.1; }
h2 { font-size: 18px; font-weight: 700; letter-spacing: -0.2px; }
h3 { font-size: 15px; font-weight: 600; }
.mono { font-family: 'JetBrains Mono', monospace; }
.big-num { font-family: 'JetBrains Mono', monospace; font-size: clamp(28px, 8vw, 44px); font-weight: 700; letter-spacing: -2px; line-height: 1; }
.text-muted { color: var(--text2); font-size: 13px; }
.text-sm { font-size: 13px; }
.text-xs { font-size: 11px; }

/* ── BOTÕES ── */
.btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 10px 18px; border-radius: var(--r-sm); border: none;
  font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 600;
  cursor: pointer; transition: all 0.18s; white-space: nowrap;
}
.btn svg { width: 16px; height: 16px; flex-shrink: 0; }
.btn-primary { background: var(--primary); color: #0A0C16; }
.btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); }
.btn-ghost { background: var(--s2); color: var(--text2); border: 1px solid var(--border); }
.btn-ghost:hover { background: var(--s3); color: var(--text); }
.btn-danger { background: var(--danger2); color: var(--danger); }
.btn-success { background: var(--success2); color: var(--success); }
.btn-warning { background: var(--warning2); color: var(--warning); }
.btn-sm { padding: 6px 12px; font-size: 12px; border-radius: 8px; }
.btn-icon { padding: 8px; border-radius: 8px; }
.btn-icon svg { width: 15px; height: 15px; }
.btn-full { width: 100%; justify-content: center; }

/* ── FORMULÁRIOS ── */
.form-group { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
.form-label { font-size: 12px; font-weight: 600; color: var(--text2); text-transform: uppercase; letter-spacing: 0.5px; }
.form-row { display: grid; grid-template-columns: 1fr; gap: 0; }
@media (min-width: 480px) { .form-row { grid-template-columns: 1fr 1fr; gap: 12px; } }
input, select, textarea {
  background: var(--s2); border: 1px solid var(--border);
  color: var(--text); border-radius: var(--r-sm);
  padding: 10px 14px; font-family: 'Outfit', sans-serif; font-size: 14px;
  width: 100%; transition: border-color 0.2s; outline: none;
  -webkit-appearance: none;
}
input:focus, select:focus, textarea:focus { border-color: var(--primary); background: rgba(124,131,245,0.04); }
input::placeholder, textarea::placeholder { color: var(--text3); }
select option { background: var(--s2); color: var(--text); }

/* ── PROGRESS ── */
.prog-wrap { background: var(--s3); border-radius: 20px; height: 7px; overflow: hidden; }
.prog-bar { height: 100%; border-radius: 20px; transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }

/* ── BADGES ── */
.badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 700;
  letter-spacing: 0.3px; text-transform: uppercase;
}
.badge-essential { background: var(--danger2); color: var(--danger); }
.badge-important  { background: var(--warning2); color: var(--warning); }
.badge-optional   { background: var(--primary2); color: var(--primary); }
.badge-success    { background: var(--success2); color: var(--success); }
.badge-info       { background: var(--info2); color: var(--info); }

/* ── ALERTAS ── */
.alert { border-radius: 10px; padding: 10px 14px; display: flex; align-items: flex-start; gap: 9px; font-size: 13px; font-weight: 500; margin-bottom: 10px; }
.alert svg { width: 16px; height: 16px; flex-shrink: 0; margin-top: 1px; }
.alert-warning { background: var(--warning2); color: var(--warning); }
.alert-danger   { background: var(--danger2); color: var(--danger); }
.alert-success  { background: var(--success2); color: var(--success); }
.alert-info     { background: var(--info2); color: var(--info); }

/* ── MODAL ── */
.modal-bg {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(0,0,0,0.7); backdrop-filter: blur(6px);
  display: flex; align-items: flex-end; justify-content: center;
}
@media (min-width: 640px) { .modal-bg { align-items: center; } }
.modal-box {
  background: var(--s1); border: 1px solid var(--border2);
  border-radius: 22px 22px 0 0; padding: 24px 20px 28px;
  width: 100%; max-width: 460px; max-height: 92vh; overflow-y: auto;
  animation: modalUp 0.28s cubic-bezier(0.34,1.56,0.64,1);
}
@media (min-width: 640px) { .modal-box { border-radius: 22px; } }
@keyframes modalUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.modal-handle { width: 40px; height: 4px; background: var(--border2); border-radius: 2px; margin: -10px auto 16px; }

/* ── ITEMS DE LISTA ── */
.list-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 13px 0; border-bottom: 1px solid var(--border); gap: 8px;
}
.list-item:last-child { border-bottom: none; }
.list-item-left { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; overflow: hidden; }
.list-item-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.cat-ico {
  width: 38px; height: 38px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; flex-shrink: 0;
}
.cat-ico svg { width: 18px; height: 18px; }

/* ── UTILIDADES ── */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.items-start { align-items: flex-start; }
.justify-between { justify-content: space-between; }
.justify-end { justify-content: flex-end; }
.gap-1 { gap: 4px; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }
.gap-5 { gap: 20px; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.grid-3 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
@media (min-width: 480px) { .grid-3 { grid-template-columns: repeat(3, 1fr); } }
.mt-1 { margin-top: 4px; }
.mt-2 { margin-top: 8px; }
.mt-3 { margin-top: 12px; }
.mt-4 { margin-top: 16px; }
.mt-5 { margin-top: 20px; }
.mb-2 { margin-bottom: 8px; }
.mb-3 { margin-bottom: 12px; }
.mb-4 { margin-bottom: 16px; }
.w-full { width: 100%; }
.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.text-right { text-align: right; }
.font-bold { font-weight: 700; }
.font-semi { font-weight: 600; }
.color-success { color: var(--success); }
.color-danger  { color: var(--danger); }
.color-warning { color: var(--warning); }
.color-primary { color: var(--primary); }
.color-muted   { color: var(--text2); }
.divider { height: 1px; background: var(--border); margin: 16px 0; }
.section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.empty { text-align: center; padding: 36px 20px; color: var(--text3); }
.empty svg { width: 40px; height: 40px; margin: 0 auto 10px; display: block; opacity: 0.4; }

/* ── HEADER DA PÁGINA ── */
.page-header { margin-bottom: 20px; }
.page-month-nav { display: flex; align-items: center; gap: 8px; margin-top: 6px; }
.month-badge {
  background: var(--s2); border: 1px solid var(--border);
  border-radius: 20px; padding: 4px 14px; font-size: 13px; font-weight: 600;
  color: var(--text2);
}

/* ── STAT CARDS ── */
.stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
@media (min-width: 640px) { .stat-grid { grid-template-columns: repeat(4, 1fr); } }
.stat-card {
  background: var(--s1); border: 1px solid var(--border);
  border-radius: var(--r); padding: 16px;
}
.stat-label { font-size: 12px; color: var(--text2); font-weight: 500; margin-bottom: 6px; }
.stat-value { font-size: 16px; font-weight: 800; font-family: 'JetBrains Mono', monospace; letter-spacing: -0.5px; word-break: break-all; }
@media (min-width: 480px) { .stat-value { font-size: 20px; } }
.stat-sub { font-size: 11px; color: var(--text3); margin-top: 3px; }

/* ── CREDIT CARD VISUAL ── */
.cc-visual {
  border-radius: 16px; padding: 22px 24px; position: relative; overflow: hidden;
  min-height: 160px; cursor: pointer; transition: transform 0.2s;
}
.cc-visual:hover { transform: translateY(-2px); }
.cc-shine {
  position: absolute; top: -40px; right: -40px; width: 150px; height: 150px;
  border-radius: 50%; background: rgba(255,255,255,0.06);
}

/* ── SCROLL ── */
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--s3); border-radius: 4px; }

/* ── ANIMS ── */
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.fade-in { animation: fadeIn 0.3s ease; }

/* ── CHIP ── */
.chip {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all 0.18s;
  border: 1px solid var(--border); background: transparent; color: var(--text2);
  font-family: 'Outfit', sans-serif; white-space: nowrap; flex-shrink: 0;
}
.chip:hover, .chip.active { background: var(--primary2); color: var(--primary); border-color: rgba(124,131,245,0.3); }

/* ── MOBILE FIXES ── */
* { -webkit-tap-highlight-color: transparent; }
img, svg { max-width: 100%; }
.scroll-x { overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 4px; }
.nowrap { white-space: nowrap; }
@media (max-width: 400px) {
  .card { padding: 14px 12px; }
  .big-num { font-size: 26px; letter-spacing: -1px; }
  .btn { padding: 9px 14px; font-size: 13px; }
  .btn-sm { padding: 6px 10px; font-size: 11px; }
  .page { padding: 16px 12px; }
}
`;

// ─────────────────────────────────────────────
//  CONSTANTES
// ─────────────────────────────────────────────
const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const MONTHS_SHORT = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];

const PRIORITY = {
  essential: { label: "Essencial", className: "badge-essential", dot: "🔴" },
  important:  { label: "Importante", className: "badge-important",  dot: "🟡" },
  optional:   { label: "Opcional",   className: "badge-optional",   dot: "🔵" },
};

const CARD_COLORS = ["#7C83F5","#3DD598","#FF6B6B","#FFB547","#38BDF8","#E879F9","#F97316","#84CC16"];

const DEFAULT_CATS = [
  { id:"c1", name:"Mercado",      limit:800,  color:"#3DD598", priority:"essential", icon:"🛒" },
  { id:"c2", name:"Restaurantes", limit:400,  color:"#FFB547", priority:"important",  icon:"🍽️" },
  { id:"c3", name:"Transporte",   limit:300,  color:"#38BDF8", priority:"essential", icon:"🚌" },
  { id:"c4", name:"Lazer",        limit:400,  color:"#E879F9", priority:"optional",   icon:"🎉" },
  { id:"c5", name:"Saúde",        limit:200,  color:"#FF6B6B", priority:"essential", icon:"💊" },
  { id:"c6", name:"Vestuário",    limit:200,  color:"#7C83F5", priority:"optional",   icon:"👕" },
];

const ICON_OPTS = ["🛒","🍽️","🚌","🎉","💊","👕","📱","💡","🎓","🐾","🏠","✈️","🎮","💄","🔧","📚","🏋️","🎵","☕","🍕"];

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9);
const fmt = (n) => new Intl.NumberFormat("pt-BR", { style:"currency", currency:"BRL" }).format(n ?? 0);
const fmtShort = (n) => {
  const abs = Math.abs(n);
  if (abs >= 1000) return (n < 0 ? "-" : "") + "R$" + (abs/1000).toFixed(1) + "k";
  return fmt(n);
};
const fmtDate = (d) => new Date(d).toLocaleDateString("pt-BR");
const daysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
const today = new Date();

function isSameMonth(dateStr, month, year) {
  const d = new Date(dateStr);
  return d.getMonth() === month && d.getFullYear() === year;
}

function pctColor(pct) {
  if (pct >= 100) return "var(--danger)";
  if (pct >= 80)  return "var(--warning)";
  return "var(--success)";
}

function getSpendingAlerts(categories, transactions, month, year) {
  const alerts = [];
  categories.forEach(cat => {
    const spent = transactions
      .filter(t => t.categoryId === cat.id && isSameMonth(t.date, month, year))
      .reduce((s,t) => s + t.amount, 0);
    const pct = cat.limit > 0 ? (spent / cat.limit) * 100 : 0;
    if (pct >= 100)
      alerts.push({ type:"danger", msg:`${cat.icon} ${cat.name}: limite ultrapassado em ${fmt(spent - cat.limit)}` });
    else if (pct >= 80)
      alerts.push({ type:"warning", msg:`${cat.icon} ${cat.name}: ${pct.toFixed(0)}% do limite atingido` });
  });
  return alerts;
}

// ─────────────────────────────────────────────
//  ESTADO INICIAL
// ─────────────────────────────────────────────
const INIT_STATE = {
  income: [{ id:"i1", name:"Salário", amount:5000, recurring:true }],
  fixedExpenses: [
    { id:"f1", name:"Aluguel", amount:1500, dueDay:5, priority:"essential" },
    { id:"f2", name:"Internet", amount:120, dueDay:10, priority:"essential" },
    { id:"f3", name:"Streaming", amount:55, dueDay:15, priority:"optional" },
  ],
  variableCategories: DEFAULT_CATS,
  transactions: [],
  creditCards: [],
  cardTransactions: [],
  goals: [],
  currentMonth: today.getMonth(),
  currentYear:  today.getFullYear(),
};

// ─────────────────────────────────────────────
//  REDUCER
// ─────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case "LOAD":        return action.payload;
    case "ADD_INCOME":  return { ...state, income:[...state.income, {...action.p, id:uid()}] };
    case "UPD_INCOME":  return { ...state, income: state.income.map(x => x.id===action.p.id ? action.p : x) };
    case "DEL_INCOME":  return { ...state, income: state.income.filter(x => x.id!==action.id) };
    case "ADD_FIXED":   return { ...state, fixedExpenses:[...state.fixedExpenses, {...action.p, id:uid()}] };
    case "UPD_FIXED":   return { ...state, fixedExpenses: state.fixedExpenses.map(x => x.id===action.p.id ? action.p : x) };
    case "DEL_FIXED":   return { ...state, fixedExpenses: state.fixedExpenses.filter(x => x.id!==action.id) };
    case "ADD_CAT":     return { ...state, variableCategories:[...state.variableCategories, {...action.p, id:uid()}] };
    case "UPD_CAT":     return { ...state, variableCategories: state.variableCategories.map(x => x.id===action.p.id ? action.p : x) };
    case "DEL_CAT":     return { ...state, variableCategories: state.variableCategories.filter(x => x.id!==action.id) };
    case "ADD_TX":      return { ...state, transactions:[...state.transactions, {...action.p, id:uid(), date: action.p.date || new Date().toISOString()}] };
    case "DEL_TX":      return { ...state, transactions: state.transactions.filter(x => x.id!==action.id) };
    case "ADD_CARD":    return { ...state, creditCards:[...state.creditCards, {...action.p, id:uid()}] };
    case "DEL_CARD":    return { ...state, creditCards: state.creditCards.filter(x => x.id!==action.id) };
    case "ADD_CARD_TX": return { ...state, cardTransactions:[...state.cardTransactions, {...action.p, id:uid(), date: action.p.date || new Date().toISOString()}] };
    case "DEL_CARD_TX": return { ...state, cardTransactions: state.cardTransactions.filter(x => x.id!==action.id) };
    case "ADD_GOAL":    return { ...state, goals:[...state.goals, {...action.p, id:uid()}] };
    case "UPD_GOAL":    return { ...state, goals: state.goals.map(x => x.id===action.p.id ? action.p : x) };
    case "DEL_GOAL":    return { ...state, goals: state.goals.filter(x => x.id!==action.id) };
    case "SET_MONTH":   return { ...state, currentMonth:action.month, currentYear:action.year };
    default: return state;
  }
}

// ─────────────────────────────────────────────
//  STORAGE
// ─────────────────────────────────────────────
const STORE_KEY = "financeapp_v2";
function saveState(s) { try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch(_) {} }
function loadState() { try { const v = localStorage.getItem(STORE_KEY); return v ? JSON.parse(v) : null; } catch(_) { return null; } }

// ─────────────────────────────────────────────
//  COMPONENTES COMPARTILHADOS
// ─────────────────────────────────────────────

function StylesInject() {
  return <style dangerouslySetInnerHTML={{ __html: STYLES }} />;
}

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const fn = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);
  return (
    <div className="modal-bg" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-handle" />
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><X size={15}/></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ProgressBar({ spent, limit, color }) {
  const pct = limit > 0 ? Math.min((spent/limit)*100, 100) : 0;
  const raw = limit > 0 ? (spent/limit)*100 : 0;
  const fill = raw>=100?"var(--danger)":raw>=80?"var(--warning)":color||"var(--success)";
  return (
    <div className="prog-wrap">
      <div className="prog-bar" style={{ width:`${pct}%`, background:fill }} />
    </div>
  );
}

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-2">
        <span className="stat-label">{label}</span>
        {icon && <span style={{fontSize:18}}>{icon}</span>}
      </div>
      <div className="stat-value" style={color?{color}:{}}>{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

function AlertBanner({ type, msg }) {
  const Icon = type==="danger"?AlertTriangle:type==="warning"?Bell:CheckCircle2;
  return (
    <div className={`alert alert-${type}`}>
      <Icon size={16}/><span>{msg}</span>
    </div>
  );
}

function MonthNav({ month, year, onChange }) {
  function prev() {
    if (month===0) onChange(11, year-1); else onChange(month-1, year);
  }
  function next() {
    if (month===11) onChange(0, year+1); else onChange(month+1, year);
  }
  return (
    <div className="page-month-nav">
      <button className="btn btn-ghost btn-icon btn-sm" onClick={prev}><ChevronLeft size={15}/></button>
      <span className="month-badge">{MONTHS[month]} {year}</span>
      <button className="btn btn-ghost btn-icon btn-sm" onClick={next}><ChevronRight size={15}/></button>
    </div>
  );
}

function Empty({ icon, text }) {
  return (
    <div className="empty">
      <div style={{fontSize:36,marginBottom:8}}>{icon||"📭"}</div>
      <p>{text||"Nenhum item ainda"}</p>
    </div>
  );
}

// ─────────────────────────────────────────────
//  DASHBOARD
// ─────────────────────────────────────────────
function Dashboard({ state, dispatch }) {
  const { income, fixedExpenses, variableCategories, transactions, creditCards, cardTransactions, currentMonth, currentYear } = state;

  const stats = useMemo(() => {
    const totalIncome = income.reduce((s,x) => s + x.amount, 0);
    const totalFixed  = fixedExpenses.reduce((s,x) => s + x.amount, 0);
    const monthTxs    = transactions.filter(t => isSameMonth(t.date, currentMonth, currentYear));
    const totalVar    = monthTxs.reduce((s,t) => s + t.amount, 0);
    const monthCards  = cardTransactions.filter(t => isSameMonth(t.date, currentMonth, currentYear));
    const totalCard   = monthCards.reduce((s,t) => s + t.amount, 0);
    const totalDebt   = totalFixed + totalVar + totalCard;
    const available   = totalIncome - totalDebt;
    const dim = daysInMonth(currentMonth, currentYear);
    const isCurrentMonth = currentMonth===today.getMonth() && currentYear===today.getFullYear();
    const daysPassed = isCurrentMonth ? today.getDate() : dim;
    const daysLeft   = Math.max(dim - daysPassed + 1, 1);
    const dailyBudget = available / daysLeft;
    const dailyActual = daysPassed > 0 ? totalVar / daysPassed : 0;
    const forecastVar = dailyActual * dim;
    const forecastBalance = totalIncome - totalFixed - forecastVar - totalCard;
    const savings = totalIncome - totalDebt;

    return { totalIncome, totalFixed, totalVar, totalCard, totalDebt, available, dailyBudget, daysLeft, forecastBalance, savings, monthTxs };
  }, [income, fixedExpenses, transactions, cardTransactions, currentMonth, currentYear]);

  const alerts = useMemo(
    () => getSpendingAlerts(variableCategories, transactions, currentMonth, currentYear),
    [variableCategories, transactions, currentMonth, currentYear]
  );

  const catData = useMemo(() => {
    return variableCategories.map(cat => {
      const spent = transactions
        .filter(t => t.categoryId===cat.id && isSameMonth(t.date, currentMonth, currentYear))
        .reduce((s,t) => s+t.amount, 0);
      return { ...cat, spent, pct: cat.limit>0 ? (spent/cat.limit)*100 : 0 };
    }).filter(c => c.spent > 0 || c.limit > 0).slice(0, 6);
  }, [variableCategories, transactions, currentMonth, currentYear]);

  const recent = useMemo(() =>
    [...stats.monthTxs].sort((a,b) => new Date(b.date)-new Date(a.date)).slice(0,5),
    [stats.monthTxs]
  );

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1>Visão Geral</h1>
        <MonthNav month={currentMonth} year={currentYear}
          onChange={(m,y) => dispatch({type:"SET_MONTH", month:m, year:y})} />
      </div>

      {/* SALDO PRINCIPAL */}
      <div className="card mb-4" style={{background:"linear-gradient(135deg,#0E1118 0%,#141923 100%)", border:"1px solid rgba(124,131,245,0.2)"}}>
        <div className="text-muted mb-2">Saldo disponível</div>
        <div className="big-num" style={{color: stats.available >= 0 ? "var(--success)" : "var(--danger)"}}>
          {fmt(stats.available)}
        </div>
        <div className="flex items-center gap-3 mt-3" style={{flexWrap:"wrap"}}>
          <span className="text-muted text-sm">
            💡 Você pode gastar <span style={{color:"var(--warning)", fontWeight:700}}>{fmt(Math.max(stats.dailyBudget,0))}</span>/dia
          </span>
          <span className="text-muted text-sm">{stats.daysLeft} dias restantes</span>
        </div>
        <div className="divider" />
        <div className="flex gap-4" style={{flexWrap:"wrap", rowGap:8}}>
          <div>
            <div className="text-xs color-muted">Renda</div>
            <div className="text-sm font-semi color-success">+{fmt(stats.totalIncome)}</div>
          </div>
          <div>
            <div className="text-xs color-muted">Fixos</div>
            <div className="text-sm font-semi color-danger">-{fmt(stats.totalFixed)}</div>
          </div>
          <div>
            <div className="text-xs color-muted">Variáveis</div>
            <div className="text-sm font-semi color-warning">-{fmt(stats.totalVar)}</div>
          </div>
          {stats.totalCard > 0 && (
            <div>
              <div className="text-xs color-muted">Crédito</div>
              <div className="text-sm font-semi" style={{color:"var(--info)"}}>-{fmt(stats.totalCard)}</div>
            </div>
          )}
        </div>
      </div>

      {/* STATS GRID */}
      <div className="stat-grid mb-4">
        <StatCard label="Renda Total" value={fmt(stats.totalIncome)} icon="💰" color="var(--success)" />
        <StatCard label="Gastos Fixos" value={fmt(stats.totalFixed)} sub={`${((stats.totalFixed/stats.totalIncome)*100||0).toFixed(0)}% da renda`} icon="🏠" color="var(--danger)" />
        <StatCard label="Gastos Variáveis" value={fmt(stats.totalVar)} icon="🛒" color="var(--warning)" />
        <StatCard label="Previsão Final" value={fmt(stats.forecastBalance)} sub="se mantiver ritmo atual" icon="🔮" color={stats.forecastBalance>=0?"var(--success)":"var(--danger)"} />
      </div>

      {/* PRIORITY ALLOCATION STRIP */}
      {state.fixedExpenses.length > 0 && (() => {
        const byP = {
          essential: state.fixedExpenses.filter(x=>(x.priority||"essential")==="essential").reduce((s,x)=>s+x.amount,0),
          important: state.fixedExpenses.filter(x=>x.priority==="important").reduce((s,x)=>s+x.amount,0),
          optional:  state.fixedExpenses.filter(x=>x.priority==="optional").reduce((s,x)=>s+x.amount,0),
        };
        const savVal = Math.max(0, stats.totalIncome - stats.totalFixed - stats.totalVar - stats.totalCard);
        return (
          <div className="card mb-4" style={{padding:"14px 16px"}}>
            <div style={{fontSize:12,fontWeight:700,color:"var(--text2)",textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>Alocação por Prioridade</div>
            <div style={{display:"flex",height:10,borderRadius:20,overflow:"hidden",gap:2,marginBottom:10}}>
              {[
                {pct:stats.totalIncome>0?(byP.essential/stats.totalIncome)*100:0, color:"#FF6B6B"},
                {pct:stats.totalIncome>0?(byP.important/stats.totalIncome)*100:0,  color:"#FFB547"},
                {pct:stats.totalIncome>0?(byP.optional/stats.totalIncome)*100:0,   color:"#7C83F5"},
                {pct:stats.totalIncome>0?(stats.totalVar/stats.totalIncome)*100:0, color:"rgba(56,189,248,0.6)"},
                {pct:stats.totalIncome>0?(savVal/stats.totalIncome)*100:0,          color:"rgba(61,213,152,0.5)"},
              ].filter(x=>x.pct>0).map((x,i)=>(
                <div key={i} style={{flex:x.pct,background:x.color,minWidth:3}} />
              ))}
            </div>
            <div style={{display:"flex",gap:"8px 16px",flexWrap:"wrap"}}>
              {[
                {dot:"🔴",label:"Essencial",val:byP.essential,color:"#FF6B6B"},
                {dot:"🟡",label:"Importante",val:byP.important,color:"#FFB547"},
                {dot:"🔵",label:"Opcional",val:byP.optional,color:"#7C83F5"},
                {dot:"💚",label:"Poupança",val:savVal,color:"#3DD598"},
              ].filter(x=>x.val>0).map(x=>(
                <div key={x.label} style={{display:"flex",alignItems:"center",gap:5}}>
                  <div style={{width:8,height:8,borderRadius:2,background:x.color,flexShrink:0}}/>
                  <span style={{fontSize:11,color:"var(--text3)"}}>{x.dot} {fmt(x.val)}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ALERTAS */}
      {alerts.length > 0 && (
        <div className="mb-4">
          {alerts.map((a,i) => <AlertBanner key={i} type={a.type} msg={a.msg} />)}
        </div>
      )}

      {/* CATEGORIAS */}
      {catData.length > 0 && (
        <div className="card mb-4">
          <div className="section-head">
            <h3>Limites por Categoria</h3>
          </div>
          {catData.map(cat => (
            <div key={cat.id} className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span style={{fontSize:16}}>{cat.icon}</span>
                  <span className="text-sm font-semi">{cat.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs color-muted">{fmt(cat.spent)} / {fmt(cat.limit)}</span>
                  <span className="text-xs font-bold" style={{color:pctColor(cat.pct)}}>{cat.pct.toFixed(0)}%</span>
                </div>
              </div>
              <ProgressBar spent={cat.spent} limit={cat.limit} color={cat.color} />
            </div>
          ))}
        </div>
      )}

      {/* TRANSAÇÕES RECENTES */}
      {recent.length > 0 && (
        <div className="card mb-4">
          <div className="section-head">
            <h3>Últimas Transações</h3>
          </div>
          {recent.map(tx => {
            const cat = variableCategories.find(c => c.id===tx.categoryId);
            return (
              <div key={tx.id} className="list-item">
                <div className="list-item-left">
                  <div className="cat-ico" style={{background:`${cat?.color||"#7C83F5"}22`}}>
                    <span style={{fontSize:18}}>{cat?.icon||"💸"}</span>
                  </div>
                  <div className="truncate">
                    <div className="text-sm font-semi truncate">{tx.description||cat?.name||"Gasto"}</div>
                    <div className="text-xs color-muted">{fmtDate(tx.date)} · {cat?.name}</div>
                  </div>
                </div>
                <div className="text-sm font-bold color-danger">-{fmt(tx.amount)}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* GRÁFICO RESUMO */}
      {catData.length > 0 && (
        <div className="card">
          <h3 className="mb-4">Gastos por Categoria</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={catData.filter(c=>c.spent>0)} margin={{top:0,right:0,left:0,bottom:0}}>
              <XAxis dataKey="icon" tick={{fill:"#8B93B0", fontSize:14}} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{background:"#0E1118",border:"1px solid #1C2333",borderRadius:10,fontFamily:"Outfit"}}
                labelStyle={{color:"#E8EAF2"}}
                formatter={(v,n,p) => [fmt(v), p.payload.name]}
              />
              <Bar dataKey="spent" radius={[6,6,0,0]}>
                {catData.filter(c=>c.spent>0).map((c,i) => <Cell key={i} fill={c.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  RECEITAS
// ─────────────────────────────────────────────
function Income({ state, dispatch }) {
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ name:"", amount:"", recurring:true });

  const total = state.income.reduce((s,x) => s+x.amount, 0);

  function openAdd() { setForm({name:"",amount:"",recurring:true}); setEdit(null); setModal(true); }
  function openEdit(item) { setForm({name:item.name,amount:String(item.amount),recurring:item.recurring}); setEdit(item); setModal(true); }
  function save() {
    if (!form.name.trim() || !form.amount) return;
    const p = { name:form.name.trim(), amount:parseFloat(form.amount), recurring:form.recurring };
    if (edit) dispatch({ type:"UPD_INCOME", p:{...edit,...p} });
    else dispatch({ type:"ADD_INCOME", p });
    setModal(false);
  }

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1>Receitas</h1>
      </div>

      <div className="card mb-4" style={{background:"var(--success2)",border:"1px solid rgba(61,213,152,0.2)"}}>
        <div className="text-muted text-sm">Renda total mensal</div>
        <div className="big-num color-success">{fmt(total)}</div>
      </div>

      <div className="card">
        <div className="section-head">
          <h3>Fontes de Renda</h3>
          <button className="btn btn-primary btn-sm" onClick={openAdd}><Plus size={14}/>Adicionar</button>
        </div>
        {state.income.length === 0 ? <Empty icon="💰" text="Nenhuma fonte de renda cadastrada" /> : (
          state.income.map(item => (
            <div key={item.id} className="list-item">
              <div className="list-item-left">
                <div className="cat-ico" style={{background:"var(--success2)"}}>
                  <DollarSign size={20} color="var(--success)" />
                </div>
                <div>
                  <div className="text-sm font-semi">{item.name}</div>
                  <span className="badge badge-success" style={{fontSize:10}}>{item.recurring?"Recorrente":"Eventual"}</span>
                </div>
              </div>
              <div className="flex items-center gap-2" style={{flexShrink:0}}>
                <div className="font-bold color-success mono" style={{fontSize:13}}>{fmt(item.amount)}</div>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={()=>openEdit(item)}><Edit2 size={13}/></button>
                <button className="btn btn-danger btn-icon btn-sm" onClick={()=>dispatch({type:"DEL_INCOME",id:item.id})}><Trash2 size={13}/></button>
              </div>
            </div>
          ))
        )}
      </div>

      {modal && (
        <Modal title={edit?"Editar Receita":"Nova Receita"} onClose={()=>setModal(false)}>
          <div className="form-group"><label className="form-label">Nome</label>
            <input placeholder="Ex: Salário, Freelance..." value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          </div>
          <div className="form-group"><label className="form-label">Valor (R$)</label>
            <input type="number" placeholder="0,00" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Tipo</label>
            <select value={form.recurring?"sim":"nao"} onChange={e=>setForm({...form,recurring:e.target.value==="sim"})}>
              <option value="sim">Recorrente (todo mês)</option>
              <option value="nao">Eventual (uma vez)</option>
            </select>
          </div>
          <button className="btn btn-primary btn-full mt-3" onClick={save}>💾 Salvar</button>
        </Modal>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  PRIORIDADES (GASTOS FIXOS + VISÃO POR TIER)
// ─────────────────────────────────────────────
const PRIORITY_CONFIG = {
  essential: {
    label: "Essencial",
    desc: "Não pode cortar — sobrevivência e obrigações",
    color: "#FF6B6B",
    bg: "rgba(255,107,107,0.08)",
    border: "rgba(255,107,107,0.25)",
    dot: "🔴",
    icon: "🛡️",
    tip: "Gastos essenciais devem ficar abaixo de 50% da renda.",
  },
  important: {
    label: "Importante",
    desc: "Relevantes para qualidade de vida, mas ajustáveis",
    color: "#FFB547",
    bg: "rgba(255,181,71,0.08)",
    border: "rgba(255,181,71,0.25)",
    dot: "🟡",
    icon: "⚡",
    tip: "Revise se algum item pode ser reduzido sem impacto real.",
  },
  optional: {
    label: "Opcional",
    desc: "Conforto e lazer — primeira linha de corte",
    color: "#7C83F5",
    bg: "rgba(124,131,245,0.08)",
    border: "rgba(124,131,245,0.25)",
    dot: "🔵",
    icon: "✨",
    tip: "Em caso de aperto, esses são os primeiros a revisar.",
  },
};

function PriorityTierCard({ tier, items, totalIncome, onEdit, onDelete, onAdd }) {
  const cfg = PRIORITY_CONFIG[tier];
  const total = items.reduce((s, x) => s + x.amount, 0);
  const pct = totalIncome > 0 ? (total / totalIncome) * 100 : 0;
  const [expanded, setExpanded] = useState(true);

  if (items.length === 0) return null;

  return (
    <div style={{
      borderRadius: 16, border: `1px solid ${cfg.border}`,
      background: cfg.bg, overflow: "hidden", marginBottom: 14,
    }}>
      {/* HEADER DO TIER */}
      <button onClick={() => setExpanded(e => !e)} style={{
        width: "100%", background: "transparent", border: "none",
        cursor: "pointer", padding: "14px 16px",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 12, flexShrink: 0,
          background: `${cfg.color}22`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18,
        }}>{cfg.icon}</div>

        <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: cfg.color }}>{cfg.dot} {cfg.label}</span>
            <span style={{
              background: `${cfg.color}22`, color: cfg.color,
              fontSize: 10, fontWeight: 800, padding: "2px 8px",
              borderRadius: 20, letterSpacing: 0.5,
            }}>{items.length} {items.length === 1 ? "item" : "itens"}</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{cfg.desc}</div>
        </div>

        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontFamily: "JetBrains Mono", fontWeight: 800, fontSize: 15, color: cfg.color }}>{fmt(total)}</div>
          <div style={{ fontSize: 11, color: "var(--text3)" }}>{pct.toFixed(1)}% da renda</div>
        </div>
      </button>

      {/* BARRA DE % */}
      <div style={{ height: 4, background: "rgba(255,255,255,0.05)", margin: "0 16px" }}>
        <div style={{
          height: "100%", width: `${Math.min(pct, 100)}%`,
          background: cfg.color, borderRadius: 4,
          transition: "width 0.6s cubic-bezier(0.34,1.56,0.64,1)",
        }} />
      </div>

      {/* ITENS */}
      {expanded && (
        <div style={{ padding: "8px 16px 14px" }}>
          <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 10, marginBottom: 8, fontWeight: 600, letterSpacing: 0.4, textTransform: "uppercase" }}>
            💡 {cfg.tip}
          </div>
          {items.map(item => (
            <div key={item.id} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 0", borderTop: "1px solid rgba(255,255,255,0.05)",
            }}>
              <div style={{
                width: 6, height: 32, borderRadius: 3,
                background: cfg.color, flexShrink: 0,
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }} className="truncate">{item.name}</div>
                {item.dueDay && (
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>Vence dia {item.dueDay}</div>
                )}
              </div>
              <div style={{ fontFamily: "JetBrains Mono", fontWeight: 700, fontSize: 14, color: cfg.color, flexShrink: 0 }}>
                {fmt(item.amount)}
              </div>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => onEdit(item)}><Edit2 size={12} /></button>
              <button className="btn btn-danger btn-icon btn-sm" onClick={() => onDelete(item.id)}><Trash2 size={12} /></button>
            </div>
          ))}
          <button
            onClick={() => onAdd(tier)}
            style={{
              marginTop: 10, width: "100%", padding: "9px",
              borderRadius: 10, border: `1px dashed ${cfg.border}`,
              background: "transparent", color: cfg.color,
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              fontFamily: "Outfit, sans-serif",
            }}>
            <Plus size={14} /> Adicionar {cfg.label}
          </button>
        </div>
      )}
    </div>
  );
}

function FixedExpenses({ state, dispatch }) {
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ name: "", amount: "", dueDay: "", priority: "essential" });

  const totalIncome = state.income.reduce((s, x) => s + x.amount, 0);
  const total = state.fixedExpenses.reduce((s, x) => s + x.amount, 0);

  const byPriority = useMemo(() => ({
    essential: state.fixedExpenses.filter(x => (x.priority || "essential") === "essential"),
    important:  state.fixedExpenses.filter(x => x.priority === "important"),
    optional:   state.fixedExpenses.filter(x => x.priority === "optional"),
  }), [state.fixedExpenses]);

  const essentialPct  = totalIncome > 0 ? (byPriority.essential.reduce((s,x)=>s+x.amount,0)  / totalIncome) * 100 : 0;
  const importantPct  = totalIncome > 0 ? (byPriority.important.reduce((s,x)=>s+x.amount,0)   / totalIncome) * 100 : 0;
  const optionalPct   = totalIncome > 0 ? (byPriority.optional.reduce((s,x)=>s+x.amount,0)    / totalIncome) * 100 : 0;
  const savingsPct    = Math.max(0, 100 - essentialPct - importantPct - optionalPct);

  function openAdd(priority = "essential") {
    setForm({ name: "", amount: "", dueDay: "", priority });
    setEdit(null); setModal(true);
  }
  function openEdit(item) {
    setForm({ name: item.name, amount: String(item.amount), dueDay: String(item.dueDay || ""), priority: item.priority || "essential" });
    setEdit(item); setModal(true);
  }
  function save() {
    if (!form.name.trim() || !form.amount) return;
    const p = { name: form.name.trim(), amount: parseFloat(form.amount), dueDay: parseInt(form.dueDay) || null, priority: form.priority };
    if (edit) dispatch({ type: "UPD_FIXED", p: { ...edit, ...p } });
    else dispatch({ type: "ADD_FIXED", p });
    setModal(false);
  }

  return (
    <div className="page fade-in">
      <div className="page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1>Prioridades</h1>
          <div className="text-muted text-sm mt-1">Visualize e reorganize seus gastos fixos</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => openAdd("essential")}>
          <Plus size={14} />Adicionar
        </button>
      </div>

      {/* BARRA DE ALOCAÇÃO DE RENDA */}
      <div className="card mb-4" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>
          Como sua renda é alocada
        </div>
        {/* BARRA SEGMENTADA */}
        <div style={{ display: "flex", height: 14, borderRadius: 20, overflow: "hidden", gap: 2, marginBottom: 12 }}>
          {essentialPct > 0 && <div style={{ flex: essentialPct, background: "#FF6B6B", borderRadius: "20px 0 0 20px", minWidth: 4, transition: "flex 0.6s" }} />}
          {importantPct > 0 && <div style={{ flex: importantPct, background: "#FFB547", minWidth: 4, transition: "flex 0.6s" }} />}
          {optionalPct  > 0 && <div style={{ flex: optionalPct,  background: "#7C83F5", minWidth: 4, transition: "flex 0.6s" }} />}
          {savingsPct   > 0 && <div style={{ flex: savingsPct,   background: "rgba(61,213,152,0.5)", borderRadius: "0 20px 20px 0", minWidth: 4, transition: "flex 0.6s" }} />}
        </div>
        {/* LEGENDA */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
          {[
            { label: "🔴 Essencial",  pct: essentialPct, color: "#FF6B6B",  val: byPriority.essential.reduce((s,x)=>s+x.amount,0) },
            { label: "🟡 Importante", pct: importantPct, color: "#FFB547",  val: byPriority.important.reduce((s,x)=>s+x.amount,0) },
            { label: "🔵 Opcional",   pct: optionalPct,  color: "#7C83F5",  val: byPriority.optional.reduce((s,x)=>s+x.amount,0) },
            { label: "💚 Poupança",   pct: savingsPct,   color: "#3DD598",  val: Math.max(0, totalIncome - total) },
          ].map(r => (
            <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: r.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)" }}>{r.label}</div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>{fmt(r.val)} · {r.pct.toFixed(1)}%</div>
              </div>
            </div>
          ))}
        </div>

        {/* INSIGHT AUTOMÁTICO */}
        <div style={{ marginTop: 12, padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {savingsPct < 10 ? (
            <div style={{ fontSize: 12, color: "#FF6B6B" }}>
              ⚠️ <strong>Atenção:</strong> Você está poupando apenas {savingsPct.toFixed(1)}% da renda. Revise gastos opcionais.
            </div>
          ) : optionalPct > 20 ? (
            <div style={{ fontSize: 12, color: "#FFB547" }}>
              💡 <strong>Dica:</strong> {optionalPct.toFixed(1)}% da renda em opcionais. Reduzir pode aumentar muito sua poupança.
            </div>
          ) : savingsPct >= 20 ? (
            <div style={{ fontSize: 12, color: "#3DD598" }}>
              ✅ <strong>Ótimo!</strong> Você está poupando {savingsPct.toFixed(1)}% da renda. Continue assim!
            </div>
          ) : (
            <div style={{ fontSize: 12, color: "var(--text2)" }}>
              📊 Sua alocação está equilibrada. Tente chegar a 20% de poupança.
            </div>
          )}
        </div>
      </div>

      {/* RESUMO RÁPIDO */}
      <div className="grid-2 mb-4">
        <div className="stat-card">
          <div className="stat-label">Total fixo mensal</div>
          <div className="stat-value" style={{ color: "var(--danger)" }}>{fmt(total)}</div>
          <div className="stat-sub">{totalIncome > 0 ? ((total/totalIncome)*100).toFixed(0) : 0}% da renda</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Disponível após fixos</div>
          <div className="stat-value" style={{ color: "var(--success)" }}>{fmt(Math.max(0, totalIncome - total))}</div>
          <div className="stat-sub">Para variáveis e poupança</div>
        </div>
      </div>

      {/* ALERTAS */}
      {essentialPct > 50 && <AlertBanner type="danger" msg={`🔴 Essenciais consomem ${essentialPct.toFixed(0)}% da renda (ideal: abaixo de 50%)`} />}
      {optionalPct > 15 && <AlertBanner type="warning" msg={`🔵 Opcionais consomem ${optionalPct.toFixed(0)}% da renda — primeira área a revisar em caso de aperto`} />}
      {savingsPct < 10 && total > 0 && <AlertBanner type="danger" msg={`⚠️ Poupança de ${savingsPct.toFixed(1)}% está abaixo do mínimo recomendado de 10%`} />}

      {/* TIERS POR PRIORIDADE */}
      {state.fixedExpenses.length === 0 ? (
        <div className="card"><Empty icon="🏠" text="Nenhuma despesa fixa cadastrada" /></div>
      ) : (
        <>
          <PriorityTierCard tier="essential" items={byPriority.essential} totalIncome={totalIncome}
            onEdit={openEdit} onDelete={id => dispatch({ type: "DEL_FIXED", id })} onAdd={openAdd} />
          <PriorityTierCard tier="important"  items={byPriority.important}  totalIncome={totalIncome}
            onEdit={openEdit} onDelete={id => dispatch({ type: "DEL_FIXED", id })} onAdd={openAdd} />
          <PriorityTierCard tier="optional"  items={byPriority.optional}   totalIncome={totalIncome}
            onEdit={openEdit} onDelete={id => dispatch({ type: "DEL_FIXED", id })} onAdd={openAdd} />
        </>
      )}

      {/* BOTÃO GERAL DE ADICIONAR quando já tem itens */}
      {state.fixedExpenses.length > 0 && (
        <button className="btn btn-ghost btn-full mt-2" onClick={() => openAdd("essential")}>
          <Plus size={14} /> Adicionar nova despesa fixa
        </button>
      )}

      {modal && (
        <Modal title={edit ? "Editar Despesa" : "Nova Despesa Fixa"} onClose={() => setModal(false)}>
          {/* SELETOR VISUAL DE PRIORIDADE */}
          <div className="form-group">
            <label className="form-label">Prioridade</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
                <button key={key} onClick={() => setForm({ ...form, priority: key })}
                  style={{
                    padding: "10px 6px", borderRadius: 10, cursor: "pointer",
                    border: `2px solid ${form.priority === key ? cfg.color : "transparent"}`,
                    background: form.priority === key ? cfg.bg : "var(--s2)",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                    transition: "all 0.18s", fontFamily: "Outfit, sans-serif",
                  }}>
                  <span style={{ fontSize: 18 }}>{cfg.dot}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: form.priority === key ? cfg.color : "var(--text3)" }}>
                    {cfg.label}
                  </span>
                </button>
              ))}
            </div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 6 }}>
              {PRIORITY_CONFIG[form.priority].desc}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nome</label>
            <input placeholder="Ex: Aluguel, Internet..." value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Valor (R$)</label>
              <input type="number" placeholder="0,00" value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Dia do vencimento</label>
              <input type="number" min="1" max="31" placeholder="Ex: 10" value={form.dueDay}
                onChange={e => setForm({ ...form, dueDay: e.target.value })} />
            </div>
          </div>
          <button className="btn btn-primary btn-full mt-3" onClick={save}>💾 Salvar</button>
          {edit && (
            <button className="btn btn-danger btn-full mt-2"
              onClick={() => { dispatch({ type: "DEL_FIXED", id: edit.id }); setModal(false); }}>
              🗑️ Excluir
            </button>
          )}
        </Modal>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  GASTOS VARIÁVEIS
// ─────────────────────────────────────────────
function VariableExpenses({ state, dispatch }) {
  const { variableCategories, transactions, currentMonth, currentYear } = state;
  const [view, setView] = useState("categories"); // categories | transactions
  const [modalCat, setModalCat] = useState(false);
  const [modalTx, setModalTx] = useState(false);
  const [editCat, setEditCat] = useState(null);
  const [selectedCat, setSelectedCat] = useState(null);
  const [catForm, setCatForm] = useState({ name:"", limit:"", color:"#3DD598", priority:"important", icon:"🛒" });
  const [txForm, setTxForm] = useState({ categoryId:"", amount:"", description:"", date:"" });
  const [search, setSearch] = useState("");

  const catStats = useMemo(() => {
    return variableCategories.map(cat => {
      const spent = transactions
        .filter(t => t.categoryId===cat.id && isSameMonth(t.date, currentMonth, currentYear))
        .reduce((s,t) => s+t.amount, 0);
      return { ...cat, spent, pct: cat.limit>0 ? (spent/cat.limit)*100 : 0 };
    });
  }, [variableCategories, transactions, currentMonth, currentYear]);

  const monthTxs = useMemo(() => {
    let txs = transactions.filter(t => isSameMonth(t.date, currentMonth, currentYear));
    if (selectedCat) txs = txs.filter(t => t.categoryId===selectedCat);
    if (search) txs = txs.filter(t => t.description?.toLowerCase().includes(search.toLowerCase()));
    return txs.sort((a,b) => new Date(b.date)-new Date(a.date));
  }, [transactions, currentMonth, currentYear, selectedCat, search]);

  const totalSpent = catStats.reduce((s,c)=>s+c.spent,0);

  function openAddCat() { setCatForm({name:"",limit:"",color:"#3DD598",priority:"important",icon:"🛒"}); setEditCat(null); setModalCat(true); }
  function openEditCat(c) { setCatForm({name:c.name,limit:String(c.limit),color:c.color,priority:c.priority,icon:c.icon}); setEditCat(c); setModalCat(true); }
  function saveCat() {
    if (!catForm.name.trim()||!catForm.limit) return;
    const p = { name:catForm.name.trim(), limit:parseFloat(catForm.limit), color:catForm.color, priority:catForm.priority, icon:catForm.icon };
    if (editCat) dispatch({type:"UPD_CAT",p:{...editCat,...p}});
    else dispatch({type:"ADD_CAT",p});
    setModalCat(false);
  }
  function openAddTx(catId) { setTxForm({ categoryId:catId||"", amount:"", description:"", date:new Date().toISOString().slice(0,10) }); setModalTx(true); }
  function saveTx() {
    if (!txForm.categoryId||!txForm.amount) return;
    dispatch({type:"ADD_TX", p:{ categoryId:txForm.categoryId, amount:parseFloat(txForm.amount), description:txForm.description, date: new Date(txForm.date+"T12:00:00").toISOString() }});
    setModalTx(false);
  }

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1>Gastos Variáveis</h1>
        <MonthNav month={currentMonth} year={currentYear}
          onChange={(m,y)=>dispatch({type:"SET_MONTH",month:m,year:y})} />
      </div>

      <div className="flex gap-2 mb-4" style={{flexWrap:"wrap"}}>
        <button className={`chip ${view==="categories"?"active":""}`} onClick={()=>setView("categories")}>📂 Categorias</button>
        <button className={`chip ${view==="transactions"?"active":""}`} onClick={()=>setView("transactions")}>📋 Transações</button>
        <button className="btn btn-primary btn-sm" style={{marginLeft:"auto"}} onClick={()=>openAddTx("")}><Plus size={14}/>Registrar</button>
      </div>

      {/* TOTAL DO MÊS */}
      <div className="card mb-4" style={{border:"1px solid rgba(255,181,71,0.2)"}}>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-muted text-sm">Total variável</div>
            <div className="big-num" style={{color:"var(--warning)"}}>{fmt(totalSpent)}</div>
          </div>
          <div className="text-right">
            <div className="text-muted text-sm">Limite total</div>
            <div className="text-sm font-bold">{fmt(variableCategories.reduce((s,c)=>s+c.limit,0))}</div>
          </div>
        </div>
      </div>

      {view === "categories" && (
        <>
          <div className="card">
            <div className="section-head">
              <h3>Categorias</h3>
              <button className="btn btn-ghost btn-sm" onClick={openAddCat}><Plus size={14}/>Nova</button>
            </div>
            {catStats.length===0 ? <Empty icon="🛒" text="Nenhuma categoria criada" /> : (
              (() => {
                const grouped = {
                  essential: catStats.filter(c=>(c.priority||"important")==="essential"),
                  important:  catStats.filter(c=>c.priority==="important" || !c.priority),
                  optional:   catStats.filter(c=>c.priority==="optional"),
                };
                return Object.entries(grouped).map(([tier, cats]) => {
                  if (cats.length === 0) return null;
                  const cfg = PRIORITY_CONFIG[tier];
                  return (
                    <div key={tier} style={{marginBottom:16}}>
                      <div style={{
                        display:"flex", alignItems:"center", gap:6,
                        marginBottom:8, paddingBottom:6,
                        borderBottom:`1px solid ${cfg.border}`,
                      }}>
                        <span style={{fontSize:13}}>{cfg.dot}</span>
                        <span style={{fontSize:12, fontWeight:700, color:cfg.color, textTransform:"uppercase", letterSpacing:0.5}}>{cfg.label}</span>
                        <span style={{fontSize:11, color:"var(--text3)", marginLeft:"auto"}}>
                          {fmt(cats.reduce((s,c)=>s+c.spent,0))} de {fmt(cats.reduce((s,c)=>s+c.limit,0))}
                        </span>
                      </div>
                      {cats.map(cat => (
                        <div key={cat.id} style={{
                          marginBottom:12, paddingLeft:10,
                          borderLeft:`3px solid ${cfg.color}`,
                        }}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span style={{fontSize:18}}>{cat.icon}</span>
                              <span className="text-sm font-semi">{cat.name}</span>
                            </div>
                            <div className="flex items-center gap-1" style={{flexShrink:0}}>
                              <span className="text-xs color-muted" style={{whiteSpace:"nowrap"}}>{fmt(cat.spent)}/{fmt(cat.limit)}</span>
                              <span className="text-xs font-bold" style={{color:pctColor(cat.pct),minWidth:30}}>{cat.pct.toFixed(0)}%</span>
                              <button className="btn btn-ghost btn-icon btn-sm" onClick={()=>openEditCat(cat)}><Edit2 size={12}/></button>
                              <button className="btn btn-primary btn-icon btn-sm" onClick={()=>openAddTx(cat.id)}><Plus size={12}/></button>
                            </div>
                          </div>
                          <ProgressBar spent={cat.spent} limit={cat.limit} color={cat.color} />
                          {cat.pct >= 100 && <div className="text-xs color-danger mt-1">⚠️ Limite ultrapassado em {fmt(cat.spent-cat.limit)}</div>}
                          {cat.pct >= 80 && cat.pct < 100 && <div className="text-xs color-warning mt-1">⚡ {(100-cat.pct).toFixed(0)}% do limite restante</div>}
                        </div>
                      ))}
                    </div>
                  );
                });
              })()
            )}
          </div>
        </>
      )}

      {view === "transactions" && (
        <div className="card">
          <div className="mb-3">
            <div style={{position:"relative"}}>
              <Search size={15} style={{position:"absolute",left:12,top:11,color:"var(--text3)"}} />
              <input placeholder="Pesquisar gastos..." value={search}
                onChange={e=>setSearch(e.target.value)}
                style={{paddingLeft:36}} />
            </div>
          </div>
          <div className="flex gap-2 mb-3" style={{overflowX:"auto",paddingBottom:4,WebkitOverflowScrolling:"touch",msOverflowStyle:"none",scrollbarWidth:"none"}}>
            <button className={`chip ${!selectedCat?"active":""}`} onClick={()=>setSelectedCat(null)}>Todas</button>
            {variableCategories.map(cat => (
              <button key={cat.id} className={`chip ${selectedCat===cat.id?"active":""}`}
                onClick={()=>setSelectedCat(selectedCat===cat.id?null:cat.id)}>
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
          {monthTxs.length===0 ? <Empty icon="📋" text="Nenhum gasto registrado" /> : (
            monthTxs.map(tx => {
              const cat = variableCategories.find(c=>c.id===tx.categoryId);
              return (
                <div key={tx.id} className="list-item">
                  <div className="list-item-left">
                    <div className="cat-ico" style={{background:`${cat?.color||"#7C83F5"}22`}}>
                      <span style={{fontSize:18}}>{cat?.icon||"💸"}</span>
                    </div>
                    <div className="truncate">
                      <div className="text-sm font-semi truncate">{tx.description||cat?.name||"Gasto"}</div>
                      <div className="text-xs color-muted">{fmtDate(tx.date)} · {cat?.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="font-bold color-danger mono text-sm">-{fmt(tx.amount)}</div>
                    <button className="btn btn-danger btn-icon btn-sm" onClick={()=>dispatch({type:"DEL_TX",id:tx.id})}><Trash2 size={12}/></button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* MODAL CATEGORIA */}
      {modalCat && (
        <Modal title={editCat?"Editar Categoria":"Nova Categoria"} onClose={()=>setModalCat(false)}>
          <div className="form-group"><label className="form-label">Ícone</label>
            <div className="flex gap-1" style={{flexWrap:"wrap",maxHeight:100,overflowY:"auto"}}>
              {ICON_OPTS.map(ic => (
                <button key={ic} onClick={()=>setCatForm({...catForm,icon:ic})}
                  style={{fontSize:22,padding:6,border:`2px solid ${catForm.icon===ic?"var(--primary)":"transparent"}`,borderRadius:8,background:"var(--s2)",cursor:"pointer"}}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group"><label className="form-label">Nome</label>
            <input placeholder="Ex: Mercado, Academia..." value={catForm.name} onChange={e=>setCatForm({...catForm,name:e.target.value})} />
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Limite (R$)</label>
              <input type="number" placeholder="0,00" value={catForm.limit} onChange={e=>setCatForm({...catForm,limit:e.target.value})} />
            </div>
            <div className="form-group"><label className="form-label">Cor</label>
              <input type="color" value={catForm.color} onChange={e=>setCatForm({...catForm,color:e.target.value})} style={{height:42,padding:4}} />
            </div>
          </div>
          <div className="form-group"><label className="form-label">Prioridade</label>
            <select value={catForm.priority} onChange={e=>setCatForm({...catForm,priority:e.target.value})}>
              <option value="essential">🔴 Essencial</option>
              <option value="important">🟡 Importante</option>
              <option value="optional">🔵 Opcional</option>
            </select>
          </div>
          <button className="btn btn-primary btn-full mt-3" onClick={saveCat}>💾 Salvar</button>
          {editCat && <button className="btn btn-danger btn-full mt-2" onClick={()=>{dispatch({type:"DEL_CAT",id:editCat.id});setModalCat(false);}}>🗑️ Excluir Categoria</button>}
        </Modal>
      )}

      {/* MODAL TRANSAÇÃO */}
      {modalTx && (
        <Modal title="Registrar Gasto" onClose={()=>setModalTx(false)}>
          <div className="form-group"><label className="form-label">Categoria</label>
            <select value={txForm.categoryId} onChange={e=>setTxForm({...txForm,categoryId:e.target.value})}>
              <option value="">Selecione...</option>
              {variableCategories.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Valor (R$)</label>
              <input type="number" placeholder="0,00" value={txForm.amount} onChange={e=>setTxForm({...txForm,amount:e.target.value})} />
            </div>
            <div className="form-group"><label className="form-label">Data</label>
              <input type="date" value={txForm.date} onChange={e=>setTxForm({...txForm,date:e.target.value})} />
            </div>
          </div>
          <div className="form-group"><label className="form-label">Descrição (opcional)</label>
            <input placeholder="Ex: Compra no Pão de Açúcar..." value={txForm.description} onChange={e=>setTxForm({...txForm,description:e.target.value})} />
          </div>
          <button className="btn btn-primary btn-full mt-3" onClick={saveTx}>💾 Registrar</button>
        </Modal>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  CARTÕES DE CRÉDITO
// ─────────────────────────────────────────────
function CreditCards({ state, dispatch }) {
  const { creditCards, cardTransactions, currentMonth, currentYear } = state;
  const [modalCard, setModalCard] = useState(false);
  const [modalTx, setModalTx] = useState(false);
  const [selCard, setSelCard] = useState(null);
  const [cardForm, setCardForm] = useState({ name:"", limit:"", closingDay:"", dueDay:"", color:CARD_COLORS[0] });
  const [txForm, setTxForm] = useState({ cardId:"", amount:"", description:"", date:"", installments:1 });

  const cardStats = useMemo(() => {
    return creditCards.map(card => {
      const monthTxs = cardTransactions.filter(t => t.cardId===card.id && isSameMonth(t.date, currentMonth, currentYear));
      const used = monthTxs.reduce((s,t) => s + t.amount, 0);
      const available = card.limit - used;
      return { ...card, used, available, monthTxs };
    });
  }, [creditCards, cardTransactions, currentMonth, currentYear]);

  function saveCard() {
    if (!cardForm.name.trim()||!cardForm.limit) return;
    dispatch({type:"ADD_CARD", p:{...cardForm, limit:parseFloat(cardForm.limit), closingDay:parseInt(cardForm.closingDay)||null, dueDay:parseInt(cardForm.dueDay)||null}});
    setModalCard(false);
  }
  function saveTx() {
    if (!txForm.cardId||!txForm.amount) return;
    const baseAmount = parseFloat(txForm.amount);
    const n = parseInt(txForm.installments)||1;
    if (n>1) {
      for(let i=0;i<n;i++){
        const d = new Date(txForm.date||new Date());
        d.setMonth(d.getMonth()+i);
        dispatch({type:"ADD_CARD_TX", p:{cardId:txForm.cardId, amount:baseAmount/n, description:`${txForm.description} (${i+1}/${n})`, date:d.toISOString(), installments:n, installmentNum:i+1}});
      }
    } else {
      dispatch({type:"ADD_CARD_TX", p:{cardId:txForm.cardId, amount:baseAmount, description:txForm.description, date: new Date((txForm.date||new Date().toISOString().slice(0,10))+"T12:00:00").toISOString(), installments:1, installmentNum:1}});
    }
    setModalTx(false);
  }

  return (
    <div className="page fade-in">
      <div className="page-header"><h1>Cartões</h1></div>
      <div className="flex gap-2 mb-4">
        <button className="btn btn-ghost btn-sm" onClick={()=>setModalCard(true)}><Plus size={14}/>Novo Cartão</button>
        <button className="btn btn-primary btn-sm" style={{marginLeft:"auto"}} onClick={()=>setModalTx(true)}><Plus size={14}/>Lançar Compra</button>
      </div>

      {creditCards.length===0 ? (
        <div className="card"><Empty icon="💳" text="Nenhum cartão cadastrado" /></div>
      ) : (
        cardStats.map(card => {
          const pct = card.limit>0?(card.used/card.limit)*100:0;
          const isSelected = selCard===card.id;
          return (
            <div key={card.id} className="mb-4">
              <div className="cc-visual" style={{background:card.color, cursor:"pointer"}} onClick={()=>setSelCard(isSelected?null:card.id)}>
                <div className="cc-shine" />
                <div className="flex justify-between items-start mb-4">
                  <div style={{fontSize:13,fontWeight:700,opacity:0.9}}>{card.name}</div>
                  <button className="btn btn-danger btn-icon btn-sm" onClick={e=>{e.stopPropagation();dispatch({type:"DEL_CARD",id:card.id});}}>
                    <Trash2 size={12}/>
                  </button>
                </div>
                <div style={{fontFamily:"JetBrains Mono",fontSize:22,fontWeight:700,letterSpacing:-1,color:"#000"}}>
                  {fmt(card.limit - card.used)} <span style={{fontSize:12,opacity:0.6}}>disponível</span>
                </div>
                <div style={{marginTop:12}}>
                  <ProgressBar spent={card.used} limit={card.limit} color="rgba(0,0,0,0.4)" />
                </div>
                <div className="flex justify-between mt-2" style={{fontSize:12,opacity:0.8}}>
                  <span>Usado: {fmt(card.used)}</span>
                  <span>Limite: {fmt(card.limit)}</span>
                </div>
              </div>

              {isSelected && card.monthTxs.length>0 && (
                <div className="card mt-2 card-sm">
                  <div className="text-muted text-sm mb-2 font-semi">Lançamentos do mês</div>
                  {card.monthTxs.sort((a,b)=>new Date(b.date)-new Date(a.date)).map(tx=>(
                    <div key={tx.id} className="list-item">
                      <div className="list-item-left">
                        <div className="cat-ico" style={{background:`${card.color}22`}}>
                          <CreditCard size={18} color={card.color}/>
                        </div>
                        <div>
                          <div className="text-sm font-semi">{tx.description||"Compra"}</div>
                          <div className="text-xs color-muted">{fmtDate(tx.date)}{tx.installments>1?` · Parcela ${tx.installmentNum}/${tx.installments}`:""}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold color-danger mono text-sm">-{fmt(tx.amount)}</span>
                        <button className="btn btn-danger btn-icon btn-sm" onClick={()=>dispatch({type:"DEL_CARD_TX",id:tx.id})}><Trash2 size={12}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}

      {modalCard && (
        <Modal title="Novo Cartão" onClose={()=>setModalCard(false)}>
          <div className="form-group"><label className="form-label">Nome do cartão</label>
            <input placeholder="Ex: Nubank, Itaú..." value={cardForm.name} onChange={e=>setCardForm({...cardForm,name:e.target.value})} />
          </div>
          <div className="form-group"><label className="form-label">Limite (R$)</label>
            <input type="number" placeholder="0,00" value={cardForm.limit} onChange={e=>setCardForm({...cardForm,limit:e.target.value})} />
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Fechamento (dia)</label>
              <input type="number" min="1" max="31" placeholder="Ex: 25" value={cardForm.closingDay} onChange={e=>setCardForm({...cardForm,closingDay:e.target.value})} />
            </div>
            <div className="form-group"><label className="form-label">Vencimento (dia)</label>
              <input type="number" min="1" max="31" placeholder="Ex: 5" value={cardForm.dueDay} onChange={e=>setCardForm({...cardForm,dueDay:e.target.value})} />
            </div>
          </div>
          <div className="form-group"><label className="form-label">Cor</label>
            <div className="flex gap-2" style={{flexWrap:"wrap"}}>
              {CARD_COLORS.map(c=>(
                <button key={c} onClick={()=>setCardForm({...cardForm,color:c})}
                  style={{width:32,height:32,borderRadius:8,background:c,border:`3px solid ${cardForm.color===c?"white":"transparent"}`,cursor:"pointer"}} />
              ))}
            </div>
          </div>
          <button className="btn btn-primary btn-full mt-3" onClick={saveCard}>💾 Salvar Cartão</button>
        </Modal>
      )}

      {modalTx && (
        <Modal title="Lançar Compra" onClose={()=>setModalTx(false)}>
          <div className="form-group"><label className="form-label">Cartão</label>
            <select value={txForm.cardId} onChange={e=>setTxForm({...txForm,cardId:e.target.value})}>
              <option value="">Selecione...</option>
              {creditCards.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Valor (R$)</label>
              <input type="number" placeholder="0,00" value={txForm.amount} onChange={e=>setTxForm({...txForm,amount:e.target.value})} />
            </div>
            <div className="form-group"><label className="form-label">Parcelas</label>
              <select value={txForm.installments} onChange={e=>setTxForm({...txForm,installments:parseInt(e.target.value)})}>
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(n=><option key={n} value={n}>{n}x{n>1?` de ${txForm.amount?fmt(parseFloat(txForm.amount)/n):""}`:""}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Data</label>
              <input type="date" value={txForm.date||new Date().toISOString().slice(0,10)} onChange={e=>setTxForm({...txForm,date:e.target.value})} />
            </div>
          </div>
          <div className="form-group"><label className="form-label">Descrição</label>
            <input placeholder="Ex: iPhone, Netflix..." value={txForm.description} onChange={e=>setTxForm({...txForm,description:e.target.value})} />
          </div>
          {txForm.installments>1 && txForm.amount && (
            <div className="alert alert-info">
              <Zap size={16}/>
              <span>{txForm.installments}x de {fmt(parseFloat(txForm.amount)/txForm.installments)} — distribuído nas próximas {txForm.installments} faturas</span>
            </div>
          )}
          <button className="btn btn-primary btn-full mt-3" onClick={saveTx}>💾 Lançar</button>
        </Modal>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  ANÁLISES
// ─────────────────────────────────────────────
function Analytics({ state }) {
  const { income, fixedExpenses, variableCategories, transactions, creditCards, cardTransactions, currentMonth, currentYear } = state;

  // Últimos 6 meses de dados
  const history = useMemo(() => {
    const data = [];
    for(let i=5; i>=0; i--) {
      let m = currentMonth - i; let y = currentYear;
      if(m<0){m+=12;y--;}
      const totalInc = income.reduce((s,x)=>s+x.amount,0);
      const totalFix = fixedExpenses.reduce((s,x)=>s+x.amount,0);
      const varSpent = transactions.filter(t=>isSameMonth(t.date,m,y)).reduce((s,t)=>s+t.amount,0);
      const cardSpent = cardTransactions.filter(t=>isSameMonth(t.date,m,y)).reduce((s,t)=>s+t.amount,0);
      const total = totalFix + varSpent + cardSpent;
      data.push({ name: MONTHS_SHORT[m], renda: totalInc, gastos: total, saldo: totalInc-total, mes:m, ano:y });
    }
    return data;
  }, [income, fixedExpenses, transactions, cardTransactions, currentMonth, currentYear]);

  const catPie = useMemo(() => {
    return variableCategories.map(cat => ({
      name: `${cat.icon} ${cat.name}`,
      value: transactions.filter(t=>t.categoryId===cat.id&&isSameMonth(t.date,currentMonth,currentYear)).reduce((s,t)=>s+t.amount,0),
      color: cat.color,
    })).filter(c=>c.value>0);
  }, [variableCategories, transactions, currentMonth, currentYear]);

  const totalVar = catPie.reduce((s,c)=>s+c.value,0);
  const totalIncome = income.reduce((s,x)=>s+x.amount,0);
  const totalFixed = fixedExpenses.reduce((s,x)=>s+x.amount,0);
  const savings = totalIncome - totalFixed - totalVar;
  const savingsRate = totalIncome > 0 ? (savings/totalIncome)*100 : 0;

  const CustomTooltip = ({active,payload,label}) => {
    if(!active||!payload?.length) return null;
    return (
      <div style={{background:"#0E1118",border:"1px solid #1C2333",borderRadius:10,padding:"10px 14px",fontFamily:"Outfit",fontSize:13}}>
        <div style={{color:"#8B93B0",marginBottom:6}}>{label}</div>
        {payload.map((p,i)=>(
          <div key={i} style={{color:p.color,fontWeight:600}}>{p.name}: {fmt(p.value)}</div>
        ))}
      </div>
    );
  };

  return (
    <div className="page fade-in">
      <div className="page-header"><h1>Análises</h1></div>

      <div className="stat-grid mb-4">
        <StatCard label="Taxa de Poupança" value={`${savingsRate.toFixed(1)}%`} sub={savingsRate>=20?"🟢 Ótimo":savingsRate>=10?"🟡 Regular":"🔴 Baixo"} color={savingsRate>=20?"var(--success)":savingsRate>=10?"var(--warning)":"var(--danger)"} />
        <StatCard label="Comprom. Fixo" value={`${totalIncome>0?((totalFixed/totalIncome)*100).toFixed(0):0}%`} sub="da renda mensal" color="var(--danger)" />
        <StatCard label="Poupado" value={fmt(Math.max(savings,0))} color="var(--success)" />
        <StatCard label="Gasto Total" value={fmt(totalFixed+totalVar)} sub="fixos + variáveis" color="var(--warning)" />
      </div>

      {savingsRate < 10 && <AlertBanner type="danger" msg="Sua taxa de poupança está abaixo de 10%. Recomendamos revisar gastos opcionais." />}
      {savingsRate >= 10 && savingsRate < 20 && <AlertBanner type="warning" msg="Tente aumentar sua taxa de poupança para 20% ou mais para segurança financeira." />}
      {savingsRate >= 20 && <AlertBanner type="success" msg="Excelente! Você está poupando mais de 20% da sua renda." />}

      {/* GRÁFICO HISTÓRICO */}
      <div className="card mb-4">
        <h3 className="mb-4">Histórico de 6 Meses</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={history} margin={{top:0,right:0,left:0,bottom:0}} barGap={4}>
            <XAxis dataKey="name" tick={{fill:"#8B93B0",fontSize:12}} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="renda" name="Renda" fill="rgba(61,213,152,0.5)" radius={[5,5,0,0]} />
            <Bar dataKey="gastos" name="Gastos" fill="rgba(255,107,107,0.7)" radius={[5,5,0,0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 justify-end">
          <span className="flex items-center gap-1 text-xs color-muted"><span style={{width:10,height:10,borderRadius:2,background:"rgba(61,213,152,0.5)",display:"inline-block"}}/>Renda</span>
          <span className="flex items-center gap-1 text-xs color-muted"><span style={{width:10,height:10,borderRadius:2,background:"rgba(255,107,107,0.7)",display:"inline-block"}}/>Gastos</span>
        </div>
      </div>

      {/* SALDO MENSAL */}
      <div className="card mb-4">
        <h3 className="mb-4">Saldo por Mês</h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={history} margin={{top:5,right:0,left:0,bottom:0}}>
            <defs>
              <linearGradient id="gradPos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3DD598" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3DD598" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tick={{fill:"#8B93B0",fontSize:12}} axisLine={false} tickLine={false}/>
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="saldo" name="Saldo" stroke="#3DD598" fill="url(#gradPos)" strokeWidth={2}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* PIZZA POR CATEGORIA */}
      {catPie.length > 0 && (
        <div className="card">
          <h3 className="mb-4">Gastos por Categoria — {MONTHS[currentMonth]}</h3>
          <div className="flex gap-4" style={{flexWrap:"wrap",alignItems:"center"}}>
            <PieChart width={160} height={160}>
              <Pie data={catPie} cx={75} cy={75} innerRadius={45} outerRadius={75} paddingAngle={2} dataKey="value">
                {catPie.map((c,i) => <Cell key={i} fill={c.color} />)}
              </Pie>
              <Tooltip formatter={(v)=>[fmt(v),"Gasto"]} contentStyle={{background:"#0E1118",border:"1px solid #1C2333",borderRadius:10,fontFamily:"Outfit",fontSize:13}} />
            </PieChart>
            <div style={{flex:1}}>
              {catPie.map((c,i) => (
                <div key={i} className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div style={{width:10,height:10,borderRadius:2,background:c.color,flexShrink:0}}/>
                    <span className="text-sm">{c.name}</span>
                  </div>
                  <div className="text-sm font-bold mono">
                    {fmt(c.value)}
                    <span className="text-xs color-muted ml-1">({totalVar>0?((c.value/totalVar)*100).toFixed(0):0}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  METAS
// ─────────────────────────────────────────────
function Goals({ state, dispatch }) {
  const [modal, setModal] = useState(false);
  const [contribModal, setContribModal] = useState(null);
  const [form, setForm] = useState({ name:"", target:"", current:"", deadline:"", color:CARD_COLORS[2], icon:"🎯" });
  const [contrib, setContrib] = useState("");

  const GOAL_ICONS = ["🎯","🏖️","🚗","🏠","📱","✈️","💍","📚","🎓","🏋️","💊","🐶","🎮","💡","🌟"];

  function save() {
    if (!form.name.trim()||!form.target) return;
    dispatch({type:"ADD_GOAL",p:{name:form.name.trim(),target:parseFloat(form.target),current:parseFloat(form.current||0),deadline:form.deadline,color:form.color,icon:form.icon}});
    setModal(false);
  }
  function contribute(goal) {
    if (!contrib||isNaN(parseFloat(contrib))) return;
    dispatch({type:"UPD_GOAL",p:{...goal,current:Math.min(goal.current+parseFloat(contrib),goal.target)}});
    setContribModal(null); setContrib("");
  }

  return (
    <div className="page fade-in">
      <div className="page-header"><h1>Metas</h1></div>
      <div className="flex justify-end mb-4">
        <button className="btn btn-primary btn-sm" onClick={()=>setModal(true)}><Plus size={14}/>Nova Meta</button>
      </div>

      {state.goals.length===0 ? (
        <div className="card"><Empty icon="🎯" text="Crie sua primeira meta financeira!" /></div>
      ) : (
        state.goals.map(goal => {
          const pct = goal.target>0?(goal.current/goal.target)*100:0;
          const remaining = goal.target - goal.current;
          const done = pct>=100;
          const daysLeft = goal.deadline ? Math.max(0,Math.ceil((new Date(goal.deadline)-new Date())/(1000*60*60*24))) : null;
          return (
            <div key={goal.id} className="card mb-3" style={{border:`1px solid ${goal.color}33`}}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div style={{fontSize:28}}>{goal.icon}</div>
                  <div>
                    <div className="font-semi">{goal.name}</div>
                    {goal.deadline && <div className="text-xs color-muted">{daysLeft!==null?`${daysLeft} dias restantes`:""} · Até {new Date(goal.deadline).toLocaleDateString("pt-BR")}</div>}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!done && <button className="btn btn-ghost btn-sm" onClick={()=>{setContribModal(goal);setContrib("");}}>💰 Contribuir</button>}
                  <button className="btn btn-danger btn-icon btn-sm" onClick={()=>dispatch({type:"DEL_GOAL",id:goal.id})}><Trash2 size={12}/></button>
                </div>
              </div>
              {done && <div className="alert alert-success mb-3"><CheckCircle2 size={16}/>Meta atingida! 🎉</div>}
              <div className="prog-wrap" style={{height:10,marginBottom:10}}>
                <div className="prog-bar" style={{width:`${Math.min(pct,100)}%`,background:done?"var(--success)":goal.color}} />
              </div>
              <div className="flex justify-between">
                <div>
                  <div className="text-xs color-muted">Guardado</div>
                  <div className="font-bold mono" style={{color:goal.color}}>{fmt(goal.current)}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs color-muted">Objetivo</div>
                  <div className="font-bold mono">{fmt(goal.target)}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs color-muted">Faltam</div>
                  <div className="font-bold mono color-muted">{fmt(remaining)}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs color-muted">Progresso</div>
                  <div className="font-bold" style={{color:done?"var(--success)":goal.color}}>{pct.toFixed(1)}%</div>
                </div>
              </div>
            </div>
          );
        })
      )}

      {modal && (
        <Modal title="Nova Meta" onClose={()=>setModal(false)}>
          <div className="form-group"><label className="form-label">Ícone</label>
            <div className="flex gap-1" style={{flexWrap:"wrap"}}>
              {GOAL_ICONS.map(ic=>(
                <button key={ic} onClick={()=>setForm({...form,icon:ic})}
                  style={{fontSize:22,padding:6,border:`2px solid ${form.icon===ic?"var(--primary)":"transparent"}`,borderRadius:8,background:"var(--s2)",cursor:"pointer"}}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group"><label className="form-label">Nome da meta</label>
            <input placeholder="Ex: Viagem Europa, Carro novo..." value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Objetivo (R$)</label>
              <input type="number" placeholder="0,00" value={form.target} onChange={e=>setForm({...form,target:e.target.value})} />
            </div>
            <div className="form-group"><label className="form-label">Já guardado (R$)</label>
              <input type="number" placeholder="0,00" value={form.current} onChange={e=>setForm({...form,current:e.target.value})} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Prazo (opcional)</label>
              <input type="date" value={form.deadline} onChange={e=>setForm({...form,deadline:e.target.value})} />
            </div>
            <div className="form-group"><label className="form-label">Cor</label>
              <div className="flex gap-1" style={{flexWrap:"wrap"}}>
                {CARD_COLORS.map(c=>(
                  <button key={c} onClick={()=>setForm({...form,color:c})}
                    style={{width:28,height:28,borderRadius:6,background:c,border:`3px solid ${form.color===c?"white":"transparent"}`,cursor:"pointer"}} />
                ))}
              </div>
            </div>
          </div>
          <button className="btn btn-primary btn-full mt-3" onClick={save}>🎯 Criar Meta</button>
        </Modal>
      )}

      {contribModal && (
        <Modal title={`Contribuir — ${contribModal.name}`} onClose={()=>setContribModal(null)}>
          <div className="form-group"><label className="form-label">Valor a adicionar (R$)</label>
            <input type="number" placeholder="0,00" value={contrib} onChange={e=>setContrib(e.target.value)} autoFocus />
          </div>
          <div className="text-muted text-sm mb-3">
            Faltam {fmt(contribModal.target-contribModal.current)} para completar a meta
          </div>
          <button className="btn btn-success btn-full" onClick={()=>contribute(contribModal)}>💰 Confirmar</button>
        </Modal>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  CONFIGURAÇÕES / EXPORTAÇÃO
// ─────────────────────────────────────────────
function Settings({ state, dispatch }) {
  const fileRef = useRef();

  function exportJSON() {
    const blob = new Blob([JSON.stringify(state, null, 2)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="financas_backup.json"; a.click();
    URL.revokeObjectURL(url);
  }
  function importJSON(e) {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        dispatch({type:"LOAD", payload:data});
        alert("Dados importados com sucesso!");
      } catch { alert("Arquivo inválido."); }
    };
    reader.readAsText(file);
  }
  function resetAll() {
    if(window.confirm("Tem certeza? Todos os dados serão apagados!")) {
      dispatch({type:"LOAD", payload:INIT_STATE});
    }
  }

  const txCount = state.transactions.length;
  const totalSaved = state.goals.reduce((s,g)=>s+g.current,0);

  return (
    <div className="page fade-in">
      <div className="page-header"><h1>Configurações</h1></div>

      <div className="card mb-3">
        <h3 className="mb-3">Resumo dos dados</h3>
        <div className="list-item">
          <span className="text-sm color-muted">Fontes de renda</span>
          <span className="font-semi">{state.income.length}</span>
        </div>
        <div className="list-item">
          <span className="text-sm color-muted">Gastos fixos</span>
          <span className="font-semi">{state.fixedExpenses.length}</span>
        </div>
        <div className="list-item">
          <span className="text-sm color-muted">Categorias</span>
          <span className="font-semi">{state.variableCategories.length}</span>
        </div>
        <div className="list-item">
          <span className="text-sm color-muted">Transações registradas</span>
          <span className="font-semi">{txCount}</span>
        </div>
        <div className="list-item">
          <span className="text-sm color-muted">Cartões cadastrados</span>
          <span className="font-semi">{state.creditCards.length}</span>
        </div>
        <div className="list-item">
          <span className="text-sm color-muted">Metas ativas</span>
          <span className="font-semi">{state.goals.length}</span>
        </div>
      </div>

      <div className="card mb-3">
        <h3 className="mb-3">Backup & Restauração</h3>
        <button className="btn btn-ghost btn-full mb-2" onClick={exportJSON}>
          <Download size={16}/>Exportar dados (JSON)
        </button>
        <button className="btn btn-ghost btn-full mb-2" onClick={()=>fileRef.current?.click()}>
          <Upload size={16}/>Importar dados (JSON)
        </button>
        <input ref={fileRef} type="file" accept=".json" style={{display:"none"}} onChange={importJSON} />
      </div>

      <div className="card">
        <h3 className="mb-3">Zona de Perigo</h3>
        <button className="btn btn-danger btn-full" onClick={resetAll}>
          <Trash2 size={16}/>Apagar todos os dados
        </button>
      </div>

      <div className="text-center mt-5" style={{color:"var(--text3)",fontSize:12}}>
        💰 FinanceApp v2.0 · Seus dados são salvos localmente no seu dispositivo
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  APP PRINCIPAL
// ─────────────────────────────────────────────
const TABS = [
  { id:"dashboard", label:"Início",    Icon:LayoutDashboard },
  { id:"income",    label:"Receitas",  Icon:TrendingUp },
  { id:"fixed",     label:"Fixos",     Icon:Shield },
  { id:"variable",  label:"Variáveis", Icon:ShoppingCart },
  { id:"cards",     label:"Cartões",   Icon:CreditCard },
  { id:"analytics", label:"Análises",  Icon:BarChart3 },
  { id:"goals",     label:"Metas",     Icon:Target },
];

export default function App() {
  const [state, dispatch] = useReducer(reducer, null, () => {
    const saved = loadState();
    return saved || INIT_STATE;
  });

  const [tab, setTab] = useState("dashboard");

  // Persiste no localStorage sempre que o estado muda
  useEffect(() => { saveState(state); }, [state]);

  const allTabs = [...TABS, { id:"settings", label:"Config", Icon:MoreHorizontal }];
  const mobileTabs = TABS.slice(0, 5);
  const mobileMore = TABS.slice(5);

  const alerts = useMemo(() =>
    getSpendingAlerts(state.variableCategories, state.transactions, state.currentMonth, state.currentYear),
    [state.variableCategories, state.transactions, state.currentMonth, state.currentYear]
  );

  function renderPage() {
    const props = { state, dispatch };
    switch(tab) {
      case "dashboard": return <Dashboard {...props} />;
      case "income":    return <Income {...props} />;
      case "fixed":     return <FixedExpenses {...props} />;
      case "variable":  return <VariableExpenses {...props} />;
      case "cards":     return <CreditCards {...props} />;
      case "analytics": return <Analytics {...props} />;
      case "goals":     return <Goals {...props} />;
      case "settings":  return <Settings {...props} />;
      default:          return <Dashboard {...props} />;
    }
  }

  return (
    <>
      <StylesInject />
      <div className="fin-app">

        {/* NAV LATERAL (desktop) */}
        <nav className="nav-side" style={{display:"none"}} id="nav-side">
          <div className="nav-logo">
            <div className="nav-logo-icon"><Wallet size={20} color="var(--primary)"/></div>
            <span className="nav-logo-text">FinanceApp</span>
          </div>
          {allTabs.map(({id, label, Icon}) => (
            <button key={id} className={`nav-side-btn ${tab===id?"active":""}`} onClick={()=>setTab(id)}>
              <Icon size={18}/>
              {label}
              {id==="analytics" && alerts.length>0 && (
                <span style={{marginLeft:"auto",background:"var(--danger)",color:"white",fontSize:10,fontWeight:700,borderRadius:10,padding:"1px 6px"}}>{alerts.length}</span>
              )}
            </button>
          ))}
        </nav>

        {/* CONTEÚDO */}
        <main className="main">
          {renderPage()}
        </main>

        {/* NAV BOTTOM (mobile) */}
        <nav className="nav-bottom">
          {[...mobileTabs, {id:"goals",label:"Metas",Icon:Target}, {id:"settings",label:"Mais",Icon:MoreHorizontal}].map(({id,label,Icon})=>(
            <button key={id} className={`nav-btn ${tab===id?"active":""}`} onClick={()=>setTab(id)}>
              <Icon />
              <span>{label}</span>
              <div className="nav-dot" />
            </button>
          ))}
        </nav>
      </div>

      {/* Script para mostrar nav lateral no desktop */}
      <style>{`
        @media (min-width: 768px) {
          #nav-side { display: flex !important; }
        }
      `}</style>
    </>
  );
}