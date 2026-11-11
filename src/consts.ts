// Site-wide settings. The values live in src/data/site.json, which you can
// edit at /admin ("Home page & profile"). Empty links are hidden on the site.
import site from './data/site.json';

export const SITE = site;
export const SITE_TITLE = site.name;
export const SITE_DESCRIPTION = `${site.name} — ${site.headline}`;
export const EMAIL = site.email;
export const GITHUB_URL = site.github_url;
export const X_URL = site.x_url;
export const LINKEDIN_URL = site.linkedin_url;
export const CV_URL = site.cv_url;
export const OPEN_TO = site.open_to;
