/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ReceiptData {
  merchant: string;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
}

export interface Assignments {
  [itemId: string]: string[];
}

export interface PersonShare {
  itemName: string;
  itemId: string;
  originalPrice: number;
  sharePrice: number;
  quantity: number;
}

export interface PersonBreakdown {
  name: string;
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  shares: PersonShare[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: string;
}
