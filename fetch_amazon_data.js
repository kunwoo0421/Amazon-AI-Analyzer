const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
const API_KEY = null; // Set this to your actual key to fetch live data (e.g., Rainforest API)

async function fetchRainforestData(keyword, apiKey) {
    if (!apiKey) {
        console.log("⚠️  No API Key provided. Switching to MOCK DATA mode.");
        return null;
    }
    // Simulation of API call
    console.log(`Fetching live data for ${keyword}... (API Key logic would go here)`);
    return null;
}

function estimateSalesFromBsr(bsr, category = "Beauty") {
    // Simplified heuristic logic
    if (!bsr) return 0;

    if (bsr < 10) return 50000;
    else if (bsr < 100) return 10000;
    else if (bsr < 1000) return 3000;
    else if (bsr < 5000) return 1000;
    else if (bsr < 10000) return 300;
    else if (bsr < 50000) return 50;
    else return 10;
}

async function analyzeMarket(keyword) {
    console.log(`\n🔍 Analyzing Market for Keyword: '${keyword}'...`);
    console.log("-".repeat(50));

    let data = await fetchRainforestData(keyword, API_KEY);

    if (!data) {
        try {
            const dataPath = path.join(__dirname, 'sample_data.json');
            const fileContent = fs.readFileSync(dataPath, 'utf8');
            data = JSON.parse(fileContent);
            console.log("✅ Loaded SAMPLE DATA (simulating API response)");
        } catch (err) {
            console.error("❌ Error: Sample data file not found.", err.message);
            return;
        }
    }

    const results = data.search_results || [];
    if (results.length === 0) {
        console.log("No results found.");
        return;
    }

    // Extract Metrics
    const prices = [];
    const competitors = [];

    results.forEach(item => {
        const priceObj = item.price;
        const price = priceObj ? priceObj.value : null;
        const bsr = item.best_seller_rank;
        const title = item.title || 'Unknown';

        const salesEst = estimateSalesFromBsr(bsr);

        if (price !== null) {
            prices.push(price);
        }

        competitors.push({
            title: title.length > 50 ? title.substring(0, 50) + "..." : title,
            price: price,
            bsr: bsr,
            est_sales: salesEst,
            revenue: (price || 0) * salesEst
        });
    });

    if (prices.length === 0) {
        console.log("No pricing data available.");
        return;
    }

    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const totalEstSales = competitors.reduce((sum, item) => sum + item.est_sales, 0);
    const estMarketRevenue = competitors.reduce((sum, item) => sum + item.revenue, 0);

    // Generate Report
    console.log(`\n📊 MARKET INTELLIGENCE REPORT: ${keyword}`);
    console.log("=".repeat(50));
    console.log(`💰 Average Price:       $${avgPrice.toFixed(2)}`);
    console.log(`📉 Price Range:         $${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`);
    console.log(`📦 Est. Monthly Sales (Top ${results.length}): ${totalEstSales.toLocaleString()} units`);
    console.log(`💵 Est. Monthly Revenue (Top ${results.length}): $${estMarketRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    console.log("-".repeat(50));
    console.log("🏆 TOP COMPETITORS:");

    competitors
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
        .forEach((product, i) => {
            console.log(`${i + 1}. ${product.title}`);
            console.log(`   Price: $${product.price} | BSR: #${product.bsr} | Est. Sales: ~${product.est_sales}/mo`);
            console.log(`   Est. Rev: $${product.revenue.toLocaleString()}`);
            console.log("");
        });

    console.log("💡 STRATEGIC RECOMMENDATION:");
    if (avgPrice > 20 && totalEstSales > 5000) {
        console.log("   ✅ GO: High demand and healthy price margins detected.");
        console.log("   Strategy: Bundle products to increase Average Order Value (AOV) above $25.");
    } else if (avgPrice < 15) {
        console.log("   ⚠️ CAUTION: Price war zone. Low margins expected.");
        console.log("   Strategy: Focus on extreme differentiation or branding to command higher prices.");
    } else {
        console.log("   ℹ️ NEUTRAL: Standard market conditions. Requires good marketing.");
    }
}

analyzeMarket("Korean Skincare");
