// ==UserScript==
// @name         Open In Job Creator
// @namespace    https://github.com/algineer/
// @version      1.0.1
// @description  Load Filters into the Job Creator
// @author       Algineer
// @match        https://*/3d/responses*
// @grant        none
// @downloadURL  https://github.com/algineer/tampermonkey_scripts/raw/main/open_responce_filters_in/create_job.user.js
// @updateURL    https://github.com/algineer/tampermonkey_scripts/raw/main/open_responce_filters_in/create_job.user.js
// @run-at       context-menu
// ==/UserScript==

(function() {

    let filters = window.location.href.split("?")[1]

    window.open(`${window.location.href.split("/3d")[0]}/3d/job-track-settings?${filters}`, "_blank")
})();