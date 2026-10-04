// ============================================
// GODTRADER AI — CONFIGURATION
// ============================================

const CONFIG = {

    // =========================
    // APP
    // =========================

    appName: "GodTrader AI",
    version: "1.0.0",

    // =========================
    // MARKET SETTINGS
    // =========================

    candleTimeframe: "1m",

    availableDurations: [
        1,
        10,
        15,
        20,
        30
    ],

    signalWindowSeconds: 5,

    // =========================
    // SIGNAL SETTINGS
    // =========================

    minimumConfidence: 80,

    signals: {
        UP: "UP",
        DOWN: "DOWN",
        NO_TRADE: "NO TRADE"
    },

    // =========================
    // SAFETY
    // =========================

    autoTrading: false,

    paperMode: true,

    allowGuaranteedClaims: false,

    // =========================
    // ANALYSIS
    // =========================

    analysis: {

        trend: true,

        momentum: true,

        supportResistance: true,

        candlestickPatterns: true,

        marketStructure: true,

        breakoutDetection: true,

        retestDetection: true,

        rejectionDetection: true,

        volatilityFilter: true,

        fakeBreakoutFilter: true,

        choppyMarketFilter: true,

        multiConfirmation: true,

        newsFilter: true
    },

    // =========================
    // DATA PROVIDER
    // =========================
    // এখনো কোনো fake API দেওয়া হচ্ছে না.
    // পরে verified provider এখানে connect করা হবে.

    dataProvider: {

        enabled: false,

        providerName: "",

        apiKey: "",

        baseUrl: "",

        interval: "1min"
    },

    // =========================
    // OTC DATA
    // =========================
    // Quotex OTC-এর জন্য সাধারণ forex
    // API data ব্যবহার করে fake price বানানো হবে না.

    otcData: {

        enabled: false,

        source: "",

        verified: false
    },

    // =========================
    // LEARNING SYSTEM
    // =========================

    learning: {

        enabled: true,

        recordSignals: true,

        recordResults: true,

        analyzeLosses: true,

        updateStatistics: true,

        autoChangeStrategy: false
    }

};


// ============================================
// EXPORT
// ============================================

window.GODTRADER_CONFIG = CONFIG;