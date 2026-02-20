"use client";

import { AuthForm } from "../../components/AuthForm";

export default function MyPage() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-5 duration-500 py-12">
            <div className="text-center mb-10 space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">Welcome to Amazon Master</h1>
                <p className="text-slate-500">Join the community of top Amazon Sellers</p>
            </div>

            <AuthForm />
        </div>
    );
}
