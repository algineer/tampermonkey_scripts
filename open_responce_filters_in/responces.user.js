// ==UserScript==
// @name         Open In Responces
// @namespace    https://github.com/algineer/
// @version      1.0.0
// @description  Load Filters into the Job Creator
// @author       Algineer
// @match        https://flide.ap.tesla.services/3d/bulk-edit*
// @match        https://flide.ap.tesla.services/3d/job-track-settings*
// @grant        none
// @downloadURL  https://github.com/algineer/tampermonkey_scripts/raw/main/open_responce_filters_in/responces.user.js
// @updateURL    https://github.com/algineer/tampermonkey_scripts/raw/main/open_responce_filters_in/responces.user.js
// @run-at       context-menu
// ==/UserScript==

(function() {

    let filters = window.location.href.split("?")[1]

    window.open(`https://flide.ap.tesla.services/3d/responses?${filters}`, "_blank")
})();