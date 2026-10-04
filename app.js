(() => {
    "use strict";

    /* =========================
       STATE
    ========================= */

    let selectedMarket = "EUR/USD";
    let selectedMarketType = "REAL";
    let selectedDuration = 1;
    let isAnalyzing = false;


    /* =========================
       MARKETS
    ========================= */

    const realMarkets = [
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

    const otcMarkets = [
        "EUR/USD OTC",
        "GBP/USD OTC",
        "USD/JPY OTC",
        "AUD/USD OTC",
        "USD/CAD OTC",
        "EUR/GBP OTC",
        "EUR/JPY OTC",
        "GBP/JPY OTC",
        "USD/CHF OTC",
        "NZD/USD OTC"
    ];


    /* =========================
       ELEMENTS
    ========================= */

    const loader = document.getElementById("appLoader");

    const marketSelector =
        document.getElementById("marketSelector");

    const selectedMarketEl =
        document.getElementById("selectedMarket");

    const selectedMarketTypeEl =
        document.getElementById("selectedMarketType");

    const selectedDurationEl =
        document.getElementById("selectedDuration");

    const durationButtons =
        document.querySelectorAll(".duration-btn");

    const analyzeButton =
        document.getElementById("analyzeButton");

    const analysisStatus =
        document.getElementById("analysisStatus");

    const signalValue =
        document.getElementById("signalValue");

    const signalDescription =
        document.getElementById("signalDescription");

    const confidenceValue =
        document.getElementById("confidenceValue");

    const confidenceBar =
        document.getElementById("confidenceBar");

    const trendValue =
        document.getElementById("trendValue");

    const momentumValue =
        document.getElementById("momentumValue");

    const volatilityValue =
        document.getElementById("volatilityValue");

    const structureValue =
        document.getElementById("structureValue");

    const countdown =
        document.getElementById("countdown");

    const countdownText =
        document.getElementById("countdownText");


    /* =========================
       LOADER
    ========================= */

    function hideLoader() {
        if (loader) {
            loader.style.display = "none";
        }
    }

    window.addEventListener("load", hideLoader);

    setTimeout(hideLoader, 2500);


    /* =========================
       MARKET MODAL
    ========================= */

    const marketModal =
        document.getElementById("marketModal");

    const closeMarketModal =
        document.getElementById("closeMarketModal");

    const realMarketList =
        document.getElementById("realMarketList");

    const otcMarketList =
        document.getElementById("otcMarketList");


    function openMarketModal() {
        if (marketModal) {
            marketModal.classList.add("active");
        }
    }


    function closeMarket() {
        if (marketModal) {
            marketModal.classList.remove("active");
        }
    }


    if (marketSelector) {
        marketSelector.addEventListener(
            "click",
            openMarketModal
        );
    }


    if (closeMarketModal) {
        closeMarketModal.addEventListener(
            "click",
            closeMarket
        );
    }


    if (marketModal) {
        marketModal.addEventListener(
            "click",
            function (event) {
                if (event.target === marketModal) {
                    closeMarket();
                }
            }
        );
    }


    /* =========================
       MARKET DISPLAY
    ========================= */

    function updateMarket() {

        if (selectedMarketEl) {
            selectedMarketEl.textContent =
                selectedMarket;
        }

        if (selectedMarketTypeEl) {
            selectedMarketTypeEl.textContent =
                selectedMarketType === "REAL"
                    ? "REAL MARKET"
                    : "OTC MARKET";
        }
    }


    function createMarketButton(
        market,
        type
    ) {

        const button =
            document.createElement("button");

        button.type = "button";
        button.className = "market-item";
        button.textContent = market;

        button.addEventListener(
            "click",
            function () {

                selectedMarket = market;
                selectedMarketType = type;

                updateMarket();

                closeMarket();

                resetAnalysis();
            }
        );

        return button;
    }


    function loadMarkets() {

        if (realMarketList) {

            realMarketList.innerHTML = "";

            realMarkets.forEach(
                function (market) {

                    realMarketList.appendChild(
                        createMarketButton(
                            market,
                            "REAL"
                        )
                    );

                }
            );
        }


        if (otcMarketList) {

            otcMarketList.innerHTML = "";

            otcMarkets.forEach(
                function (market) {

                    otcMarketList.appendChild(
                        createMarketButton(
                            market,
                            "OTC"
                        )
                    );

                }
            );
        }
    }


    /* =========================
       DURATION
    ========================= */

    function updateDuration() {

        durationButtons.forEach(
            function (button) {

                const value =
                    Number(
                        button.dataset.duration
                    );

                if (value === selectedDuration) {

                    button.classList.add("active");

                } else {

                    button.classList.remove("active");

                }
            }
        );


        if (selectedDurationEl) {
            selectedDurationEl.textContent =
                selectedDuration;
        }
    }


    durationButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    selectedDuration =
                        Number(
                            button.dataset.duration
                        );

                    updateDuration();

                }
            );

        }
    );


    /* =========================
       RESET
    ========================= */

    function resetAnalysis() {

        if (analysisStatus) {
            analysisStatus.textContent =
                "Ready";
        }

        if (signalValue) {
            signalValue.textContent =
                "NO TRADE";
        }

        if (signalDescription) {
            signalDescription.textContent =
                "Select a market and start analysis.";
        }

        if (confidenceValue) {
            confidenceValue.textContent =
                "0%";
        }

        if (confidenceBar) {
            confidenceBar.style.width = "0%";
        }

        if (trendValue) {
            trendValue.textContent = "--";
        }

        if (momentumValue) {
            momentumValue.textContent = "--";
        }

        if (volatilityValue) {
            volatilityValue.textContent = "--";
        }

        if (structureValue) {
            structureValue.textContent = "--";
        }

        if (countdown) {
            countdown.textContent = "--";
        }

        if (countdownText) {
            countdownText.textContent =
                "Waiting for analysis";
        }
    }


    /* =========================
       ANALYZE
    ========================= */

    async function analyzeMarket() {

        if (isAnalyzing) return;

        if (selectedMarketType !== "REAL") {

            if (analysisStatus) {
                analysisStatus.textContent =
                    "OTC data unavailable";
            }

            if (signalDescription) {
                signalDescription.textContent =
                    "OTC data source is not connected yet.";
            }

            return;
        }


        isAnalyzing = true;

        if (analyzeButton) {
            analyzeButton.disabled = true;
            analyzeButton.textContent =
                "ANALYZING...";
        }

        if (analysisStatus) {
            analysisStatus.textContent =
                "Fetching market data...";
        }


        try {

            const response =
                await fetch(
                    "/api/market-data?symbol=" +
                    encodeURIComponent(
                        selectedMarket
                    )
                );


            if (!response.ok) {
                throw new Error(
                    "Market data unavailable"
                );
            }


            const data =
                await response.json();


            if (
                !data.success ||
                !Array.isArray(data.candles) ||
                data.candles.length < 2
            ) {
                throw new Error(
                    "Invalid market data"
                );
            }


            const candles = data.candles;

            const previous =
                Number(
                    candles[candles.length - 2].close
                );

            const latest =
                Number(
                    candles[candles.length - 1].close
                );


            let signal = "NO TRADE";

            if (latest > previous) {
                signal = "UP";
            }

            if (latest < previous) {
                signal = "DOWN";
            }


            /*
             * Conservative display:
             * one candle alone is NOT enough
             * for a high-confidence trade.
             */

            if (signalValue) {
                signalValue.textContent =
                    signal;
            }

            if (confidenceValue) {
                confidenceValue.textContent =
                    "0%";
            }

            if (confidenceBar) {
                confidenceBar.style.width =
                    "0%";
            }

            if (trendValue) {
                trendValue.textContent =
                    signal === "UP"
                        ? "BULLISH"
                        : signal === "DOWN"
                            ? "BEARISH"
                            : "SIDEWAYS";
            }

            if (momentumValue) {
                momentumValue.textContent =
                    "WAIT";
            }

            if (volatilityValue) {
                volatilityValue.textContent =
                    "CHECKING";
            }

            if (structureValue) {
                structureValue.textContent =
                    "CONFIRMATION NEEDED";
            }

            if (signalDescription) {
                signalDescription.textContent =
                    "Initial direction detected. More confirmation is required.";
            }

            if (analysisStatus) {
                analysisStatus.textContent =
                    "Analysis complete";
            }

        } catch (error) {

            console.error(error);

            if (analysisStatus) {
                analysisStatus.textContent =
                    "Data unavailable";
            }

            if (signalValue) {
                signalValue.textContent =
                    "NO TRADE";
            }

            if (signalDescription) {
                signalDescription.textContent =
                    "Live market data could not be loaded.";
            }

        }


        isAnalyzing = false;

        if (analyzeButton) {
            analyzeButton.disabled = false;
            analyzeButton.textContent =
                "ANALYZE MARKET";
        }
    }


    if (analyzeButton) {
        analyzeButton.addEventListener(
            "click",
            analyzeMarket
        );
    }


    /* =========================
       PRO
    ========================= */

    const proButton =
        document.getElementById("proButton");

    const proCardButton =
        document.getElementById("proCardButton");

    const proModal =
        document.getElementById("proModal");

    const closeProModal =
        document.getElementById("closeProModal");

    const activateProButton =
        document.getElementById(
            "activateProButton"
        );

    const proCodeInput =
        document.getElementById(
            "proCodeInput"
        );

    const proMessage =
        document.getElementById(
            "proMessage"
        );


    function openPro() {

        if (proModal) {
            proModal.classList.add("active");
        }
    }


    function closePro() {

        if (proModal) {
            proModal.classList.remove("active");
        }
    }


    if (proButton) {
        proButton.addEventListener(
            "click",
            openPro
        );
    }


    if (proCardButton) {
        proCardButton.addEventListener(
            "click",
            openPro
        );
    }


    if (closeProModal) {
        closeProModal.addEventListener(
            "click",
            closePro
        );
    }


    if (proModal) {
        proModal.addEventListener(
            "click",
            function (event) {

                if (event.target === proModal) {
                    closePro();
                }

            }
        );
    }


    if (activateProButton) {

        activateProButton.addEventListener(
            "click",
            function () {

                const code =
                    proCodeInput
                        ? proCodeInput.value.trim()
                        : "";


                if (code === "pro123") {

                    if (proMessage) {
                        proMessage.textContent =
                            "PRO activated successfully.";
                    }

                    if (proButton) {
                        proButton.textContent =
                            "PRO ✓";
                    }

                    if (proCardButton) {
                        proCardButton.textContent =
                            "PRO ACTIVE";
                    }

                    setTimeout(
                        closePro,
                        800
                    );

                } else {

                    if (proMessage) {
                        proMessage.textContent =
                            "Invalid activation code.";
                    }

                }
            }
        );
    }


    /* =========================
       START
    ========================= */

    loadMarkets();

    updateMarket();

    updateDuration();

    resetAnalysis();

})();