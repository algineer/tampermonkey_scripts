// ==UserScript==
// @name         Open In Job Creator
// @namespace    https://github.com/algineer/
// @version      1.0.0
// @description  Load Filters into the Job Creator
// @author       Algineer
// @match        https://flide.ap.tesla.services/3d/responses*
// @grant        none
// @downloadURL  https://github.com/algineer/tampermonkey_scripts/raw/main/open_responce_filters_in/create_job.user.js
// @updateURL    https://github.com/algineer/tampermonkey_scripts/raw/main/open_responce_filters_in/create_job.user.js
// @run-at       context-menu
// ==/UserScript==

(function() {

    let filters = window.location.href.split("?")[1]

    window.open(`https://flide.ap.tesla.services/3d/job-track-settings?${filters}`, "_blank")
})();