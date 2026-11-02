# PrinkoutMerchantWebApp

Merchant Side Web & Desktop Application for **Prinkout**.

Built with **React Native for Web**, **Vite**, and **Electron** to deliver a responsive website and cross-platform desktop application.

---

## 🚀 Quick Start

### 1. Run as Website (Browser)
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Run as Native Desktop App (Electron)
```bash
npm run desktop
```
Launches the standalone merchant desktop window.

### 3. Production Build
```bash
npm run build
```

---

## 🛠️ Architecture & Features

This application implements the 18-page Prinkout Merchant System specification:

1. **Authentication & Shop Onboarding (Pages 1 - 6):**
   - **Login Screen (Page 1):** Dark merchant theme, serif headline, 3 feature pills (`Receive Orders`, `Print & Update`, `Track Earnings`), phone input (+91), "Send OTP ->", "Create Merchant Account", and demo fast-login.
   - **Verify OTP (Page 2):** 4-digit verification code input with countdown timer and resend support (default dev code: `0000`).
   - **Shop Setup Step 1 (Page 3):** Shop Name, Owner Contact, Email, GST Number, Street Address, Area, City, Pincode.
   - **Services & Pricing Step 2 (Page 4):** Category selection chips (Standard Prints, Posters, Flex & Banners, T-Shirts, Invitations, Packaging) and Base Print Pricing table (A4, A3, A0).
   - **Review & Summary Step 3 (Page 5):** Review cards with edit actions and "Create Shop & Continue ->".
   - **Shop Created Celebration (Page 6):** Live verification badge, shop card, feature reminders, and "Go to Dashboard ->".

2. **Merchant Hub Dashboard (Page 7):**
   - 4 Stat Cards: Today's Orders (`24`), Today's Revenue (`₹ 7,560`), In Printing (`8`), Ready for Pickup (`6`).
   - Order Pipeline bar: `24 Received` → `8 Printing` → `6 Ready` → `10 Completed`.
   - Quick Action cards: Open Print Queue, Update Service Rates, Analytics & Reports.
   - Recent Active Orders table with live status pills and direct detail inspection.
   - Growth promo banner for expanding print categories.

3. **Orders Management & Detail Drawer (Page 8):**
   - Filter pills: `All`, `Received`, `Printing`, `Ready`, `Completed`.
   - Search by Order ID, Customer Name, or Print Specs.
   - Interactive Slide-out Detail Drawer:
     - Customer details with instant **Call Customer** and **WhatsApp** deep links.
     - Print specifications (Service, Paper GSM, Color Mode, Sides, Binding).
     - Downloadable file card (`Project_Report_Final_v2.pdf`).
     - Special customer printing instructions.
     - Status progression buttons ("Mark as Printing ->", "Mark as Ready for Pickup ->", "Mark as Completed").

4. **Live Print Queue Kanban (Page 9):**
   - 4 Kanban columns: `Received`, `Printing`, `Ready for Pickup`, `Completed`.
   - Real-time progress bar on active print jobs (`Page 42 of 60 • 70%`, estimated time remaining).
   - Instant "Send Pickup SMS / WhatsApp" trigger to alert customers when ready.

5. **Pricing & Services (Page 10):**
   - Tabs: `My Services & Price List` and `Price List Templates`.
   - **Constraint Respected:** Bulk Update has been omitted as per user instruction.
   - Multi-category navigation: Standard Prints, Posters, Flex & Banners, T-Shirts, Invitations, Packaging.
   - GSM & Paper Texture pricing table with active ON/OFF switches.
   - Service fulfillment settings: turnaround time, minimum order limit, and Pickup/Delivery switches.

6. **Reports & Analytics (Page 11):**
   - Overview metrics: Total Revenue (`₹ 1,48,250`), Total Orders (`482`), Average Order Value (`₹ 307`), Repeat Customers (`64%`).
   - Weekly daily sales trend interactive chart.
   - Revenue contribution by category breakdown.
   - Top performing services table with growth percentages.
   - AI Shop Insights card.
   - Export CSV / PDF action.

7. **Payouts & Settlements (Page 12):**
   - Total Gross Sales, Platform Fee (10%), Net Merchant Earnings (`₹ 1,33,425`), Next Scheduled Payout (`₹ 12,450`).
   - Linked Bank Account card (`HDFC Bank •••• 4821`, Verified).
   - "Withdraw Instantly" payout trigger.
   - Weekly Net Transfers chart.
   - Recent Payout Statements table with UTR tracking numbers.

8. **Shop Profile & Public Listing (Page 13):**
   - Shop details editor, operating hours schedule, and verified documents.
   - Interactive Customer Mobile View Preview Card.
   - Shop status toggle (`● Active` / `Away`).

9. **Settings Hub (Pages 14 - 18):**
   - General Settings Overview grid (Page 14).
   - Notifications & Sound Alerts (Page 15).
   - Team & Staff Access with role assignments (Page 16).
   - Integrations: Razorpay Gateway, WhatsApp Business Cloud, Google Drive (Page 17).
   - Security: Two-Factor Authentication (2FA) and active sessions manager (Page 18).

---

## 🔗 Backend Service Integration

The application connects to **`PrinkoutService`** running on `http://localhost:5000/api/v1`:
- `GET /shops/:id` - Shop details and services.
- `GET /shops/:id/analytics` - Today's stats, pipeline flow, and revenue trends.
- `GET /shops/:id/payouts` - Net payouts, bank details, and settlement history.
- `PUT /shops/:id/profile` - Update shop configuration and live status.
- `GET /orders/shop/:shopId` - Shop orders (with automatic fallback to PDF mock orders).
- `PUT /orders/update-status/:id` - Updates order state across `received`, `printing`, `ready`, and `completed`.
- `POST /shops/auth/login` & `POST /shops/auth/verifyOTP` - Merchant authentication.
