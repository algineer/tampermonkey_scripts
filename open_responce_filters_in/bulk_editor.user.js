// ==UserScript==
// @name         Open In Bulk Editor
// @namespace    https://github.com/algineer/
// @version      1.0.1
// @description  Load Filters into the Bulk Editor
// @author       Algineer
// @match        https://*/3d/responses*
// @grant        none
// @downloadURL  https://github.com/algineer/tampermonkey_scripts/raw/main/open_responce_filters_in/bulk_editor.user.js
// @updateURL    https://github.com/algineer/tampermonkey_scripts/raw/main/open_responce_filters_in/bulk_editor.user.js
// @run-at       context-menu
// ==/UserScript==

(function() {

    let filters = window.location.href.split("?")[1]

    window.open(`${window.location.href.split("/3d")[0]}/3d/bulk-edit?${filters}`, "_blank")
})();