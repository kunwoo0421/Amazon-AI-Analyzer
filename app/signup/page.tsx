"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { ArrowLeft, CheckCircle2, User, Building2, ShieldCheck, FileText, Search, Upload } from "lucide-react";

declare global {
    interface Window {
        daum: any;
    }
}

export default function SignupPage() {
    const [step, setStep] = useState<1 | 2>(1); // 1: Select Type, 2: Fill Form & Terms
    const [accountType, setAccountType] = useState<"personal" | "business" | null>(null);

    // Common States
    const [id, setId] = useState("");
    const [isIdChecked, setIsIdChecked] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    // Personal States
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [address, setAddress] = useState("");
    const [amazonBrand, setAmazonBrand] = useState("");

    // Business States
    const [businessName, setBusinessName] = useState("");
    const [ceoName, setCeoName] = useState("");
    const [isCeo, setIsCeo] = useState<"ceo" | "manager">("ceo");
    const [subscriberName, setSubscriberName] = useState("");
    const [subscriberPhone, setSubscriberPhone] = useState("");
    const [subscriberBirthdate, setSubscriberBirthdate] = useState("");
    const [subscriberAddress, setSubscriberAddress] = useState("");
    const [businessRegNum, setBusinessRegNum] = useState("");
    const [position, setPosition] = useState("");
    const [fileName, setFileName] = useState("");

    // Terms States
    const [terms1, setTerms1] = useState(false);
    const [terms2, setTerms2] = useState(false);
    const [termsMarketing, setTermsMarketing] = useState(false);
    const [termsPush, setTermsPush] = useState(false);

    // Validation
    const isPasswordValid = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);
    const isPasswordMatch = password === passwordConfirm;

    useEffect(() => {
        if (isCeo === "ceo") {
            setSubscriberName(ceoName);
        } else if (isCeo === "manager" && subscriberName === ceoName) {
            setSubscriberName("");
        }
    }, [isCeo, ceoName]);

    useEffect(() => {
        setIsIdChecked(false); // Reset check if ID changes
    }, [id]);

    const handleCheckId = () => {
        if (id.trim() === "") return alert("아이디를 입력해주세요.");
        // Mock logic for ID check
        alert("사용 가능한 아이디입니다.");
        setIsIdChecked(true);
    };

    const handleAddressSearch = (type: "personal" | "business") => {
        if (window.daum && window.daum.Postcode) {
            new window.daum.Postcode({
                oncomplete: function (data: any) {
                    const fullAddress = data.address + (data.buildingName ? ` (${data.buildingName})` : "");
                    if (type === "personal") setAddress(fullAddress);
                    else setSubscriberAddress(fullAddress);
                }
            }).open();
        } else {
            alert("주소 검색 스크립트를 로딩 중입니다. 잠시 후 다시 시도해주세요.");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isIdChecked) return alert("아이디 중복확인을 진행해주세요.");
        if (password && !isPasswordValid) return alert("비밀번호 형식이 올바르지 않습니다.");
        if (!terms1 || !terms2) return alert("필수 약관에 동의해주세요.");
        if (accountType === 'business' && !fileName) return alert("사업자등록증을 첨부해주세요.");

        alert("회원가입이 완료되었습니다!\n(프론트엔드 모의 가입)");
        window.location.href = "/login";
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" strategy="lazyOnload" />

            {/* Header */}
            <header className="bg-white border-b border-slate-200 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <Link href="/" className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <ShieldCheck className="text-indigo-600" size={28} />
                    Seller Pilot
                </Link>
                <Link href="/login" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                    <ArrowLeft size={16} /> 돌아가기
                </Link>
            </header>

            <main className="flex-1 flex flex-col items-center py-12 px-4 sm:px-6">
                <div className="w-full max-w-2xl bg-white shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden border border-slate-100">

                    {/* Step 1: Account Type Selection */}
                    {step === 1 && (
                        <div className="p-8 md:p-12">
                            <div className="text-center mb-10">
                                <h1 className="text-3xl font-extrabold text-slate-900 mb-4">가입 유형을 선택해주세요</h1>
                                <p className="text-slate-500">회원님의 가입 목적에 맞는 계정 유형을 선택해주세요.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                {/* Personal Button */}
                                <button
                                    onClick={() => setAccountType("personal")}
                                    className={`relative p-8 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-4 group ${accountType === "personal"
                                        ? "border-indigo-600 bg-indigo-50/50 shadow-md shadow-indigo-100"
                                        : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                                        }`}
                                >
                                    {accountType === "personal" && (
                                        <div className="absolute top-4 right-4 text-indigo-600">
                                            <CheckCircle2 size={24} className="fill-indigo-100" />
                                        </div>
                                    )}
                                    <div className={`p-4 rounded-full ${accountType === "personal" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600"} transition-colors`}>
                                        <User size={32} />
                                    </div>
                                    <div>
                                        <h3 className={`text-xl font-bold mb-2 ${accountType === "personal" ? "text-indigo-900" : "text-slate-700"}`}>개인 회원</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed">아마존 진출을 준비 중인 일반 셀러 또는 예비 창업자</p>
                                    </div>
                                </button>

                                {/* Business Button */}
                                <button
                                    onClick={() => setAccountType("business")}
                                    className={`relative p-8 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-4 group ${accountType === "business"
                                        ? "border-emerald-600 bg-emerald-50/50 shadow-md shadow-emerald-100"
                                        : "border-slate-200 hover:border-emerald-300 hover:bg-slate-50"
                                        }`}
                                >
                                    {accountType === "business" && (
                                        <div className="absolute top-4 right-4 text-emerald-600">
                                            <CheckCircle2 size={24} className="fill-emerald-100" />
                                        </div>
                                    )}
                                    <div className={`p-4 rounded-full ${accountType === "business" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600"} transition-colors`}>
                                        <Building2 size={32} />
                                    </div>
                                    <div>
                                        <h3 className={`text-xl font-bold mb-2 ${accountType === "business" ? "text-emerald-900" : "text-slate-700"}`}>기업 (사업자) 회원</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed">이미 사업자 등록을 완료한 법인 및 개인사업자</p>
                                    </div>
                                </button>
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                disabled={!accountType}
                                className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors shadow-lg"
                            >
                                다음 단계로 이동
                            </button>
                        </div>
                    )}

                    {/* Step 2: Form Input */}
                    {step === 2 && (
                        <div className="p-8 md:p-12">
                            <div className="flex items-center gap-4 mb-8">
                                <button onClick={() => setStep(1)} className="p-2 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
                                    <ArrowLeft size={20} />
                                </button>
                                <div>
                                    <h1 className="text-2xl font-extrabold text-slate-900">
                                        {accountType === "personal" ? "개인 회원 정보 입력" : "기업 회원 정보 입력"}
                                    </h1>
                                    <p className="text-sm text-slate-500 mt-1">안전한 서비스 이용을 위해 정확한 정보를 입력해주세요.</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Common Account Info */}
                                <section className="space-y-5">
                                    <h2 className="text-lg font-bold text-slate-800 pb-2 border-b border-slate-100">계정 정보</h2>

                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-slate-700">아이디 (사용할 ID)*</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                required
                                                value={id}
                                                onChange={(e) => setId(e.target.value)}
                                                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                                placeholder="아이디 입력"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleCheckId}
                                                className={`px-4 py-3 font-bold rounded-xl transition-colors whitespace-nowrap ${isIdChecked ? "bg-green-100 text-green-700" : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200"}`}
                                            >
                                                {isIdChecked ? "확인완료" : "중복확인"}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-slate-700">이메일*</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="example@email.com"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-slate-700">비밀번호*</label>
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:bg-white focus:ring-2 outline-none ${password.length > 0 && !isPasswordValid ? "border-red-300 focus:ring-red-500" : "border-slate-200 focus:ring-indigo-500"}`}
                                            placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                                        />
                                        {password.length > 0 && !isPasswordValid && (
                                            <p className="text-xs text-red-500 mt-1 font-medium">비밀번호는 영문, 숫자, 특수문자를 포함하여 8자 이상이어야 합니다.</p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-slate-700">비밀번호 확인*</label>
                                        <input
                                            type="password"
                                            required
                                            value={passwordConfirm}
                                            onChange={(e) => setPasswordConfirm(e.target.value)}
                                            className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:bg-white focus:ring-2 outline-none ${passwordConfirm.length > 0 && !isPasswordMatch ? "border-red-300 focus:ring-red-500" : "border-slate-200 focus:ring-indigo-500"}`}
                                            placeholder="비밀번호 재입력"
                                        />
                                        {passwordConfirm.length > 0 && !isPasswordMatch && (
                                            <p className="text-xs text-red-500 mt-1 font-medium">비밀번호가 일치하지 않습니다.</p>
                                        )}
                                    </div>
                                </section>

                                {/* Personal Specific Info */}
                                {accountType === "personal" && (
                                    <section className="space-y-5">
                                        <h2 className="text-lg font-bold text-slate-800 pb-2 border-b border-slate-100">개인 정보</h2>

                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700">이름 (본명)*</label>
                                            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="홍길동" />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700">휴대폰 번호* (나중에 통신사 인증 연결 예정)</label>
                                            <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="010-0000-0000" />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700">생년월일* (6자리)</label>
                                            <input type="text" required maxLength={6} value={birthdate} onChange={e => setBirthdate(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="YYMMDD" />
                                            <p className="text-xs text-slate-400 mt-1">추후 본인인증 시 스마트하게 자동 반영됩니다.</p>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700">주소*</label>
                                            <div className="flex gap-2 mb-2">
                                                <input type="text" readOnly required value={address} className="flex-1 px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl outline-none text-slate-600" placeholder="우편번호 검색바를 이용해주세요" />
                                                <button type="button" onClick={() => handleAddressSearch("personal")} className="px-4 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors flex items-center gap-2 whitespace-nowrap">
                                                    <Search size={16} /> 주소 검색
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-sm font-bold text-slate-700">아마존 브랜드명 (선택)</label>
                                            <input type="text" value={amazonBrand} onChange={e => setAmazonBrand(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="브랜드명 입력 (없으면 생략)" />
                                        </div>
                                    </section>
                                )}

                                {/* Business Specific Info */}
                                {accountType === "business" && (
                                    <>
                                        <section className="space-y-5">
                                            <h2 className="text-lg font-bold text-slate-800 pb-2 border-b border-slate-100">기업 정보</h2>

                                            <div className="space-y-1">
                                                <label className="text-sm font-bold text-slate-700">사업자명 (법인명/상호명)*</label>
                                                <input type="text" required value={businessName} onChange={e => setBusinessName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="위드앨리스" />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-sm font-bold text-slate-700">대표자 이름 (본명)*</label>
                                                <input type="text" required value={ceoName} onChange={e => setCeoName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="홍길동" />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-sm font-bold text-slate-700">사업자등록번호*</label>
                                                <input type="text" required value={businessRegNum} onChange={e => setBusinessRegNum(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="000-00-00000" />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-sm font-bold text-slate-700">사업자등록증 사본 첨부*</label>
                                                <div className="flex items-center gap-3">
                                                    <label className="px-4 py-3 bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold rounded-xl cursor-pointer hover:bg-indigo-100 transition-colors flex items-center gap-2">
                                                        <Upload size={16} /> 파일 선택
                                                        <input type="file" required accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
                                                    </label>
                                                    <span className="text-sm text-slate-500 line-clamp-1">{fileName || "선택된 파일 없음"}</span>
                                                </div>
                                            </div>
                                        </section>

                                        <section className="space-y-5 mt-8">
                                            <h2 className="text-lg font-bold text-slate-800 pb-2 border-b border-slate-100">가입자(담당자) 정보</h2>

                                            <div className="space-y-2 mb-4">
                                                <label className="text-sm font-bold text-slate-700">대표자 여부*</label>
                                                <div className="flex gap-4">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input type="radio" name="isCeo" value="ceo" checked={isCeo === "ceo"} onChange={() => setIsCeo("ceo")} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300" />
                                                        <span className="text-slate-700 font-medium text-sm">대표 본인입니다</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input type="radio" name="isCeo" value="manager" checked={isCeo === "manager"} onChange={() => setIsCeo("manager")} className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300" />
                                                        <span className="text-slate-700 font-medium text-sm">기업 담당자(직원)입니다</span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-sm font-bold text-slate-700">가입자 이름 (본명)*</label>
                                                <input type="text" required disabled={isCeo === "ceo"} value={subscriberName} onChange={e => setSubscriberName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-slate-100 disabled:text-slate-500" placeholder="가입자 성함 입력" />
                                            </div>

                                            {isCeo === "manager" && (
                                                <div className="space-y-1">
                                                    <label className="text-sm font-bold text-slate-700">직급 또는 부서*</label>
                                                    <input type="text" required value={position} onChange={e => setPosition(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="예: 해외사업팀 대리" />
                                                </div>
                                            )}

                                            <div className="space-y-1">
                                                <label className="text-sm font-bold text-slate-700">가입자 휴대폰 번호* (추후 본인인증 적용)</label>
                                                <input type="tel" required value={subscriberPhone} onChange={e => setSubscriberPhone(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="010-0000-0000" />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-sm font-bold text-slate-700">가입자 생년월일* (6자리)</label>
                                                <input type="text" required maxLength={6} value={subscriberBirthdate} onChange={e => setSubscriberBirthdate(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="YYMMDD" />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-sm font-bold text-slate-700">가입자 주소*</label>
                                                <div className="flex gap-2 mb-2">
                                                    <input type="text" readOnly required value={subscriberAddress} className="flex-1 px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl outline-none text-slate-600" placeholder="우편번호 검색바를 이용해주세요" />
                                                    <button type="button" onClick={() => handleAddressSearch("business")} className="px-4 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors flex items-center gap-2 whitespace-nowrap">
                                                        <Search size={16} /> 주소 검색
                                                    </button>
                                                </div>
                                            </div>
                                        </section>
                                    </>
                                )}

                                {/* Terms & Conditions */}
                                <section className="space-y-6 pt-6 mt-8 border-t border-slate-200">
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-800 mb-4">서비스 이용 동의</h2>

                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3 p-4 border border-slate-200 bg-slate-50 rounded-xl">
                                                <input type="checkbox" id="termsAll" className="w-5 h-5 mt-0.5 text-indigo-600 rounded cursor-pointer"
                                                    checked={terms1 && terms2 && termsMarketing && termsPush}
                                                    onChange={(e) => {
                                                        const val = e.target.checked;
                                                        setTerms1(val); setTerms2(val); setTermsMarketing(val); setTermsPush(val);
                                                    }}
                                                />
                                                <label htmlFor="termsAll" className="cursor-pointer">
                                                    <span className="font-bold text-slate-800 block">전체 동의하기</span>
                                                    <span className="text-sm text-slate-500">필수 및 선택 약관에 모두 동의합니다.</span>
                                                </label>
                                            </div>

                                            <div className="pl-2 space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <input type="checkbox" id="t1" required className="w-4 h-4 text-indigo-600 rounded cursor-pointer" checked={terms1} onChange={e => setTerms1(e.target.checked)} />
                                                    <label htmlFor="t1" className="text-sm font-medium text-slate-700 cursor-pointer flex-1">[필수] 서비스 이용약관 동의</label>
                                                    <button type="button" className="text-xs text-slate-400 hover:text-indigo-600 underline">내용보기</button>
                                                </div>
                                                <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 h-20 overflow-y-auto hidden">
                                                    제1조 (목적) 본 약관은 Seller Pilot 서비스의 이용 조건 및 절차를 규정합니다. ...
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <input type="checkbox" id="t2" required className="w-4 h-4 text-indigo-600 rounded cursor-pointer" checked={terms2} onChange={e => setTerms2(e.target.checked)} />
                                                    <label htmlFor="t2" className="text-sm font-medium text-slate-700 cursor-pointer flex-1">[필수] 개인정보 수집 및 이용 동의</label>
                                                    <button type="button" className="text-xs text-slate-400 hover:text-indigo-600 underline">내용보기</button>
                                                </div>
                                                <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 h-20 overflow-y-auto">
                                                    수집항목: 이름, 이메일, 휴대전화번호, 주소 등. 목적: 서비스 제공 및 본인 확인. 보유기간: 회원 탈퇴 시까지.
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <input type="checkbox" id="tm" className="w-4 h-4 text-indigo-600 rounded cursor-pointer" checked={termsMarketing} onChange={e => setTermsMarketing(e.target.checked)} />
                                                    <label htmlFor="tm" className="text-sm font-medium text-slate-700 cursor-pointer flex-1">[선택] 마케팅 정보 수신 동의</label>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <input type="checkbox" id="tp" className="w-4 h-4 text-indigo-600 rounded cursor-pointer" checked={termsPush} onChange={e => setTermsPush(e.target.checked)} />
                                                    <label htmlFor="tp" className="text-sm font-medium text-slate-700 cursor-pointer flex-1">[선택] 앱 서비스 푸시 알림 동의</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-200 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                                    >
                                        가입 완료하기
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
