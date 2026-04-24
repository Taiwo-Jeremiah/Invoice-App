# Invoice Management App

**Live Demo:** [https://taiwo-jeremiah.github.io/Invoice-App/]
**Repository:** [https://github.com/taiwo-jeremiah/Invoice-App]

## Overview

This project is a fully responsive, interactive Invoice Management Application built for the Frontend Wizards Stage 2 task. It allows users to seamlessly manage their billing process with full CRUD (Create, Read, Update, Delete) capabilities, form validation, and data persistence, all while strictly matching the provided Figma design specifications.

## 🚀 Features

- **Full CRUD Functionality:** Create, view, edit, and delete invoices seamlessly.
- **Draft & Payment Flow:** Manage invoice lifecycles by saving as a "Draft", marking as "Pending", and finalizing as "Paid". Paid invoices securely lock to prevent accidental reversion to drafts.
- **Form Validation:** Robust native error handling prevents invalid submissions (e.g., empty required fields, invalid email formats, missing item list arrays).
- **Dynamic Filtering:** Instantly filter the invoice list by status (Draft, Pending, Paid). The UI gracefully handles empty states when no invoices match the selected filter.
- **Theme Toggling:** Global Light/Dark mode support that persists across reloads via LocalStorage.
- **Responsive Design:** Flawless layout adaptation across Mobile (320px+), Tablet (768px+), and Desktop (1024px+).
- **Interactive States:** Clear hover, focus, and active states for all interactive UI elements.
- **Data Persistence:** Saves all invoice data, filter selections, and theme preferences locally so no data is lost on refresh.

## 🛠️ Technology Stack

- **Frontend Framework:** React (Vite)
- **Routing:** React Router DOM (Using `HashRouter` for GitHub Pages compatibility)
- **State Management:** React Context API & Custom Hooks
- **Persistence:** Browser LocalStorage
- **Styling:** Tailwind CSS

## 💻 Setup Instructions

To run this project locally on your machine, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone [(https://github.com/taiwo-jeremiah/Invoice-App.git)]
   ```
2. **Navigate to the project directory:**
   ```bash
   cd Invoice-App
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Start the development server:**
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` in your web browser.

## 🏗️ Architecture Explanation

The application is built using a component-driven architecture with React, focusing on modularity and clean global state management.

- **Routing & Layout (`src/App.jsx` & `src/main.jsx`):** The app uses `react-router-dom`. `App.jsx` serves as the primary layout wrapper, housing the `Sidebar` and the main routing logic for the list view and `InvoiceDetails` view.
- **Global State Management (`src/context/InvoiceContext.jsx` & `useInvoices.js`):** To avoid prop-drilling, the core invoice data and CRUD functions (`addInvoice`, `updateInvoice`, etc.) are managed via the Context API. A custom hook (`useInvoices`) is exposed to allow any component to easily tap into the global state.
- **Smart Components (`src/components/InvoiceForm.jsx`):** The form component is highly dynamic, serving as both the "Create" and "Edit" interface. It checks for the presence of an `invoiceToEdit.id` to conditionally render titles and buttons.
- **Dynamic Filtering:** The filtering system in `App.jsx` actively listens to an array of selected statuses and instantly maps over a `filteredInvoices` array.

### 📁 Project Structure

```text
📦 Invoice-App
├── 📂 public/
│   └── 📄 vite.svg             # Public assets
├── 📂 src/
│   ├── 📂 assets/
│   │   └── 🖼️ illustration-empty.svg # Required production images
│   ├── 📂 components/
│   │   ├── 📄 InvoiceCard.jsx  # Individual invoice preview in the list
│   │   ├── 📄 InvoiceDetails.jsx # Full detailed view of a single invoice
│   │   ├── 📄 InvoiceForm.jsx  # Dynamic Create/Edit modal form
│   │   └── 📄 Sidebar.jsx      # Global navigation sidebar
│   ├── 📂 context/
│   │   ├── 📄 InvoiceContext.jsx # Global state provider and LocalStorage sync
│   │   └── 📄 useInvoices.js   # Custom hook for easy context consumption
│   ├── 📄 App.jsx              # Main routing, layout, and filter logic
│   ├── 📄 index.css            # Tailwind directives and global styles
│   └── 📄 main.jsx             # React DOM entry point and HashRouter wrapper
├── 📄 index.html               # Main HTML template
├── 📄 package.json             # Project metadata, scripts, and dependencies
├── 📄 README.md                # Project documentation
└── 📄 vite.config.js           # Vite bundler and base URL configuration
```

## ⚖️ Trade-offs

- **Context API vs. Redux/Zustand:** I chose the native React Context API combined with a custom hook. While tools like Redux are powerful, they introduce unnecessary boilerplate for an application of this scale. Context perfectly handles the global invoice array.
- **Client-Side Persistence:** Data is persisted using the browser's `LocalStorage`. This meets the project's requirements for a zero-latency user experience without a backend server, though data is tied to the specific browser session.
- **Native Form Validation:** Instead of pulling in heavy dependencies like Formik, I implemented a custom `validateForm` function within the `InvoiceForm` component. This validates complex nested arrays and sets specific error states for individual fields, keeping the bundle size small.

## ♿ Accessibility (A11y) Notes

Accessibility was prioritized throughout the development process:

- **Semantic HTML:** Used native `<button>`, `<header>`, `<main>`, and `<form>` tags rather than generic `<div>` elements.
- **Form Labels:** All form inputs are properly associated with label text for screen readers.
- **Keyboard Navigation:** Interactive elements, including the dynamic filter dropdown and item deletion buttons, are fully accessible via the `Tab` key.
- **Contrast:** Color palettes in both Light and Dark mode adhere to WCAG AA contrast standards.

## 🔮 Improvements Beyond Requirements

- **Authentication:** Implementing a login system (e.g., Firebase Auth) for cross-device access.
- **Database Integration:** Migrating from LocalStorage to a remote database for true data persistence.
- **Print/Export to PDF:** Allow users to generate a downloadable PDF version of finalized invoices.
- **Toast Notifications:** Add pop-up notifications to confirm successful actions (e.g., "Invoice Saved").

---

**Author:** Adeboye Taiwo Jeremiah

```

```
