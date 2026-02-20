"use client";

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Package, Download, AlertTriangle, CheckCircle2, XCircle, TrendingUp, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// Mock Data Types
interface InventoryItem {
    id: string;
    name: string;
    category: string;
    size: string;
    color: string;
    asin: string;
    fnsku: string;
    image?: string;
    price: number;
    qty: number;
    sales30d: number;
}

// Mock Data based on the user's image
const INVENTORY_DATA: InventoryItem[] = [
    { id: '1', category: 'Beep Toy', name: 'Dog Toys (2 in 1)', size: 'Free', color: 'White, Beige', asin: 'B0F6XT3C2W', fnsku: 'X004O52Y57', image: '/images/inventory/dog-toy.jpg', price: 8.00, qty: 42, sales30d: 35 },
    { id: '2', category: 'Stroller Cushion', name: 'Cushion for pet stroller', size: 'Free', color: 'Beige', asin: 'B0D66GBK5B', fnsku: 'X004IXAA3D', image: '/images/inventory/stroller-cushion-beige.png', price: 14.85, qty: 4, sales30d: 12 },
    { id: '3', category: 'Stroller Cushion', name: 'Cushion for pet stroller', size: 'Free', color: 'White', asin: 'B0D66K2D26', fnsku: 'X004IXAA3N', price: 14.85, qty: 5, sales30d: 8 },
    { id: '4', category: 'Stroller Cushion', name: 'Cushion for pet stroller', size: 'Free', color: 'Gray', asin: 'B0D66KFJZY', fnsku: 'X004IXTUI9', price: 14.85, qty: 0, sales30d: 15 }, // Out of Stock
    { id: '5', category: 'Stroller Cushion', name: 'Cushion for pet stroller', size: 'Free', color: 'Pink', asin: 'B0D66DL44W', fnsku: 'X004IXLJ8X', price: 14.85, qty: 8, sales30d: 10 },
    { id: '6', category: 'Liner', name: 'Liner for pet stroller', size: 'XS', color: 'White', asin: 'B0CWZZMNGR', fnsku: 'X004HK7MKV', price: 23.22, qty: 9, sales30d: 2 }, // Excess
    { id: '7', category: 'Liner', name: 'Liner for pet stroller', size: 'S', color: 'White', asin: 'B0CX14YR6L', fnsku: 'X004HKEM5J', price: 20.52, qty: 7, sales30d: 6 },
    { id: '8', category: 'Liner', name: 'Liner for pet stroller', size: 'L', color: 'White', asin: 'B0CWZSG9HN', fnsku: 'X004HK87MX', price: 18.90, qty: 8, sales30d: 12 }, // Low Stock
    { id: '9', category: 'Liner', name: 'Liner for pet stroller', size: 'XS', color: 'Beige', asin: 'B0CX1K9ZQQ', fnsku: 'X004HKEM45', price: 23.22, qty: 9, sales30d: 15 }, // Low Stock
    { id: '10', category: 'Liner', name: 'Liner for pet stroller', size: 'S', color: 'Beige', asin: 'B0CX1NZH29', fnsku: 'X004HKEXI5', price: 20.52, qty: 4, sales30d: 10 }, // Low Stock
    { id: '11', category: 'Liner', name: 'Liner for pet stroller', size: 'L', color: 'Beige', asin: 'B0CX18VHW7', fnsku: 'X004HK8F9D', price: 18.90, qty: 14, sales30d: 3 }, // Excess
    { id: '12', category: 'Liner', name: 'Liner for pet stroller', size: 'XS', color: 'Pink', asin: 'B0CX172N8Z', fnsku: 'X004HK8MPP', price: 23.22, qty: 8, sales30d: 7 },
    { id: '13', category: 'Liner', name: 'Liner for pet stroller', size: 'S', color: 'Pink', asin: 'B0CX18KMN6', fnsku: 'X004HKEM4F', price: 20.52, qty: 4, sales30d: 8 },
    { id: '14', category: 'Liner', name: 'Liner for pet stroller', size: 'L', color: 'Pink', asin: 'B0CX1FWC8H', fnsku: 'X004X0889J', price: 18.90, qty: 4, sales30d: 15 }, // Low Stock
    { id: '15', category: 'Liner', name: 'Liner for pet stroller', size: 'XS', color: 'Gray', asin: 'B0CX1B87WX', fnsku: 'X004HK95YR', price: 23.22, qty: 6, sales30d: 6 },
];

type InventoryStatus = 'Healthy' | 'Low Stock' | 'Out of Stock' | 'Excess';

function getInventoryStatus(qty: number, sales30d: number): InventoryStatus {
    if (qty === 0) return 'Out of Stock';
    if (qty < sales30d * 0.5) return 'Low Stock'; // Less than 15 days coverage (example logic)
    if (qty > sales30d * 4 && qty > 5) return 'Excess'; // More than 4 months coverage (example logic)
    return 'Healthy';
}

function getStatusColor(status: InventoryStatus) {
    switch (status) {
        case 'Healthy': return 'bg-green-100 text-green-700 border-green-200';
        case 'Low Stock': return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'Out of Stock': return 'bg-red-100 text-red-700 border-red-200';
        case 'Excess': return 'bg-blue-100 text-blue-700 border-blue-200';
        default: return 'bg-gray-100 text-gray-700';
    }
}

export default function InventoryPage() {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
    const [companyName, setCompanyName] = useState("K-SO");

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();

    const prevDay = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() - 1);
        setCurrentDate(newDate);
    };

    const nextDay = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + 1);
        setCurrentDate(newDate);
    };

    return (
        <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-pastel-beige pb-6">
                <div>
                    <h1 className="text-xl md:text-3xl font-extrabold text-primary tracking-tight flex items-center gap-2 md:gap-3">
                        <Package className="text-secondary w-6 h-6 md:w-8 md:h-8" />
                        재고 현황
                    </h1>
                    <p className="text-pastel-taupe mt-1 md:mt-2 text-sm md:text-lg">
                        실시간 아마존 FBA 재고를 파악해보세요.
                    </p>
                    <button className="flex items-center gap-2 text-pastel-taupe hover:text-primary transition-colors text-sm font-medium mt-4">
                        <Download size={16} />
                        월별 리포트 다운받기
                    </button>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row bg-white p-2 rounded-xl border border-pastel-beige shadow-sm items-center gap-2 sm:gap-4 w-full md:w-auto">
                    <div className="relative flex items-center justify-center px-4 border-b sm:border-b-0 sm:border-r border-pastel-beige pb-2 sm:pb-0 whitespace-nowrap w-full sm:w-auto sm:justify-start sm:gap-2">
                        <span className="absolute left-4 sm:static text-sm font-bold text-pastel-taupe">기업명:</span>
                        <span className="font-bold text-primary text-lg">{companyName}</span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-center">
                        <button
                            onClick={prevDay}
                            className="p-2 hover:bg-pastel-cream rounded-lg text-primary transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className="text-center min-w-[140px]">
                            <span className="text-xl font-bold text-primary font-mono">
                                {year}.{String(month + 1).padStart(2, '0')}.{String(day).padStart(2, '0')}
                            </span>
                        </div>
                        <button
                            onClick={nextDay}
                            className="p-2 hover:bg-pastel-cream rounded-lg text-primary transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop Inventory Table (Hidden on Mobile) */}
            <div className="hidden md:block bg-white rounded-2xl border border-pastel-beige shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full whitespace-nowrap">
                        <thead className="bg-pastel-cream/50 border-b border-pastel-beige">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-pastel-taupe uppercase tracking-wider">Image</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-pastel-taupe uppercase tracking-wider">Product Information</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-pastel-taupe uppercase tracking-wider">Selling Price</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-pastel-taupe uppercase tracking-wider">ASIN / FNSKU</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-pastel-taupe uppercase tracking-wider">Qty</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-pastel-taupe uppercase tracking-wider">
                                    <div className="flex items-center justify-center gap-1">
                                        Status
                                        <AlertTriangle size={14} className="text-pastel-taupe/70" />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-pastel-taupe uppercase tracking-wider">
                                    <div className="flex items-center justify-end gap-1">
                                        Sales (30d)
                                        <TrendingUp size={14} className="text-pastel-taupe/70" />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-pastel-beige/50">
                            {INVENTORY_DATA.map((item, index) => {
                                const status = getInventoryStatus(item.qty, item.sales30d);

                                return (
                                    <motion.tr
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        key={item.id}
                                        className="hover:bg-pastel-cream/10 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="text-gray-400" size={24} />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-primary text-base">{item.name}</span>
                                                <span className="text-sm text-pastel-taupe">{item.category}</span>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-xs font-medium text-slate-500">
                                                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">Size: {item.size}</span>
                                                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">Color: {item.color}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm font-bold text-primary">
                                            ${item.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-center font-mono">
                                            <div className="flex flex-col text-xs space-y-1">
                                                <span className="text-primary font-bold bg-slate-100 px-1.5 py-0.5 rounded w-fit mx-auto">{item.asin}</span>
                                                <span className="text-pastel-taupe text-[10px]">{item.fnsku}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={cn(
                                                "font-bold font-mono text-lg",
                                                item.qty === 0 ? "text-red-500" : "text-primary"
                                            )}>
                                                {item.qty}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center gap-1.5",
                                                getStatusColor(status)
                                            )}>
                                                {status === 'Healthy' && <CheckCircle2 size={12} />}
                                                {status === 'Out of Stock' && <XCircle size={12} />}
                                                {status === 'Low Stock' && <AlertTriangle size={12} />}
                                                {status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="inline-flex flex-col items-end">
                                                <span className="font-bold text-primary font-mono">{item.sales30d}</span>
                                                <span className="text-[10px] text-pastel-taupe">units / 30d</span>
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Inventory List (Visible only on Mobile) */}
            <div className="md:hidden space-y-4">
                {INVENTORY_DATA.map((item, index) => {
                    const status = getInventoryStatus(item.qty, item.sales30d);

                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={item.id}
                            className="bg-white p-4 rounded-xl border border-pastel-beige shadow-sm"
                        >
                            <div className="flex gap-4">
                                {/* Image Placeholder */}
                                <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center border border-gray-200 overflow-hidden">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <ImageIcon className="text-gray-400" size={24} />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <h3 className="font-bold text-primary text-sm whitespace-nowrap truncate">{item.name}</h3>
                                    <p className="text-xs text-pastel-taupe mt-1 whitespace-nowrap truncate">{item.category}</p>

                                    <div className="flex gap-2 mt-2 text-[10px] text-slate-500">
                                        <span className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">Size: {item.size}</span>
                                        <span className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">Color: {item.color}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-pastel-beige/50">
                                <div className="text-center">
                                    <p className="text-[10px] text-pastel-taupe uppercase font-bold text-center">Price</p>
                                    <p className="font-mono font-bold text-primary text-sm">${item.price.toFixed(2)}</p>
                                </div>
                                <div className="text-center border-l border-pastel-beige/50">
                                    <p className="text-[10px] text-pastel-taupe uppercase font-bold text-center">Qty</p>
                                    <p className={cn(
                                        "font-mono font-bold text-sm",
                                        item.qty === 0 ? "text-red-500" : "text-primary"
                                    )}>{item.qty}</p>
                                </div>
                                <div className="text-center border-l border-pastel-beige/50">
                                    <p className="text-[10px] text-pastel-taupe uppercase font-bold text-center">30d Sales</p>
                                    <p className="font-mono font-bold text-primary text-sm">{item.sales30d}</p>
                                </div>
                            </div>

                            <div className="mt-2 pt-2 border-t border-pastel-beige/30 flex justify-between items-center">
                                <div className="flex flex-col gap-1 text-[10px] text-pastel-taupe">
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-500 min-w-[35px]">ASIN:</span>
                                        <span className="font-mono text-primary font-bold">{item.asin}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-500 min-w-[35px]">FNSKU:</span>
                                        <span className="font-mono">{item.fnsku}</span>
                                    </div>
                                </div>
                                <span className={cn(
                                    "px-2 py-1 rounded-full text-[10px] whitespace-nowrap ml-2 h-fit",
                                    getStatusColor(status).replace("border ", "border-0"),
                                    "border text-xs font-bold"
                                )}>
                                    {status}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
