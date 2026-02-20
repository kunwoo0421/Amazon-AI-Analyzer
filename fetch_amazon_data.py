import json
import os
import requests
import statistics

# --- CONFIGURATION ---
# In a real scenario, you would get an API Key from a provider like Rainforest API, DataForSEO, or RapidAPI.
# provider_url = "https://api.rainforestapi.com/request"
API_KEY = None # Set this to your actual key to fetch live data

def fetch_rainforest_data(keyword, api_key):
    """
    Fetches live data from Rainforest API (Simulated implementation).
    """
    if not api_key:
        print("⚠️  No API Key provided. Switching to MOCK DATA mode.")
        return None

    # This is how the real request would look:
    # params = {
    #   'api_key': api_key,
    #   'type': 'search',
    #   'amazon_domain': 'amazon.com',
    #   'search_term': keyword,
    #   'sort_by': 'most_recent'
    # }
    # response = requests.get('https://api.rainforestapi.com/request', params=params)
    # return response.json()
    return None

def estimate_sales_from_bsr(bsr, category="Beauty"):
    """
    Roughly estimates monthly sales based on Best Seller Rank (BSR).
    NOTE: This is a simplified heuristic. Real tools use massive databases to define these curves.
    Curve assumption for Beauty category: very high sales at top ranks, dropping logarithmically.
    """
    if not bsr:
        return 0
    
    # Simple logarithmic decay model query for demonstration
    # Rank 1 ~ 30,000 sales
    # Rank 100 ~ 6,000 sales 
    # Rank 1,000 ~ 900 sales
    # Rank 10,000 ~ 100 sales
    
    if bsr < 10:
        return 50000
    elif bsr < 100:
        return 10000
    elif bsr < 1000:
        return 3000
    elif bsr < 5000:
        return 1000
    elif bsr < 10000:
        return 300
    elif bsr < 50000:
        return 50
    else:
        return 10

def analyze_market(keyword):
    print(f"\n🔍 Analyzing Market for Keyword: '{keyword}'...")
    print("-" * 50)

    # 1. Load Data (Mock or Real)
    data = fetch_rainforest_data(keyword, API_KEY)
    
    if not data:
        # Load local sample data for demonstration
        try:
            with open('sample_data.json', 'r', encoding='utf-8') as f:
                data = json.load(f)
            print("✅ Loaded SAMPLE DATA (simulating API response)")
        except FileNotFoundError:
            print("❌ Error: Sample data file not found.")
            return

    results = data.get('search_results', [])
    if not results:
        print("No results found.")
        return

    # 2. Extract Metrics
    prices = []
    sales_estimates = []
    competitors = []

    for item in results:
        # Price extraction
        price_obj = item.get('price')
        price = price_obj.get('value') if price_obj else None
        
        # BSR extraction
        bsr = item.get('best_seller_rank')
        
        # Title extraction
        title = item.get('title', 'Unknown')

        if price:
            prices.append(price)
            
        sales_est = estimate_sales_from_bsr(bsr)
        sales_estimates.append(sales_est)
        
        competitors.append({
            'title': title[:50] + "...",
            'price': price,
            'bsr': bsr,
            'est_sales': sales_est,
            'revenue': price * sales_est if price else 0
        })

    # 3. Calculate Aggregates
    if not prices:
        print("No pricing data available.")
        return

    avg_price = statistics.mean(prices)
    min_price = min(prices)
    max_price = max(prices)
    total_est_monthly_sales = sum(sales_estimates)
    avg_est_monthly_sales = statistics.mean(sales_estimates)
    est_market_revenue = sum(c['revenue'] for c in competitors)

    # 4. Generate Report
    print(f"\n📊 MARKET INTELLIGENCE REPORT: {keyword}")
    print("=" * 50)
    print(f"💰 Average Price:       ${avg_price:.2f}")
    print(f"📉 Price Range:         ${min_price:.2f} - ${max_price:.2f}")
    print(f"📦 Est. Monthly Sales (Top {len(results)}): {total_est_monthly_sales:,} units")
    print(f"💵 Est. Monthly Revenue (Top {len(results)}): ${est_market_revenue:,.2f}")
    print("-" * 50)
    print("🏆 TOP COMPETITORS:")
    
    # Sort by estimated revenue
    sorted_competitors = sorted(competitors, key=lambda x: x['revenue'], reverse=True)
    
    for i, product in enumerate(sorted_competitors[:5], 1):
        print(f"{i}. {product['title']}")
        print(f"   Price: ${product['price']} | BSR: #{product['bsr']} | Est. Sales: ~{product['est_sales']}/mo")
        print(f"   Est. Rev: ${product['revenue']:,.0f}")
        print("")

    # 5. Strategic Advice (Simple Logic)
    print("💡 STRATEGIC RECOMMENDATION:")
    if avg_price > 20 and total_est_monthly_sales > 5000:
        print("   ✅ GO: High demand and healthy price margins detected.")
        print("   Strategy: Bundle products to increase Average Order Value (AOV) above $25.")
    elif avg_price < 15:
        print("   ⚠️ CAUTION: Price war zone. Low margins expected.")
        print("   Strategy: Focus on extreme differentiation or branding to command higher prices.")
    else:
        print("   ℹ️ NEUTRAL: Standard market conditions. Requires good marketing.")

if __name__ == "__main__":
    analyze_market("Korean Skincare")
