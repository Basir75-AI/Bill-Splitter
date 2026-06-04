import React, { useState, useRef } from "react";
import { Upload, FileText, Check, Plus, Trash2, Edit2, AlertCircle, RefreshCw, Layers } from "lucide-react";
import { ReceiptData, ReceiptItem, Assignments } from "../types";

interface ReceiptParserProps {
  receipt: ReceiptData | null;
  setReceipt: (r: ReceiptData | null) => void;
  people: string[];
  setPeople: (p: string[]) => void;
  assignments: Assignments;
  setAssignments: (a: Assignments) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (err: string | null) => void;
  onLoadSample: () => void;
}

export function ReceiptParser({
  receipt,
  setReceipt,
  people,
  setPeople,
  assignments,
  setAssignments,
  isLoading,
  setIsLoading,
  error,
  setError,
  onLoadSample,
}: ReceiptParserProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  
  // Direct input states for editing
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemQty, setItemQty] = useState("1");
  const [editingMerchant, setEditingMerchant] = useState(false);
  const [merchantNameInput, setMerchantNameInput] = useState("");

  const [taxInput, setTaxInput] = useState("");
  const [tipInput, setTipInput] = useState("");
  const [isEditingTaxTip, setIsEditingTaxTip] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert File to Base64
  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPG, or WEBP).");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Image = reader.result as string;
        
        const response = await fetch("/api/parse-receipt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: base64Image }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to parse receipt image.");
        }

        const data: ReceiptData = await response.json();
        setReceipt(data);
        
        // Initialize empty assignments for new items
        const initialAssignments: Assignments = {};
        data.items.forEach((item) => {
          initialAssignments[item.id] = [];
        });
        setAssignments(initialAssignments);
      };
      
      reader.onerror = () => {
        throw new Error("Failed to read files securely.");
      };
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while uploading. Please check your API secrets.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleAddPersonDirect = () => {
    const name = prompt("Enter the name of the new person:");
    if (name && name.trim()) {
      const pName = name.trim();
      if (!people.includes(pName)) {
        setPeople([...people, pName]);
      }
    }
  };

  const toggleAssignment = (itemId: string, pName: string) => {
    const active = assignments[itemId] || [];
    let updated: string[];
    if (active.includes(pName)) {
      updated = active.filter((p) => p !== pName);
    } else {
      updated = [...active, pName];
    }
    setAssignments({
      ...assignments,
      [itemId]: updated,
    });
  };

  // Direct manual additions
  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !itemPrice) return;

    const priceNum = parseFloat(itemPrice);
    if (isNaN(priceNum)) return;

    const id = `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newItem: ReceiptItem = {
      id,
      name: itemName.trim(),
      price: priceNum,
      quantity: parseInt(itemQty) || 1,
    };

    if (receipt) {
      const updatedItems = [...receipt.items, newItem];
      const subtotal = updatedItems.reduce((acc, it) => acc + it.price, 0);
      setReceipt({
        ...receipt,
        items: updatedItems,
        subtotal: parseFloat(subtotal.toFixed(2)),
        total: parseFloat((subtotal + receipt.tax + receipt.tip).toFixed(2)),
      });
      setAssignments({
        ...assignments,
        [id]: [],
      });
    } else {
      setReceipt({
        merchant: "Manual Receipt",
        items: [newItem],
        subtotal: priceNum,
        tax: 0,
        tip: 0,
        total: priceNum,
      });
      setAssignments({
        [id]: [],
      });
    }

    // Reset Form
    setItemName("");
    setItemPrice("");
    setItemQty("1");
    setShowManualAdd(false);
  };

  const deleteItem = (itemId: string) => {
    if (!receipt) return;
    const updatedItems = receipt.items.filter((it) => it.id !== itemId);
    const subtotal = updatedItems.reduce((acc, it) => acc + it.price, 0);
    
    setReceipt({
      ...receipt,
      items: updatedItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
      total: parseFloat((subtotal + receipt.tax + receipt.tip).toFixed(2)),
    });

    const updatedAssignments = { ...assignments };
    delete updatedAssignments[itemId];
    setAssignments(updatedAssignments);
  };

  const startEditItem = (item: ReceiptItem) => {
    setEditingItem(item.id);
    setItemName(item.name);
    setItemPrice(item.price.toString());
    setItemQty(item.quantity.toString());
  };

  const saveEditItem = (itemId: string) => {
    if (!receipt) return;
    const priceNum = parseFloat(itemPrice);
    if (isNaN(priceNum)) return;

    const updatedItems = receipt.items.map((it) => {
      if (it.id === itemId) {
        return {
          ...it,
          name: itemName.trim(),
          price: priceNum,
          quantity: parseInt(itemQty) || 1,
        };
      }
      return it;
    });

    const subtotal = updatedItems.reduce((acc, it) => acc + it.price, 0);

    setReceipt({
      ...receipt,
      items: updatedItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
      total: parseFloat((subtotal + receipt.tax + receipt.tip).toFixed(2)),
    });

    setEditingItem(null);
    setItemName("");
    setItemPrice("");
    setItemQty("1");
  };

  const saveMerchantName = () => {
    if (!receipt) return;
    setReceipt({
      ...receipt,
      merchant: merchantNameInput.trim() || "Receipt",
    });
    setEditingMerchant(false);
  };

  const saveTaxTipValues = () => {
    if (!receipt) return;
    const computedTax = parseFloat(taxInput) || 0;
    const computedTip = parseFloat(tipInput) || 0;
    setReceipt({
      ...receipt,
      tax: computedTax,
      tip: computedTip,
      total: parseFloat((receipt.subtotal + computedTax + computedTip).toFixed(2)),
    });
    setIsEditingTaxTip(false);
  };

  return (
    <div id="receipt-parser" className="flex flex-col h-full bg-[#0f0f0f] border-r border-[#222]">
      {/* Search Header */}
      <div className="p-4 bg-[#0d0d0d] border-b border-[#222] flex justify-between items-center shrink-0">
        <h2 className="text-sm font-semibold text-[#888] uppercase tracking-widest flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#888]" />
          Receipt: {receipt ? receipt.merchant : "Unresolved Bill"}
        </h2>
        
        {receipt && (
          <button
            id="btn-scan-another"
            onClick={() => {
              if (confirm("Reset current receipt and scan new? Current assignments will be lost.")) {
                setReceipt(null);
                setAssignments({});
                setPeople([]);
              }
            }}
            className="text-xs transition-all bg-[#222] hover:bg-[#333] border border-[#444] px-3 py-1.5 rounded text-xs font-medium text-white flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Clear & Reset
          </button>
        )}
      </div>

      {/* Main Panel Content Scroll */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        
        {/* Error Notification */}
        {error && (
          <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded text-rose-300 text-xs flex gap-3 items-start">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-white">Extraction Failed</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Empty Upload State */}
        {!receipt && !isLoading && (
          <div
            id="dropzone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`cursor-pointer transition-all border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-8 md:p-12 text-center h-[350px] md:h-[450px] ${
              isDragging
                ? "border-emerald-500 bg-[#161616]"
                : "border-[#333] bg-[#0c0c0c] hover:border-[#555] hover:bg-[#111]"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            
            <div className="p-4 bg-[#1a1a1a] rounded text-emerald-500 border border-[#333] mb-4">
              <Upload className="w-10 h-10" />
            </div>

            <h3 className="text-sm font-semibold text-white mb-1.5 uppercase tracking-wider">
              Upload Receipt Image
            </h3>
            <p className="text-[#888] text-xs max-w-sm mb-6 px-4">
              Drag & drop a photo of your dining receipt here, or browse local files. 
              The AI will extract items, prices, and taxes automatically!
            </p>

            <div className="flex flex-wrap gap-3 justify-center">
              <button
                id="btn-browse-file"
                type="button"
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-black rounded text-xs font-semibold whitespace-nowrap active:scale-95 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Browse Image
              </button>
              
              <button
                id="btn-load-sample"
                type="button"
                className="px-4 py-1.5 bg-[#1a1a1a] border border-[#333] hover:bg-[#2a2a2a] text-[#eee] rounded text-xs font-semibold flex items-center gap-1.5 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  onLoadSample();
                }}
              >
                <Layers className="w-3.5 h-3.5 text-emerald-500" />
                Load Sample Bill
              </button>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-12 bg-[#0c0c0c] rounded border border-[#222] h-[350px] shadow-sm">
            <div className="relative flex items-center justify-center mb-6">
              <div className="w-16 h-16 border-4 border-[#222] border-t-emerald-500 rounded-full animate-spin"></div>
              <FileText className="w-6 h-6 text-emerald-500 absolute animate-pulse" />
            </div>
            
            <h3 className="text-xs font-semibold text-[#888] mb-2 uppercase tracking-widest font-sans">
              AI is parsing your receipt...
            </h3>
            <p className="text-[#666] text-xs text-center max-w-xs leading-relaxed animate-pulse">
              Translating layout columns, detecting quantities, parsing currency data, and auto-calculating totals.
            </p>
          </div>
        )}

        {/* Main Parsed Items Column */}
        {receipt && !isLoading && (
          <div className="space-y-6">
            <div id="receipt-header" className="p-4 bg-[#0d0d0d] rounded-lg border border-[#222]">
              <div className="flex justify-between items-start">
                <div className="space-y-1.5 flex-1 mr-4">
                  {editingMerchant ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={merchantNameInput}
                        onChange={(e) => setMerchantNameInput(e.target.value)}
                        className="text-sm bg-[#161616] text-[#eee] border border-[#333] rounded px-2 py-1 focus:outline-none focus:border-emerald-500/50 w-full max-w-xs"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveMerchantName();
                          if (e.key === "Escape") setEditingMerchant(false);
                        }}
                      />
                      <button
                        onClick={saveMerchantName}
                        className="p-1 text-emerald-400 bg-emerald-900/20 rounded border border-emerald-500/30 hover:bg-emerald-900/40"
                        title="Save Changes"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group">
                      <h3 className="text-sm font-semibold text-[#888] uppercase tracking-widest">
                        {receipt.merchant}
                      </h3>
                      <button
                        onClick={() => {
                          setMerchantNameInput(receipt.merchant);
                          setEditingMerchant(true);
                        }}
                        className="text-[#666] opacity-0 group-hover:opacity-100 hover:text-emerald-400 transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-[#666] font-medium font-mono uppercase tracking-wider">
                    {receipt.items.length} items parsed &bull; <span className="text-emerald-500 font-semibold text-[10px] px-2 py-0.5 bg-emerald-900/30 rounded border border-emerald-500/30">Scan Complete</span>
                  </p>
                </div>
                
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-[#666] font-bold uppercase tracking-wider block">
                    Receipt Total
                  </span>
                  <span className="text-lg font-mono text-emerald-400 font-bold">
                    ${receipt.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Structured Table */}
            <div className="bg-[#0f0f0f] rounded border border-[#222] overflow-hidden">
              <div className="p-4 border-b border-[#222] bg-[#0d0d0d] flex justify-between items-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#888]">
                  Receipt Items & Cost Splitting
                </span>
                
                <button
                  type="button"
                  id="btn-manual-add"
                  onClick={() => setShowManualAdd(!showManualAdd)}
                  className="px-2.5 py-1 text-[#aaa] border border-[#333] font-semibold bg-[#222] hover:bg-[#333] transition rounded text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-500" />
                  Add item
                </button>
              </div>

              {/* Direct manual form inline */}
              {showManualAdd && (
                <form
                  onSubmit={handleAddNewItem}
                  className="p-4 bg-[#161616] border-b border-[#222] flex flex-wrap gap-2.5 items-end justify-between transition-all duration-200"
                >
                  <div className="flex-1 min-w-[150px]">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-[#888] mb-1 block">
                      Name
                    </label>
                    <input
                      type="text"
                      id="input-manual-item-name"
                      placeholder="e.g. Garlic Bread"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      className="text-xs w-full px-2.5 py-1.5 bg-[#0e0e0e] text-[#eee] border border-[#222] rounded focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div className="w-[80px]">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-[#888] mb-1 block">
                      Qty
                    </label>
                    <input
                      type="number"
                      id="input-manual-item-qty"
                      min="1"
                      value={itemQty}
                      onChange={(e) => setItemQty(e.target.value)}
                      className="text-xs w-full px-2.5 py-1.5 bg-[#0e0e0e] text-[#eee] border border-[#222] rounded text-center focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div className="w-[90px]">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-[#888] mb-1 block">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      id="input-manual-item-price"
                      step="0.01"
                      min="0.01"
                      placeholder="e.g. 7.50"
                      value={itemPrice}
                      onChange={(e) => setItemPrice(e.target.value)}
                      className="text-xs w-full px-2.5 py-1.5 bg-[#0e0e0e] text-[#eee] text-right border border-[#222] rounded focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      type="submit"
                      id="btn-manual-item-save"
                      className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-black rounded text-xs font-semibold"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowManualAdd(false)}
                      className="px-3 py-1.5 bg-[#222] border border-[#333] text-[#aaa] rounded text-xs font-medium hover:bg-[#2d2d2d]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="divide-y divide-[#222]">
                {receipt.items.map((item, index) => {
                  const assignedToThisItem = assignments[item.id] || [];
                  const isEditingThisItem = editingItem === item.id;

                  return (
                    <div
                      key={item.id}
                      className={`p-4 transition-all hover:bg-[#1a1a1a]/55 relative group ${
                        assignedToThisItem.length === 0 ? "bg-[#181510]" : "bg-[#161616]"
                      }`}
                    >
                      {isEditingThisItem ? (
                        <div className="flex flex-wrap gap-3 items-end">
                          <input
                            type="text"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            className="text-sm bg-[#0a0a0a] border border-[#333] text-[#eee] rounded px-2 py-0.5 focus:outline-none focus:border-emerald-500/50 flex-1 min-w-[200px]"
                            placeholder="Item name"
                          />
                          <input
                            type="number"
                            value={itemQty}
                            onChange={(e) => setItemQty(e.target.value)}
                            className="text-sm bg-[#0a0a0a] border border-[#333] text-[#eee] rounded px-2 py-0.5 focus:outline-none focus:border-emerald-500/50 w-16 text-center"
                            placeholder="Qty"
                          />
                          <input
                            type="number"
                            value={itemPrice}
                            onChange={(e) => setItemPrice(e.target.value)}
                            className="text-sm bg-[#0a0a0a] border border-[#333] text-[#eee] rounded px-2 py-0.5 focus:outline-none focus:border-emerald-500/50 w-24 text-right"
                            placeholder="Price"
                          />
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => saveEditItem(item.id)}
                              className="p-1 bg-emerald-900/20 text-emerald-400 hover:bg-emerald-900/40 rounded border border-emerald-500/30"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingItem(null)}
                              className="p-1 bg-[#222] text-[#aaa] hover:bg-[#333] rounded border border-[#333]"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {/* Item line upper details */}
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex items-start gap-1.5 flex-1">
                              <span className="text-xs text-emerald-400 font-mono font-medium mt-0.5 bg-emerald-950/40 border border-emerald-500/20 px-1.5 py-0.5 rounded leading-none">
                                {item.quantity}x
                              </span>
                              <div className="space-y-0.5">
                                <p className="text-sm font-semibold text-white font-sans tracking-tight leading-snug">
                                  {item.name}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-sm font-mono tracking-tighter text-[#aaa] pr-5">
                                ${item.price.toFixed(2)}
                              </span>
                              
                              {/* Item actions */}
                              <div className="absolute right-3 top-4 flex md:opacity-0 group-hover:opacity-100 items-center gap-1 bg-[#222] rounded border border-[#333] p-0.5 transition-all shadow-md shrink-0 z-10 animate-fade-in">
                                <button
                                  type="button"
                                  onClick={() => startEditItem(item)}
                                  className="p-1 hover:bg-[#333] rounded text-[#aaa] hover:text-white transition"
                                  title="Edit Item details"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteItem(item.id)}
                                  className="p-1 hover:bg-rose-955/50 rounded text-[#888] hover:text-rose-400 transition"
                                  title="Delete item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Splits visualization/action picker */}
                          <div className="flex flex-wrap items-center gap-1.5 border-t border-[#222] pt-2 text-xs">
                            <span className="text-[#64748b] font-bold select-none text-[9px] font-sans uppercase tracking-widest">
                              Split:
                            </span>

                            {assignedToThisItem.length > 0 ? (
                              assignedToThisItem.map((name) => (
                                <span
                                  key={name}
                                  className="bg-emerald-950/30 border border-emerald-500/30 font-medium text-emerald-400 text-[10px] px-2.5 py-0.5 rounded inline-flex items-center gap-1 hover:bg-rose-950/40 hover:border-rose-500/30 hover:text-rose-400 cursor-pointer select-none transition group/tag"
                                  onClick={() => toggleAssignment(item.id, name)}
                                  title={`Remove ${name} from ${item.name}`}
                                >
                                  {name}
                                  <span className="text-emerald-500 group-hover/tag:text-rose-400 font-bold ml-0.5">&#215;</span>
                                </span>
                              ))
                            ) : (
                              <span className="text-amber-500 border border-amber-500/20 bg-amber-500/5 text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                Unassigned
                              </span>
                            )}

                            {/* Direct fast assignment buttons (only if people are registered) */}
                            {people.length > 0 && (
                              <div className="flex gap-1 flex-wrap ml-1.5">
                                {people
                                  .filter((name) => !assignedToThisItem.includes(name))
                                  .map((name) => (
                                    <button
                                      key={name}
                                      type="button"
                                      onClick={() => toggleAssignment(item.id, name)}
                                      className="border border-[#333] text-[#888] bg-[#1a1a1a] hover:bg-[#222] rounded px-2 py-0.5 text-[10px] font-medium transition duration-150"
                                    >
                                      + {name}
                                    </button>
                                  ))}
                              </div>
                            )}

                            {/* Add a person on the fly button when people is empty */}
                            {people.length === 0 && (
                              <button
                                type="button"
                                onClick={handleAddPersonDirect}
                                className="text-[10px] text-[#666] font-bold uppercase tracking-wider hover:text-emerald-400 cursor-pointer ml-1.5 transition"
                              >
                                Add person
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Tax, Tip and Summary total of parsed values */}
              <div className="bg-[#0b0b0b] border-t border-[#222] p-4 space-y-2.5 text-xs font-mono text-[#888]">
                <div className="flex justify-between items-center">
                  <span>Subtotal:</span>
                  <span className="font-bold text-[#eee]">${receipt.subtotal.toFixed(2)}</span>
                </div>
                
                {isEditingTaxTip ? (
                  <div className="p-3 bg-[#111] border border-[#222] rounded space-y-2 font-sans text-[#ccc]">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-[#666] uppercase tracking-wider mb-1 block">
                          Tax Amt ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="e.g. 5.50"
                          value={taxInput}
                          onChange={(e) => setTaxInput(e.target.value)}
                          className="w-full text-xs p-1.5 bg-[#0a0a0a] text-white border border-[#333] rounded focus:outline-none focus:border-emerald-500/50 font-mono text-right"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-[#666] uppercase tracking-wider mb-1 block">
                          Tip Amt ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="e.g. 10.00"
                          value={tipInput}
                          onChange={(e) => setTipInput(e.target.value)}
                          className="w-full text-xs p-1.5 bg-[#0a0a0a] text-white border border-[#333] rounded focus:outline-none focus:border-emerald-500/50 font-mono text-right"
                        />
                      </div>
                    </div>
                    <div className="flex gap-1.5 justify-end pt-1">
                      <button
                        type="button"
                        onClick={saveTaxTipValues}
                        className="px-3 py-1 bg-emerald-500 text-black rounded text-xs font-bold hover:bg-emerald-600"
                      >
                        Apply
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingTaxTip(false)}
                        className="px-3 py-1 bg-[#222] border border-[#333] text-[#aaa] rounded text-xs font-medium hover:bg-[#333]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center group">
                      <span className="flex items-center gap-1 text-[#666]">
                        Tax:
                        <button
                          onClick={() => {
                            setTaxInput(receipt.tax.toString());
                            setTipInput(receipt.tip.toString());
                            setIsEditingTaxTip(true);
                          }}
                          className="text-[10px] font-sans font-bold text-[#666] hover:text-emerald-400 underline opacity-0 group-hover:opacity-100 transition"
                        >
                          Modify
                        </button>
                      </span>
                      <span className="font-bold text-[#eee]">${receipt.tax.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center group">
                      <span className="flex items-center gap-1 text-[#666]">
                        Tip:
                        <button
                          onClick={() => {
                            setTaxInput(receipt.tax.toString());
                            setTipInput(receipt.tip.toString());
                            setIsEditingTaxTip(true);
                          }}
                          className="text-[10px] font-sans font-bold text-[#666] hover:text-emerald-400 underline opacity-0 group-hover:opacity-100 transition"
                        >
                          Modify
                        </button>
                      </span>
                      <span className="font-bold text-[#eee]">${receipt.tip.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center border-t border-[#222] pt-2.5 text-sm font-semibold text-[#eee]">
                  <span>Grand Total:</span>
                  <span className="font-mono text-emerald-400 text-base font-bold">${receipt.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Quick Helper Tip */}
            <div className="p-3 bg-[#111] border border-[#222] rounded-lg flex gap-2 items-center text-[#666] text-xs transition">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping shrink-0"></span>
              <p className="leading-snug text-[#888]">
                <strong>Click tags to assign</strong> parts manually or use the AI smart chat to instruct naturally!
              </p>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
