async function analyzeProcess() {

    const processName =
        document.getElementById("processName").value;

    const stepsText =
        document.getElementById("steps").value;

    const steps = stepsText
        .split("\n")
        .filter(step => step.trim() !== "");


    try {

        const response = await fetch(
            "http://127.0.0.1:5000/analyze",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    process_name: processName,
                    steps: steps
                })
            }
        );


        if (!response.ok) {
            throw new Error("Backend analysis failed");
        }


        const data = await response.json();

        const score = data.friction_score;


        // =============================
        // RISK LEVEL
        // =============================

        let scoreLevel;
        let scoreClass;

        if (score >= 70) {

            scoreLevel = "HIGH";
            scoreClass = "high";

        }
        else if (score >= 40) {

            scoreLevel = "MEDIUM";
            scoreClass = "medium";

        }
        else {

            scoreLevel = "LOW";
            scoreClass = "low";
        }


        // =============================
        // SUMMARY VALUES
        // =============================

        const totalFriction =
            data.friction_points.length;

        const highCount =
            data.friction_points.filter(
                point =>
                    point.severity.toLowerCase() === "high"
            ).length;

        const mediumCount =
            data.friction_points.filter(
                point =>
                    point.severity.toLowerCase() === "medium"
            ).length;

        const lowCount =
            data.friction_points.filter(
                point =>
                    point.severity.toLowerCase() === "low"
            ).length;


        // =============================
        // FRICTION CARDS
        // =============================

        let frictionHTML = "";


        if (data.friction_points.length === 0) {

            frictionHTML = `

                <div class="friction-card low">

                    <p>
                        No obvious friction points detected.
                    </p>

                </div>

            `;

        }
        else {

            frictionHTML = `

                <h3 style="margin-bottom:15px;">
                    Potential Friction Points
                </h3>

            `;


            data.friction_points.forEach(point => {

                const severity =
                    point.severity.toLowerCase();


                frictionHTML += `

                    <div class="friction-card ${severity}">

                        <h4>
                            Friction Point: ${point.step}
                        </h4>


                        <p>

                            <strong>Type:</strong>

                            ${point.type}

                        </p>


                        <p>

                            <strong>Severity:</strong>

                            <span
                                class="severity-badge ${severity}">

                                ${point.severity}

                            </span>

                        </p>


                        <p>

                            <strong>Impact:</strong>

                            <span class="impact-score">

                                ${point.impact}/100

                            </span>

                        </p>


                        <div class="recommendation">

                            <strong>
                                Recommendation
                            </strong>

                            <br>

                            ${point.recommendation}

                        </div>


                    </div>

                `;

            });

        }


        // =============================
        // PROCESS MAP
        // =============================

        let processMapHTML = `

            <div class="process-map">

                <h3>
                    Process Map
                </h3>


                <div class="process-node start-node">

                    START

                </div>

        `;


        steps.forEach(step => {

            const friction =
                data.friction_points.find(
                    point =>
                        point.step === step
                );


            let nodeClass =
                "normal-node";

            let icon = "✓";


            if (friction) {

                if (
                    friction.severity.toLowerCase()
                    === "high"
                ) {

                    nodeClass =
                        "high-node";

                    icon =
                        "[HIGH]";

                }

                else if (
                    friction.severity.toLowerCase()
                    === "medium"
                ) {

                    nodeClass =
                        "medium-node";

                    icon =
                        "[MEDIUM]";

                }

                else {

                    nodeClass =
                        "low-node";

                    icon =
                        "[LOW]";

                }

            }


            processMapHTML += `

                <div class="process-arrow">

                    ↓

                </div>


                <div class="process-node ${nodeClass}">

                    ${icon}

                    <span>

                        ${step}

                    </span>

                </div>

            `;

        });


        processMapHTML += `

                <div class="process-arrow">

                    ↓

                </div>


                <div class="process-node end-node">

                    END

                </div>


            </div>

        `;


        // =============================
        // DISPLAY RESULT
        // =============================

        document.getElementById("result").innerHTML = `


            <div class="result-header">


                <h2>
                    Analysis Result
                </h2>


                <p>

                    <strong>
                        Process:
                    </strong>

                    ${data.process_name}

                </p>


                <!-- SUMMARY DASHBOARD -->

                <div class="summary-dashboard">


                    <div class="summary-card">

                        <div class="summary-title">

                            FRICTION SCORE

                        </div>


                        <div class="summary-value">

                            ${score}%

                        </div>

                    </div>



                    <div class="summary-card">

                        <div class="summary-title">

                            RISK LEVEL

                        </div>


                        <div
                            class="summary-value ${scoreClass}">

                            ${scoreLevel}

                        </div>

                    </div>



                    <div class="summary-card">

                        <div class="summary-title">

                            FRICTION POINTS

                        </div>


                        <div class="summary-value">

                            ${totalFriction}

                        </div>

                    </div>


                </div>


                <!-- SCORE -->

                <p class="score-label">

                    FRICTION SCORE

                </p>


                <div class="score">

                    ${score}%

                </div>


                <div class="score-container">


                    <div class="score-bar">


                        <div

                            class="score-fill score-${scoreClass}"

                            style="width: ${score}%">

                        </div>


                    </div>


                </div>


                <span
                    class="risk-label risk-${scoreClass}">

                    ${scoreLevel} FRICTION

                </span>


                <p style="margin-top:15px;">

                    <strong>
                        Total Steps:
                    </strong>

                    ${data.number_of_steps}

                </p>


            </div>


            ${processMapHTML}


            <!-- SEVERITY SUMMARY -->

            <div class="severity-summary">


                <h3>
                    Severity Summary
                </h3>


                <div class="severity-row">

                    <span>
                        [HIGH] High
                    </span>

                    <strong>
                        ${highCount}
                    </strong>

                </div>


                <div class="severity-row">

                    <span>
                        [MEDIUM] Medium
                    </span>

                    <strong>
                        ${mediumCount}
                    </strong>

                </div>


                <div class="severity-row">

                    <span>
                        [LOW] Low
                    </span>

                    <strong>
                        ${lowCount}
                    </strong>

                </div>


            </div>


            ${frictionHTML}


        `;


        // =============================
        // SAVE TO EXISTING LOCAL HISTORY
        // =============================

        saveAnalysisHistory(data);


        // =============================
        // LOAD BACKEND HISTORY
        // =============================

        await loadBackendHistory();

    }


    catch (error) {

        console.error(error);


        document.getElementById("result").innerHTML = `

            <div class="friction-card high">

                Could not connect to backend.

            </div>

        `;

    }

}


// =====================================================
// ANALYSIS HISTORY
// =====================================================


function saveAnalysisHistory(data) {


    let history =

        JSON.parse(
            localStorage.getItem(
                "frictionHistory"
            )
        ) || [];


    const record = {

        process_name:
            data.process_name,

        friction_score:
            data.friction_score,

        risk_level:
            data.risk_level,

        friction_points:
            data.friction_points.length,

        date:
            new Date().toLocaleString()

    };


    history.unshift(record);


    // Keep latest 10 analyses

    history =
        history.slice(0, 10);


    localStorage.setItem(

        "frictionHistory",

        JSON.stringify(history)

    );


    displayHistory();

}


// =====================================================
// LOAD HISTORY FROM BACKEND
// =====================================================


async function loadBackendHistory() {

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/history"
        );


        if (!response.ok) {

            throw new Error(
                "Could not load backend history"
            );

        }


        const backendHistory =
            await response.json();


        if (
            !backendHistory ||
            backendHistory.length === 0
        ) {

            displayHistory();

            return;

        }


        // ==========================================
        // DISPLAY BACKEND HISTORY
        // ==========================================

        displayBackendHistory(
            backendHistory
        );


    }

    catch (error) {

        console.error(
            "Backend history error:",
            error
        );


        // Backend unavailable:
        // continue showing local history

        displayHistory();

    }

}


// =====================================================
// DISPLAY BACKEND HISTORY
// =====================================================


function displayBackendHistory(history) {


    const historyContainer =
        document.getElementById("history");


    if (!historyContainer) {

        return;

    }


    if (
        !history ||
        history.length === 0
    ) {

        displayHistory();

        return;

    }


    let html = `

        <h2 class="history-title">

            Analysis History

        </h2>

    `;


    history.forEach(item => {


        const risk =
            (item.risk_level || "LOW")
            .toLowerCase();


        const frictionPoints =
            item.friction_points ?? 0;


        html += `

            <div class="history-card">

                <h4>

                    ${item.process_name}

                </h4>


                <div class="history-info">


                    <span
                        class="history-badge history-score">

                        Score:
                        ${item.friction_score}%

                    </span>


                    <span
                        class="history-badge history-${risk}">

                        ${item.risk_level}
                        RISK

                    </span>


                    <span
                        class="history-badge history-score">

                        ${frictionPoints}

                        Friction Points

                    </span>


                </div>


                <p>

                    <small>

                        ${item.created_at || ""}

                    </small>

                </p>


            </div>

        `;

    });


    html += `

        <button

            class="clear-history"

            onclick="clearHistory()">

            Clear History

        </button>

    `;


    historyContainer.innerHTML =
        html;

}


// =====================================================
// DISPLAY LOCAL HISTORY
// =====================================================


function displayHistory() {


    const historyContainer =
        document.getElementById("history");


    if (!historyContainer) {

        return;

    }


    const history =

        JSON.parse(

            localStorage.getItem(
                "frictionHistory"
            )

        ) || [];


    if (history.length === 0) {

        historyContainer.innerHTML = "";

        return;

    }


    let html = `

        <h2 class="history-title">

            Analysis History

        </h2>

    `;


    history.forEach(item => {


        const risk =
            item.risk_level.toLowerCase();


        html += `


            <div class="history-card">


                <h4>

                    ${item.process_name}

                </h4>


                <div class="history-info">


                    <span
                        class="history-badge history-score">

                        Score:
                        ${item.friction_score}%

                    </span>


                    <span
                        class="history-badge history-${risk}">

                        ${item.risk_level}
                        RISK

                    </span>


                    <span
                        class="history-badge history-score">

                        ${item.friction_points}

                        Friction Points

                    </span>


                </div>


                <p>

                    <small>

                        ${item.date}

                    </small>

                </p>


            </div>


        `;

    });


    html += `


        <button

            class="clear-history"

            onclick="clearHistory()">

            Clear History

        </button>


    `;


    historyContainer.innerHTML =
        html;

}


// =====================================================
// CLEAR HISTORY
// =====================================================


async function clearHistory() {


    // ==========================================
    // CLEAR LOCAL HISTORY
    // ==========================================

    localStorage.removeItem(
        "frictionHistory"
    );


    displayHistory();


    // ==========================================
    // CLEAR BACKEND HISTORY
    // ==========================================

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/history"
        );


        if (!response.ok) {

            return;

        }


        const backendHistory =
            await response.json();


        for (
            const item of backendHistory
        ) {

            if (item.id) {

                await fetch(

                    `http://127.0.0.1:5000/history/${item.id}`,

                    {
                        method: "DELETE"
                    }

                );

            }

        }


        console.log(
            "Backend history cleared successfully."
        );


        // Refresh display

        displayHistory();

    }

    catch (error) {

        console.error(
            "Could not clear backend history:",
            error
        );

    }

}


// =====================================================
// LOAD HISTORY WHEN PAGE OPENS
// =====================================================


displayHistory();


// Also connect to backend history

loadBackendHistory();