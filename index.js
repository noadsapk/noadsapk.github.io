document.addEventListener('DOMContentLoaded', async () => {
    const appList = document.getElementById('app-list');
    appList.innerHTML = "<p>Loading apps...</p>";

    try {
        const sheetId = '1WVOnGXZAC5-nGzvmYQAgnyL_LiDYXP2PExRsF9uVZ34';
        const response = await fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`);

        if (!response.ok) {
            throw new Error(`Failed to load the Google Sheet. HTTP status: ${response.status}`);
        }

        const csvData = await response.text();
        const sheetData = XLSX.utils.sheet_to_json(XLSX.read(csvData, { type: 'string' }).Sheets[XLSX.read(csvData, { type: 'string' }).SheetNames[0]]);

        if (sheetData.length === 0) {
            appList.innerHTML = "<p>No apps found in the list.</p>";
            return;
        }

        const appItemsHTML = sheetData.map(row => {
            const name = row.Name || 'N/A';
            const version = row.Version || 'N/A';
            const developer = row.Developer || 'N/A';
            const icon = `app/${name}/icon.jpg`;
            const defaultIcon = 'https://via.placeholder.com/100/e0e0e0/808080?text=No+Icon';
            
            return `
            <li class="app-list-item">
                <div style="display: flex; align-items: center;">
                    <img src="${icon}" alt="${name} Icon" onerror="this.onerror=null;this.src='${defaultIcon}';">
                    <div>
                        <h3>${name}</h3>
                        <p><strong>Version:</strong> ${version}</p>
                        <p><strong>Developer:</strong> ${developer}</p>
                    </div>
                </div>
                <a href="apk.html?app=${encodeURIComponent(name)}">View Details</a>
            </li>`;
        }).join('');

        appList.innerHTML = appItemsHTML;

    } catch (error) {
        console.error("Error loading apps:", error);
        appList.innerHTML = `<p>Error loading app list. Please try refreshing the page.</p>`;
    }
});
