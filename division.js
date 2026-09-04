/* =========================================================
   AGILITY UNITED
   DIVISION SYSTEM
========================================================= */


/* =========================================================
   GOOGLE SHEETS
========================================================= */

const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ93uw-1XWwiTKhTOrOPjlBEcxBkFLT_Ol1XYVEggT2ir1Z76HcoLtC15nm_eD_w8R8bWDO8yiOFrDQ/pub?output=csv";


/* =========================================================
   CONTAINER
========================================================= */

const divisionContainer =
    document.getElementById(
        "divisions-container"
    );


/* =========================================================
   DIVISION LOGOS
=========================================================

   Upload logo ke folder:

   assets/

   dengan nama:

   division-01.png
   division-02.png
   division-03.png
   division-04.png
   dst.

========================================================= */

const DIVISION_LOGOS = {

    "01": "assets/division-01.png",

    "02": "assets/division-02.png",

    "03": "assets/division-03.png",

    "04": "assets/division-04.png",

    "05": "assets/division-05.png",

    "06": "assets/division-06.png",

    "07": "assets/division-07.png",

    "08": "assets/division-08.png",

    "09": "assets/division-09.png",

    "10": "assets/division-10.png"

};


/* =========================================================
   LOAD GOOGLE SHEETS
========================================================= */

async function loadDivisions() {

    if (!divisionContainer) {

        console.error(
            "divisions-container tidak ditemukan."
        );

        return;

    }


    try {

        const response =
            await fetch(
                SHEET_URL
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const csv =
            await response.text();


        console.log(
            "GOOGLE SHEETS RAW DATA:"
        );

        console.log(csv);


        const rows =
            parseCSV(csv);


        if (
            !rows ||
            rows.length < 2
        ) {

            showError(
                "Google Sheets tidak memiliki data member."
            );

            return;

        }


        /* =================================================
           HEADER
        ================================================= */

        const headers =
            rows[0].map(
                header =>
                    normalizeHeader(header)
            );


        console.log(
            "SHEET HEADERS:",
            headers
        );


        /* =================================================
           FIND COLUMNS
        ================================================= */

        const nicknameColumn =
            findColumn(
                headers,
                [
                    "nickname",
                    "name"
                ]
            );


        const idColumn =
            findColumn(
                headers,
                [
                    "id",
                    "gameid",
                    "game id"
                ]
            );


        const divisionColumn =
            findColumn(
                headers,
                [
                    "division"
                ]
            );


        const roleColumn =
            findColumn(
                headers,
                [
                    "role",
                    "position"
                ]
            );


        /*
         * OPTIONAL
         *
         * Jika kamu menambahkan kolom Leader,
         * kode otomatis membacanya.
         */

        const leaderColumn =
            findColumn(
                headers,
                [
                    "leader",
                    "ketua",
                    "division leader"
                ]
            );


        console.log(
            "NICKNAME COLUMN:",
            nicknameColumn
        );

        console.log(
            "ID COLUMN:",
            idColumn
        );

        console.log(
            "DIVISION COLUMN:",
            divisionColumn
        );

        console.log(
            "ROLE COLUMN:",
            roleColumn
        );

        console.log(
            "LEADER COLUMN:",
            leaderColumn
        );


        /* =================================================
           VALIDATE DIVISION
        ================================================= */

        if (!divisionColumn) {

            showError(
                "Kolom Division tidak ditemukan."
            );

            return;

        }


        /* =================================================
           CONVERT DATA
        ================================================= */

        const members =
            rows
                .slice(1)
                .map(
                    row => {

                        return {

                            nickname:
                                getValue(
                                    row,
                                    headers,
                                    nicknameColumn
                                ),

                            id:
                                getValue(
                                    row,
                                    headers,
                                    idColumn
                                ),

                            division:
                                getValue(
                                    row,
                                    headers,
                                    divisionColumn
                                ),

                            role:
                                getValue(
                                    row,
                                    headers,
                                    roleColumn
                                ),

                            leader:
                                getValue(
                                    row,
                                    headers,
                                    leaderColumn
                                )

                        };

                    }
                )
                .filter(
                    member =>
                        member.nickname ||
                        member.id ||
                        member.division
                );


        console.log(
            "MEMBERS:",
            members
        );


        if (
            members.length === 0
        ) {

            showError(
                "Tidak ada data member."
            );

            return;

        }


        /* =================================================
           RENDER
        ================================================= */

        renderDivisions(
            members
        );

    }

    catch (error) {

        console.error(
            "DIVISION ERROR:",
            error
        );


        showError(
            "Data Google Sheets tidak dapat dimuat."
        );

    }

}


/* =========================================================
   NORMALIZE HEADER
========================================================= */

function normalizeHeader(
    value
) {

    return String(
        value || ""
    )
        .trim()
        .toLowerCase()
        .replace(
            /\s+/g,
            " "
        );

}


/* =========================================================
   FIND COLUMN
========================================================= */

function findColumn(
    headers,
    names
) {

    return headers.find(
        header =>
            names.includes(
                header
            )
    ) || null;

}


/* =========================================================
   GET VALUE
========================================================= */

function getValue(
    row,
    headers,
    column
) {

    if (!column) {

        return "";

    }


    const index =
        headers.indexOf(
            column
        );


    if (
        index === -1
    ) {

        return "";

    }


    return String(
        row[index] || ""
    ).trim();

}


/* =========================================================
   NORMALIZE DIVISION
========================================================= */

function normalizeDivision(value) {

    if (!value) {
        return "";
    }

    return String(value)
        .trim()
        .replace(/\s+/g, " ");
}


/* =========================================================
   FORMAT DIVISION
========================================================= */

function formatDivision(
    value
) {

    const number =
        normalizeDivision(
            value
        );


    if (!number) {

        return "";

    }


    return String(
        number
    ).padStart(
        2,
        "0"
    );

}


/* =========================================================
   RENDER ALL DIVISIONS
========================================================= */

function renderDivisions(
    members
) {

    divisionContainer.innerHTML =
        "";


    const divisions =
        {};


    /* =====================================================
       GROUP
    ===================================================== */

    members.forEach(
        member => {

            const division =
                normalizeDivision(
                    member.division
                );


            if (!division) {

                return;

            }


            if (
                !divisions[division]
            ) {

                divisions[division] =
                    [];

            }


            divisions[division].push(
                member
            );

        }
    );


    /* =====================================================
       SORT
    ===================================================== */

    const divisionNumbers =
        Object.keys(
            divisions
        ).sort(
            (a, b) =>
                Number(a) -
                Number(b)
        );


    /* =====================================================
       NO DATA
    ===================================================== */

    if (
        divisionNumbers.length === 0
    ) {

        showError(
            "Tidak ditemukan Division yang valid."
        );

        return;

    }


    /* =====================================================
       CREATE CARDS
    ===================================================== */

    divisionNumbers.forEach(
        divisionNumber => {

            createDivisionCard(
                divisionNumber,
                divisions[
                    divisionNumber
                ]
            );

        }
    );

}


/* =========================================================
   FIND LEADER
========================================================= */

function findLeader(
    members
) {

    /*
     * PRIORITY:
     *
     * 1. Leader = YES
     * 2. Leader = TRUE
     * 3. Leader = 1
     * 4. Leader = Y
     * 5. Leader = KETUA
     * 6. MEMBER PERTAMA
     *
     * Karena Role kamu hanya:
     *
     * CB
     * ST
     * CM
     * WF
     * GK
     *
     * kita TIDAK memakai Role untuk
     * menentukan ketua.
     */


    const leader =
        members.find(
            member => {

                const value =
                    String(
                        member.leader ||
                        ""
                    )
                        .trim()
                        .toLowerCase();


                return (

                    value === "yes" ||

                    value === "true" ||

                    value === "1" ||

                    value === "y" ||

                    value === "ketua" ||

                    value === "leader"

                );

            }
        );


    /*
     * Jika belum ada kolom Leader,
     * member pertama menjadi ketua.
     */

    return (
        leader ||
        members[0] ||
        {}
    );

}


/* =========================================================
   CREATE DIVISION CARD
========================================================= */

function createDivisionCard(
    divisionNumber,
    members
) {

    const formatted =
        String(
            divisionNumber
        ).padStart(
            2,
            "0"
        );


    const leader =
        findLeader(
            members
        );


    const logo =
        DIVISION_LOGOS[
            formatted
        ] ||
        "";


    const card =
        document.createElement(
            "article"
        );


    card.className =
        "division-card";


    /* =====================================================
       CARD HTML
    ===================================================== */

    card.innerHTML = `

        <!-- =========================================
             HEADER
        ========================================== -->

        <button
            class="division-header"
            type="button"
            aria-expanded="false"
        >

            <div class="division-header-left">


                <!-- LOGO -->

                <div class="division-logo">

                    ${
                        logo
                            ? `
                                <img
                                    src="${logo}"
                                    alt="Division ${formatted} Logo"
                                    onerror="
                                        this.style.display='none';
                                        this.nextElementSibling.style.display='flex';
                                    "
                                >

                                <i
                                    class="fa-solid fa-shield-halved"
                                    style="display:none;"
                                ></i>
                            `
                            : `
                                <i class="fa-solid fa-shield-halved"></i>
                            `
                    }

                </div>


                <!-- INFO -->

                <div class="division-info">

                    <span class="division-number">

                        DIVISION ${formatted}

                    </span>


                    <h3 class="division-name">

                        ${escapeHTML(
                           members[0].division ||
                           "UNKNOWN DIVISION"
                        )}
                    </h3>



                    <p class="division-description">

                        ${members.length}
                        ${members.length === 1 ? "MEMBER" : "MEMBERS"}

                    </p>

                </div>

            </div>



            <!-- RIGHT -->

            <div class="division-header-right">


                <span class="division-member-count">

                    <i class="fa-solid fa-users"></i>

                    ${members.length}

                    ${
                        members.length === 1
                            ? "MEMBER"
                            : "MEMBERS"
                    }

                </span>


                <span class="division-arrow">

                    <i class="fa-solid fa-chevron-down"></i>

                </span>

            </div>

        </button>



        <!-- =========================================
             LEADER
        ========================================== -->

        <div class="division-leader-section">


            <div class="division-leader-heading">

                <i class="fa-solid fa-crown"></i>

                <span>
                    KETUA DIVISI
                </span>

            </div>


            <div class="division-leader-card">


                <div class="division-leader-avatar">

                    <i class="fa-solid fa-user"></i>

                </div>


                <div class="division-leader-info">

                    <span>
                        DIVISION LEADER
                    </span>


                    <h4>

                        ${escapeHTML(
                            leader.nickname ||
                            "BELUM ADA DATA"
                        )}

                    </h4>


                    <p>

                        ID:
                        ${escapeHTML(
                            leader.id ||
                            "-"
                        )}

                    </p>

                </div>


                <div class="division-leader-role">

                    ${escapeHTML(
                        leader.role ||
                        "-"
                    )}

                </div>

            </div>

        </div>



        <!-- =========================================
             MEMBERS
        ========================================== -->

        <div class="division-members">


            <div class="members-panel-top">

                <div class="members-panel-title">

                    <i class="fa-solid fa-users"></i>

                    TEAM MEMBERS

                </div>

            </div>


            <div class="members-table-wrapper">

                <table class="members-table">

                    <thead>

                        <tr>

                            <th>
                                #
                            </th>

                            <th>
                                NICKNAME
                            </th>

                            <th>
                                GAME ID
                            </th>

                            <th>
                                ROLE
                            </th>

                            <th>
                                STATUS
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${createMemberRows(
                            members,
                            leader
                        )}

                    </tbody>

                </table>

            </div>

        </div>

    `;


    /* =====================================================
       CLICK
    ===================================================== */

    const header =
        card.querySelector(
            ".division-header"
        );


    header.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            const isOpen =
                card.classList.toggle(
                    "open"
                );


            header.setAttribute(
                "aria-expanded",
                isOpen
            );

        }
    );


    /* =====================================================
       APPEND
    ===================================================== */

    divisionContainer.appendChild(
        card
    );

}


/* =========================================================
   CREATE MEMBER ROWS
========================================================= */

function createMemberRows(
    members,
    leader
) {

    return members
        .map(
            (member, index) => {

                const isLeader =
                    member === leader;


                return `

                    <tr>

                        <td class="member-index">

                            ${String(
                                index + 1
                            ).padStart(
                                2,
                                "0"
                            )}

                        </td>


                        <td class="member-nickname">

                            <div class="member-name-cell">

                                <div class="member-photo-placeholder">

                                    <i class="fa-solid fa-user"></i>

                                </div>


                                <span>

                                    ${escapeHTML(
                                        member.nickname ||
                                        "-"
                                    )}

                                </span>

                            </div>

                        </td>


                        <td class="member-game-id">

                            ${escapeHTML(
                                member.id ||
                                "-"
                            )}

                        </td>


                        <td>

                            <span class="member-role">

                                ${escapeHTML(
                                    member.role ||
                                    "-"
                                )}

                            </span>

                        </td>


                        <td>

                            ${
                                isLeader
                                    ? `
                                        <span class="member-status leader-status">

                                            <i class="fa-solid fa-crown"></i>

                                            KETUA

                                        </span>
                                    `
                                    : `
                                        <span class="member-status">

                                            MEMBER

                                        </span>
                                    `
                            }

                        </td>

                    </tr>

                `;

            }
        )
        .join("");

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
    value
) {

    return String(
        value || ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   CSV PARSER
========================================================= */

function parseCSV(
    text
) {

    const rows = [];

    let row = [];

    let value = "";

    let insideQuotes =
        false;


    for (
        let i = 0;
        i < text.length;
        i++
    ) {

        const char =
            text[i];

        const next =
            text[i + 1];


        /* QUOTES */

        if (
            char === '"' &&
            next === '"'
        ) {

            value += '"';

            i++;

            continue;

        }


        if (
            char === '"'
        ) {

            insideQuotes =
                !insideQuotes;

            continue;

        }


        /* COMMA */

        if (
            char === "," &&
            !insideQuotes
        ) {

            row.push(
                value
            );

            value = "";

            continue;

        }


        /* NEW LINE */

        if (
            (
                char === "\n" ||
                char === "\r"
            ) &&
            !insideQuotes
        ) {

            if (
                char === "\r" &&
                next === "\n"
            ) {

                i++;

            }


            row.push(
                value
            );


            rows.push(
                row
            );


            row = [];

            value = "";

            continue;

        }


        value += char;

    }


    /* LAST ROW */

    if (
        value !== "" ||
        row.length > 0
    ) {

        row.push(
            value
        );


        rows.push(
            row
        );

    }


    return rows
        .filter(
            row =>
                row.some(
                    cell =>
                        String(
                            cell
                        ).trim() !== ""
                )
        )
        .map(
            row =>
                row.map(
                    cell =>
                        String(
                            cell
                        ).trim()
                )
        );

}


/* =========================================================
   ERROR
========================================================= */

function showError(
    message
) {

    divisionContainer.innerHTML = `

        <div class="division-error">

            <i class="fa-solid fa-triangle-exclamation"></i>


            <h3>
                DIVISION DATA ERROR
            </h3>


            <p>
                ${escapeHTML(
                    message
                )}
            </p>


            <small>
                Periksa Google Sheets dan struktur kolomnya.
            </small>

        </div>

    `;

}


/* =========================================================
   START
========================================================= */

loadDivisions();
