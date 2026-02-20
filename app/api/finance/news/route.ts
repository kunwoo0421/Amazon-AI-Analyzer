
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Update frequency: 30 days
        const REVALIDATE_SECONDS = 2592000;

        // 1. Broad queries for open news sources
        const queries = [
            { term: 'Amazon FBA tips blog', category: 'Seller Tips' },
            { term: 'Amazon ecommerce retail news', category: 'Retail News' },
            { term: 'Amazon marketplace trends', category: 'Market Insights' }
        ];

        let allNewsItems: any[] = [];
        let idCounter = 0;

        // Function to check if a URL is likely to be valid and public
        const isSafeUrl = (url: string, title: string) => {
            const lowerUrl = url.toLowerCase();
            const lowerTitle = title.toLowerCase();

            // Blacklist keywords indicating paywalls, logins, or restricted content
            const badKeywords = [
                'login', 'signin', 'sign-in', 'signup', 'sign-up',
                'subscribe', 'register', 'member', 'paywall',
                'account', 'auth', 'redirect', '404', 'error'
            ];

            // Specific domains that often require login or have strict paywalls
            const badDomains = [
                'wsj.com', 'ft.com', 'bloomberg.com', // Strict paywalls
                'sellercentral.amazon.com/forums'      // Often requires login to view details
            ];

            if (badKeywords.some(w => lowerUrl.includes(w) || lowerTitle.includes(w))) return false;
            if (badDomains.some(d => lowerUrl.includes(d))) return false;

            return true;
        };

        // Fetch news
        await Promise.all(queries.map(async (q) => {
            try {
                const url = `https://news.google.com/search?q=${encodeURIComponent(q.term + ' when:30d')}&hl=en-US&gl=US&ceid=US:en`;

                const response = await fetch(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    },
                    next: { revalidate: REVALIDATE_SECONDS }
                } as any);

                const html = await response.text();
                const articleChunks = html.split('<article');

                let articlesFound = 0;
                for (let i = 1; i < articleChunks.length && articlesFound < 2; i++) {
                    const chunk = articleChunks[i];

                    const linkMatch = chunk.match(/<h3[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/h3>/);
                    const timeMatch = chunk.match(/<time[^>]*>([\s\S]*?)<\/time>/);

                    if (linkMatch && linkMatch[2]) {
                        const rawTitle = linkMatch[2];
                        const title = rawTitle
                            .replace(/&amp;/g, '&')
                            .replace(/&quot;/g, '"')
                            .replace(/&#39;/g, "'");

                        let url = linkMatch[1];
                        if (url.startsWith('./')) {
                            url = 'https://news.google.com' + url.substring(1);
                        }

                        // Apply Smart Filtering
                        if (isSafeUrl(url, title)) {
                            if (!allNewsItems.some(item => item.url === url)) {
                                allNewsItems.push({
                                    id: idCounter++,
                                    title,
                                    date: timeMatch ? timeMatch[1] : 'Recent',
                                    category: q.category,
                                    url: url
                                });
                                articlesFound++;
                            }
                        }
                    }
                }
            } catch (e) {
                console.error(`Failed to fetch for query ${q.term}`, e);
            }
        }));

        // 2. Guaranteed Public Fallback Links (Verified to be open)
        // Used to fill up slots if scraping yields few or blocked results
        const verifiedResources = [
            {
                id: 901,
                title: "Amazon News: Latest Company Updates (Official)",
                date: "Official",
                category: "Company News",
                url: "https://www.aboutamazon.com/news"
            },
            {
                id: 902,
                title: "CNBC Retail News - Amazon Section",
                date: "News",
                category: "Retail Trends",
                url: "https://www.cnbc.com/retail/"
            },
            {
                id: 903,
                title: "TechCrunch - Amazon News",
                date: "Tech News",
                category: "Industry",
                url: "https://techcrunch.com/tag/amazon/"
            },
            {
                id: 904,
                title: "Jungle Scout - Amazon Seller Blog",
                date: "Guide",
                category: "Seller Tips",
                url: "https://www.junglescout.com/blog/"
            },
            {
                id: 905,
                title: "Marketplace Pulse - Ecommerce Market Intelligence",
                date: "Data",
                category: "Insights",
                url: "https://www.marketplacepulse.com/amazon/news"
            }
        ];

        // Fill up to 5 items minimum
        for (const item of verifiedResources) {
            if (allNewsItems.length >= 8) break; // Don't overflow if we already have many
            if (!allNewsItems.some(n => n.url === item.url)) {
                allNewsItems.push(item);
            }
        }

        // 3. Final Sort & Slice
        allNewsItems.sort((a, b) => {
            // Put items with specific time format (e.g., "2 hours ago") to the top
            const aIsRecent = a.date.includes('ago') || a.date.includes('hour');
            const bIsRecent = b.date.includes('ago') || b.date.includes('hour');
            if (aIsRecent && !bIsRecent) return -1;
            if (!aIsRecent && bIsRecent) return 1;
            return 0;
        });

        // Ensure we strictly have at least 5 items
        const finalNews = allNewsItems.slice(0, 8);

        return NextResponse.json({ news: finalNews });

    } catch (error) {
        console.error("News fetch error:", error);
        // Absolute safety fallback
        return NextResponse.json({
            news: [
                { id: 1, title: "Amazon Official News", date: "Official", category: "News", url: "https://www.aboutamazon.com/" },
                { id: 2, title: "Marketplace Pulse", date: "News", category: "Trends", url: "https://www.marketplacepulse.com/" }
            ]
        });
    }
}
