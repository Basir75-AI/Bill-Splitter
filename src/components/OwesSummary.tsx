import React, { useState } from "react";
import { User, ShieldAlert, Sparkles, AlertCircle, X, ChevronDown, ChevronUp, UserCheck, Percent } from "lucide-react";
import { ReceiptData, Assignments, PersonBreakdown, PersonShare } from "../types";

interface OwesSummaryProps {
  receipt: ReceiptData | null;
  people: string[];
  setPeople: (p: string[]) => void;
  assignments: Assignments;
  setAssignments: (a: Assignments) => void;
}

export function OwesSummary({
  receipt,
  people,
  setPeople,
  assignments,
  setAssignments,
}: OwesSummaryProps) {
  const [expandedPerson, setExpandedPerson] = useState<string | null>(null);

  if (!receipt) return null;

  // 1. Calculate each person's core allocations and build reports
  const breakdowns: { [name: string]: PersonBreakdown } = {};
  
  // Initialize breakdown structures
  people.forEach((pName) => {
    breakdowns[pName] = {
      name: pName,
      subtotal: 0,
      tax: 0,
      tip: 0,
      total: 0,
      shares: [],
    };
  });

  let sumOfAssignedSubtotals = 0;
  const unassignedItems: { item: any; priceLeft: number }[] = [];
  let unassignedSubtotalAmt = 0;

  // Map allocations
  receipt.items.forEach((item) => {
    const assignedPeople = assignments[item.id] || [];
    const shareCount = assignedPeople.length;

    if (shareCount === 0) {
      unassignedItems.push({ item, priceLeft: item.price });
      unassignedSubtotalAmt += item.price;
    } else {
      const splitPrice = item.price / shareCount;
      assignedPeople.forEach((pName) => {
        if (breakdowns[pName]) {
          breakdowns[pName].subtotal += splitPrice;
          breakdowns[pName].shares.push({
            itemId: item.id,
            itemName: item.name,
            originalPrice: item.price,
            sharePrice: splitPrice,
            quantity: item.quantity,
          });
          sumOfAssignedSubtotals += splitPrice;
        }
      });
    }
  });

  // Calculate proportional distribution
  people.forEach((pName) => {
    const pBreakdown = breakdowns[pName];
    if (sumOfAssignedSubtotals > 0) {
      const sharePercentage = pBreakdown.subtotal / sumOfAssignedSubtotals;
      pBreakdown.tax = sharePercentage * receipt.tax;
      pBreakdown.tip = sharePercentage * receipt.tip;
      pBreakdown.total = pBreakdown.subtotal + pBreakdown.tax + pBreakdown.tip;
    }
  });

  // Handle person deleting
  const handleDeletePerson = (pName: string) => {
    if (confirm(`Are you sure you want to remove ${pName}? This will wipe their assignments.`)) {
      setPeople(people.filter((name) => name !== pName));
      
      // Wipe assignments mapping for items that included this person
      const updatedAssignments: Assignments = {};
      Object.keys(assignments).forEach((itemId) => {
        updatedAssignments[itemId] = (assignments[itemId] || []).filter((name) => name !== pName);
      });
      setAssignments(updatedAssignments);
    }
  };

  const rounded = (val: number) => Math.round(val * 100) / 100;
  const splitCompletionPercentage = receipt.subtotal > 0
    ? Math.min(100, Math.round((sumOfAssignedSubtotals / receipt.subtotal) * 100))
    : 0;

  return (
    <div className="space-y-6">
      {/* progress card visual bar */}
      <div className="bg-[#0c0c0c] p-4 rounded-xl border border-[#222] shadow-sm shrink-0">
        <div className="flex justify-between items-center mb-1.5 font-sans">
          <span className="text-xs font-bold text-[#888] uppercase tracking-widest flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
            Cost Assignment Status
          </span>
          <span className="text-xs font-semibold text-[#eee] font-mono">
            {splitCompletionPercentage}% split completed
          </span>
        </div>
        <div className="w-full bg-[#161616] h-2 rounded-full overflow-hidden flex border border-[#222]">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            style={{ width: `${splitCompletionPercentage}%` }}
          ></div>
        </div>
        
        {unassignedSubtotalAmt > 0 && (
          <div className="mt-3 p-3 bg-amber-950/20 border border-amber-500/20 rounded-lg flex items-start gap-2.5 text-[11px] text-amber-300 leading-normal">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Unassigned Funds Left (${rounded(unassignedSubtotalAmt).toFixed(2)})</p>
              <p className="text-amber-400/80 mt-0.5">
                You still have {unassignedItems.length} items unassigned. Tax and tip allocations will calibrate proportionally to items already claimed. Use the chat to claim these items.
              </p>
            </div>
          </div>
        )}

        {unassignedSubtotalAmt === 0 && people.length > 0 && (
          <div className="mt-3 p-2.5 bg-emerald-950/20 border border-emerald-500/20 rounded-lg flex items-center gap-2 text-emerald-400 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
            100% of subtotal is accounted for! Proportional shares match perfectly.
          </div>
        )}
      </div>

      {/* People Breakdowns list */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-[#666] uppercase tracking-widest px-1 block">
          Who Owes List ({people.length})
        </h3>

        {people.length === 0 ? (
          <div className="p-8 text-center bg-[#0c0c0c] border border-[#222] border-dashed rounded-xl select-none">
            <User className="w-8 h-8 text-[#555] mx-auto mb-2" />
            <p className="text-xs font-semibold text-[#888]">No people listed yet</p>
            <p className="text-[11px] text-[#555] mt-0.5 max-w-[200px] mx-auto">
              Type names in chat or click an unassigned tag in the items list to begin registration.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {people.map((pName) => {
              const b = breakdowns[pName] || {
                name: pName,
                subtotal: 0,
                tax: 0,
                tip: 0,
                total: 0,
                shares: [],
              };
              const isExpanded = expandedPerson === pName;

              return (
                <div
                  key={pName}
                  className="bg-[#0c0c0c] border border-[#222] hover:border-[#333] rounded-xl transition shadow-md overflow-hidden"
                >
                  {/* Summary trigger strip */}
                  <div
                    className="p-4 flex justify-between items-center cursor-pointer select-none"
                    onClick={() => setExpandedPerson(isExpanded ? null : pName)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                        {pName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#eee] font-sans tracking-tight">
                          {pName}
                        </h4>
                        <p className="text-[10px] text-[#666] font-medium font-mono uppercase tracking-wider">
                          {b.shares.length} claim{b.shares.length !== 1 ? "s" : ""} &bull; Sub: ${b.subtotal.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pr-1">
                      <div className="text-right">
                        <span className="text-[9px] text-[#666] font-bold block uppercase tracking-wider select-none">
                          Total Owed
                        </span>
                        <span className="text-base font-bold text-emerald-400 font-mono">
                          ${rounded(b.total || 0).toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-1.5 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePerson(pName);
                          }}
                          className="p-1 hover:bg-rose-955/50 rounded text-[#666] hover:text-rose-400 transition"
                          title="Remove person"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded detail checklist list of claims */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-[#222] bg-[#0f0f0f] space-y-3">
                      <p className="text-[10px] uppercase font-extrabold text-[#666] tracking-widest pt-2">
                        Allocated Shares Breakdown
                      </p>
                      
                      {b.shares.length === 0 ? (
                        <p className="text-xs text-[#666] italic">No items assigned yet.</p>
                      ) : (
                        <div className="space-y-3 text-xs">
                          {/* list shares */}
                          <div className="divide-y divide-[#222] border border-[#222] rounded bg-[#0d0d0d] overflow-hidden shadow-sm">
                            {b.shares.map((sh, idx) => {
                              const totalAssignedPeople = assignments[sh.itemId]?.length || 1;
                              return (
                                <div key={`${sh.itemId}-${idx}`} className="p-3 text-xs text-[#aaa] flex justify-between items-center font-sans hover:bg-[#111] transition duration-150">
                                  <div className="space-y-0.5 max-w-[70%]">
                                    <p className="font-semibold text-[#eee] leading-tight">
                                      {sh.itemName}
                                    </p>
                                    <p className="text-[10px] text-[#666] font-medium font-mono uppercase tracking-wider">
                                      Whole price: ${sh.originalPrice.toFixed(2)} &bull; Shared by {totalAssignedPeople}
                                    </p>
                                  </div>
                                  <span className="font-bold font-mono text-[#eee]">
                                    ${rounded(sh.sharePrice).toFixed(2)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* proportional values list */}
                          <div className="p-3 bg-[#0d0d0d] border border-[#222] rounded-lg space-y-2 flex flex-col justify-center text-xs font-mono text-[#888]">
                            <div className="flex justify-between text-[#888] font-mono text-[11px]">
                              <span>Items Subtotal:</span>
                              <span className="text-[#eee]">${b.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-[#666] font-mono text-[11px]">
                              <span>Tax Contribution:</span>
                              <span className="text-[#aaa]">+${rounded(b.tax).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-[#666] font-mono text-[11px]">
                              <span>Tip Contribution:</span>
                              <span className="text-[#aaa]">+${rounded(b.tip).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
