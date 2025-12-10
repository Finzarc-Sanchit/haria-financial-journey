/**
 * Comprehensive NSE Stock Database
 * 
 * This file contains a comprehensive list of Indian NSE stocks.
 * Currently includes 200+ major stocks across all sectors.
 * 
 * For production with 5000+ stocks:
 * - Load from backend API/database
 * - Implement pagination
 * - Cache stock data
 * - Use virtual scrolling for performance
 */

export interface StockInfo {
    symbol: string;
    name: string;
    sector: string;
    marketCapCategory: 'Large Cap' | 'Mid Cap' | 'Small Cap';
}

// Comprehensive NSE Stock List (200+ stocks)
export const NSE_STOCKS: StockInfo[] = [
    // NIFTY 50 Stocks - Large Cap
    { symbol: 'RELIANCE.NS', name: 'Reliance Industries', sector: 'Energy', marketCapCategory: 'Large Cap' },
    { symbol: 'TCS.NS', name: 'Tata Consultancy Services', sector: 'Technology', marketCapCategory: 'Large Cap' },
    { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', sector: 'Banking', marketCapCategory: 'Large Cap' },
    { symbol: 'INFY.NS', name: 'Infosys', sector: 'Technology', marketCapCategory: 'Large Cap' },
    { symbol: 'ICICIBANK.NS', name: 'ICICI Bank', sector: 'Banking', marketCapCategory: 'Large Cap' },
    { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever', sector: 'Consumer Goods', marketCapCategory: 'Large Cap' },
    { symbol: 'ITC.NS', name: 'ITC Limited', sector: 'Consumer Goods', marketCapCategory: 'Large Cap' },
    { symbol: 'SBIN.NS', name: 'State Bank of India', sector: 'Banking', marketCapCategory: 'Large Cap' },
    { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel', sector: 'Telecommunications', marketCapCategory: 'Large Cap' },
    { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance', sector: 'Financial Services', marketCapCategory: 'Large Cap' },
    { symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank', sector: 'Banking', marketCapCategory: 'Large Cap' },
    { symbol: 'LT.NS', name: 'Larsen & Toubro', sector: 'Infrastructure', marketCapCategory: 'Large Cap' },
    { symbol: 'ASIANPAINT.NS', name: 'Asian Paints', sector: 'Consumer Goods', marketCapCategory: 'Large Cap' },
    { symbol: 'AXISBANK.NS', name: 'Axis Bank', sector: 'Banking', marketCapCategory: 'Large Cap' },
    { symbol: 'MARUTI.NS', name: 'Maruti Suzuki', sector: 'Automotive', marketCapCategory: 'Large Cap' },
    { symbol: 'SUNPHARMA.NS', name: 'Sun Pharmaceutical', sector: 'Healthcare', marketCapCategory: 'Large Cap' },
    { symbol: 'TITAN.NS', name: 'Titan Company', sector: 'Consumer Goods', marketCapCategory: 'Large Cap' },
    { symbol: 'WIPRO.NS', name: 'Wipro', sector: 'Technology', marketCapCategory: 'Large Cap' },
    { symbol: 'ULTRACEMCO.NS', name: 'UltraTech Cement', sector: 'Infrastructure', marketCapCategory: 'Large Cap' },
    { symbol: 'NESTLEIND.NS', name: 'Nestle India', sector: 'Consumer Goods', marketCapCategory: 'Large Cap' },
    { symbol: 'BAJAJFINSV.NS', name: 'Bajaj Finserv', sector: 'Financial Services', marketCapCategory: 'Large Cap' },
    { symbol: 'HCLTECH.NS', name: 'HCL Technologies', sector: 'Technology', marketCapCategory: 'Large Cap' },
    { symbol: 'TATAMOTORS.NS', name: 'Tata Motors', sector: 'Automotive', marketCapCategory: 'Large Cap' },
    { symbol: 'TATASTEEL.NS', name: 'Tata Steel', sector: 'Metals', marketCapCategory: 'Large Cap' },
    { symbol: 'POWERGRID.NS', name: 'Power Grid Corporation', sector: 'Energy', marketCapCategory: 'Large Cap' },
    { symbol: 'NTPC.NS', name: 'NTPC Limited', sector: 'Energy', marketCapCategory: 'Large Cap' },
    { symbol: 'ONGC.NS', name: 'Oil & Natural Gas Corporation', sector: 'Energy', marketCapCategory: 'Large Cap' },
    { symbol: 'M&M.NS', name: 'Mahindra & Mahindra', sector: 'Automotive', marketCapCategory: 'Large Cap' },
    { symbol: 'JSWSTEEL.NS', name: 'JSW Steel', sector: 'Metals', marketCapCategory: 'Large Cap' },
    { symbol: 'INDUSINDBK.NS', name: 'IndusInd Bank', sector: 'Banking', marketCapCategory: 'Large Cap' },
    { symbol: 'TECHM.NS', name: 'Tech Mahindra', sector: 'Technology', marketCapCategory: 'Large Cap' },
    { symbol: 'HINDALCO.NS', name: 'Hindalco Industries', sector: 'Metals', marketCapCategory: 'Large Cap' },
    { symbol: 'ADANIENT.NS', name: 'Adani Enterprises', sector: 'Infrastructure', marketCapCategory: 'Large Cap' },
    { symbol: 'ADANIPORTS.NS', name: 'Adani Ports', sector: 'Infrastructure', marketCapCategory: 'Large Cap' },
    { symbol: 'COALINDIA.NS', name: 'Coal India', sector: 'Metals', marketCapCategory: 'Large Cap' },
    { symbol: 'BRITANNIA.NS', name: 'Britannia Industries', sector: 'Consumer Goods', marketCapCategory: 'Large Cap' },
    { symbol: 'DIVISLAB.NS', name: 'Divi\'s Laboratories', sector: 'Healthcare', marketCapCategory: 'Large Cap' },
    { symbol: 'EICHERMOT.NS', name: 'Eicher Motors', sector: 'Automotive', marketCapCategory: 'Large Cap' },
    { symbol: 'BPCL.NS', name: 'Bharat Petroleum', sector: 'Energy', marketCapCategory: 'Large Cap' },
    { symbol: 'GRASIM.NS', name: 'Grasim Industries', sector: 'Infrastructure', marketCapCategory: 'Large Cap' },
    { symbol: 'TATACONSUM.NS', name: 'Tata Consumer Products', sector: 'Consumer Goods', marketCapCategory: 'Large Cap' },
    { symbol: 'HEROMOTOCO.NS', name: 'Hero MotoCorp', sector: 'Automotive', marketCapCategory: 'Large Cap' },
    { symbol: 'CIPLA.NS', name: 'Cipla Limited', sector: 'Healthcare', marketCapCategory: 'Large Cap' },
    { symbol: 'DRREDDY.NS', name: 'Dr. Reddy\'s Laboratories', sector: 'Healthcare', marketCapCategory: 'Large Cap' },
    { symbol: 'APOLLOHOSP.NS', name: 'Apollo Hospitals', sector: 'Healthcare', marketCapCategory: 'Large Cap' },
    { symbol: 'HDFCLIFE.NS', name: 'HDFC Life Insurance', sector: 'Financial Services', marketCapCategory: 'Large Cap' },
    { symbol: 'SBILIFE.NS', name: 'SBI Life Insurance', sector: 'Financial Services', marketCapCategory: 'Large Cap' },
    { symbol: 'BAJAJ-AUTO.NS', name: 'Bajaj Auto', sector: 'Automotive', marketCapCategory: 'Large Cap' },
    { symbol: 'SHREECEM.NS', name: 'Shree Cement', sector: 'Infrastructure', marketCapCategory: 'Large Cap' },
    { symbol: 'IOC.NS', name: 'Indian Oil Corporation', sector: 'Energy', marketCapCategory: 'Large Cap' },

    // Additional Large Cap Stocks (NIFTY Next 50)
    { symbol: 'ADANIGREEN.NS', name: 'Adani Green Energy', sector: 'Energy', marketCapCategory: 'Large Cap' },
    { symbol: 'SIEMENS.NS', name: 'Siemens Limited', sector: 'Infrastructure', marketCapCategory: 'Large Cap' },
    { symbol: 'DLF.NS', name: 'DLF Limited', sector: 'Real Estate', marketCapCategory: 'Large Cap' },
    { symbol: 'GODREJCP.NS', name: 'Godrej Consumer Products', sector: 'Consumer Goods', marketCapCategory: 'Large Cap' },
    { symbol: 'PIDILITIND.NS', name: 'Pidilite Industries', sector: 'Consumer Goods', marketCapCategory: 'Large Cap' },
    { symbol: 'VEDL.NS', name: 'Vedanta Limited', sector: 'Metals', marketCapCategory: 'Large Cap' },
    { symbol: 'DABUR.NS', name: 'Dabur India', sector: 'Consumer Goods', marketCapCategory: 'Large Cap' },
    { symbol: 'MARICO.NS', name: 'Marico Limited', sector: 'Consumer Goods', marketCapCategory: 'Large Cap' },
    { symbol: 'BIOCON.NS', name: 'Biocon Limited', sector: 'Healthcare', marketCapCategory: 'Large Cap' },
    { symbol: 'HAVELLS.NS', name: 'Havells India', sector: 'Consumer Goods', marketCapCategory: 'Large Cap' },
    { symbol: 'COLPAL.NS', name: 'Colgate-Palmolive India', sector: 'Consumer Goods', marketCapCategory: 'Large Cap' },
    { symbol: 'BERGEPAINT.NS', name: 'Berger Paints', sector: 'Consumer Goods', marketCapCategory: 'Large Cap' },
    { symbol: 'BOSCHLTD.NS', name: 'Bosch Limited', sector: 'Automotive', marketCapCategory: 'Large Cap' },
    { symbol: 'LTI.NS', name: 'LTI Mindtree', sector: 'Technology', marketCapCategory: 'Large Cap' },
    { symbol: 'MCDOWELL-N.NS', name: 'United Spirits', sector: 'Consumer Goods', marketCapCategory: 'Large Cap' },
    { symbol: 'AMBUJACEM.NS', name: 'Ambuja Cements', sector: 'Infrastructure', marketCapCategory: 'Large Cap' },
    { symbol: 'ACC.NS', name: 'ACC Limited', sector: 'Infrastructure', marketCapCategory: 'Large Cap' },
    { symbol: 'TORNTPHARM.NS', name: 'Torrent Pharmaceuticals', sector: 'Healthcare', marketCapCategory: 'Large Cap' },
    { symbol: 'MUTHOOTFIN.NS', name: 'Muthoot Finance', sector: 'Financial Services', marketCapCategory: 'Large Cap' },
    { symbol: 'HINDZINC.NS', name: 'Hindustan Zinc', sector: 'Metals', marketCapCategory: 'Large Cap' },
    { symbol: 'BANDHANBNK.NS', name: 'Bandhan Bank', sector: 'Banking', marketCapCategory: 'Large Cap' },
    { symbol: 'PEL.NS', name: 'Piramal Enterprises', sector: 'Financial Services', marketCapCategory: 'Large Cap' },
    { symbol: 'LUPIN.NS', name: 'Lupin Limited', sector: 'Healthcare', marketCapCategory: 'Large Cap' },
    { symbol: 'DMART.NS', name: 'Avenue Supermarts (DMart)', sector: 'Consumer Goods', marketCapCategory: 'Large Cap' },
    { symbol: 'TRENT.NS', name: 'Trent Limited', sector: 'Consumer Goods', marketCapCategory: 'Large Cap' },
    { symbol: 'GODREJPROP.NS', name: 'Godrej Properties', sector: 'Real Estate', marketCapCategory: 'Large Cap' },
    { symbol: 'OBEROIRLTY.NS', name: 'Oberoi Realty', sector: 'Real Estate', marketCapCategory: 'Large Cap' },
    { symbol: 'ABB.NS', name: 'ABB India', sector: 'Infrastructure', marketCapCategory: 'Large Cap' },
    { symbol: 'CHOLAFIN.NS', name: 'Cholamandalam Investment', sector: 'Financial Services', marketCapCategory: 'Large Cap' },
    { symbol: 'MPHASIS.NS', name: 'Mphasis Limited', sector: 'Technology', marketCapCategory: 'Large Cap' },
    { symbol: 'ICICIPRULI.NS', name: 'ICICI Prudential Life', sector: 'Financial Services', marketCapCategory: 'Large Cap' },
    { symbol: 'INDIGO.NS', name: 'InterGlobe Aviation (IndiGo)', sector: 'Transportation', marketCapCategory: 'Large Cap' },
    { symbol: 'SRF.NS', name: 'SRF Limited', sector: 'Chemicals', marketCapCategory: 'Large Cap' },
    { symbol: 'MOTHERSON.NS', name: 'Samvardhana Motherson', sector: 'Automotive', marketCapCategory: 'Large Cap' },
    { symbol: 'PNB.NS', name: 'Punjab National Bank', sector: 'Banking', marketCapCategory: 'Large Cap' },
    { symbol: 'BANKBARODA.NS', name: 'Bank of Baroda', sector: 'Banking', marketCapCategory: 'Large Cap' },
    { symbol: 'CANBK.NS', name: 'Canara Bank', sector: 'Banking', marketCapCategory: 'Large Cap' },
    { symbol: 'UNIONBANK.NS', name: 'Union Bank of India', sector: 'Banking', marketCapCategory: 'Large Cap' },
    
    // Mid Cap Stocks
    { symbol: 'AUROPHARMA.NS', name: 'Aurobindo Pharma', sector: 'Healthcare', marketCapCategory: 'Mid Cap' },
    { symbol: 'ZEEL.NS', name: 'Zee Entertainment', sector: 'Media', marketCapCategory: 'Mid Cap' },
    { symbol: 'PAGEIND.NS', name: 'Page Industries', sector: 'Consumer Goods', marketCapCategory: 'Mid Cap' },
    { symbol: 'VOLTAS.NS', name: 'Voltas Limited', sector: 'Consumer Goods', marketCapCategory: 'Mid Cap' },
    { symbol: 'CONCOR.NS', name: 'Container Corporation', sector: 'Transportation', marketCapCategory: 'Mid Cap' },
    { symbol: 'GMRINFRA.NS', name: 'GMR Infrastructure', sector: 'Infrastructure', marketCapCategory: 'Mid Cap' },
    { symbol: 'NMDC.NS', name: 'NMDC Limited', sector: 'Metals', marketCapCategory: 'Mid Cap' },
    { symbol: 'SAIL.NS', name: 'Steel Authority of India', sector: 'Metals', marketCapCategory: 'Mid Cap' },
    { symbol: 'BHEL.NS', name: 'Bharat Heavy Electricals', sector: 'Infrastructure', marketCapCategory: 'Mid Cap' },
    { symbol: 'BEL.NS', name: 'Bharat Electronics', sector: 'Defense', marketCapCategory: 'Mid Cap' },
    { symbol: 'HAL.NS', name: 'Hindustan Aeronautics', sector: 'Defense', marketCapCategory: 'Mid Cap' },
    { symbol: 'GAIL.NS', name: 'GAIL India', sector: 'Energy', marketCapCategory: 'Mid Cap' },
    { symbol: 'MRF.NS', name: 'MRF Limited', sector: 'Automotive', marketCapCategory: 'Mid Cap' },
    { symbol: 'APOLLOTYRE.NS', name: 'Apollo Tyres', sector: 'Automotive', marketCapCategory: 'Mid Cap' },
    { symbol: 'CEAT.NS', name: 'CEAT Limited', sector: 'Automotive', marketCapCategory: 'Mid Cap' },
    { symbol: 'ESCORTS.NS', name: 'Escorts Limited', sector: 'Automotive', marketCapCategory: 'Mid Cap' },
    { symbol: 'ASHOKLEY.NS', name: 'Ashok Leyland', sector: 'Automotive', marketCapCategory: 'Mid Cap' },
    { symbol: 'BALKRISIND.NS', name: 'Balkrishna Industries', sector: 'Automotive', marketCapCategory: 'Mid Cap' },
    { symbol: 'CASTROLIND.NS', name: 'Castrol India', sector: 'Automotive', marketCapCategory: 'Mid Cap' },
    { symbol: 'EXIDEIND.NS', name: 'Exide Industries', sector: 'Automotive', marketCapCategory: 'Mid Cap' },
    { symbol: 'COFORGE.NS', name: 'Coforge Limited', sector: 'Technology', marketCapCategory: 'Mid Cap' },
    { symbol: 'PERSISTENT.NS', name: 'Persistent Systems', sector: 'Technology', marketCapCategory: 'Mid Cap' },
    { symbol: 'MINDTREE.NS', name: 'Mindtree Limited', sector: 'Technology', marketCapCategory: 'Mid Cap' },
    { symbol: 'LTTS.NS', name: 'L&T Technology Services', sector: 'Technology', marketCapCategory: 'Mid Cap' },
    { symbol: 'OFSS.NS', name: 'Oracle Financial Services', sector: 'Technology', marketCapCategory: 'Mid Cap' },
    { symbol: 'ZOMATO.NS', name: 'Zomato Limited', sector: 'Consumer Services', marketCapCategory: 'Mid Cap' },
    { symbol: 'NYKAA.NS', name: 'FSN E-Commerce (Nykaa)', sector: 'Consumer Services', marketCapCategory: 'Mid Cap' },
    { symbol: 'POLICYBZR.NS', name: 'PB Fintech (PolicyBazaar)', sector: 'Financial Services', marketCapCategory: 'Mid Cap' },
    { symbol: 'PAYTM.NS', name: 'Paytm (One97 Communications)', sector: 'Financial Services', marketCapCategory: 'Mid Cap' },
    { symbol: 'IRCTC.NS', name: 'Indian Railway Catering', sector: 'Transportation', marketCapCategory: 'Mid Cap' },
    { symbol: 'ADANIPOWER.NS', name: 'Adani Power', sector: 'Energy', marketCapCategory: 'Mid Cap' },
    { symbol: 'ADANITRANS.NS', name: 'Adani Transmission', sector: 'Energy', marketCapCategory: 'Mid Cap' },
    { symbol: 'TATACHEM.NS', name: 'Tata Chemicals', sector: 'Chemicals', marketCapCategory: 'Mid Cap' },
    { symbol: 'TATAPOWER.NS', name: 'Tata Power', sector: 'Energy', marketCapCategory: 'Mid Cap' },
    { symbol: 'TATACOFFEE.NS', name: 'Tata Coffee', sector: 'Consumer Goods', marketCapCategory: 'Mid Cap' },
    { symbol: 'TATAELXSI.NS', name: 'Tata Elxsi', sector: 'Technology', marketCapCategory: 'Mid Cap' },
    { symbol: 'FEDERALBNK.NS', name: 'Federal Bank', sector: 'Banking', marketCapCategory: 'Mid Cap' },
    { symbol: 'IDFCFIRSTB.NS', name: 'IDFC First Bank', sector: 'Banking', marketCapCategory: 'Mid Cap' },
    { symbol: 'RBLBANK.NS', name: 'RBL Bank', sector: 'Banking', marketCapCategory: 'Mid Cap' },
    { symbol: 'IDFCFIRSTB.NS', name: 'IDFC First Bank', sector: 'Banking', marketCapCategory: 'Mid Cap' },
    { symbol: 'M&MFIN.NS', name: 'Mahindra & Mahindra Financial', sector: 'Financial Services', marketCapCategory: 'Mid Cap' },
    { symbol: 'LICHSGFIN.NS', name: 'LIC Housing Finance', sector: 'Financial Services', marketCapCategory: 'Mid Cap' },
    { symbol: 'PFC.NS', name: 'Power Finance Corporation', sector: 'Financial Services', marketCapCategory: 'Mid Cap' },
    { symbol: 'RECLTD.NS', name: 'REC Limited', sector: 'Financial Services', marketCapCategory: 'Mid Cap' },
    { symbol: 'DELTACORP.NS', name: 'Delta Corp', sector: 'Consumer Services', marketCapCategory: 'Mid Cap' },
    { symbol: 'PHOENIXLTD.NS', name: 'Phoenix Mills', sector: 'Real Estate', marketCapCategory: 'Mid Cap' },
    { symbol: 'PRESTIGE.NS', name: 'Prestige Estates Projects', sector: 'Real Estate', marketCapCategory: 'Mid Cap' },
    { symbol: 'SOBHA.NS', name: 'Sobha Limited', sector: 'Real Estate', marketCapCategory: 'Mid Cap' },
    { symbol: 'BRIGADE.NS', name: 'Brigade Enterprises', sector: 'Real Estate', marketCapCategory: 'Mid Cap' },
    
    // Small Cap Stocks
    { symbol: 'DIXON.NS', name: 'Dixon Technologies', sector: 'Consumer Goods', marketCapCategory: 'Small Cap' },
    { symbol: 'AMBER.NS', name: 'Amber Enterprises', sector: 'Consumer Goods', marketCapCategory: 'Small Cap' },
    { symbol: 'HAPPSTMNDS.NS', name: 'Happiest Minds Technologies', sector: 'Technology', marketCapCategory: 'Small Cap' },
    { symbol: 'ROUTE.NS', name: 'Route Mobile', sector: 'Technology', marketCapCategory: 'Small Cap' },
    { symbol: 'NAZARA.NS', name: 'Nazara Technologies', sector: 'Technology', marketCapCategory: 'Small Cap' },
    { symbol: 'CARTRADE.NS', name: 'CarTrade Tech', sector: 'Consumer Services', marketCapCategory: 'Small Cap' },
    { symbol: 'EASEMYTRIP.NS', name: 'Easy Trip Planners', sector: 'Transportation', marketCapCategory: 'Small Cap' },
    { symbol: 'LATENTVIEW.NS', name: 'Latent View Analytics', sector: 'Technology', marketCapCategory: 'Small Cap' },
    { symbol: 'FINEORG.NS', name: 'Fine Organic Industries', sector: 'Chemicals', marketCapCategory: 'Small Cap' },
    { symbol: 'CLEAN.NS', name: 'Clean Science and Technology', sector: 'Chemicals', marketCapCategory: 'Small Cap' },
    { symbol: 'AETHER.NS', name: 'Aether Industries', sector: 'Chemicals', marketCapCategory: 'Small Cap' },
    { symbol: 'RVNL.NS', name: 'Rail Vikas Nigam', sector: 'Infrastructure', marketCapCategory: 'Small Cap' },
    { symbol: 'IRFC.NS', name: 'Indian Railway Finance Corp', sector: 'Financial Services', marketCapCategory: 'Small Cap' },
    { symbol: 'HGINFRA.NS', name: 'H.G. Infra Engineering', sector: 'Infrastructure', marketCapCategory: 'Small Cap' },
    { symbol: 'KPRMILL.NS', name: 'KPR Mill', sector: 'Textiles', marketCapCategory: 'Small Cap' },
    { symbol: 'WELSPUNIND.NS', name: 'Welspun India', sector: 'Textiles', marketCapCategory: 'Small Cap' },
    { symbol: 'SOLARINDS.NS', name: 'Solar Industries', sector: 'Chemicals', marketCapCategory: 'Small Cap' },
    { symbol: 'FLUOROCHEM.NS', name: 'Gujarat Fluorochemicals', sector: 'Chemicals', marketCapCategory: 'Small Cap' },
    { symbol: 'SYNGENE.NS', name: 'Syngene International', sector: 'Healthcare', marketCapCategory: 'Small Cap' },
    { symbol: 'LALPATHLAB.NS', name: 'Dr. Lal PathLabs', sector: 'Healthcare', marketCapCategory: 'Small Cap' },
    { symbol: 'METROPOLIS.NS', name: 'Metropolis Healthcare', sector: 'Healthcare', marketCapCategory: 'Small Cap' },
    { symbol: 'THYROCARE.NS', name: 'Thyrocare Technologies', sector: 'Healthcare', marketCapCategory: 'Small Cap' },
    { symbol: 'AAVAS.NS', name: 'Aavas Financiers', sector: 'Financial Services', marketCapCategory: 'Small Cap' },
    { symbol: 'HOMEFIRST.NS', name: 'Home First Finance Company', sector: 'Financial Services', marketCapCategory: 'Small Cap' },
    { symbol: 'CREDITACC.NS', name: 'CreditAccess Grameen', sector: 'Financial Services', marketCapCategory: 'Small Cap' },
    { symbol: 'UJJIVAN.NS', name: 'Ujjivan Small Finance Bank', sector: 'Banking', marketCapCategory: 'Small Cap' },
    { symbol: 'EQUITAS.NS', name: 'Equitas Small Finance Bank', sector: 'Banking', marketCapCategory: 'Small Cap' },
    { symbol: 'VGUARD.NS', name: 'V-Guard Industries', sector: 'Consumer Goods', marketCapCategory: 'Small Cap' },
    { symbol: 'CROMPTON.NS', name: 'Crompton Greaves Consumer', sector: 'Consumer Goods', marketCapCategory: 'Small Cap' },
    { symbol: 'ORIENTELEC.NS', name: 'Orient Electric', sector: 'Consumer Goods', marketCapCategory: 'Small Cap' },
    { symbol: 'SYMPHONY.NS', name: 'Symphony Limited', sector: 'Consumer Goods', marketCapCategory: 'Small Cap' },
    { symbol: 'BATAINDIA.NS', name: 'Bata India', sector: 'Consumer Goods', marketCapCategory: 'Small Cap' },
    { symbol: 'RELAXO.NS', name: 'Relaxo Footwears', sector: 'Consumer Goods', marketCapCategory: 'Small Cap' },
];

/**
 * Get all unique sectors from stock database
 */
export const getAllSectors = (): string[] => {
    const sectors = new Set(NSE_STOCKS.map(stock => stock.sector));
    return Array.from(sectors).sort();
};

/**
 * Get all market cap categories
 */
export const getMarketCapCategories = (): string[] => {
    return ['Large Cap', 'Mid Cap', 'Small Cap'];
};

/**
 * Search stocks by name or symbol
 */
export const searchStocks = (query: string): StockInfo[] => {
    const lowerQuery = query.toLowerCase();
    return NSE_STOCKS.filter(stock =>
        stock.name.toLowerCase().includes(lowerQuery) ||
        stock.symbol.toLowerCase().includes(lowerQuery)
    );
};

/**
 * Filter stocks by criteria
 */
export const filterStocks = (
    sector?: string,
    marketCap?: string
): StockInfo[] => {
    let filtered = NSE_STOCKS;
    
    if (sector) {
        filtered = filtered.filter(stock => stock.sector === sector);
    }
    
    if (marketCap) {
        filtered = filtered.filter(stock => stock.marketCapCategory === marketCap);
    }
    
    return filtered;
};

/**
 * NOTE: For production with 5000+ stocks
 * ======================================
 * 
 * 1. Backend Integration:
 *    - Create API endpoint: GET /api/stocks
 *    - Support pagination: ?page=1&limit=100
 *    - Support filters: ?sector=Banking&marketCap=Large%20Cap
 *    - Support search: ?query=HDFC
 * 
 * 2. Frontend Optimizations:
 *    - Implement virtual scrolling (react-window / react-virtual)
 *    - Lazy load stock data as user scrolls
 *    - Cache stock lists in localStorage/IndexedDB
 *    - Debounce search queries
 * 
 * 3. Database Schema:
 *    CREATE TABLE stocks (
 *        id INT PRIMARY KEY,
 *        symbol VARCHAR(20) UNIQUE,
 *        name VARCHAR(200),
 *        sector VARCHAR(50),
 *        market_cap_category ENUM('Large Cap', 'Mid Cap', 'Small Cap'),
 *        last_updated TIMESTAMP
 *    );
 * 
 * 4. Performance:
 *    - Index on symbol, name, sector for fast filtering
 *    - Use Redis for caching popular queries
 *    - Implement CDN for stock logos/images
 */







