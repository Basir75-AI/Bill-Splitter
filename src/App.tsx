/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, Coins, Users, CreditCard, Receipt, Github } from "lucide-react";
import { ReceiptData, Assignments, ChatMessage } from "./types";
import { ReceiptParser } from "./components/ReceiptParser";
import { SmartChat } from "./components/SmartChat";
import { OwesSummary } from "./components/OwesSummary";

const DEMO_RECEIPT: ReceiptData = {
  merchant: "Bella Italia Café & Bar",
  items: [
    { id: "demo-1", name: "14in Margherita Pizza Regular", price: 18.50, quantity: 1 },
    { id: "demo-2", name: "Garlic Truffle Fries", price: 9.00, quantity: 1 },
    { id: "demo-3", name: "Classic Lasagna Bolognese", price: 16.50, quantity: 1 },
    { id: "demo-4", name: "Craft IPA Beers (Pint)", price: 21.00, quantity: 3 },
    { id: "demo-5", name: "Velvet Chocolate lava Tart", price: 9.00, quantity: 1 }
  ],
  subtotal: 74.00,
  tax: 6.29,
  tip: 12.00,
  total: 92.29
};

export default function App() {
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [people, setPeople] = useState<string[]>([]);
  const [assignments, setAssignments] = useState<Assignments>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isParserLoading, setIsParserLoading] = useState(false);
  const [isChatPending, setIsChatPending] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Load a rich sample demo receipt to immediately allow interactive splitting
  const handleLoadSample = () => {
    setReceipt(DEMO_RECEIPT);
    setPeople(["Dhruv", "Sarah", "Sue"]);
    
    // Wire some pre-filled assignments
    const initialAssignments: Assignments = {
      "demo-1": ["Sarah", "Sue"], // shared pizza
      "demo-2": ["Dhruv", "Sarah", "Sue"], // shared garlic fries
      "demo-3": ["Sue"], // Sue got lasagna
      "demo-4": ["Dhruv"], // Dhruv had the IPA beers
      "demo-5": [] // unassigned lava tart for visual cues!
    };
    setAssignments(initialAssignments);

    setMessages([
      {
        id: "seed-msg",
        sender: "ai",
        text: "Hi! I've populated Bella Italia Café receipt with 3 folks registered: Dhruv, Sarah, Sue. Some items have been shared! Try typing in the chat below e.g. 'Dhruv had the chocolate tart' or 'add 18% tip'. Let's see how costs re-align in real-time above!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
    ]);
    setGlobalError(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col font-sans text-[#e0e0e0]">
      
      {/* Top Premium Navbar */}
      <nav className="bg-[#0d0d0d] border-b border-[#222] px-8 py-4 flex justify-between items-center h-16 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <Coins className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-md md:text-lg font-semibold tracking-tight text-white leading-none">
              SplitSense <span className="text-emerald-500 font-bold">AI</span>
            </h1>
            <p className="text-[9px] text-[#666] font-bold font-mono uppercase tracking-widest mt-0.5">
              Smart Bill Splitter Pane
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-widest text-[#666] font-bold leading-none">Total Amount</span>
            <span className="text-md sm:text-lg font-mono text-emerald-400 mt-1">
              ${receipt ? receipt.total.toFixed(2) : "0.00"}
            </span>
          </div>

          <button
            onClick={() => {
              if (receipt) {
                alert(`Exporting Cost Breakdown for ${receipt.merchant || "your bill"}!`);
              } else {
                alert("Please load or parse a receipt first.");
              }
            }}
            className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#333] rounded text-xs font-medium text-[#eee] transition"
          >
            Export Summary
          </button>
        </div>
      </nav>

      {/* Main Container Section */}
      <main className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 max-w-8xl mx-auto w-full">
        
        {/* Left Pane: Interactive Receipt Parser */}
        <section className="lg:col-span-6 bg-[#0f0f0f] border border-[#222] rounded-2xl overflow-hidden flex flex-col h-[500px] lg:h-full shadow-lg">
          <ReceiptParser
            receipt={receipt}
            setReceipt={setReceipt}
            people={people}
            setPeople={setPeople}
            assignments={assignments}
            setAssignments={setAssignments}
            isLoading={isParserLoading}
            setIsLoading={setIsParserLoading}
            error={globalError}
            setError={setGlobalError}
            onLoadSample={handleLoadSample}
          />
        </section>

        {/* Right Pane: Smart Chat & Allocation summary */}
        <section className="lg:col-span-6 flex flex-col h-[650px] lg:h-full space-y-5 overflow-hidden">
          
          {/* Proportional cost balances (upper block) */}
          <div className="flex-1 overflow-y-auto pr-1">
            <OwesSummary
              receipt={receipt}
              people={people}
              setPeople={setPeople}
              assignments={assignments}
              setAssignments={setAssignments}
            />
          </div>

          {/* Conversational Assistant chat (lower block) */}
          <div className="h-[360px] md:h-[450px] shrink-0">
            <SmartChat
              receipt={receipt}
              setReceipt={setReceipt}
              people={people}
              setPeople={setPeople}
              assignments={assignments}
              setAssignments={setAssignments}
              messages={messages}
              setMessages={setMessages}
              chatPending={isChatPending}
              setChatPending={setIsChatPending}
              error={globalError}
              setError={setGlobalError}
            />
          </div>

        </section>

      </main>
    </div>
  );
}

