// --- Configuration ---
// REPLACE with your actual Google Sheet ID
const SHEET_ID = "1mokXWWfkHoiPdxSJdbGnz2CM9NEm24e97UmHgCTHkQk"; 
const SHEET_NAME = "Master"; 
// The URL to fetch JSON data from the Google Sheet
const DATA_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${SHEET_NAME}`;
// ---------------------

const container = document.getElementById('app-list-container');

// Function to fetch the content of a TXT file (for privacy/about)
async function fetchTextFile(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            return `Content not found at ${path.split('/').pop()}.`;
        }
        return await response.text();
    } catch (error) {
        console.error("Error fetching text file:", path, error);
        return "Error loading content.";
    }
}

async function loadApps() {
    container.innerHTML = "<p>Fetching data from Google Sheet...</p>";
    
    try {
        const response = await fetch(DATA_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const dataText = await response.text();

        // Validate and parse JSON
        if (!dataText.startsWith("/*O_o*/")) {
            throw new Error("Invalid response format. Ensure the Google Sheet is publicly accessible.");
        }

        const jsonString = dataText.substring(47).slice(0, -2);
        let jsonData;
        try {
            jsonData = JSON.parse(jsonString);
        } catch (parseError) {
            throw new Error("Failed to parse JSON data. Check the sheet structure.");
        }

        const rows = jsonData.table?.rows || [];
        container.innerHTML = ''; // Clear the loading message

        if (rows.length === 0) {
            container.innerHTML = "<p>No data found in the Master sheet.</p>";
            return;
        }
        
        for (const row of rows) {
            
            // --- Map Column Indices to Variables ---
            // c[0] = Id, c[1] = Name, c[2] = Developer, c[3] = Version, c[4] = Download
            const app = {
                id: row.c[0] ? row.c[0].v : 'N/A',
                name: row.c[1] ? row.c[1].v : 'N/A',
                developer: row.c[2] ? row.c[2].v : 'N/A',
                version: row.c[3] ? row.c[3].v : 'N/A',
                download_link: row.c[4] ? row.c[4].v : '#', 
            };
            
            if (app.name === 'N/A') {
                console.warn("Skipping row due to missing Name field.");
                continue; 
            }

            // --- Construct File Paths and Fetch Content ---
            // Ensure you use the file extension that matches your icons (e.g., .png, .jpg)
            const iconPath = `apk_icons/${app.name}.jpg`; 
            const privacyPath = `apk_privacy/${app.name}.txt`;
            const aboutPath = `apk_about/${app.name}.txt`;

            const privacyContent = await fetchTextFile(privacyPath);
            const aboutContent = await fetchTextFile(aboutPath);

            // --- Create the HTML Structure (The Card) ---
            const card = document.createElement('div');
            card.className = 'app-card';
            card.innerHTML = `
                <img src="${iconPath}" alt="${app.name} Icon" class="app-icon" onerror="this.onerror=null;this.src='default_icon.png';">
                <h2>${app.name}</h2>
                <p><strong>ID:</strong> ${app.id}</p>
                <p><strong>Developer:</strong> ${app.developer}</p>
                <p><strong>Version:</strong> ${app.version}</p>
                <a href="${app.download_link}" target="_blank" class="download-btn">
                    Download App
                </a>
                
                <div class="content-section">
                    <h3>About ${app.name}</h3>
                    <p class="about-text">${aboutContent.replace(/\n/g, '<br>')}</p>
                </div>

                <div class="content-section">
                    <h3>Privacy Policy</h3>
                    <p class="privacy-text">${privacyContent.replace(/\n/g, '<br>')}</p>
                </div>
            `;

            container.appendChild(card);
        }

    } catch (error) {
        console.error("Critical error loading app data:", error);
        container.innerHTML = `
            <div class="error-message">
                <p>Fatal error loading data. Please check console for details.</p>
                <p>${error.message}</p>
            </div>
        `;
    }
}

function loadAppsFromExcel(sheetData, containerId) {
    const container = document.getElementById(containerId);

    if (!container) {
        console.error(`Container with ID "${containerId}" not found.`);
        return;
    }

    container.innerHTML = ''; // Clear the container

    if (sheetData.length === 0) {
        container.innerHTML = "<p>No data found in the Excel file.</p>";
        return;
    }

    for (const row of sheetData) {
        const app = {
            id: row.Id || 'N/A',
            name: row.Name || 'N/A',
            developer: row.Developer || 'N/A',
            version: row.Version || 'N/A',
            download_link: row.Download || '#',
        };

        if (app.name === 'N/A') {
            console.warn("Skipping row due to missing Name field.");
            continue;
        }

        const iconPath = `apk_icons/${app.name}.jpg`;
        const card = document.createElement('div');
        card.className = 'app-card';
        card.innerHTML = `
            <img src="${iconPath}" alt="${app.name} Icon" class="app-icon" onerror="this.onerror=null;this.src='default_icon.png';">
            <h2>${app.name}</h2>
            <p><strong>ID:</strong> ${app.id}</p>
            <p><strong>Developer:</strong> ${app.developer}</p>
            <p><strong>Version:</strong> ${app.version}</p>
            <a href="${app.download_link}" target="_blank" class="download-btn">
                Download App
            </a>
        `;

        container.appendChild(card);
    }
}

async function loadAppsFromFile(containerId) {
    const filePath = './noadsapk.xlsx'; // Path to the Excel file in the project folder

    try {
        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error(`Failed to load the Excel file. HTTP status: ${response.status}`);
        }

        const data = await response.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
        const sheetName = workbook.SheetNames[0]; // Use the first sheet
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        loadAppsFromExcel(sheetData, containerId);
    } catch (error) {
        console.error("Error loading Excel file:", error);

        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <p>Fatal error loading data from Excel file. Please check the following:</p>
                    <ul>
                        <li>Ensure the file <strong>noadsapk.xlsx</strong> is in the project folder.</li>
                        <li>Run the project on a local server to avoid browser restrictions.</li>
                        <li>Check the browser console for more details.</li>
                    </ul>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }
}

// Automatically load the Excel file on page load for apk.html
if (document.getElementById('app-list-container')) {
    loadAppsFromFile('app-list-container');
}