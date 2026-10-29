import React, { useState } from "react";

import Dashboard from "./components/Dashboard";
import Inventory from "./components/Inventory";
import Sales from "./components/Sales";
import Khata from "./components/Khata";
import VoiceAssistant from "./components/VoiceAssistant";
import Payment from "./components/Payment";

function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div className="app">
      {/* Header */}
      <header className="topbar">
        <div>
          <h1>DukaanMitra</h1>
          <p>AI + Voice Assistant for your shop</p>
        </div>

        {/* Navigation */}
        <div className="nav">
          <button onClick={() => setPage("dashboard")}>
            Dashboard
          </button>

          <button onClick={() => setPage("inventory")}>
            Inventory
          </button>

          <button onClick={() => setPage("sales")}>
            Sales
          </button>

          <button onClick={() => setPage("khata")}>
            Khata
          </button>

          <button onClick={() => setPage("voice")}>
            🎙 Voice AI
          </button>

          <button onClick={() => setPage("payment")}>
            💳 Payment
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">

        {page === "dashboard" && <Dashboard />}

        {page === "inventory" && <Inventory />}

        {page === "sales" && <Sales />}

        {page === "khata" && <Khata />}

        {page === "voice" && <VoiceAssistant />}

        {page === "payment" && <Payment />}

      </main>
    </div>
  );
}

export default App;