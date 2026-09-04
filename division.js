const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ93uw-1XWwiTKhTOrOPjlBEcxBkFLT_Ol1XYVEggT2ir1Z76HcoLtC15nm_eD_w8R8bWDO8yiOFrDQ/pub?output=csv";

const divisionContainer =
    document.getElementById("divisions-container");


async function loadDivisions() {

    try {

        const response = await fetch(SHEET_URL);

        const csv = await response.text();

        const rows = parseCSV(csv);

        if (rows.length < 2) {
            divisionContainer.innerHTML =
                "<p>No member data available.</p>";
            return;
        }

        const headers = rows[0];

        const members = rows.slice(1).map(row => {

            const member = {};

            headers.forEach((header, index) => {
                member[header.trim()] =
                    row[index]?.trim() || "";
            });

            return member;

        });

        renderDivisions(members);

    } catch (error) {

        console.error(
            "Failed to load Google Sheet:",
            error
        );

        divisionContainer.innerHTML = `
            <p class="division-error">
                Failed to load division data.
            </p>
        `;

    }

}
const SHEET_URL =
    "MASUKKAN_LINK_GOOGLE_SHEET_DI_SINI";

const divisionContainer =
    document.getElementById("divisions-container");


async function loadDivisions() {

    try {

        const response = await fetch(SHEET_URL);

        const csv = await response.text();

        const rows = parseCSV(csv);

        if (rows.length < 2) {
            divisionContainer.innerHTML =
                "<p>No member data available.</p>";
            return;
        }

        const headers = rows[0];

        const members = rows.slice(1).map(row => {

            const member = {};

            headers.forEach((header, index) => {
                member[header.trim()] =
                    row[index]?.trim() || "";
            });

            return member;

        });

        renderDivisions(members);

    } catch (error) {

        console.error(
            "Failed to load Google Sheet:",
            error
        );

        divisionContainer.innerHTML = `
            <p class="division-error">
                Failed to load division data.
            </p>
        `;

    }

}
function renderDivisions(members) {

    divisionContainer.innerHTML = "";

    const divisions = {};

    members.forEach(member => {

        const division =
            member.Division;

        if (!division) return;

        if (!divisions[division]) {
            divisions[division] = [];
        }

        divisions[division].push(member);

    });


    Object.keys(divisions)
        .sort((a, b) => Number(a) - Number(b))
        .forEach(divisionNumber => {

            const divisionMembers =
                divisions[divisionNumber];

            createDivisionCard(
                divisionNumber,
                divisionMembers
            );

        });

}
function createDivisionCard(
    divisionNumber,
    members
) {

    const leader =
        members.find(
            member =>
                member.Position?.toLowerCase() === "leader"
        ) || members[0];


    const card =
        document.createElement("div");

    card.className = "division-card";


    card.innerHTML = `

        <div class="division-header">

            <div>

                <span class="division-number">
                    DIVISION ${String(divisionNumber).padStart(2, "0")}
                </span>

                <h3>
                    AGILITY UNITED ${String(divisionNumber).padStart(2, "0")}
                </h3>

            </div>

            <div class="division-icon">

                <i class="fa-solid fa-users"></i>

            </div>

        </div>


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
                        ${leader.Nickname || "UNKNOWN"}
                    </h4>

                    <span>
                        GAME ID :
                        <strong>
                            ${leader["Game ID"] || "-"}
                        </strong>
                    </span>

                </div>


                <div class="role-badge">

                    ${leader.Role || "-"}

                </div>

            </div>

        </div>


        <div class="division-members">

            <div class="members-title">

                <i class="fa-solid fa-users"></i>

                TEAM MEMBERS

            </div>

            <div class="members-list">

                ${createMemberList(members)}

            </div>

        </div>

    `;


    card.addEventListener(
        "click",
        () => {

            card.classList.toggle("expanded");

        }
    );


    divisionContainer.appendChild(card);

}
function createMemberList(members) {

    return members.map(member => `

        <div class="member-row">

            <div class="member-avatar">

                <i class="fa-solid fa-user"></i>

            </div>

            <div class="member-data">

                <strong>
                    ${member.Nickname || "-"}
                </strong>

                <span>
                    GAME ID :
                    ${member["Game ID"] || "-"}
                </span>

            </div>

            <div class="member-role">

                ${member.Role || "-"}

            </div>

        </div>

    `).join("");

}
function parseCSV(text) {

    const lines =
        text.trim().split("\n");

    return lines.map(line => {

        return line
            .split(",")
            .map(value =>
                value
                    .replace(/^"|"$/g, "")
                    .trim()
            );

    });

}
loadDivisions();
