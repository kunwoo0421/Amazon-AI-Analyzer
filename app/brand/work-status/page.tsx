"use client";

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Building2, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Data for K-SO (2026-01)
const WORK_LOGS: Record<string, string[]> = {
    "2026-01-01": ["인플루언서 섭외 캠페인 생성"],
    "2026-01-02": ["인플루언서 신청자 연락 및 협상"],
    "2026-01-05": ["광고 CPC 최적화 작업"],
    "2026-01-08": ["캠페인 신청자 모집 완료"],
    "2026-01-09": ["추가 인플루언서 모집 중 (캠페인 중)"],
    "2026-01-12": ["인플루언서 캠페인 검토 > 후기 선정/검토 완료 (CPC단가 수집)"],
    "2026-01-13": [
        "1. 원고 수정본 및 추가 촬영 계획중",
        "2. 인플루언서 수사 가이드 (마감은 이번주 내 작업완료)"
    ],
    "2026-01-14": ["광고 최적화 및 CPC 딜런싱 논의"],
    "2026-01-16": [
        "첫 인플루언서 원고 검토",
        "추가 인플루언서 샘플 발송 요청"
    ],
    "2026-01-20": ["인플루언서 쿠폰코드 제공"],
    "2026-01-22": ["유럽국가 상표 방송 가능 여부 확인", "원산지 관리제도 정보 취합"],
    "2026-01-28": ["인플루언서 매칭 프로그램 접속확인 및 포토샵 수정"]
};

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function WorkStatusPage() {
    // Start at Jan 2026 as requested
    const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
    const [companyName, setCompanyName] = useState("K-SO");

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const formatDateKey = (day: number) => {
        // Returns YYYY-MM-DD local format
        const y = year;
        const m = String(month + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
    const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

    const daysInMonth = getDaysInMonth(year, month);
    const startDay = getFirstDayOfMonth(year, month);

    // Generate weeks array
    // Each week is an array of 7 items (numbers for days, null for padding)
    const weeks: (number | null)[][] = [];
    let currentWeek: (number | null)[] = Array(7).fill(null);
    let currentDayIndex = startDay;

    for (let day = 1; day <= daysInMonth; day++) {
        currentWeek[currentDayIndex] = day;
        currentDayIndex++;

        if (currentDayIndex === 7) {
            weeks.push(currentWeek);
            currentWeek = Array(7).fill(null);
            currentDayIndex = 0;
        }
    }
    // Push last week if it has any days
    if (currentWeek.some(d => d !== null)) {
        weeks.push(currentWeek);
    }

    return (
        <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-pastel-beige pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-primary tracking-tight flex items-center gap-3">
                        <Building2 className="text-secondary" size={32} />
                        업무 현황
                    </h1>
                    <p className="text-pastel-taupe mt-2 text-lg">
                        일별 진행상황을 한눈에 확인해보세요.
                    </p>
                    <button className="flex items-center gap-2 text-pastel-taupe hover:text-primary transition-colors text-sm font-medium mt-4">
                        <Download size={16} />
                        월별 리포트 다운받기
                    </button>
                </div>

                {/* Controls */}
                {/* Controls */}
                <div className="flex flex-col sm:flex-row bg-white p-2 rounded-xl border border-pastel-beige shadow-sm items-center gap-2 sm:gap-4 w-full md:w-auto">
                    <div className="relative flex items-center justify-center px-4 border-b sm:border-b-0 sm:border-r border-pastel-beige pb-2 sm:pb-0 whitespace-nowrap w-full sm:w-auto sm:justify-start sm:gap-2">
                        <span className="absolute left-4 sm:static text-sm font-bold text-pastel-taupe">기업명:</span>
                        <span className="font-bold text-primary text-lg">{companyName}</span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-center">
                        <button
                            onClick={prevMonth}
                            className="p-2 hover:bg-pastel-cream rounded-lg text-primary transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className="text-center min-w-[140px]">
                            <span className="text-xl font-bold text-primary font-mono">
                                {year}.{String(month + 1).padStart(2, '0')}
                            </span>
                        </div>
                        <button
                            onClick={nextMonth}
                            className="p-2 hover:bg-pastel-cream rounded-lg text-primary transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop Calendar Table (Hidden on Mobile) */}
            <div className="hidden md:block bg-white rounded-2xl border border-pastel-beige shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px] lg:min-w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="w-20 bg-pastel-cream/50 border-r border-b border-pastel-beige p-2 text-center text-sm font-bold text-primary">
                                    구분
                                </th>
                                {WEEKDAYS.map((day, i) => (
                                    <th
                                        key={day}
                                        className={cn(
                                            "bg-pastel-cream/50 border-b border-r border-pastel-beige p-3 text-center text-sm font-bold text-primary",
                                            i === 0 && "text-red-500", // Sunday
                                            i === 6 && "text-blue-500", // Saturday (optional, but common in KR)
                                            i === 6 && "border-r-0"
                                        )}
                                        style={{ width: '13%' }}
                                    >
                                        {day}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {weeks.map((week, weekIndex) => (
                                <CalendarWeekRow
                                    key={weekIndex}
                                    week={week}
                                    formatDateKey={formatDateKey}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Vertical Calendar (Visible only on Mobile) */}
            <div className="md:hidden space-y-4">
                <div className="bg-white rounded-2xl border border-pastel-beige shadow-lg overflow-hidden">
                    {/* Iterate through all days to show vertical list */}
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                        const dateKey = formatDateKey(day);
                        const logs = WORK_LOGS[dateKey];
                        const dateObj = new Date(year, month, day);
                        const dayOfWeek = dateObj.getDay(); // 0 is Sunday

                        return (
                            <div key={day} className={cn(
                                "border-b border-pastel-beige last:border-0 p-4 transition-colors",
                                logs ? "bg-white" : "bg-gray-50/30"
                            )}>
                                <div className="flex items-start gap-4">
                                    {/* Date Column */}
                                    <div className="w-16 flex-shrink-0 text-center">
                                        <div className={cn(
                                            "text-lg font-bold",
                                            dayOfWeek === 0 ? "text-red-500" : dayOfWeek === 6 ? "text-blue-500" : "text-primary"
                                        )}>
                                            {day}
                                        </div>
                                        <div className="text-xs text-pastel-taupe font-medium uppercase">
                                            {WEEKDAYS[dayOfWeek]}
                                        </div>
                                    </div>

                                    {/* Content Column */}
                                    <div className="flex-1 min-h-[40px] flex items-center">
                                        {logs ? (
                                            <div className="w-full space-y-2">
                                                {logs.map((log, idx) => (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -10 }}
                                                        whileInView={{ opacity: 1, x: 0 }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: idx * 0.1 }}
                                                        key={idx}
                                                        className="bg-secondary/10 text-primary p-3 rounded-lg border border-secondary/20 text-sm leading-relaxed"
                                                    >
                                                        {log.startsWith("1.") || log.startsWith("2.") ? (
                                                            <span className="block">{log}</span>
                                                        ) : (
                                                            <div className="flex gap-2">
                                                                <span className="text-secondary shrink-0">•</span>
                                                                <span>{log.replace(/^- /, "")}</span>
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-300 italic">No activity</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>


        </div>
    );
}

function CalendarWeekRow({
    week,
    formatDateKey
}: {
    week: (number | null)[],
    formatDateKey: (d: number) => string
}) {
    // We render two TRs for each week
    // 1. Date Row
    // 2. Content Row

    return (
        <>
            {/* Date Row */}
            <tr className="h-8">
                <td rowSpan={2} className="bg-pastel-cream/20 border-r border-b border-pastel-beige text-center font-bold text-pastel-taupe text-xs align-middle">
                    <div className="flex flex-col gap-2 py-4">
                        <span>일자</span>
                        <div className="h-px w-8 mx-auto bg-pastel-beige/50" />
                        <span>업무<br />진행<br />현황</span>
                    </div>
                </td>
                {week.map((day, i) => (
                    <td
                        key={i}
                        className={cn(
                            "border-b border-r border-pastel-beige px-2 py-1 text-right text-xs bg-gray-50/50",
                            i === 6 && "border-r-0",
                            !day && "bg-gray-50/30"
                        )}
                    >
                        {day ? (
                            <span className={cn(
                                "font-medium",
                                i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-gray-500"
                            )}>
                                {day}일
                            </span>
                        ) : null}
                    </td>
                ))}
            </tr>
            {/* Content Row */}
            <tr className="h-32">
                {week.map((day, i) => {
                    const dateKey = day ? formatDateKey(day) : '';
                    const logs = day ? WORK_LOGS[dateKey] : undefined;

                    return (
                        <td
                            key={i}
                            className={cn(
                                "border-b border-r border-pastel-beige p-2 align-top text-xs hover:bg-blue-50/10 transition-colors",
                                i === 6 && "border-r-0",
                                !day && "bg-gray-50/30"
                            )}
                        >
                            {logs && (
                                <div className="space-y-1">
                                    {logs.map((log, idx) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            key={idx}
                                            className="bg-secondary/10 text-primary p-1.5 rounded-md border border-secondary/20 leading-tight"
                                        >
                                            {log.startsWith("1.") || log.startsWith("2.") ? (
                                                <span className="block mb-0.5">{log}</span>
                                            ) : (
                                                <span>- {log}</span>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </td>
                    );
                })}
            </tr>
        </>
    );
}
