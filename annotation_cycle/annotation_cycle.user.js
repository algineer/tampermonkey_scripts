// ==UserScript==
// @name         Annotation Cycle
// @namespace    https://github.com/algineer/
// @version      1.1.1
// @description  try to take over the world!
// @author       Algineer
// @match        https://flide.ap.tesla.services/3d/TCLP*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tesla.services
// @grant        none
// @downloadURL  https://github.com/algineer/tampermonkey_scripts/raw/main/annotation_cycle/annotation_cycle.user.js
// @updateURL    https://github.com/algineer/tampermonkey_scripts/raw/main/annotation_cycle/annotation_cycle.user.js
// ==/UserScript==

(function() {
    let next = 0

    function cycle() {
        var anno_list = document.querySelectorAll("div.css-11hk4do")

        if (anno_list != null) {
            if (next >= anno_list.length) { next = 0 }
            anno_list[next].click()
            next++
        }

    }

    document.addEventListener('keyup',
        event => {
            if (event.repeat) { return }
            if (event.key == "Tab") {
                event.preventDefault
                cycle()
            }
            if (event.ctrlKey && (event.key == "ArrowRight" || event.key == "ArrowLeft")) { next = 0 }
        })
})();