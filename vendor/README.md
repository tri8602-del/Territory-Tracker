# Vendored libraries (so the app starts with no connection)

| Library | Version | Source | Licence |
|---|---|---|---|
| Leaflet (`leaflet/`) | 1.9.4 | https://unpkg.com/leaflet@1.9.4/dist/ | BSD-2-Clause (`leaflet/LICENSE`) |
| Firebase JS SDK compat (`firebase/`) | 12.18.0 | https://www.gstatic.com/firebasejs/12.18.0/ | Apache-2.0 (https://github.com/firebase/firebase-js-sdk/blob/main/LICENSE) |

The files are unmodified copies. To upgrade, replace the files, update the version here,
and bump `VERSION` in `sw.js` (and `TT_APP_VERSION` in `index.html`) so devices pick up the change.
