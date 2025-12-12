// Dynamically load apps into the list
async function loadAppList() {
    const appList = document.getElementById('app-list');
    appList.innerHTML = "<p>Loading apps...</p>";

    try {
        const filePath = './noadsapk.xlsx';
        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error(`Failed to load the Excel file. HTTP status: ${response.status}`);
        }

        const data = await response.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        appList.innerHTML = ''; // Clear loading message

        if (sheetData.length === 0) {
            appList.innerHTML = "<p>No apps found in the Excel file.</p>";
            return;
        }

        sheetData.forEach((row) => {
            const app = {
                id: row.Id || 'N/A',
                name: row.Name || 'N/A',
                developer: row.Developer || 'N/A',
                version: row.Version || 'N/A',
                icon: `../app/${row.Name}/icon.jpg`,
            };

            const listItem = document.createElement('li');
            listItem.className = 'app-list-item';
            listItem.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <img src="${app.icon}" alt="${app.name} Icon" onerror="this.onerror=null;this.src='default_icon.jpg';">
                    <div>
                        <h3>${app.name}</h3>
                        <p><strong>Version:</strong> ${app.version}</p>
                        <p><strong>Developer:</strong> ${app.developer}</p>
                    </div>
                </div>
                <a href="apk.html?app=${encodeURIComponent(app.name)}">View Details</a>
            `;

            appList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error loading apps:", error);
        appList.innerHTML = `<p>Error loading apps. Please check the console for details.</p>`;
    }
}

loadAppList();
