/* =====================================================
   AGILITY UNITED
   DIVISION SYSTEM
===================================================== */


/* =====================================================
   GOOGLE SHEETS
===================================================== */

const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ93uw-1XWwiTKhTOrOPjlBEcxBkFLT_Ol1XYVEggT2ir1Z76HcoLtC15nm_eD_w8R8bWDO8yiOFrDQ/pub?output=csv";


/* =====================================================
   DIVISION CONFIGURATION
===================================================== */

const divisionConfig = {

    "01": {
        name: "AGILITY UNITED 01",
        logo: "assets/divisions/division01.png"
    },

    "02": {
        name: "AGILITY UNITED 02",
        logo: "assets/divisions/division02.png"
    },

    "03": {
        name: "AGILITY UNITED 03",
        logo: "assets/divisions/division03.png"
    },

    "04": {
        name: "AGILITY UNITED 04",
        logo: "assets/divisions/division04.png"
    },

    "05": {
        name: "AGILITY UNITED 05",
        logo: "assets/divisions/division05.png"
    },

    "06": {
        name: "AGILITY UNITED 06",
        logo: "assets/divisions/division06.png"
    },

    "07": {
        name: "AGILITY UNITED 07",
        logo: "assets/divisions/division07.png"
    },

    "08": {
        name: "AGILITY UNITED 08",
        logo: "assets/divisions/division08.png"
    }

};


/* =====================================================
   INITIALIZATION
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadDivisions();

});


/* =====================================================
   LOAD GOOGLE SHEETS
===================================================== */

async function loadDivisions() {

    const container =
        document.getElementById("divisions-container");

    if (!container) {
        console.error(
            "Element #divisions-container tidak ditemukan."
        );

        return;
    }


    try {

        console.log(
            "Mengambil data Google Sheets..."
        );


        const response =
            await fetch(SHEET_URL, {
                cache: "no-store"
            });


        if (!response.ok) {

            throw new Error(
                `HTTP Error: ${response.status}`
            );

        }


        const csv =
            await response.text();


        console.log(
            "Google Sheets berhasil diambil."
        );


        console.log(
            "CSV:",
            csv
        );


        const rows =
            parseCSV(csv);


        if (!rows.length) {

            throw new Error(
                "Google Sheets kosong."
            );

        }


        const headers =
            rows[0].map(header =>
                cleanHeader(header)
            );


        console.log(
            "Headers:",
            headers
        );


        const members =
            rows
                .slice(1)
                .filter(row =>
                    row.some(cell =>
                        cell.trim() !== ""
                    )
                )
                .map(row => {

                    const member = {};

                    headers.forEach(
                        (header, index) => {

                            member[header] =
                                row[index]
                                    ? row[index].trim()
                                    : "";

                        }
                    );


                    return member;

                });


        console.log(
            "Member data:",
            members
        );


        if (!members.length) {

            container.innerHTML = `
                <div class="division-message">
                    <i class="fa-solid fa-users-slash"></i>

                    <h3>
                        NO MEMBER DATA
                    </h3>

                    <p>
                        Google Sheets tidak memiliki
                        data member.
                    </p>
                </div>
            `;

            return;

        }


        renderDivisions(members);


    } catch (error) {

        console.error(
            "Google Sheets Error:",
            error
        );


        container.innerHTML = `

            <div class="division-message error">

                <i class="fa-solid fa-triangle-exclamation"></i>

                <h3>
                    FAILED TO LOAD DATA
                </h3>

                <p>
                    Data division tidak dapat
                    diambil dari Google Sheets.
                </p>

                <small>
                    Buka Developer Console
                    (F12) untuk melihat error.
                </small>

            </div>

        `;

    }

}


/* =====================================================
   RENDER DIVISIONS
===================================================== */

function renderDivisions(members) {

    const container =
        document.getElementById(
            "divisions-container"
        );


    container.innerHTML = "";


    /*
        Group member berdasarkan Division
    */

    const grouped =
        {};


    members.forEach(member => {

        const division =
            normalizeDivision(
                member.Division
            );


        /*
            Jika tidak ada Division,
            jangan dimasukkan.
        */

        if (!division) {
            return;
        }


        if (!grouped[division]) {

            grouped[division] = [];

        }


        grouped[division].push(member);

    });


    const divisionNumbers =
        Object.keys(grouped)
            .sort(
                (a, b) =>
                    Number(a) - Number(b)
            );


    if (!divisionNumbers.length) {

        container.innerHTML = `

            <div class="division-message error">

                <i class="fa-solid fa-database"></i>

                <h3>
                    DIVISION DATA NOT FOUND
                </h3>

                <p>
                    Google Sheets belum memiliki
                    kolom <strong>Division</strong>.
                </p>

                <small>
                    Tambahkan kolom Division
                    pada Google Sheets.
                </small>

            </div>

        `;

        return;

    }


    divisionNumbers.forEach(
        divisionNumber => {

            const divisionMembers =
                grouped[divisionNumber];


            const card =
                createDivisionCard(
                    divisionNumber,
                    divisionMembers
                );


            container.appendChild(card);

        }
    );

}


/* =====================================================
   CREATE DIVISION CARD
===================================================== */

function createDivisionCard(
    divisionNumber,
    members
) {

    const paddedNumber =
        String(divisionNumber)
            .padStart(2, "0");


    const config =
        divisionConfig[paddedNumber] || {

            name:
                `AGILITY UNITED ${paddedNumber}`,

            logo:
                "assets/logo.png"

        };


    /*
        Cari leader.

        Prioritas:
        1. Position = Leader
        2. Leader = Yes
        3. Member pertama
    */

    let leader =
        members.find(member => {

            const position =
                String(
                    member.Position || ""
                ).toLowerCase();

            const leaderValue =
                String(
                    member.Leader || ""
                ).toLowerCase();

            return (
                position === "leader" ||
                position === "ketua" ||
                leaderValue === "yes" ||
                leaderValue === "true" ||
                leaderValue === "leader" ||
                leaderValue === "ketua"
            );

        });


    /*
        Kalau tidak ada kolom Position/Leader,
        member pertama menjadi leader.
    */

    if (!leader) {
        leader = members[0];
    }


    /*
        Semua member tetap ditampilkan.
    */

    const card =
        document.createElement("article");


    card.className =
        "division-card";


    card.dataset.division =
        paddedNumber;


    card.innerHTML = `

        <!-- =================================
             DIVISION HEADER
        ================================== -->

        <button
            type="button"
            class="division-header"
            aria-expanded="false"
        >

            <div class="division-header-left">

                <div class="division-logo">

                    <img
                        src="${config.logo}"
                        alt="${config.name}"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                    >

                    <i
                        class="fa-solid fa-users"
                        style="display:none;"
                    ></i>

                </div>


                <div>

                    <span class="division-number">

                        DIVISION
                        ${paddedNumber}

                    </span>


                    <h3>
                        ${escapeHTML(config.name)}
                    </h3>

                </div>

            </div>


            <div class="division-header-right">

                <span class="member-count">

                    ${members.length}
                    MEMBER${members.length > 1 ? "S" : ""}

                </span>


                <div class="division-icon">

                    <i class="fa-solid fa-chevron-down"></i>

                </div>

            </div>

        </button>


        <!-- =================================
             DIVISION LEADER
        ================================== -->

        <div class="division-leader">

            <div class="division-leader-title">

                <i class="fa-solid fa-user-tie"></i>

                DIVISION LEADER

            </div>


            <div class="leader-profile">

                <div class="leader-avatar">

                    <i class="fa-solid fa-user"></i>

                </div>


                <div class="leader-details">

                    <h4>
                        ${escapeHTML(
                            getNickname(leader)
                        )}
                    </h4>


                    <span>

                        GAME ID :

                        <strong>
                            ${escapeHTML(
                                getGameID(leader)
                            )}
                        </strong>

                    </span>

                </div>


                <div class="role-badge">

                    ${escapeHTML(
                        getRole(leader)
                    )}

                </div>

            </div>

        </div>


        <!-- =================================
             MEMBERS
        ================================== -->

        <div class="division-members">

            <div class="members-title">

                <div>

                    <i class="fa-solid fa-users"></i>

                    TEAM MEMBERS

                </div>


                <span>
                    ${members.length}
                </span>

            </div>


            <div class="members-list">

                ${createMemberList(
                    members,
                    leader
                )}

            </div>

        </div>

    `;


    /*
        Klik header untuk membuka
        member division.
    */

    const header =
        card.querySelector(
            ".division-header"
        );


    header.addEventListener(
        "click",
        event => {

            event.preventDefault();


            const isOpen =
                card.classList.contains(
                    "expanded"
                );


            /*
                Optional:
                Tutup division lain
            */

            document
                .querySelectorAll(
                    ".division-card.expanded"
                )
                .forEach(otherCard => {

                    if (otherCard !== card) {

                        otherCard.classList.remove(
                            "expanded"
                        );


                        const otherHeader =
                            otherCard.querySelector(
                                ".division-header"
                            );


                        if (otherHeader) {

                            otherHeader.setAttribute(
                                "aria-expanded",
                                "false"
                            );

                        }

                    }

                });


            card.classList.toggle(
                "expanded"
            );


            header.setAttribute(
                "aria-expanded",
                !isOpen
            );

        }
    );


    return card;

}


/* =====================================================
   CREATE MEMBER LIST
===================================================== */

function createMemberList(
    members,
    leader
) {

    return members
        .map((member, index) => {

            const isLeader =
                member === leader;


            return `

                <div
                    class="member-row
                    ${isLeader ? "member-is-leader" : ""}"
                >

                    <div class="member-number">

                        ${String(
                            index + 1
                        ).padStart(2, "0")}

                    </div>


                    <div class="member-avatar">

                        <i class="fa-solid fa-user"></i>

                    </div>


                    <div class="member-data">

                        <strong>

                            ${escapeHTML(
                                getNickname(member)
                            )}

                            ${
                                isLeader
                                ? `
                                    <span class="leader-tag">
                                        LEADER
                                    </span>
                                  `
                                : ""
                            }

                        </strong>


                        <span>

                            GAME ID :

                            ${escapeHTML(
                                getGameID(member)
                            )}

                        </span>

                    </div>


                    <div class="member-role">

                        ${escapeHTML(
                            getRole(member)
                        )}

                    </div>

                </div>

            `;

        })
        .join("");

}


/* =====================================================
   GET NICKNAME
===================================================== */

function getNickname(member) {

    return (
        member.Nickname ||
        member.nickname ||
        member.NICKNAME ||
        member.Member ||
        member.member ||
        "-"
    );

}


/* =====================================================
   GET GAME ID
===================================================== */

function getGameID(member) {

    return (
        member["Game ID"] ||
        member["GAME ID"] ||
        member.GameID ||
        member.ID ||
        member.Id ||
        member.id ||
        "-"
    );

}


/* =====================================================
   GET ROLE
===================================================== */

function getRole(member) {

    return (
        member.Role ||
        member.role ||
        member.ROLE ||
        "-"
    );

}


/* =====================================================
   NORMALIZE DIVISION
===================================================== */

function normalizeDivision(value) {

    if (!value) {
        return "";
    }


    const text =
        String(value)
            .trim()
            .toUpperCase();


    /*
        Contoh:

        1
        01
        DIVISION 1
        DIVISION 01

        semuanya menjadi:

        01
    */

    const match =
        text.match(/\d+/);


    if (!match) {
        return "";
    }


    return String(
        Number(match[0])
    ).padStart(2, "0");

}


/* =====================================================
   CLEAN HEADER
===================================================== */

function cleanHeader(header) {

    return String(header)
        .replace(/^\uFEFF/, "")
        .replace(/^["']|["']$/g, "")
        .trim();

}


/* =====================================================
   CSV PARSER
   Support comma dalam tanda kutip
===================================================== */

function parseCSV(text) {

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


        const next =
            text[i + 1];


        /*
            Double quote
        */

        if (
            char === '"' &&
            insideQuotes &&
            next === '"'
        ) {

            value += '"';

            i++;

            continue;

        }


        /*
            Open / close quotes
        */

        if (char === '"') {

            insideQuotes =
                !insideQuotes;

            continue;

        }


        /*
            Comma
        */

        if (
            char === "," &&
            !insideQuotes
        ) {

            row.push(value);

            value = "";

            continue;

        }


        /*
            New line
        */

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


            row.push(value);

            rows.push(row);

            row = [];

            value = "";

            continue;

        }


        value += char;

    }


    /*
        Sisa data
    */

    if (
        value !== "" ||
        row.length > 0
    ) {

        row.push(value);

        rows.push(row);

    }


    return rows;

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    return String(value ?? "")
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
