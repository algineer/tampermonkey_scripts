// ==UserScript==
// @name         Copy formated clip link
// @namespace    https://github.com/algineer/
// @version      1.1.0
// @description  Format Clip Link with ID
// @author       Algineer
// @match        https://*/3d/MESH*
// @match        https://*/3d/TCLP*
// @match        https://*/3d/FLDE*
// @match        https://*/viz/tclip*
// @grant        none
// @downloadURL  https://github.com/algineer/tampermonkey_scripts/raw/main/copy_to_clipboard/copy_formated_clip_link_to_clipboard.user.js
// @updateURL    https://github.com/algineer/tampermonkey_scripts/raw/main/copy_to_clipboard/copy_formated_clip_link_to_clipboard.user.js
// @run-at       context-menu
// ==/UserScript==

(function() {

    //fetch the data
    const copyToClipboard = async(id, url) => {

        try {
            await navigator.clipboard.writeText(`[${id}](${url})`) //new line
                /* Resolved - text copied to clipboard successfully */
        } catch (err) {
            console.error('Failed to copy: ', err);
            /* Rejected - text failed to copy to the clipboard */
        }
    }

    //process the fetched data
    const run = async() => {
        let url = window.location.href
        let id = window.location.href.match(/[a-zA-Z]+(?:-\d+){6}-\w+/g)[0]

        copyToClipboard(id, url)
    }

    run()

})();