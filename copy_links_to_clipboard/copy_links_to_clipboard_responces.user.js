// ==UserScript==
// @name         Copy Links to clipboard: Responces
// @namespace    https://github.com/algineer/
// @version      1.2.1
// @description  Load x number of links into clipboard
// @author       Algineer
// @match        https://flide.ap.tesla.services/3d/responses*
// @grant        none
// @downloadURL  https://github.com/algineer/tampermonkey_scripts/raw/main/copy_links_to_clipboard/copy_links_to_clipboard_responces.user.js
// @updateURL    https://github.com/algineer/tampermonkey_scripts/raw/main/copy_links_to_clipboard/copy_links_to_clipboard_responces.user.js
// @run-at       context-menu
// ==/UserScript==

(function() {
    'use strict';

    const copyToClipboard = async(links) => {

        try {
            await navigator.clipboard.writeText(links.join('\n')) //new line
                /* Resolved - text copied to clipboard successfully */
        } catch (err) {
            console.error('Failed to copy: ', err);
            /* Rejected - text failed to copy to the clipboard */
        }
    }

    const copy = async(count) => {

        let list = document.querySelectorAll("a.css-1xi4blx")
        let clip_id_list = []

        list.forEach(clip_url => {
            clip_id_list.push(clip_url.href)
        })

        await copyToClipboard(clip_id_list.slice(0, count))

        document.getElementsByTagName("body")[0].style.cursor = ''
    }


    let amount = window.prompt("Aount of clips to copy")
    document.getElementsByTagName("body")[0].style.cursor = 'wait'

    setTimeout(() => {
        copy.bind(null, amount)()
    }, 2500);


})();