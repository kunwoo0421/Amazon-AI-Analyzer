"use client";

import { useState } from 'react';
import { glossaryTerms } from '../../data/glossary';
import { Search, Beaker, Layout, Database, CheckCircle2, AlertCircle, XCircle, ArrowRight, Loader2, Smartphone, Monitor } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

import WorkStatusPage from '../brand/work-status/page';
import InventoryPage from '../brand/inventory/page';

type Tab = 'glossary' | 'ui' | 'api' | 'mobile' | 'work-status' | 'inventory';

export default function TestPage() {
    const [activeTab, setActiveTab] = useState<Tab>('ui');

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 text-primary">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-pastel-beige pb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-primary tracking-tight flex items-center gap-3">
                        <Beaker className="text-secondary" size={32} />
                        Developer Test Center
                    </h1>
                    <p className="text-pastel-taupe mt-2 text-lg">
                        Test components, verify data logic, and debug API integrations.
                    </p>
                </div>
                <div className="flex bg-pastel-cream p-1 rounded-xl border border-pastel-beige overflow-x-auto max-w-full">
                    {(['inventory', 'work-status', 'glossary', 'ui', 'api', 'mobile'] as Tab[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-6 py-2.5 rounded-lg text-sm font-bold transition-all capitalize whitespace-nowrap",
                                activeTab === tab
                                    ? "bg-primary text-white shadow-sm"
                                    : "text-pastel-taupe hover:text-primary hover:bg-white/50"
                            )}
                        >
                            {tab === 'inventory' ? 'Inventory' :
                                tab === 'ui' ? 'UI Components' :
                                    tab === 'api' ? 'API Debug' :
                                        tab === 'mobile' ? 'Mobile Preview' :
                                            tab === 'work-status' ? 'Work Status' :
                                                'Glossary Data'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                {activeTab === 'inventory' && (
                    <div className="border border-pastel-beige rounded-2xl overflow-hidden">
                        <InventoryPage />
                    </div>
                )}
                {activeTab === 'glossary' && <GlossaryTest />}
                {activeTab === 'ui' && <UiComponentTest />}
                {activeTab === 'api' && <ApiDebug />}
                {activeTab === 'mobile' && <MobilePreview />}
                {activeTab === 'work-status' && (
                    <div className="border border-pastel-beige rounded-2xl overflow-hidden">
                        <WorkStatusPage />
                    </div>
                )}
            </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------

function MobilePreview() {
    const [url, setUrl] = useState('/');
    const [device, setDevice] = useState<'iphone' | 'android'>('iphone');

    const devices = {
        iphone: { name: 'iPhone 14 Pro', width: 393, height: 852, frameColor: 'bg-zinc-900', radius: 'rounded-[3rem]' },
        android: { name: 'Galaxy S23', width: 412, height: 915, frameColor: 'bg-slate-900', radius: 'rounded-[2rem]' }
    };

    const currentDevice = devices[device];

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start h-full">
            {/* Controls */}
            <div className="w-full lg:w-1/3 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-pastel-beige space-y-4">
                    <h3 className="font-bold text-primary flex items-center gap-2">
                        <Smartphone size={20} className="text-secondary" />
                        Preview Settings
                    </h3>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-pastel-taupe">Device Model</label>
                        <div className="flex gap-2 p-1 bg-pastel-cream rounded-xl border border-pastel-beige">
                            <button
                                onClick={() => setDevice('iphone')}
                                className={cn(
                                    "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
                                    device === 'iphone' ? "bg-white shadow-sm text-primary" : "text-pastel-taupe hover:text-primary"
                                )}
                            >
                                iPhone
                            </button>
                            <button
                                onClick={() => setDevice('android')}
                                className={cn(
                                    "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
                                    device === 'android' ? "bg-white shadow-sm text-primary" : "text-pastel-taupe hover:text-primary"
                                )}
                            >
                                Galaxy
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-pastel-taupe">Page URL</label>
                        <select
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full p-3 rounded-xl border border-pastel-beige bg-white text-primary focus:outline-none focus:ring-2 focus:ring-secondary font-medium"
                        >
                            <option value="/">Home (/)</option>
                            <option value="/analysis">Analysis (/analysis)</option>
                            <option value="/community">Community (/community)</option>
                            <option value="/education">Education (/education)</option>
                            <option value="/library">Library (/library)</option>
                            <option value="/subscription">Subscription (/subscription)</option>
                        </select>
                    </div>

                    <div className="p-4 bg-blue-50 text-blue-800 text-sm rounded-xl border border-blue-100 flex items-start gap-3">
                        <Monitor size={16} className="mt-1 shrink-0" />
                        <p>
                            Use this preview to check responsive layouts and touch interactions.
                            The frame simulates the viewport size of popular devices.
                        </p>
                    </div>
                </div>
            </div>

            {/* Device Frame */}
            <div className="flex-1 flex justify-center bg-pastel-cream/50 rounded-3xl border border-dashed border-pastel-beige p-8 min-h-[800px]">
                <div
                    className={cn(
                        "relative shadow-2xl transition-all duration-500 border-[12px] border-zinc-900 overflow-hidden bg-white shrink-0",
                        currentDevice.radius
                    )}
                    style={{
                        width: currentDevice.width,
                        height: currentDevice.height
                    }}
                >
                    {/* Notch / Dynamic Island */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-zinc-900 rounded-b-2xl z-20 pointer-events-none" />

                    {/* Status Bar Mockup */}
                    <div className="absolute top-2 w-full px-8 flex justify-between items-center text-[10px] font-bold text-black z-10 pointer-events-none mix-blend-difference text-white">
                        <span>9:41</span>
                        <div className="flex gap-1">
                            <span>5G</span>
                            <span>100%</span>
                        </div>
                    </div>

                    {/* Content Iframe */}
                    <iframe
                        src={url}
                        className="w-full h-full border-none bg-white"
                        title="Mobile Preview"
                    />

                    {/* Home Indicator */}
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/20 rounded-full z-20 pointer-events-none" />
                </div>
            </div>
        </div>
    );
}

function GlossaryTest() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredTerms = glossaryTerms.filter((item) =>
        item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="bg-pastel-cream border border-pastel-beige rounded-2xl p-6">
                <h3 className="text-primary font-bold flex items-center gap-2 mb-2">
                    <Database size={20} className="text-accent" />
                    Glossary Data Verification
                </h3>
                <p className="text-sm text-pastel-taupe">
                    Testing the glossary data structure and search filtering logic.
                    Total records: <span className="font-mono font-bold text-primary">{glossaryTerms.length}</span>
                </p>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pastel-taupe" size={20} />
                <input
                    type="text"
                    placeholder="Search terms..."
                    className="w-full pl-12 pr-4 py-4 bg-white border border-pastel-beige rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm transition-all font-medium text-primary placeholder:text-pastel-taupe/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {filteredTerms.map((item, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={index}
                        className="p-6 border border-pastel-beige rounded-2xl bg-white shadow-sm hover:shadow-md transition-all group"
                    >
                        <h2 className="text-lg font-bold text-primary group-hover:text-secondary transition-colors mb-2">
                            {item.term}
                        </h2>
                        <p className="text-pastel-taupe leading-relaxed text-sm">
                            {item.definition}
                        </p>
                    </motion.div>
                ))}
            </div>

            {filteredTerms.length === 0 && (
                <div className="text-center py-20 bg-pastel-cream rounded-2xl border border-dashed border-pastel-beige">
                    <p className="text-pastel-taupe">No terms found.</p>
                </div>
            )}
        </div>
    );
}

function UiComponentTest() {
    const [loading, setLoading] = useState(false);

    return (
        <div className="grid gap-8">
            {/* Buttons */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-primary border-b border-pastel-beige pb-2">Buttons & States</h3>
                <div className="flex flex-wrap gap-4 items-center p-6 bg-white rounded-2xl border border-pastel-beige">
                    <button className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all">
                        Primary Button
                    </button>
                    <button className="px-6 py-2.5 bg-secondary text-primary rounded-xl font-bold hover:bg-secondary/90 transition-all shadow-lg shadow-pastel-yellow/20">
                        Brand Button
                    </button>
                    <button className="px-6 py-2.5 border border-pastel-beige text-pastel-taupe rounded-xl font-bold hover:bg-pastel-cream hover:text-primary transition-all">
                        Secondary Button
                    </button>
                    <button className="px-6 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all">
                        Danger Zone
                    </button>
                    <button
                        onClick={() => setLoading(!loading)}
                        className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                        disabled={loading}
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        {loading ? 'Processing...' : 'Toggle Loading'}
                    </button>
                </div>
            </section>

            {/* Alerts */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-primary border-b border-pastel-beige pb-2">Feedback & Alerts</h3>
                <div className="grid gap-4 p-6 bg-white rounded-2xl border border-pastel-beige">
                    <div className="flex items-start gap-4 p-4 bg-pastel-cream text-primary rounded-xl border border-pastel-beige">
                        <CheckCircle2 className="shrink-0 mt-0.5 text-accent" size={20} />
                        <div>
                            <h4 className="font-bold">Success Message</h4>
                            <p className="text-sm opacity-90 text-pastel-taupe">Your operation was completed successfully.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-pastel-yellow/10 text-primary rounded-xl border border-pastel-yellow/30">
                        <AlertCircle className="shrink-0 mt-0.5 text-pastel-yellow" size={20} />
                        <div>
                            <h4 className="font-bold">Warning Message</h4>
                            <p className="text-sm opacity-90 text-pastel-taupe">Please review your inputs before proceeding.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100">
                        <XCircle className="shrink-0 mt-0.5" size={20} />
                        <div>
                            <h4 className="font-bold">Error Message</h4>
                            <p className="text-sm opacity-90">Something went wrong. Please try again later.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function ApiDebug() {
    const [result, setResult] = useState<string | null>(null);

    const runMockTest = () => {
        setResult("Running...");
        setTimeout(() => {
            setResult(JSON.stringify({
                status: "success",
                timestamp: new Date().toISOString(),
                data: {
                    user: "Test User",
                    permissions: ["READ", "WRITE"],
                    active: true
                }
            }, null, 2));
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <div className="bg-primary text-pastel-cream p-6 rounded-2xl font-mono text-sm leading-relaxed overflow-x-auto min-h-[200px] border border-pastel-beige">
                {result ? (
                    <pre>{result}</pre>
                ) : (
                    <div className="flex items-center justify-center h-full opacity-50 text-pastel-beige">
                        No API calls made yet.
                    </div>
                )}
            </div>
            <div className="flex gap-4">
                <button
                    onClick={runMockTest}
                    className="flex items-center gap-2 px-6 py-3 bg-secondary text-primary rounded-xl font-bold hover:bg-secondary/90 transition-all hover:-translate-y-1 shadow-lg shadow-pastel-yellow/20"
                >
                    Run Mock API Call
                    <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
}
