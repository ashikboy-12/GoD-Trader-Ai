// ============================================
// GODTRADER AI — MARKET DATA ENGINE
// ============================================

(function () {

    const CONFIG = window.GODTRADER_CONFIG;

    if (!CONFIG) {
        console.error("GodTrader Config not found.");
        return;
    }

    // ========================================
    // REAL MARKET SYMBOLS
    // ========================================

    const REAL_MARKETS = [
        "EUR/USD",
        "GBP/USD",
        "USD/JPY",
        "AUD/USD",
        "USD/CAD",
        "EUR/GBP",
        "EUR/JPY",
        "GBP/JPY",
        "USD/CHF",
        "NZD/USD"
    ];


    // ========================================
    // SYMBOL VALIDATION
    // ========================================

    function isRealMarket(symbol) {
        return REAL_MARKETS.includes(symbol);
    }


    // ========================================
    // FETCH 1-MINUTE CANDLES
    // ========================================

    async function getCandles(symbol, outputSize = 100) {

        if (!isRealMarket(symbol)) {
            throw new Error(
                "Live data is currently available only for REAL markets."
            );
        }

        const provider = CONFIG.dataProvider;

        if (
            !provider ||
            !provider.enabled ||
            !provider.apiKey ||
            !provider.baseUrl
        ) {
            throw new Error(
                "Market data provider is not configured yet."
            );
        }


        const url =
            provider.baseUrl +
            "/time_series" +
            "?symbol=" + encodeURIComponent(symbol) +
            "&interval=1min" +
            "&outputsize=" + outputSize +
            "&timezone=UTC" +
            "&apikey=" + encodeURIComponent(provider.apiKey);


        const response = await fetch(url, {
            method: "GET",
            cache: "no-store"
        });


        if (!response.ok) {
            throw new Error(
                "Market data request failed: HTTP " +
                response.status
            );
        }


        const data = await response.json();


        if (data.status === "error") {
            throw new Error(
                data.message || "Market data provider returned an error."
            );
        }


        if (!Array.isArray(data.values)) {
            throw new Error(
                "Invalid candle data received."
            );
        }


        const candles = data.values
            .map(normalizeCandle)
            .filter(Boolean)
            .sort(function (a, b) {
                return a.timestamp - b.timestamp;
            });


        if (candles.length < 20) {
            throw new Error(
                "Not enough valid candle data for analysis."
            );
        }


        return candles;
    }


    // ========================================
    // NORMALIZE CANDLE
    // ========================================

    function normalizeCandle(candle) {

        if (!candle) {
            return null;
        }


        const open = Number(candle.open);
        const high = Number(candle.high);
        const low = Number(candle.low);
        const close = Number(candle.close);


        if (
            !Number.isFinite(open) ||
            !Number.isFinite(high) ||
            !Number.isFinite(low) ||
            !Number.isFinite(close)
        ) {
            return null;
        }


        if (
            high < low ||
            high < open ||
            high < close ||
            low > open ||
            low > close
        ) {
            return null;
        }


        const timestamp = Date.parse(
            String(candle.datetime) + " UTC"
        );


        if (!Number.isFinite(timestamp)) {
            return null;
        }


        return {
            timestamp: timestamp,

            datetime: candle.datetime,

            open: open,

            high: high,

            low: low,

            close: close,

            volume: Number.isFinite(Number(candle.volume))
                ? Number(candle.volume)
                : null
        };
    }


    // ========================================
    // GET LATEST CANDLE
    // ========================================

    async function getLatestCandle(symbol) {

        const candles = await getCandles(symbol, 5);

        if (!candles.length) {
            throw new Error(
                "Latest candle is unavailable."
            );
        }

        return candles[candles.length - 1];
    }


    // ========================================
    // MARKET TYPE
    // ========================================

    function getMarketType(symbol) {

        if (
            typeof symbol === "string" &&
            symbol.toUpperCase().includes("OTC")
        ) {
            return "OTC";
        }

        return "REAL";
    }


    // ========================================
    // PUBLIC API
    // ========================================

    window.GodTraderMarketData = {

        getCandles: getCandles,

        getLatestCandle: getLatestCandle,

        getMarketType: getMarketType,

        isRealMarket: isRealMarket

    };


    console.log(
        "GodTrader Market Data Engine loaded."
    );

})();