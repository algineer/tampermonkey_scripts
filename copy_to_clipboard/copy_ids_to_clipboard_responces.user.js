// ==UserScript==
// @name         Copy ID's to clipboard: Responces
// @namespace    https://github.com/algineer/
// @version      1.0.0
// @description  Load x number of clip ID's into clipboard
// @author       Algineer
// @match        https://flide.ap.tesla.services/3d/responses*
// @grant        none
// @downloadURL  https://github.com/algineer/tampermonkey_scripts/raw/main/copy_to_clipboard/copy_ids_to_clipboard_responces.user.js
// @updateURL    https://github.com/algineer/tampermonkey_scripts/raw/main/copy_to_clipboard/copy_ids_to_clipboard_responces.user.js
// @run-at       context-menu
// ==/UserScript==

(function() {
    'use strict';

    const copyToClipboard = async(list) => {

        try {
            await navigator.clipboard.writeText(list.join('\n')) //new line
                /* Resolved - text copied to clipboard successfully */
        } catch (err) {
            console.error('Failed to copy: ', err);
            /* Rejected - text failed to copy to the clipboard */
        }
    }

    const copy = async(count) => {

        let list = document.querySelectorAll("a.css-1xi4blx")
        let clip_list = []

        list.forEach(clip_url => {
            clip_list.push(clip_url.href.match(/[a-zA-Z]+-\d\d\d\d-\d\d-\d\d-\d\d-\d\d-\d\d-......../g)[0])
        })

        if (count != '')
            await copyToClipboard(clip_list.slice(0, count))
        else
            await copyToClipboard(clip_list)

        document.getElementsByTagName("body")[0].style.cursor = ''
    }


    let amount = window.prompt("Aount of clips to copy")

    if (amount != null) {
        document.getElementsByTagName("body")[0].style.cursor = 'wait'

        setTimeout(() => {
            copy.bind(null, amount)()
        }, 1000);
    }

})();