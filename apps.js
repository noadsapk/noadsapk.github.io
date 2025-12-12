const mainAppsData = [
  {
    name: "Document",
    developer: "Nikhil",
  },
  {
    name: "Document",
    developer: "Nikhil",
  },
  {
    name: "Document",
    developer: "Nikhil",
  },
  {
    name: "Document",
    developer: "Nikhil",
  }
];


const otherAppsData = [
  { name: "Document", developer: "Nikhil" },
  { name: "Document", developer: "Nikhil" }
];

/**
 * Creates an HTML anchor element representing an app card.
 * @param {object} app - The app data object with 'name' and 'developer'.
 * @returns {HTMLAnchorElement} The created app card link element.
 */
function createAppCardElement(app) {
  // Sanitize app name for use in URL (lowercase, remove spaces)
  const appNameForPath = app.name.toLowerCase().replace(/\s+/g, '');

  const appLink = document.createElement('a');
  appLink.href = `apk/${appNameForPath}/index.html`;
  appLink.classList.add('app-card-link');

  const article = document.createElement('article');
  article.classList.add('app-card');

  const appThumb = document.createElement('div');
  appThumb.classList.add('app-thumb');

  const img = document.createElement('img');
  img.src = `apk/${appNameForPath}/icon.jpg`;
  img.alt = `${app.name} App Icon`;
  // Apply the required inline style for all app icons
  img.style.cssText = "width:100%;height:100%;border-radius:12px;object-fit:cover;";
  appThumb.appendChild(img);

  const appMeta = document.createElement('div');
  appMeta.classList.add('app-meta');

  const h3 = document.createElement('h3');
  h3.textContent = app.name;

  const span = document.createElement('span');
  span.textContent = `Developer: ${app.developer}`;

  appMeta.appendChild(h3);
  appMeta.appendChild(span);

  article.appendChild(appThumb);
  article.appendChild(appMeta);
  appLink.appendChild(article);

  return appLink;
}

document.addEventListener('DOMContentLoaded', () => {
  // Populate the main apps grid
  const mainAppsGrid = document.querySelector('main .apps-grid');
  if (mainAppsGrid) {
    mainAppsGrid.innerHTML = ''; // Clear any existing content
    mainAppsData.forEach(app => {
      mainAppsGrid.appendChild(createAppCardElement(app));
    });
  }

  // Populate the "Other apps" grid in the sidebar
  const otherAppsGrid = document.querySelector('.right-column .apps-grid');
  if (otherAppsGrid) {
    otherAppsGrid.innerHTML = ''; // Clear any existing content
    otherAppsData.forEach(app => {
      otherAppsGrid.appendChild(createAppCardElement(app));
    });
  }
});