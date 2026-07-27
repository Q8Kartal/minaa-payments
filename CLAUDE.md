# Minaã – Payment Management System

## Project Overview
Single-file HTML payment tracker for **Minaã** (منصة ميناء) — a warehouse and long-term parking reservations platform in Kuwait.

The entire app lives in **one file**: `minaa-payments.html`  
No build tools, no dependencies, no backend. Opens directly in any browser.

---

## Brand Identity
- **Brand color (Orange):** `#E8471C`
- **Monthly payments:** `#7C3AED` (purple)
- **Quarterly subscriptions:** `#0D9488` (teal)
- **One-time payments:** `#E8471C` (orange/brand)
- **Font:** Cairo (Google Fonts, Arabic-optimized)
- **Logo:** Orange seagull on bollard — embedded as base64 PNG in the HTML `<img>` tag inside `.logo-wrap`

---

## Payment Types
| Type | Value | Color | Arabic Label |
|------|-------|-------|--------------|
| `monthly` | Recurring monthly | Purple `#7C3AED` | شهري |
| `quarterly` | Every 3 months | Teal `#0D9488` | اشتراك / 3 أشهر |
| `onetime` | One-time payment | Orange `#E8471C` | مرة واحدة |

---

## Currency Support
- **Base currency:** Kuwaiti Dinar (KWD) — all values stored in KWD
- **Input currencies:** KWD, USD, EUR
- **Live exchange rates:** [Frankfurter API](https://api.frankfurter.app/latest?from=KWD&to=USD,EUR) — free, no API key
- **Fallback rates (offline):** USD = 0.3065 KWD, EUR = 0.2820 KWD
- Conversion happens at input time; original amount + currency stored for display

---

## Data Storage
- **localStorage key:** `minaa_v2_payments`
- **Schema per payment:**
```json
{
  "id": 1,
  "name": "إيجار المخزن A",
  "origValue": 150.000,
  "origCurrency": "KWD",
  "kwdValue": 150.000,
  "type": "monthly",
  "date": "2026-07-27T10:00:00.000Z"
}
```
- **Migration:** `migrateOldData()` auto-migrates from old keys `minaa_payments`, `minaa_v1_payments`

---

## Key JavaScript Functions

| Function | Purpose |
|----------|---------|
| `fetchRates(manual)` | Fetch live exchange rates from Frankfurter API |
| `toKWD(amount, currency)` | Convert USD/EUR to KWD using live rates |
| `addPayment()` | Validate & add new payment entry |
| `deletePayment(id)` | Remove payment by ID |
| `openEdit(id)` | Open edit modal pre-filled with payment data |
| `saveEdit()` | Save changes from edit modal |
| `render()` | Re-render all stats, badges, and payment lists |
| `renderList(listId, items, type)` | Render individual payment section list |
| `openInvoice()` | Generate and show comprehensive invoice modal |
| `closeInvoice(e)` | Close invoice modal |
| `printInvoice()` | Trigger `window.print()` for PDF/print |
| `exportData()` | Download JSON backup file |
| `importData(e)` | Import JSON backup file |
| `clearData()` | Clear all data after confirmation |
| `migrateOldData()` | Migrate from old localStorage keys |
| `showToast(msg)` | Show notification toast for 2.8s |
| `updateTypeStyle()` | Apply color class to type select input |
| `updateCurrencyStyle()` | Apply color class to currency select |
| `fmtKWD(val)` | Format number as KWD (3 decimals + "د.ك") |
| `fmtDate(iso)` | Format ISO date to Arabic locale |

---

## UI Components

### Layout (RTL, Arabic)
- **Header:** Logo + "Payment Management" subtitle
- **Rates bar:** Live USD/EUR rates + refresh button
- **Data toolbar:** Invoice button, Export, Import, Clear
- **Stats row:** 4 cards — Monthly total, Quarterly total, One-time total, Grand total
- **Add form:** Name, Value, Currency (KWD/USD/EUR), Type, Add button
- **Payments grid:** 3 columns — Monthly section | Quarterly section | One-time section
- **Toast:** Bottom-center notification
- **Edit modal:** Overlay modal to edit existing payments
- **Invoice modal:** Full printable invoice with logo, summary chips, tables, grand total

### Keyboard Shortcuts
- `Enter` → Add payment (or Save edit if modal open)
- `Escape` → Close invoice modal, then close edit modal

---

## Invoice Feature (فاتورة شاملة)
- Opens via "🧾 فاتورة شاملة" button in toolbar
- Auto-generates invoice number: `INV-YYMMDD-NNN`
- Shows: logo, date, 4 summary chips, tables per type, grand total bar
- "🖨 طباعة / PDF" triggers `window.print()`
- Print CSS hides all UI except the invoice modal

---

## Known Quirks
- **RTL + SVG:** Any SVG `<text>` elements need `direction="ltr"` + `text-anchor="start"` to render correctly inside an RTL page
- **localStorage origin:** Data saved in one browser/context won't appear in another (different file path = different origin). Use Export/Import JSON to transfer data between browsers
- **Logo:** Embedded as base64 PNG (~large). Extracted from chat JPEG, background removed with Python PIL + Gaussian blur for soft edges

---

## Possible Next Features
- [ ] دفعات سنوية (yearly payments type)
- [ ] تاريخ الاستحقاق / تنبيه قبل الدفع (due date + reminder)
- [ ] فلترة وبحث في الدفعات (search/filter payments)
- [ ] تقرير شهري / سنوي (monthly/yearly report)
- [ ] رفع على GitHub Pages للوصول من أي جهاز
- [ ] دعم أكثر من مشروع (multi-project support)
- [ ] تصدير PDF مباشر بدون طباعة (direct PDF via jsPDF)

---

## File Structure
```
minaa-payments.html   ← The entire app (HTML + CSS + JS + base64 logo)
CLAUDE.md             ← This file — project context for Claude Code
```

---

## How to Run
Just open `minaa-payments.html` in any browser. No server needed.
