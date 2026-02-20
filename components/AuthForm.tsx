"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Smartphone, Lock, User, Mail, CheckCircle2, ShieldCheck } from "lucide-react";
import { cn } from "../lib/utils";
import { useData } from "../app/contexts/DataContext";

export function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Login / Register Form States
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [name, setName] = useState("");

    // Phone Verification States
    const [phone, setPhone] = useState("");
    const [verifyCode, setVerifyCode] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [timer, setTimer] = useState(0);

    // Toggle Password Visibility
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isCodeSent && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            // Timer expired logic if needed
        }
        return () => clearInterval(interval);
    }, [isCodeSent, timer]);

    const handleSendCode = () => {
        if (!phone || phone.length < 10) {
            alert("Please enter a valid phone number.");
            return;
        }
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsCodeSent(true);
            setTimer(180); // 3 minutes
            alert("Verification code sent! (Mock: 123456)");
        }, 1000);
    };

    const handleVerifyCode = () => {
        if (verifyCode === "123456") {
            setIsVerified(true);
            setIsCodeSent(false);
        } else {
            alert("Invalid code. Try 123456");
        }
    };

    const { registerUser } = useData();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Login Logic
        if (isLogin) {
            setTimeout(() => {
                setIsLoading(false);
                alert("Login successful! (Welcome back)");
            }, 1000);
        }
        // Register Logic
        else {
            if (!nickname) {
                alert("Please enter a nickname.");
                setIsLoading(false);
                return;
            }
            registerUser(email, nickname);
            setTimeout(() => {
                setIsLoading(false);
                alert(`Welcome, ${nickname}! Registration successful.`);
                setIsLogin(true); // Switch to login
            }, 1000);
        }
    };

    const handleSocialLogin = (provider: string) => {
        alert(`Redirecting to ${provider} login... (Add API Keys to enable)`);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
            {/* Header Tabs */}
            <div className="flex border-b border-slate-100">
                <button
                    onClick={() => setIsLogin(true)}
                    className={cn(
                        "flex-1 py-4 text-sm font-semibold transition-colors",
                        isLogin ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                    )}
                >
                    Login
                </button>
                <button
                    onClick={() => setIsLogin(false)}
                    className={cn(
                        "flex-1 py-4 text-sm font-semibold transition-colors",
                        !isLogin ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                    )}
                >
                    Register
                </button>
            </div>

            <div className="p-8 space-y-6">
                {/* Social Login Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={() => handleSocialLogin('naver')}
                        className="w-full py-3 rounded-xl bg-[#03C75A] text-white font-bold text-sm hover:bg-[#02b351] transition-all transform hover:-translate-y-0.5 shadow-md shadow-green-100 flex items-center justify-center gap-3"
                    >
                        <span className="font-extrabold text-lg">N</span>
                        {isLogin ? "Login with Naver" : "Sign up with Naver"}
                    </button>
                    <button
                        onClick={() => handleSocialLogin('kakao')}
                        className="w-full py-3 rounded-xl bg-[#FEE500] text-[#3c1e1e] font-bold text-sm hover:bg-[#fddc00] transition-all transform hover:-translate-y-0.5 shadow-md shadow-yellow-100 flex items-center justify-center gap-3"
                    >
                        <span className="font-extrabold text-lg">K</span>
                        {isLogin ? "Login with Kakao" : "Sign up with Kakao"}
                    </button>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-slate-500">Or continue with</span>
                    </div>
                </div>

                {/* Form Fields */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Common Fields */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                placeholder="Min. 8 characters"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Register Only Fields */}
                    {!isLogin && (
                        <>
                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <input
                                        type="password"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                        placeholder="Repeat password"
                                    />
                                </div>
                            </div>

                            {/* Nickname (New Field) */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Nickname</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                        placeholder="Community Nickname"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            {/* Phone Verification */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Phone Number (Verification)</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Smartphone className="absolute left-3 top-3 text-slate-400" size={18} />
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            disabled={isVerified}
                                            className={cn(
                                                "w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none transition-all text-sm",
                                                isVerified ? "bg-green-50 border-green-200 text-green-700" : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                            )}
                                            placeholder="010-1234-5678"
                                        />
                                        {isVerified && <CheckCircle2 className="absolute right-3 top-3 text-green-500" size={18} />}
                                    </div>
                                    {!isVerified && (
                                        <button
                                            type="button"
                                            onClick={handleSendCode}
                                            disabled={isLoading || isCodeSent}
                                            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50 min-w-[80px]"
                                        >
                                            {isLoading ? "Sending..." : isCodeSent ? "Resend" : "Send"}
                                        </button>
                                    )}
                                </div>

                                {/* Verification Code Input */}
                                {isCodeSent && !isVerified && (
                                    <div className="animate-in fade-in slide-in-from-top-2">
                                        <div className="flex gap-2 mt-2">
                                            <div className="relative flex-1">
                                                <ShieldCheck className="absolute left-3 top-3 text-slate-400" size={18} />
                                                <input
                                                    type="text"
                                                    value={verifyCode}
                                                    onChange={(e) => setVerifyCode(e.target.value)}
                                                    className="w-full pl-10 pr-16 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
                                                    placeholder="123456"
                                                />
                                                <span className="absolute right-4 top-3 text-xs font-mono text-red-500">
                                                    {formatTime(timer)}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleVerifyCode}
                                                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700"
                                            >
                                                Verify
                                            </button>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1 pl-1">
                                            * Test mock code is <span className="font-mono font-bold text-slate-600">123456</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    <button className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 mt-4">
                        {isLogin ? "Sign In" : "Create Account"}
                    </button>
                </form>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500">
                    By continuing, you agree to Amazon Seller Master's <br />
                    <a href="#" className="underline hover:text-slate-800">Terms of Service</a> and <a href="#" className="underline hover:text-slate-800">Privacy Policy</a>.
                </p>
            </div>
        </div>
    );
}
