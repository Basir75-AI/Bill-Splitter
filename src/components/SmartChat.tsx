import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, MessageSquare, AlertCircle } from "lucide-react";
import { ChatMessage, ReceiptData, Assignments } from "../types";

interface SmartChatProps {
  receipt: ReceiptData | null;
  setReceipt: (r: ReceiptData | null) => void;
  people: string[];
  setPeople: (p: string[]) => void;
  assignments: Assignments;
  setAssignments: (a: Assignments) => void;
  messages: ChatMessage[];
  setMessages: (m: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
  chatPending: boolean;
  setChatPending: (p: boolean) => void;
  error: string | null;
  setError: (err: string | null) => void;
}

const SUGGESTIONS = [
  "Add Dhruv, Sarah, and Sue",
  "Dhruv had the Carbonara and beers",
  "Sarah and Sue shared the Margarita Pizza",
  "Add a 15% tip to the bill",
  "Sarah paid for everything",
  "Set tax to $5",
];

export function SmartChat({
  receipt,
  setReceipt,
  people,
  setPeople,
  assignments,
  setAssignments,
  messages,
  setMessages,
  chatPending,
  setChatPending,
  error,
  setError,
}: SmartChatProps) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat log
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatPending]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !receipt) return;

    const userMessage: ChatMessage = {
      id: `m-${Date.now()}-user`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setChatPending(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          items: receipt.items,
          assignments,
          people,
          tax: receipt.tax,
          tip: receipt.tip,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to process chat command.");
      }

      const data = await response.json();

      // Update state parsed back from Gemini response
      setPeople(data.updatedPeople);
      setAssignments(data.updatedAssignments);
      
      const computedTotal = parseFloat((receipt.subtotal + data.updatedTax + data.updatedTip).toFixed(2));
      setReceipt({
        ...receipt,
        tax: data.updatedTax,
        tip: data.updatedTip,
        total: computedTotal,
      });

      // Append assistant's response
      const assistantMessage: ChatMessage = {
        id: `m-${Date.now()}-assistant`,
        sender: "ai",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong in the chat helper.");
      
      const errorMessage: ChatMessage = {
        id: `m-${Date.now()}-err`,
        sender: "system",
        text: `Error updating assignments: ${err.message || "Unknown error"}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setChatPending(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  return (
    <div className="flex flex-col h-[400px] md:h-full bg-[#0a0a0a] rounded-xl border border-[#222] overflow-hidden min-h-[400px] shadow-lg">
      {/* Thread Title */}
      <div className="p-4 bg-[#0d0d0d] text-[#e0e0e0] shrink-0 flex items-center justify-between border-b border-[#222]">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#888]" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#eee]">
            Smart Assignment Chat
          </h3>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-950/20 border border-emerald-500/20 px-2.5 py-0.5 rounded text-[10px] text-emerald-400 font-medium">
          <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
          Gemini Powered
        </div>
      </div>

      {/* Message Bubbles Box */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0a0a]">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 h-full text-center space-y-4 select-none">
            <div className="p-4 bg-[#161616] border border-[#222] rounded text-[#888] mb-2">
              <MessageSquare className="w-8 h-8 opacity-70" />
            </div>
            
            <div className="space-y-1">
              <p className="text-[#eee] font-medium text-xs uppercase tracking-wider">No assignments made yet</p>
              <p className="text-[#666] text-xs max-w-xs leading-relaxed">
                Add dynamic splitting commands below to assign item segments instantly!
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <span className="text-[10px] text-[#666] mb-1 font-bold uppercase tracking-wider px-2">
              {msg.sender === "user" ? "User" : msg.sender === "system" ? "System Log" : "SplitSense AI"}
            </span>
            <div
              className={`max-w-[85%] rounded-xl p-3 text-sm shadow-sm ${
                msg.sender === "user"
                  ? "bg-[#222] text-[#eee] rounded-tr-none border border-[#333]"
                  : msg.sender === "system"
                  ? "bg-rose-955/20 text-rose-300 border border-rose-500/20 rounded-tl-none font-medium flex items-center gap-2"
                  : "bg-emerald-900/10 text-[#eee] border border-emerald-500/20 rounded-tl-none leading-relaxed"
              }`}
            >
              {msg.sender === "system" && <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />}
              <div>{msg.text}</div>
              <div
                className={`text-[9px] mt-2 text-right tracking-tight font-medium ${
                  msg.sender === "user" ? "text-slate-500" : "text-emerald-600"
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {/* AI Thinking Line */}
        {chatPending && (
          <div className="flex flex-col items-start">
            <span className="text-[10px] text-emerald-500 mb-1 font-bold uppercase tracking-wider px-2 block">
              SplitSense AI
            </span>
            <div className="bg-[#111] text-[#888] border border-[#222] rounded-xl rounded-tl-none p-3 shadow-xs max-w-[85%]">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0s]"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </span>
                <span className="text-xs text-[#666] font-normal leading-none font-mono uppercase tracking-wider">Allocating Cost Shares...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Prompts Row */}
      {receipt && (
        <div className="p-3 bg-[#0d0d0d] border-t border-[#222] shrink-0 select-none">
          <p className="text-[10px] uppercase font-bold text-[#666] tracking-widest mb-2 block">
            Suggested Cost Assignments
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-1.5 mask-right max-h-[80px] scrollbar-thin">
            {SUGGESTIONS.map((sug) => (
              <button
                key={sug}
                id={`btn-suggestion-${sug.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                type="button"
                onClick={() => setInputText(sug)}
                className="px-2.5 py-1 bg-[#161616] border border-[#333] hover:border-[#444] text-[#aaa] rounded text-xs transition duration-155 whitespace-nowrap active:scale-95"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input box form */}
      <form
        onSubmit={handleFormSubmit}
        className="p-3 border-t border-[#222] bg-[#0d0d0d] shrink-0 flex gap-2 items-center"
      >
        <input
          type="text"
          id="chat-input"
          placeholder={
            receipt
              ? "Type assignment e.g. Dhruv had the beers..."
              : "Upload a receipt first to use the smart chat"
          }
          disabled={!receipt || chatPending}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 text-sm bg-[#161616] border border-[#333] hover:border-[#444] text-[#eee] rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500/50 focus:ring-0 placeholder-[#555] disabled:opacity-50 disabled:bg-[#111] transition shadow-xs"
        />
        <button
          id="btn-chat-send"
          type="submit"
          disabled={!inputText.trim() || chatPending || !receipt}
          className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-black border-0 disabled:bg-[#222] disabled:text-[#444] rounded-lg transition duration-150 shrink-0 shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
