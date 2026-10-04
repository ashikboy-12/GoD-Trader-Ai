// ========================================
// GODTRADER AI - LIVE MARKET DATA API
// Vercel Serverless Function
// ========================================

const ALLOWED_MARKETS = [
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

module.exports = async (req, res) => {
    // -------------------------------
    // CORS
    // -------------------------------
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, OPTIONS"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );

    // -------------------------------
    // OPTIONS
    // -------------------------------
    if (req.method === "OPTIONS") {
        return res.status(200).json({
            success: true
        });
    }

    // -------------------------------
    // GET ONLY
    // -------------------------------
    if (req.method !== "GET") {
        return res.status(405).json({
            success: false,
            error: "Method not allowed."
        });
    }

    try {
        // -------------------------------
        // MARKET SYMBOL
        // -------------------------------
        const symbol = String(
            req.query.symbol || ""
        ).trim().toUpperCase();

        if (!symbol) {
            return res.status(400).json({
                success: false,
                error: "Market symbol is required."
            });
        }

        // -------------------------------
        // CHECK MARKET
        // -------------------------------
        if (!ALLOWED_MARKETS.includes(symbol)) {
            return res.status(400).json({
                success: false,
                error: "Unsupported market."
            });
        }

        // -------------------------------
        // API KEY
        // -------------------------------
        const apiKey =
            process.env.TWELVE_DATA_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                success: false,
                error: "Twelve Data API key is not configured."
            });
        }

        // -------------------------------
        // TWELVE DATA URL
        // -------------------------------
        const url =
            "https://api.twelvedata.com/time_series" +
            "?symbol=" +
            encodeURIComponent(symbol) +
            "&interval=1min" +
            "&outputsize=100" +
            "&timezone=UTC" +
            "&apikey=" +
            encodeURIComponent(apiKey);

        // -------------------------------
        // REQUEST TWELVE DATA
        // -------------------------------
        const response = await fetch(url);

        if (!response.ok) {
            return res.status(502).json({
                success: false,
                error: "Market data provider request failed."
            });
        }

        const data = await response.json();

        // -------------------------------
        // PROVIDER ERROR
        // -------------------------------
        if (
            data &&
            (
                data.status === "error" ||
                data.code
            )
        ) {
            return res.status(502).json({
                success: false,
                error:
                    data.message ||
                    "Twelve Data returned an error."
            });
        }

        // -------------------------------
        // CHECK CANDLES
        // -------------------------------
        if (
            !data ||
            !Array.isArray(data.values)
        ) {
            return res.status(502).json({
                success: false,
                error: "No valid candle data received."
            });
        }

        // -------------------------------
        // NORMALIZE CANDLES
        // -------------------------------
        const candles = data.values
            .map(candle => ({
                datetime: candle.datetime,
                open: Number(candle.open),
                high: Number(candle.high),
                low: Number(candle.low),
                close: Number(candle.close),
                volume:
                    candle.volume !== undefined &&
                    candle.volume !== null &&
                    candle.volume !== ""
                        ? Number(candle.volume)
                        : null
            }))
            .filter(candle =>
                candle.datetime &&
                Number.isFinite(candle.open) &&
                Number.isFinite(candle.high) &&
                Number.isFinite(candle.low) &&
                Number.isFinite(candle.close)
            );

        // -------------------------------
        // NOT ENOUGH DATA
        // -------------------------------
        if (candles.length < 2) {
            return res.status(502).json({
                success: false,
                error: "Not enough candle data."
            });
        }

        // -------------------------------
        // SUCCESS
        // -------------------------------
        return res.status(200).json({
            success: true,
            market: symbol,
            marketType: "REAL",
            timeframe: "1m",
            candles: candles,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error(
            "GodTrader market-data error:",
            error
        );

        return res.status(500).json({
            success: false,
            error: "Internal market data error."
        });
    }
};