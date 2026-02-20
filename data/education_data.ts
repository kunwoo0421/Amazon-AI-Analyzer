
export interface EducationSection {
    title: string;
    content: string;
    highlight?: 'info' | 'warning' | 'success' | 'tip';
    pdf?: string; // PDF file path
    image?: string; // Optional image path
}

export interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
}

export interface EducationLevel {
    id: number;
    title: string;
    description: string;
    sections: EducationSection[];
    quiz: QuizQuestion[];
}

export const educationLevels: EducationLevel[] = [
    // Level 1: Beginner
    {
        id: 1,
        title: "Amazon 셀러 계정 가입 및 기초 세팅",
        description: "준비 서류부터 가입 절차, 신원 인증(SIV) 통과 팁까지 완벽 가이드",
        sections: [
            {
                title: "1. 필수 준비 서류 (반드시 영문/칼라)",
                content: `**여권 (Passport)**
- 만료일이 6개월 이상 남았는지 확인
- 서명란에 반드시 서명할 것
- 빛 번짐 없이 4귀퉁이가 모두 나오게 스캔

**Bank Statement (은행 명세서) 또는 Credit Card Statement**
- Payoneer 혹은 WorldFirst에서 발급받은 'Bank Statement' 추천
- 주소가 여권 주소 또는 실제 거주지와 일치해야 함 (매우 중요)
- 최근 90일 이내 발급분`,
                highlight: 'warning',
                pdf: '/pdfs/1회-강의.pdf' // Linked
            },
            {
                title: "2. 가입 프로세스 핵심 체크포인트",
                content: `**계정 정보 입력**
- 영문 이름은 여권과 100% 일치해야 함 (띄어쓰기 포함)
- 주소지는 증빙 서류(Bank Statement) 상의 주소와 토씨 하나 틀리지 않게 입력

**신용카드 정보**
- 해외 결제 가능한 카드 (Visa, Master, Amex)
- 체크카드도 가능하나, 가끔 승인 거절될 수 있음 (신용카드 권장)`,
                highlight: 'info'
            },
            {
                title: "3. SIV (Seller Identity Verification) 통과 팁",
                content: `**서류 제출 시 주의사항**
- 스캔본보다는 고화질 사진 촬영본이 더 잘 승인되는 경향이 있음
- 파일명은 영문으로 저장 (예: Passport_HongGildong.jpg)
- 절대 서류를 자르거나 편집(포토샵) 하지 말 것 (메타데이터 확인함)`,
                highlight: 'success'
            }
        ],
        quiz: [
            {
                id: 1,
                question: "아마존 셀러 가입 시 여권 만료일은 최소 얼마 이상 남아야 합니까?",
                options: ["1개월", "3개월", "6개월", "1년"],
                correctAnswer: 2
            },
            {
                id: 2,
                question: "가입 시 주소지 증빙을 위해 가장 권장되는 서류는?",
                options: ["주민등록등본", "운전면허증", "페이오니아 Bank Statement", "전기요금 고지서"],
                correctAnswer: 2
            },
            {
                id: 3,
                question: "SIV 서류 제출 시 가장 피해야 할 행동은?",
                options: ["고화질 촬영", "PDF 변환", "포토샵으로 여백 자르기", "영문 파일명 사용"],
                correctAnswer: 2
            },
            {
                id: 4,
                question: "아마존 월 이용료(프로페셔널)는 대략 얼마입니까?",
                options: ["무료", "$29.99", "$39.99", "$99.99"],
                correctAnswer: 2
            },
            {
                id: 5,
                question: "여권 서명란에 서명이 없으면 어떻게 됩니까?",
                options: ["상관없다", "가입이 거절될 수 있다", "자동으로 서명이 생성된다", "전화로 본인인증 하면 된다"],
                correctAnswer: 1
            },
            {
                id: 6,
                question: "가상 계좌(Payoneer 등) 발급 시 예금주명은?",
                options: ["아무거나", "여권 영문명과 일치", "회사명", "닉네임"],
                correctAnswer: 1
            },
            {
                id: 7,
                question: "비디오 인터뷰(Video Call) 시 준비물은?",
                options: ["없음", "여권 원본", "통장 사본", "사업자 등록증"],
                correctAnswer: 1
            },
            {
                id: 8,
                question: "개인 셀러도 아마존에 입점할 수 있습니까?",
                options: ["네, 가능하다", "아니오, 사업자만 가능", "미국 거주자만 가능", "초대받은 사람만 가능"],
                correctAnswer: 0
            },
            {
                id: 9,
                question: "가입 승인 후 가장 먼저 해야 할 일은?",
                options: ["상품 등록", "2단계 인증 설정", "광고 집행", "대량 구매"],
                correctAnswer: 1
            },
            {
                id: 10,
                question: "GTIIN 면제 신청은 언제 합니까?",
                options: ["바코드가 없는 제품을 판매할 때", "중고품 판매 시", "브랜드 제품 판매 시", "항상 해야 한다"],
                correctAnswer: 0
            }
        ]
    },
    // Level 2: Intermediate
    {
        id: 2,
        title: "상품 등록(Listing) 및 배송 설정(FBA)",
        description: "매출을 부르는 키워드 최적화와 FBA 입고 플랜 생성 실전",
        sections: [
            {
                title: "1. 리스팅의 핵심 3요소",
                content: `**Title (상품명)**
- 가장 중요한 키워드를 맨 앞에 배치 (모바일 가독성)
- 브랜드명 + 핵심키워드 + 기능/재질 + 사이즈/색상 순서 추천

**Bullet Points (특장점)**
- 5줄 꽉 채워서 작성 (모바일은 3줄만 보임)
- 단순 스펙 나열보다는 '소비자가 얻을 이익(Benefit)' 위주로 작성

**Backend Keywords (Search Terms)**
- 제목에 못 쓴 연관 키워드들을 모두 때려 넣는 곳
- 경쟁사 브랜드명은 절대 넣지 말 것 (정책 위반)`,
                highlight: 'tip',
                pdf: '/pdfs/2회-강의.pdf' // Linked
            },
            {
                title: "2. FBA (Fulfillment by Amazon) 이해",
                content: `**FBA의 장점**
- Prime 배지 획득 (매출 상승의 핵심)
- 배송/CS를 아마존이 대행
- Buy Box 획득 확률 매우 높아짐

**FBA 입고 절차 (Send to Amazon)**
1. 재고 수량 입력
2. 박스 라벨 출력 및 부착
3. 팔레트/박스 정보 입력
4. 배송사 선택 (SPD or LTL)`,
                highlight: 'info'
            },
            {
                title: "3. 바코드의 종류와 A+ 콘텐츠",
                content: `**ASIN (Amazon Standard Identification Number)**
- 아마존에서 상품을 식별하는 고유 ID (주민등록번호와 유사)
- 상품을 등록하면 자동으로 부여됨 (바코드가 아님)

**FNSKU (Fulfillment Network Stock Keeping Unit)**
- **아마존 전용 바코드**: FBA 입고 시 제품에 부착해야 하는 라벨
- 아마존 창고에서 내 재고를 추적하는 결정적 역할 (FBA 필수)

**A+ Content (상세페이지 이미지)**
- **비브랜드 셀러**: '기본(Basic)' A+ 콘텐츠 사용 가능 (텍스트+이미지 조합)
- **브랜드 등록 셀러**: '브랜드 스토리', '프리미엄 A+ 콘텐츠' 등 고급 기능 사용 가능`,
                highlight: 'warning'
            }
        ],
        quiz: [
            {
                id: 1,
                question: "FBA의 약자는 무엇입니까?",
                options: ["Full Box Amazon", "Fulfillment by Amazon", "Fast Best Amazon", "Free Box Amazon"],
                correctAnswer: 1
            },
            {
                id: 2,
                question: "아마존에서 부여하는 상품 고유 식별 ID(주민번호 역할)는?",
                options: ["FNSKU", "UPC", "ASIN", "ISBN"],
                correctAnswer: 2
            },
            {
                id: 3,
                question: "FBA 이용 시 상품에 부착해야 하는 '아마존 재고 추적용' 바코드는?",
                options: ["ASIN", "EAN", "QR코드", "FNSKU"],
                correctAnswer: 3
            },
            {
                id: 4,
                question: "Backend Search Term에 넣지 말아야 할 것은?",
                options: ["동의어", "오타", "경쟁사 브랜드명", "한글 키워드"],
                correctAnswer: 2
            },
            {
                id: 5,
                question: "Prime 배지의 가장 큰 혜택은?",
                options: ["수수료 면제", "배송비 무료 (고객)", "무제한 리스팅", "광고비 무료"],
                correctAnswer: 1
            },
            {
                id: 6,
                question: "메인 이미지의 배경색은?",
                options: ["흰색 (RGB 255,255,255)", "검정색", "투명", "상관없음"],
                correctAnswer: 0
            },
            {
                id: 7,
                question: "불릿 포인트(Bullet Point)는 최대 몇 개까지 작성 가능한가?",
                options: ["3개", "5개", "7개", "10개"],
                correctAnswer: 1
            },
            {
                id: 8,
                question: "변형(Variation) 리스팅이란?",
                options: ["중고 제품 리스팅", "사이즈/색상 등 옵션 묶음", "타사 제품과 묶음", "랜덤 발송"],
                correctAnswer: 1
            },
            {
                id: 9,
                question: "A+ 콘텐츠에 대한 설명으로 옳은 것은?",
                options: ["브랜드 등록 없이는 절대 사용할 수 없다", "비브랜드 셀러도 '기본(Basic)' A+ 콘텐츠는 쓸 수 있다", "유료 회원만 쓸 수 있다", "미국 셀러만 쓸 수 있다"],
                correctAnswer: 1
            },
            {
                id: 10,
                question: "리스팅 품질 점수(LQI)를 높이려면?",
                options: ["이미지를 1장만 쓴다", "설명을 최대한 짧게 쓴다", "모든 속성(Attribute)을 채운다", "가격을 최저가로 한다"],
                correctAnswer: 2
            }
        ]
    },
    // Level 3: Advanced
    {
        id: 3,
        title: "매출 폭발을 위한 마케팅 & 광고 (PPC)",
        description: "내 상품을 첫 페이지에 노출시키는 광고 전략과 프로모션",
        sections: [
            {
                title: "1. 아마존 PPC 광고의 종류",
                content: `**Sponsored Products (SP)**
- 검색 결과에 내 상품을 직접 노출 (가장 기본적이고 효과 좋음)
- 키워드 타겟팅 & 상품 타겟팅 가능

**Sponsored Brands (SB)**
- 검색 결과 최상단에 브랜드 로고와 제품 3개 노출
- 브랜드 인지도 상승에 효과적

**Sponsored Display (SD)**
- 경쟁사 리스팅 페이지나 아마존 외부 사이트에 배너 노출
- 리타겟팅(Retargeting)에 유리`,
                highlight: 'success',
                pdf: '/pdfs/아마존PPC_초급편3.pdf' // Linked
            },
            {
                title: "2. 광고 성과 분석 지표",
                content: `**ACOS (Advertising Cost of Sales)**
- 매출 대비 광고비 비율 (낮을수록 좋음)
- 공식: (광고비 ÷ 매출) × 100
- 마진율보다 ACOS가 낮아야 이익 발생

**ROAS (Return on Ad Spend)**
- 광고비 대비 매출 (높을수록 좋음)
- 공식: 매출 ÷ 광고비
- 예: ROAS 4.0 = 1달러 써서 4달러 매출`,
                highlight: 'info'
            },
            {
                title: "3. 쿠폰(Coupon)과 프로모션",
                content: `**클립 쿠폰 (Green Badge)**
- 검색 결과에 초록색 딱지가 붙어 클릭률(CTR) 상승 효과 엄청남
- 5%~10% 할인이라도 붙여두는 것을 강력 추천

**Prime Exclusive Discount**
- 프라임 회원에게만 할인가 제공
- 프라임 데이 등 행사 때 필수`,
                highlight: 'tip'
            }
        ],
        quiz: [
            {
                id: 1,
                question: "ACOS가 30%라는 의미는?",
                options: ["매출의 30%를 광고비로 썼다", "이익이 30%다", "광고 클릭률이 30%다", "전환율이 30%다"],
                correctAnswer: 0
            },
            {
                id: 2,
                question: "ROAS 5.0은 ACOS 몇 %와 같은가?",
                options: ["10%", "20%", "25%", "50%"],
                correctAnswer: 1
            },
            {
                id: 3,
                question: "검색 결과 최상단에 브랜드 로고와 함께 뜨는 광고는?",
                options: ["Sponsored Products", "Sponsored Brands", "Sponsored Display", "TV 광고"],
                correctAnswer: 1
            },
            {
                id: 4,
                question: "클릭률(CTR)을 높이는 가장 쉬운 방법은?",
                options: ["가격 인상", "메인 이미지 교체", "쿠폰(녹색 배지) 적용", "상품명 줄이기"],
                correctAnswer: 2
            },
            {
                id: 5,
                question: "Negative Keyword(제외 키워드)의 목적은?",
                options: ["노출을 늘리기 위해", "불필요한 클릭 비용 절감", "경쟁사 공격", "아마존 추천"],
                correctAnswer: 1
            },
            {
                id: 6,
                question: "자동 광고(Automatic Targeting)의 장점은?",
                options: ["가장 저렴하다", "세팅이 쉽고 키워드를 발굴해준다", "상단 노출 보장", "경쟁이 없다"],
                correctAnswer: 1
            },
            {
                id: 7,
                question: "광고 예산(Budget)이 소진되면 어떻게 되는가?",
                options: ["추가 과금된다", "광고가 중단된다", "자동으로 예산이 증액된다", "계정이 정지된다"],
                correctAnswer: 1
            },
            {
                id: 8,
                question: "리타겟팅(Retargeting)에 가장 적합한 광고 유형은?",
                options: ["Sponsored Products", "Sponsored Brands", "Sponsored Display", "Vine"],
                correctAnswer: 2
            },
            {
                id: 9,
                question: "Vine 프로그램이란?",
                options: ["재고 폐기 프로그램", "초기 리뷰 획득 프로그램", "배송 대행", "번역 서비스"],
                correctAnswer: 1
            },
            {
                id: 10,
                question: "광고 입찰가(Bid)를 높이면?",
                options: ["ACOS가 무조건 낮아진다", "노출될 확률이 높아진다", "품질 점수가 떨어진다", "수수료가 면제된다"],
                correctAnswer: 1
            }
        ]
    },
    // Level 4: Expert
    {
        id: 4,
        title: "브랜드 빌딩 & 글로벌 확장",
        description: "아마존 브랜드 레지스트리와 유럽/일본 시장 진출",
        sections: [
            {
                title: "1. Brand Registry (브랜드 등록)",
                content: `**필수 조건**
- 해당 국가(미국 등)에 등록된 '상표권(Trademark)'
- 출원 중(Pending) 상태에서도 신청 가능 (IP Accelerator 이용 시)

**등록 혜택**
- A+ Content (상세페이지 이미지/동영상) 사용 가능
- 가품 셀러 방어 (Project Zero, Transparency)
- 브랜드 분석 데이터(Brand Analytics) 제공`,
                highlight: 'success',
                pdf: '/pdfs/4회강의ppt.pdf' // Linked
            },
            {
                title: "2. 글로벌 셀링 (Global Selling)",
                content: `**일본 아마존 (Amazon JP)**
- 한국과 가깝고 배송비 저렴
- FBA 입고 절차가 미국과 유사
- 소비세(JCT) 관련 이슈 확인 필요

**유럽 아마존 (Amazon EU)**
- VAT(부가세) 등록의 장벽이 있음 (영국, 독일 등)
- 시장 규모는 미국 다음으로 큼`,
                highlight: 'warning'
            },
            {
                title: "3. 브랜드 보호 프로그램",
                content: `**Transparency (투명성 프로그램)**
- 제품마다 고유 QR코드를 부착하여 위조품 원천 차단
- 아마존 창고 입고 시 QR 스캔 없으면 입고 거부됨

**Project Zero**
- 브랜드가 직접 위조품 리스팅을 삭제할 수 있는 권한 부여`,
                highlight: 'info'
            }
        ],
        quiz: [
            {
                id: 1,
                question: "브랜드 레지스트리에 필요한 필수 조건은?",
                options: ["사업자 등록증", "상표권(Trademark)", "특허권", "미국 법인"],
                correctAnswer: 1
            },
            {
                id: 2,
                question: "유럽 아마존 진출 시 가장 큰 장벽은?",
                options: ["언어", "배송비", "VAT(부가세)", "시차"],
                correctAnswer: 2
            },
            {
                id: 3,
                question: "상표권이 '출원 중(Pending)'일 때 브랜드 등록이 가능한가?",
                options: ["불가능하다", "가능하다 (IP Accelerator 등)", "3년 기다려야 한다", "변호사만 가능하다"],
                correctAnswer: 1
            },
            {
                id: 4,
                question: "가품 방지를 위해 제품에 QR코드를 부착하는 프로그램은?",
                options: ["FBA", "Vine", "Transparency", "Launchpad"],
                correctAnswer: 2
            },
            {
                id: 5,
                question: "브랜드 분석(Brand Analytics)에서 알 수 있는 것은?",
                options: ["경쟁사 재고량", "고객 개인정보", "검색어 순위 및 클릭 점유율", "아마존 직원 연락처"],
                correctAnswer: 2
            },
            {
                id: 6,
                question: "IP Accelerator란?",
                options: ["IP 우회 접속", "지식재산권 보호 지원 및 브랜드 등록 가속화", "인터넷 속도 향상", "재고 가속화"],
                correctAnswer: 1
            },
            {
                id: 7,
                question: "브랜드 스토리를 사용하면 좋은 점은?",
                options: ["수수료 할인", "다른 상품들과 교차 판매(Cross-selling) 유도", "배송 속도 향상", "반품 금지"],
                correctAnswer: 1
            },
            {
                id: 8,
                question: "A+ Content의 옛날 명칭은?",
                options: ["EBC (Enhanced Brand Content)", "FBA", "AWS", "Kindle"],
                correctAnswer: 0
            },
            {
                id: 9,
                question: "브랜드가 직접 위조품을 삭제하는 권한을 주는 프로그램은?",
                options: ["Self-Service", "Project Zero", "Amazon Police", "Brand Monitor"],
                correctAnswer: 1
            },
            {
                id: 10,
                question: "Virtual Bundle이란?",
                options: ["가상 화폐 결제", "FBA 재고를 물리적으로 합치지 않고 묶음 상품 판매", "VR 기기 판매", "소프트웨어 번들"],
                correctAnswer: 1
            }
        ]
    },
    // Level 5: Master
    {
        id: 5,
        title: "성공적인 계정 운영 및 엑싯(Exit)",
        description: "계정 건전성 관리부터 매각(Exit)까지 마스터 플랜",
        sections: [
            {
                title: "1. Account Health (계정 건전성)",
                content: `**ODR (Order Defect Rate)**
- 주문 결함률 1% 미만 유지 필수
- 부정적 피드백, A-to-Z 클레임, 카드 취소 등이 영향

**LSR (Late Shipment Rate)**
- 배송 지연율 4% 미만 유지 (FBM 셀러 해당)

**IPI (Inventory Performance Index)**
- 재고 성과 지표 400점 이상 유지
- 점수 낮으면 창고 저장 용량 제한됨`,
                highlight: 'warning'
            },
            {
                title: "2. 외부 트래픽 (External Traffic)",
                content: `**아마존 밖에서 고객 데려오기**
- 인스타그램, 틱톡, 유튜브 등에서 아마존으로 유입
- 'Amazon Attribution'을 통해 외부 유입 성과 측정 가능
- 브랜드 리퍼럴 보너스(Brand Referral Bonus)로 수수료 약 10% 환급`,
                highlight: 'success'
            },
            {
                title: "3. 비즈니스 매각 (Exit Strategy)",
                content: `**브랜드 애그리게이터(Aggregator)**
- 잘 키운 아마존 브랜드를 전문적으로 인수하는 기업들 (Thrasio, Perch 등)
- 순이익(SDE)의 3배~5배수로 매각하는 것이 일반적
- 회계 투명성과 꾸준한 성장률이 중요`,
                highlight: 'tip'
            }
        ],
        quiz: [
            {
                id: 1,
                question: "ODR(주문 결함률)의 목표 유지 수치는?",
                options: ["1% 미만", "5% 미만", "10% 미만", "0%"],
                correctAnswer: 0
            },
            {
                id: 2,
                question: "외부 트래픽 유입 시 수수료를 환급해주는 프로그램은?",
                options: ["FBA", "Brand Referral Bonus", "Vine", "Prime"],
                correctAnswer: 1
            },
            {
                id: 3,
                question: "재고 퍼포먼스 지표(IPI)가 낮으면 발생하는 불이익은?",
                options: ["계정 정지", "판매 금지", "창고 저장 용량 제한", "광고 금지"],
                correctAnswer: 2
            },
            {
                id: 4,
                question: "아마존 브랜드를 인수하는 기업들을 무엇이라 부르는가?",
                options: ["Venture Capital", "Aggregator (애그리게이터)", "Angel Investor", "Hedge Fund"],
                correctAnswer: 1
            },
            {
                id: 5,
                question: "LSR(배송 지연율)은 주로 누구에게 중요한가?",
                options: ["FBA 셀러", "FBM(직접 배송) 셀러", "디지털 상품 셀러", "구매자"],
                correctAnswer: 1
            },
            {
                id: 6,
                question: "Amazon Attribution의 기능은?",
                options: ["제품 원가 계산", "외부 트래픽 성과 추적", "직원 근태 관리", "배송 경로 추적"],
                correctAnswer: 1
            },
            {
                id: 7,
                question: "계정 정지 시 제출해야 하는 서류는?",
                options: ["POA (Plan of Action)", "사업 계획서", "반성문", "포기 각서"],
                correctAnswer: 0
            },
            {
                id: 8,
                question: "브랜드 매각 시 가치 평가의 기준이 되는 이익 지표는?",
                options: ["매출(Revenue)", "SDE (Seller Discretionary Earnings)", "ROAS", "ACOS"],
                correctAnswer: 1
            },
            {
                id: 9,
                question: "계정 건전성 점수(AHR)가 몇 점 미만이면 위험한가?",
                options: ["1000점", "200점", "500점", "100점"],
                correctAnswer: 1
            },
            {
                id: 10,
                question: "아마존 셀러 활동의 최종 목표로 가장 적절한 것은?",
                options: ["평생 노동", "계정 정지", "성공적인 브랜드 엑싯(매각)", "재고 소진"],
                correctAnswer: 2
            }
        ]
    }
];
