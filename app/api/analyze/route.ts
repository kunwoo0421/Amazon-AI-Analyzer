import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Type definitions for the Analysis Request and Response
export interface AnalysisRequest {
    productName: string;
    keywords: string;
    width?: number;
    height?: number;
    length?: number;
    weight?: number;
    hsCode?: string;
}

interface Competitor {
    title: string;
    price: number | null;
    bsr: number;
    est_sales: number;
    revenue: number;
    rating: number;
    reviews: number;
    image: string;
}

export interface AnalysisResponse {
    productOverview: {
        summary: string;
        validated: string[];
    };
    swot: {
        strengths: string[];
        weaknesses: string[];
        opportunities: string[];
        threats: string[];
    };
    marketing4P: {
        product: string;
        price: string;
        place: string;
        promotion: string;
    };
    quantitativeAnalysis: {
        avgPrice: number;
        minPrice: number;
        maxPrice: number;
        totalEstMonthlySales: number;
        estMarketRevenue: number;
        competitors: Competitor[];
    } | null;
    conclusion: string;
}

// BSR Sales Estimation Logic (from backup)
function estimateSalesFromBsr(bsr: number) {
    if (!bsr) return 0;
    if (bsr < 10) return 50000;
    else if (bsr < 100) return 10000;
    else if (bsr < 1000) return 3000;
    else if (bsr < 5000) return 1000;
    else if (bsr < 10000) return 300;
    else if (bsr < 50000) return 50;
    else return 10;
}

export async function POST(request: Request) {
    try {
        const body: AnalysisRequest = await request.json();
        const { productName, keywords } = body;

        // --------------------------------------------------------------------------------
        // 1. Quantitative Analysis (Data Logic)
        // --------------------------------------------------------------------------------

        // Load Sample Data
        const dataPath = path.join(process.cwd(), 'src/lib/analysis/sample_data.json');
        let quantitativeData = null;

        try {
            const fileContent = fs.readFileSync(dataPath, 'utf8');
            const data = JSON.parse(fileContent);
            const results = data.search_results || [];

            if (results.length > 0) {
                const prices: number[] = [];
                const competitors: Competitor[] = [];

                results.forEach((item: any) => {
                    const price = item.price?.value || null;
                    const bsr = item.best_seller_rank || 0;
                    const salesEst = estimateSalesFromBsr(bsr);

                    if (price !== null) prices.push(price);

                    competitors.push({
                        title: item.title,
                        price: price,
                        bsr: bsr,
                        est_sales: salesEst,
                        revenue: (price || 0) * salesEst,
                        rating: item.rating,
                        reviews: item.ratings_total,
                        image: item.image
                    });
                });

                if (prices.length > 0) {
                    quantitativeData = {
                        avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length,
                        minPrice: Math.min(...prices),
                        maxPrice: Math.max(...prices),
                        totalEstMonthlySales: competitors.reduce((sum, item) => sum + item.est_sales, 0),
                        estMarketRevenue: competitors.reduce((sum, item) => sum + item.revenue, 0),
                        competitors: competitors.sort((a, b) => b.revenue - a.revenue).slice(0, 5)
                    };
                }
            }
        } catch (err) {
            console.error("Failed to load sample data:", err);
        }

        // --------------------------------------------------------------------------------
        // 2. Qualitative Analysis (AI Simulation)
        // --------------------------------------------------------------------------------

        // Simulating Server-side Processing Time
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Generating Dynamic Analysis Data (Mocking AI Intelligence)
        // This replicates the specific, high-quality logic we designed.
        const analysisResult: AnalysisResponse = {
            productOverview: {
                summary: `"${productName}" 제품은 입력하신 키워드 "${keywords}"를 분석했을 때 미국 시장에서 높은 잠재력을 보여줍니다.`,
                validated: [
                    "아마존 미국 시장 내 제품 수요 및 성장성 검증 완료",
                    "주요 검색 키워드 경쟁 강도 및 시장 진입 가능성 확인"
                ]
            },
            swot: {
                strengths: [
                    "K-Category(푸드/뷰티/리빙)의 프리미엄 이미지 활용 가능",
                    "미국 현지 제품 대비 차별화된 패키징 및 디자인 경쟁력",
                    "경쟁사 대비 우수한 원재료 및 품질 기준 보유"
                ],
                weaknesses: [
                    "미국 내 초기 브랜드 인지도 부족으로 인한 신뢰도 구축 필요",
                    body.weight && Number(body.weight) > 1
                        ? `중량(${body.weight}kg)에 따른 초기 물류비 부담 예상 (타겟 배송비 최적화 필요)`
                        : "초기 물류 및 풀필먼트(FBA) 세팅 비용 발생"
                ],
                opportunities: [
                    "미국 내 '친환경/미니멀리즘' 및 'K-트렌드' 확산",
                    "TikTok Shop, Instagram Reels 등 숏폼 플랫폼을 통한 바이럴 기회",
                    "Q4 홀리데이 시즌(블랙프라이데이, 크리스마스) 선물 수요 공략 가능"
                ],
                threats: [
                    "기존 저가형 중국 셀러들의 공격적인 가격 경쟁",
                    "해당 카테고리 내 아마존 PPC 광고 단가(CPC)의 지속적 상승"
                ]
            },
            marketing4P: {
                product: "미국 소비자에게 익숙한 영문 패키징(oz/lb 단위 병기) 및 매뉴얼 필수. 선물용 번들 구성을 통한 객단가 증대 전략.",
                price: "저가 경쟁을 지양하고 브랜드 가치를 높이는 프리미엄 가격 전략 권장 ($25-$45 구간).",
                place: "Prime 뱃지 획득을 위해 반드시 아마존 FBA(Fulfilled by Amazon)를 이용해야 함.",
                promotion: "아마존 스폰서드 광고(PPC)와 외부 인플루언서 마케팅을 병행하여 초기 트래픽 확보."
            },
            quantitativeAnalysis: quantitativeData,
            conclusion: "소규모 FBA 입고를 통한 테스트 판매(Test Bed) 진입을 강력히 추천합니다. 분석된 니치 마켓 키워드를 공략하면 초기 랭킹 확보가 가능할 것으로 예상됩니다."
        };

        return NextResponse.json(analysisResult);

    } catch (error) {
        console.error("Analysis Error:", error);
        return NextResponse.json(
            { error: "Failed to generate analysis report" },
            { status: 500 }
        );
    }
}

