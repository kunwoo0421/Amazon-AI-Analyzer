
export interface ExchangeRate {
    country: string;
    currency: string;
    rate: number;
    change: number; // positive or negative
    flag: string;
}

export interface ServiceProvider {
    id: string;
    category: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    description: string;
}

export const serviceCategories = [
    "물류/3PL", "사진촬영", "디자인", "입점대행", "광고대행",
    "운영대행", "웹사이트구축", "통번역", "특허법인", "기타"
];

export interface NewsItem {
    id: string;
    title: string;
    summary: string;
    date: string;
    source: string;
    category: 'Amazon News' | 'Google Update' | 'Official Announcement';
    url?: string;
}

export const mockExchangeRates: ExchangeRate[] = [
    { country: "미국 (USA)", currency: "USD", rate: 1340.50, change: 5.2, flag: "🇺🇸" },
    { country: "캐나다 (Canada)", currency: "CAD", rate: 985.20, change: -2.1, flag: "🇨🇦" },
    { country: "멕시코 (Mexico)", currency: "MXN", rate: 75.30, change: 0.5, flag: "🇲🇽" },
    { country: "일본 (Japan)", currency: "JPY", rate: 905.10, change: -1.5, flag: "🇯🇵" },
    { country: "유럽 (Europe)", currency: "EUR", rate: 1450.80, change: 3.4, flag: "🇪🇺" },
];

export const mockServiceProviders: ServiceProvider[] = [
    {
        id: '1',
        category: '물류/3PL',
        name: 'FastShip Logistics',
        address: '서울시 강남구 테헤란로 123',
        phone: '02-1234-5678',
        email: 'contact@fastship.com',
        description: '미국 FBA 전용 특송 및 해상 운송 전문, 캘리포니아 자체 창고 보유.'
    },
    {
        id: '2',
        category: '디자인',
        name: 'Pixel Perfect',
        address: '서울시 마포구 홍대입구 55',
        phone: '010-9876-5432',
        email: 'design@pixel.com',
        description: '아마존 A+ 콘텐츠 및 리스팅 이미지 최적화 전문 디자인 에이전시.'
    },
    {
        id: '3',
        category: '특허법인',
        name: 'Globl IP Law',
        address: '서울시 서초구 법원로 99',
        phone: '02-555-1212',
        email: 'ip@global.com',
        description: '미국 상표 출원 및 브랜드 레지스트리 등록 원스톱 서비스.'
    }
];

export const mockNews: NewsItem[] = [
    {
        id: '1',
        title: '아마존 FBA 입고 비용 인상 발표',
        summary: '2025년 2월부터 FBA 입고 및 보관 수수료가 약 5% 인상될 예정입니다. 대형 화물에 대한 할증이 주요 내용입니다.',
        date: '2026-01-19',
        source: 'Amazon Official',
        category: 'Official Announcement'
    },
    {
        id: '2',
        title: '구글 SEO 알고리즘 대규모 업데이트',
        summary: '구글 검색 엔진이 커머스 사이트의 리뷰 신뢰도를 더 높게 평가하도록 업데이트되었습니다.',
        date: '2026-01-18',
        source: 'Search Engine Land',
        category: 'Google Update'
    },
    {
        id: '3',
        title: '아마존, 한국 셀러를 위한 전용 지원팀 확대',
        summary: '아마존 코리아가 한국 셀러들의 글로벌 진출을 돕기 위해 전담 매니저 팀을 2배로 확충합니다.',
        date: '2026-01-15',
        source: 'K-Economic Daily',
        category: 'Amazon News'
    }
];

// --- ACS (Anyone Can Share) ---
export interface ACSComment {
    id: string;
    author: string;
    content: string; // max 500 chars
    date: string;
    imageUrl?: string;
}

export interface ACSPost {
    id: string;
    title: string;
    author: string;
    date: string;
    content: string;
    category: string; // "Free", "Question", "Tip"
    isSecret: boolean;
    password?: string; // 4 digits
    views: number;
    likes: number;
    files?: { name: string; type: 'image' | 'video' | 'pdf'; url: string }[];
    comments: ACSComment[];
}

export const mockACSPosts: ACSPost[] = [
    {
        id: '1',
        title: '아마존 FBA 첫 입고 후기 공유합니다!',
        author: 'Seller123',
        date: '2026-01-20',
        content: '처음으로 FBA 입고를 진행해봤는데 생각보다 절차가 복잡하지 않네요. 꿀팁 공유합니다...',
        category: 'Tip',
        isSecret: false,
        views: 152,
        likes: 12,
        comments: [
            { id: 'c1', author: 'Newbie', content: '좋은 정보 감사합니다!', date: '2026-01-20' }
        ]
    },
    {
        id: '2',
        title: '배송 대행지 추천 부탁드립니다 (비밀글)',
        author: 'SecretUser',
        date: '2026-01-19',
        content: '이 글은 비밀글입니다.',
        category: 'Question',
        isSecret: true,
        password: '1234',
        views: 45,
        likes: 2,
        comments: []
    }
];

// --- FAQ ---
export interface FAQItem {
    id: string;
    category: '아마존 셀러센트럴' | '아마존 물류' | '아마존 광고' | 'AWA 어플 사용';
    question: string;
    answer: string;
    likes: number;
}

export const mockFAQs: FAQItem[] = [
    {
        id: '1',
        category: '아마존 셀러센트럴',
        question: '계정이 정지되었습니다. 어떻게 복구하나요?',
        answer: '계정 정지 사유를 파악하고 POA(Action Plan)를 작성하여 제출해야 합니다. AWA 전문가 상담을 권장합니다.',
        likes: 15
    },
    {
        id: '2',
        category: '아마존 물류',
        question: 'FBA 재고 한도는 어떻게 늘리나요?',
        answer: 'IPI 점수를 400점 이상 유지하거나, 판매 속도(Sales Velocity)를 높여야 재고 한도가 상향됩니다.',
        likes: 24
    },
    {
        id: '3',
        category: 'AWA 어플 사용',
        question: '멤버십 등급은 어떻게 올리나요?',
        answer: '멤버십은 월 매출 규모와 서비스 이용 기간에 따라 자동으로 산정되어 매월 1일 갱신됩니다.',
        likes: 8
    },
    {
        id: '4',
        category: '아마존 광고',
        question: 'ROAS가 너무 낮아요. 해결 방법이 있나요?',
        answer: '키워드 입찰가를 조정하거나, 부정 키워드(Negative Keywords)를 등록하여 불필요한 지출을 막으세요.',
        likes: 42
    }
];

// --- Q&A (Secret Board) ---
export interface QnAItem {
    id: string;
    category: '아마존 셀러센트럴' | '아마존 물류' | '아마존 광고' | 'AWA 어플 사용';
    title: string;
    author: string;
    content: string;
    date: string;
    status: 'Waiting' | 'Answered';
    password?: string; // 4 digits
}

export const mockQnAs: QnAItem[] = [
    {
        id: '1',
        category: '아마존 셀러센트럴',
        title: '브랜드 레지스트리 오류 문의',
        author: 'UserA',
        content: '브랜드 등록 중 5665 에러가 계속 뜹니다.',
        date: '2026-01-20',
        status: 'Waiting',
        password: '0000'
    },
    {
        id: '2',
        category: '아마존 광고',
        title: '광고 캠페인 세팅 조언 요청',
        author: 'UserB',
        content: '오토 캠페인 효율이 안나옵니다.',
        date: '2026-01-18',
        status: 'Answered',
        password: '1234'
    }
];
