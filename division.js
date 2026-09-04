/* =====================================================
   AGILITY UNITED
   DIVISION SYSTEM
===================================================== */


/* =====================================================
   GOOGLE SHEETS CONFIGURATION
===================================================== */


/*
    MASUKKAN LINK CSV GOOGLE SHEETS DI SINI.

    Contoh:

    https://docs.google.com/spreadsheets/d/XXXXXXXX/export?format=csv&gid=0

*/

const SHEET_URL =
    "PASTE_YOUR_GOOGLE_SHEET_CSV_LINK_HERE";



/* =====================================================
   DIVISION CONFIGURATION
===================================================== */

const divisions = [

    {
        number: "DIVISION 01",
        name: "AGILITY EVOLUTION",

        logo: "assets/divisions/evolution.png",

        description:
            "Agility Evolution competitive division."

    },

    {
        number: "DIVISION 02",
        name: "AGILITY UNITED 02",

        logo: "assets/divisions/division02.png",

        description:
            "Agility United competitive division."

    },

    {
        number: "DIVISION 03",
        name: "AGILITY UNITED 03",

        logo: "assets/divisions/division03.png",

        description:
            "Agility United competitive division."

    },

    {
        number: "DIVISION 04",
        name: "AGILITY UNITED 04",

        logo: "assets/divisions/division04.png",

        description:
            "Agility United competitive division."

    },

    {
        number: "DIVISION 05",
        name: "AGILITY UNITED 05",

        logo: "assets/divisions/division05.png",

        description:
            "Agility United competitive division."

    },

    {
        number: "DIVISION 06",
        name: "AGILITY UNITED 06",

        logo: "assets/divisions/division06.png",

        description:
            "Agility United competitive division."

    },

    {
        number: "DIVISION 07",
        name: "AGILITY UNITED 07",

        logo: "assets/divisions/division07.png",

        description:
            "Agility United competitive division."

    },

    {
        number: "DIVISION 08",
        name: "AGILITY UNITED 08",

        logo: "assets/divisions/division08.png",

        description:
            "Agility United competitive division."

    }

];



/* =====================================================
   GLOBAL DATA
===================================================== */

let membersData = [];



/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderDivisions();

        loadMembers();

    }
);



/* =====================================================
   RENDER DIVISIONS
===================================================== */

function renderDivisions() {

    const container =
        document.getElementById(
            "division-list"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    divisions.forEach(
        (division, index) => {

            const card =
                createDivisionCard(
                    division,
                    index
                );


            container.appendChild(card);

        }
    );

}



/* =====================================================
   CREATE DIVISION CARD
===================================================== */

function createDivisionCard(
    division,
    index
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "division-card";


    card.dataset.division =
        division.name;


    card.innerHTML = `

        <button
            type="button"
            class="division-header"
            aria-expanded="false"
        >

            <div
                class="division-header-left"
            >

                <div class="division-logo">

                    <img
                        src="${division.logo}"
                        alt="${division.name} Logo"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                    >

                    <i
                        class="fa-solid fa-users"
                        style="display:none;"
                    ></i>

                </div>


                <div class="division-info">

                    <span class="division-number">
                        ${division.number}
                    </span>

                    <h3 class="division-name">
                        ${division.name}
                    </h3>

                    <p class="division-description">
                        ${division.description}
                    </p>

                </div>

            </div>


            <div
                class="division-header-right"
            >

                <span
                    class="division-member-count"
                >

                    <i
                        class="fa-solid fa-users"
                    ></i>

                    <span class="count-value">
                        0 MEMBERS
                    </span>

                </span>


                <span class="division-arrow">

                    <i
                        class="fa-solid fa-chevron-down"
                    ></i>

                </span>

            </div>

        </button>


        <div
            class="division-members"
        >

            <div
                class="members-panel-top"
            >

                <div
                    class="members-panel-title"
                >

                    <i
                        class="fa-solid fa-user-group"
                    ></i>

                    <span>
                        DIVISION MEMBERS
                    </span>

                </div>


                <div
                    class="member-search"
                >

                    <i
                        class="fa-solid fa-magnifying-glass"
                    ></i>

                    <input
                        type="text"
                        placeholder="Search member..."
                        data-search="${index}"
                    >

                </div>

            </div>


            <div
                class="members-table-wrapper"
            >

                <table
                    class="members-table"
                >

                    <thead>

                        <tr>

                            <th>
                                NO
                            </th>

                            <th>
                                MEMBER
                            </th>

                            <th>
                                GAME ID
                            </th>

                            <th>
                                ROLE
                            </th>

                        </tr>

                    </thead>


                    <tbody
                        class="members-body"
                    >

                        <tr>

                            <td
                                colspan="4"
                                style="text-align:center;"
                            >

                                <div
                                    class="division-loading"
                                >

                                    <div
                                        class="loading-spinner"
                                    ></div>

                                    <span>
                                        Loading members...
                                    </span>

                                </div>

                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </div>

    `;


    const header =
        card.querySelector(
            ".division-header"
        );


    const search =
        card.querySelector(
            ".member-search input"
        );


    header.addEventListener(
        "click",
        () => {

            toggleDivision(card);

        }
    );


    search.addEventListener(
        "input",
        () => {

            renderMembers(
                card,
                search.value
            );

        }
    );


    return card;

}



/* =====================================================
   TOGGLE DIVISION
===================================================== */

function toggleDivision(card) {

    const isOpen =
        card.classList.contains(
            "open"
        );


    card.classList.toggle(
        "open"
    );


    const header =
        card.querySelector(
            ".division-header"
        );


    header.setAttribute(
        "aria-expanded",
        !isOpen
    );


    /*
        Kalau dibuka,
        render ulang data member.
    */

    if (!isOpen) {

        renderMembers(card);

    }

}



/* =====================================================
   LOAD GOOGLE SHEETS
===================================================== */

async function loadMembers() {

    const container =
        document.getElementById(
            "division-list"
        );


    /*
        Kalau URL belum diganti
    */

    if (
        !SHEET_URL ||
        SHEET_URL.includes(
            "PASTE_YOUR_GOOGLE"
        )
    ) {

        showSheetWarning();

        return;

    }


    try {

        const response =
            await fetch(
                SHEET_URL
            );


        if (!response.ok) {

            throw new Error(
                "Google Sheets could not be loaded."
            );

        }


        const csv =
            await response.text();


        membersData =
            parseCSV(csv);


        normalizeMembers();


        updateMemberCounts();


        /*
            Render jika ada card
            yang sedang terbuka.
        */

        document
            .querySelectorAll(
                ".division-card.open"
            )
            .forEach(
                card => {

                    renderMembers(card);

                }
            );


    } catch (error) {

        console.error(
            "Google Sheets Error:",
            error
        );


        showSheetError();

    }

}



/* =====================================================
   PARSE CSV
===================================================== */

function parseCSV(csv) {

    const rows = [];

    let row = [];

    let value = "";

    let insideQuotes = false;


    for (
        let i = 0;
        i < csv.length;
        i++
    ) {

        const char =
            csv[i];


        const next =
            csv[i + 1];


        if (
            char === '"' &&
            insideQuotes &&
            next === '"'
        ) {

            value += '"';

            i++;

            continue;

        }


        if (char === '"') {

            insideQuotes =
                !insideQuotes;

            continue;

        }


        if (
            char === "," &&
            !insideQuotes
        ) {

            row.push(
                value.trim()
            );

            value = "";

            continue;

        }


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
                value.trim()
            );

            value = "";


            if (
                row.some(
                    cell =>
                        cell !== ""
                )
            ) {

                rows.push(row);

            }


            row = [];

            continue;

        }


        value += char;

    }


    if (value !== "" || row.length) {

        row.push(
            value.trim()
        );

        rows.push(row);

    }


    if (!rows.length) {

        return [];

    }


    const headers =
        rows[0].map(
            header =>
                header
                    .toLowerCase()
                    .trim()
        );


    return rows
        .slice(1)
        .map(row => {

            const object = {};


            headers.forEach(
                (header, index) => {

                    object[header] =
                        (
                            row[index] ||
                            ""
                        ).trim();

                }
            );


            return object;

        });

}



/* =====================================================
   NORMALIZE MEMBERS
===================================================== */

function normalizeMembers() {

    membersData =
        membersData
            .filter(
                member => {

                    return (
                        member.division ||
                        member.team
                    );

                }
            )
            .map(
                member => {

                    return {

                        division:
                            (
                                member.division ||
                                member.team ||
                                ""
                            )
                            .trim(),

                        nickname:
                            (
                                member.nickname ||
                                member.name ||
                                member.player ||
                                ""
                            )
                            .trim(),

                        gameid:
                            (
                                member.gameid ||
                                member.game_id ||
                                member.id ||
                                ""
                            )
                            .trim(),

                        role:
                            (
                                member.role ||
                                "PLAYER"
                            )
                            .trim(),

                        photo:
                            (
                                member.photo ||
                                member.image ||
                                ""
                            )
                            .trim()

                    };

                }
            );

}



/* =====================================================
   GET MEMBERS FOR DIVISION
===================================================== */

function getDivisionMembers(
    divisionName
) {

    const target =
        normalizeText(
            divisionName
        );


    return membersData.filter(
        member => {

            return (
                normalizeText(
                    member.division
                ) === target
            );

        }
    );

}



/* =====================================================
   NORMALIZE TEXT
===================================================== */

function normalizeText(text) {

    return String(text || "")
        .toLowerCase()
        .trim()
        .replace(
            /\s+/g,
            " "
        );

}



/* =====================================================
   UPDATE MEMBER COUNTS
===================================================== */

function updateMemberCounts() {

    document
        .querySelectorAll(
            ".division-card"
        )
        .forEach(card => {

            const divisionName =
                card.dataset.division;


            const members =
                getDivisionMembers(
                    divisionName
                );


            const count =
                card.querySelector(
                    ".count-value"
                );


            if (count) {

                count.textContent =
                    `${members.length} MEMBERS`;

            }

        });

}



/* =====================================================
   RENDER MEMBERS
===================================================== */

function renderMembers(
    card,
    searchTerm = ""
) {

    const divisionName =
        card.dataset.division;


    const tbody =
        card.querySelector(
            ".members-body"
        );


    if (!tbody) {
        return;
    }


    let members =
        getDivisionMembers(
            divisionName
        );


    /*
        SEARCH
    */

    const search =
        normalizeText(
            searchTerm
        );


    if (search) {

        members =
            members.filter(
                member => {

                    return (

                        normalizeText(
                            member.nickname
                        ).includes(search)

                        ||

                        normalizeText(
                            member.gameid
                        ).includes(search)

                        ||

                        normalizeText(
                            member.role
                        ).includes(search)

                    );

                }
            );

    }


    /*
        EMPTY
    */

    if (!members.length) {

        tbody.innerHTML = `

            <tr>

                <td colspan="4">

                    <div
                        class="members-empty"
                    >

                        <i
                            class="fa-solid fa-user-slash"
                        ></i>

                        <p>
                            No members found
                        </p>

                    </div>

                </td>

            </tr>

        `;

        return;

    }


    /*
        MEMBER ROWS
    */

    tbody.innerHTML =
        members
            .map(
                (member, index) => {

                    return `

                        <tr>

                            <td
                                class="member-index"
                            >
                                ${String(
                                    index + 1
                                ).padStart(
                                    2,
                                    "0"
                                )}
                            </td>


                            <td>

                                <span
                                    class="member-nickname"
                                >
                                    ${escapeHTML(
                                        member.nickname
                                    )}
                                </span>

                            </td>


                            <td
                                class="member-game-id"
                            >
                                ${escapeHTML(
                                    member.gameid ||
                                    "-"
                                )}
                            </td>


                            <td>

                                <span
                                    class="member-role"
                                >
                                    ${escapeHTML(
                                        member.role ||
                                        "PLAYER"
                                    )}
                                </span>

                            </td>

                        </tr>

                    `;

                }
            )
            .join("");

}



/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(text) {

    return String(text || "")
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



/* =====================================================
   GOOGLE SHEET WARNING
===================================================== */

function showSheetWarning() {

    const container =
        document.getElementById(
            "division-list"
        );


    if (!container) {
        return;
    }


    /*
        Tetap tampilkan division.
        Hanya member yang belum tersedia.
    */

    updateMemberCounts();


    console.warn(
        "Google Sheets URL has not been configured."
    );

}



/* =====================================================
   GOOGLE SHEET ERROR
===================================================== */

function showSheetError() {

    document
        .querySelectorAll(
            ".members-body"
        )
        .forEach(
            tbody => {

                tbody.innerHTML = `

                    <tr>

                        <td colspan="4">

                            <div
                                class="division-error"
                            >

                                <i
                                    class="fa-solid fa-triangle-exclamation"
                                ></i>

                                <p>
                                    Unable to load member data.
                                </p>

                                <small>
                                    Please check your Google Sheets
                                    connection and sharing settings.
                                </small>

                            </div>

                        </td>

                    </tr>

                `;

            }
        );

}
