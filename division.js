/* =========================================================
   AGILITY UNITED - DIVISIONS
   Google Sheets → Division Cards → Expand Members
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
    document.getElementById("divisions-container");


/* =========================================================
   LOAD GOOGLE SHEETS
========================================================= */

async function loadDivisions() {

    if (!divisionContainer) {
        console.error(
            "Element #divisions-container tidak ditemukan."
        );

        return;
    }

    try {

        const response = await fetch(SHEET_URL);

        if (!response.ok) {
            throw new Error(
                `HTTP Error ${response.status}`
            );
        }

        const csv = await response.text();

        console.log("Google Sheets CSV:");
        console.log(csv);

        const rows = parseCSV(csv);

        if (!rows || rows.length < 2) {

            divisionContainer.innerHTML = `
                <div class="division-error">
                    <i class="fa-solid fa-database"></i>

                    <h3>DIVISION DATA NOT FOUND</h3>

                    <p>
                        Google Sheets tidak memiliki
                        data member.
                    </p>
                </div>
            `;

            return;
        }


        /* =================================================
           HEADER
        ================================================= */

        const headers = rows[0].map(header =>
            header.trim()
        );

        console.log("Headers:", headers);


        /* =================================================
           VALIDATE HEADER
        ================================================= */

        const nicknameColumn =
            findColumn(headers, [
                "Nickname",
                "nickname",
                "Name",
                "name"
            ]);

        const idColumn =
            findColumn(headers, [
                "ID",
                "id",
                "Game ID",
                "game id",
                "GameID",
                "gameid"
            ]);

        const divisionColumn =
            findColumn(headers, [
                "Division",
                "division"
            ]);

        const roleColumn =
            findColumn(headers, [
                "Role",
                "role",
                "Position",
                "position"
            ]);


        if (!divisionColumn) {

            divisionContainer.innerHTML = `
                <div class="division-error">

                    <i class="fa-solid fa-database"></i>

                    <h3>DIVISION DATA NOT FOUND</h3>

                    <p>
                        Google Sheets belum memiliki
                        kolom <strong>Division</strong>.
                    </p>

                    <small>
                        Pastikan nama kolom adalah:
                        Division
                    </small>

                </div>
            `;

            console.error(
                "Kolom Division tidak ditemukan."
            );

            return;
        }


        /* =================================================
           CONVERT ROW → MEMBER OBJECT
        ================================================= */

        const members = rows
            .slice(1)
            .map(row => {

                return {

                    nickname:
                        nicknameColumn
                            ? getValue(
                                row,
                                headers,
                                nicknameColumn
                            )
                            : "",

                    id:
                        idColumn
                            ? getValue(
                                row,
                                headers,
                                idColumn
                            )
                            : "",

                    division:
                        getValue(
                            row,
                            headers,
                            divisionColumn
                        ),

                    role:
                        roleColumn
                            ? getValue(
                                row,
                                headers,
                                roleColumn
                            )
                            : ""

                };

            })
            .filter(member =>
                member.division !== ""
            );


        console.log(
            "Members:",
            members
        );


        if (members.length === 0) {

            divisionContainer.innerHTML = `
                <div class="division-error">

                    <i class="fa-solid fa-users-slash"></i>

                    <h3>NO DIVISION MEMBERS</h3>

                    <p>
                        Tidak ada member yang memiliki
                        data Division.
                    </p>

                </div>
            `;

            return;
        }


        /* =================================================
           RENDER
        ================================================= */

        renderDivisions(members);

    }

    catch (error) {

        console.error(
            "Failed to load Google Sheet:",
            error
        );

        divisionContainer.innerHTML = `

            <div class="division-error">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <h3>FAILED TO LOAD DATA</h3>

                <p>
                    Data Google Sheets tidak dapat
                    dimuat.
                </p>

                <small>
                    Periksa link Google Sheets
                    dan koneksi internet.
                </small>

            </div>

        `;

    }

}


/* =========================================================
   FIND COLUMN
========================================================= */

function findColumn(headers, possibleNames) {

    return headers.find(header =>
        possibleNames.some(name =>
            header.toLowerCase() ===
            name.toLowerCase()
        )
    );

}


/* =========================================================
   GET VALUE
========================================================= */

function getValue(row, headers, columnName) {

    const index =
        headers.findIndex(header =>
            header.toLowerCase() ===
            columnName.toLowerCase()
        );

    if (index === -1) {
        return "";
    }

    return (
        row[index] ||
        ""
    ).trim();

}


/* =========================================================
   RENDER DIVISIONS
========================================================= */

function renderDivisions(members) {

    divisionContainer.innerHTML = "";


    /* =====================================================
       GROUP MEMBER BERDASARKAN DIVISION
    ===================================================== */

    const divisions = {};


    members.forEach(member => {

        /*
         * Contoh:
         *
         * "01" → 1
         * "1"  → 1
         * "02" → 2
         * "2"  → 2
         *
         * Jadi "01" dan "1" dianggap
         * sebagai division yang sama.
         */

        const divisionNumber =
            normalizeDivision(
                member.division
            );


        if (!divisionNumber) {
            return;
        }


        if (!divisions[divisionNumber]) {

            divisions[divisionNumber] = [];

        }


        divisions[divisionNumber].push(
            member
        );

    });


    /* =====================================================
       SORT DIVISION
    ===================================================== */

    Object.keys(divisions)
        .sort(
            (a, b) =>
                Number(a) - Number(b)
        )
        .forEach(divisionNumber => {

            const divisionMembers =
                divisions[divisionNumber];


            createDivisionCard(
                divisionNumber,
                divisionMembers
            );

        });


    /* =====================================================
       JIKA TIDAK ADA DIVISION
    ===================================================== */

    if (
        Object.keys(divisions).length === 0
    ) {

        divisionContainer.innerHTML = `

            <div class="division-error">

                <i class="fa-solid fa-database"></i>

                <h3>DIVISION DATA NOT FOUND</h3>

                <p>
                    Tidak ditemukan division
                    yang valid.
                </p>

            </div>

        `;

    }

}


/* =========================================================
   NORMALIZE DIVISION
========================================================= */

function normalizeDivision(value) {

    if (!value) {
        return "";
    }


    /*
     * Mengambil angka dari:
     *
     * 01
     * 1
     * Division 01
     * division 1
     */

    const match =
        String(value).match(/\d+/);


    if (!match) {
        return "";
    }


    return String(
        parseInt(
            match[0],
            10
        )
    );

}


/* =========================================================
   CREATE DIVISION CARD
========================================================= */

function createDivisionCard(
    divisionNumber,
    members
) {


    /* =====================================================
       CARI KETUA DIVISI
    ===================================================== */

    const leader =
        findLeader(members);


    /* =====================================================
       CARD
    ===================================================== */

    const card =
        document.createElement("div");

    card.className =
        "division-card";


    /* =====================================================
       FORMAT DIVISION
    ===================================================== */

    const formattedDivision =
        String(
            divisionNumber
        ).padStart(2, "0");


    /* =====================================================
       CARD HTML
    ===================================================== */

    card.innerHTML = `

        <!-- =========================================
             DIVISION HEADER
        ========================================== -->

        <div class="division-header">

            <div class="division-title">

                <span class="division-number">

                    DIVISION ${formattedDivision}

                </span>

                <h3>

                    AGILITY UNITED
                    ${formattedDivision}

                </h3>

            </div>


            <div class="division-icon">

                <i class="fa-solid fa-users"></i>

            </div>

        </div>


        <!-- =========================================
             LEADER
        ========================================== -->

        <div class="division-leader">

            <div class="division-leader-title">

                <i class="fa-solid fa-crown"></i>

                KETUA DIVISI

            </div>


            <div class="leader-profile">

                <div class="leader-avatar">

                    <i class="fa-solid fa-user"></i>

                </div>


                <div class="leader-details">

                    <h4>

                        ${
                            escapeHTML(
                                leader.nickname ||
                                "UNKNOWN"
                            )
                        }

                    </h4>


                    <span>

                        ID :

                        <strong>

                            ${
                                escapeHTML(
                                    leader.id ||
                                    "-"
                                )
                            }

                        </strong>

                    </span>

                </div>


                <div class="role-badge">

                    ${
                        escapeHTML(
                            leader.role ||
                            "LEADER"
                        )
                    }

                </div>

            </div>

        </div>


        <!-- =========================================
             MEMBER COUNT
        ========================================== -->

        <div class="division-member-count">

            <i class="fa-solid fa-users"></i>

            ${members.length} MEMBERS

            <span class="expand-text">

                CLICK TO VIEW

            </span>

        </div>


        <!-- =========================================
             MEMBERS
        ========================================== -->

        <div class="division-members">

            <div class="members-title">

                <i class="fa-solid fa-users"></i>

                TEAM MEMBERS

            </div>


            <div class="members-list">

                ${
                    createMemberList(
                        members,
                        leader
                    )
                }

            </div>

        </div>


        <!-- =========================================
             ARROW
        ========================================== -->

        <div class="division-expand-icon">

            <i class="fa-solid fa-chevron-down"></i>

        </div>

    `;


    /* =====================================================
       CLICK CARD
    ===================================================== */

    card.addEventListener(
        "click",
        () => {

            card.classList.toggle(
                "expanded"
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
   FIND LEADER
========================================================= */

function findLeader(members) {

    /*
     * Prioritas pencarian:
     *
     * 1. Role = Leader
     * 2. Role = Ketua
     * 3. Role = Ketua Divisi
     * 4. Position = Leader
     * 5. Member pertama
     */


    const leader =
        members.find(member => {

            const role =
                member.role
                    .toLowerCase()
                    .trim();


            return (

                role === "leader" ||

                role === "ketua" ||

                role === "ketua divisi" ||

                role.includes("leader") ||

                role.includes("ketua")

            );

        });


    return (
        leader ||
        members[0] ||
        {}
    );

}


/* =========================================================
   CREATE MEMBER LIST
========================================================= */

function createMemberList(
    members,
    leader
) {

    return members
        .map(member => {

            const isLeader =
                member === leader;


            return `

                <div class="member-row">

                    <div class="member-avatar">

                        <i class="fa-solid fa-user"></i>

                    </div>


                    <div class="member-data">

                        <strong>

                            ${
                                escapeHTML(
                                    member.nickname ||
                                    "-"
                                )
                            }

                        </strong>


                        <span>

                            ID :

                            ${
                                escapeHTML(
                                    member.id ||
                                    "-"
                                )
                            }

                        </span>

                    </div>


                    <div class="member-role">

                        ${
                            isLeader
                                ? "LEADER"
                                : escapeHTML(
                                    member.role ||
                                    "MEMBER"
                                )
                        }

                    </div>

                </div>

            `;

        })
        .join("");

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value)
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

function parseCSV(text) {

    /*
     * Parser sederhana yang tetap bisa menangani
     * koma di dalam tanda kutip.
     */

    const rows = [];

    let row = [];

    let value = "";

    let insideQuotes = false;


    for (
        let i = 0;
        i < text.length;
        i++
    ) {

        const char =
            text[i];


        const nextChar =
            text[i + 1];


        /* =============================================
           QUOTE
        ============================================== */

        if (
            char === '"' &&
            nextChar === '"'
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


        /* =============================================
           COMMA
        ============================================== */

        if (
            char === "," &&
            !insideQuotes
        ) {

            row.push(value);

            value = "";

            continue;

        }


        /* =============================================
           NEW LINE
        ============================================== */

        if (
            (
                char === "\n" ||
                char === "\r"
            ) &&
            !insideQuotes
        ) {

            if (
                char === "\r" &&
                nextChar === "\n"
            ) {

                i++;

            }


            row.push(value);

            rows.push(row);

            row = [];

            value = "";

            continue;

        }


        value += char;

    }


    /* =============================================
       LAST ROW
    ============================================== */

    if (
        value !== "" ||
        row.length > 0
    ) {

        row.push(value);

        rows.push(row);

    }


    return rows
        .filter(row =>
            row.some(cell =>
                cell.trim() !== ""
            )
        )
        .map(row =>
            row.map(cell =>
                cell.trim()
            )
        );

}


/* =========================================================
   START
========================================================= */

loadDivisions();
