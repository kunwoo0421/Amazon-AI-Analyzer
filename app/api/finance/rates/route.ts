
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const urls = [
            { code: 'USD', country: 'US', url: 'https://www.google.com/finance/quote/USD-KRW' },
            { code: 'JPY', country: 'Japan', url: 'https://www.google.com/finance/quote/JPY-KRW' },
            { code: 'EUR', country: 'Europe', url: 'https://www.google.com/finance/quote/EUR-KRW' },
        ];

        const rates = await Promise.all(urls.map(async (item) => {
            try {
                const response = await fetch(item.url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    }
                });
                const html = await response.text();

                // Simple regex to find the class we identified earlier
                // <div class="YMlKec fxKbKc">1,458.50</div>
                const match = html.match(/<div class="YMlKec fxKbKc">([^<]+)<\/div>/);

                let rate = 0;
                if (match && match[1]) {
                    rate = parseFloat(match[1].replace(/,/g, ''));
                }

                return {
                    country: item.country,
                    code: item.code,
                    rate: rate || 0,
                    change: 0,
                    trend: 'up',
                    url: item.url
                };
            } catch (error) {
                console.error(`Error scraping ${item.code}:`, error);
                return {
                    country: item.country,
                    code: item.code,
                    rate: 0,
                    change: 0,
                    trend: 'neutral'
                };
            }
        }));

        return NextResponse.json({ rates });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch rates' }, { status: 500 });
    }
}
