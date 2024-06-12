// ==UserScript==
// @name         Annotation Cycle
// @namespace    https://github.com/algineer/
// @version      1.1.3
// @description  try to take over the world!
// @author       Algineer
// @match        https://*/3d/TCLP*
// @grant        none
// @downloadURL  https://github.com/algineer/tampermonkey_scripts/raw/main/annotation_cycle/annotation_cycle.user.js
// @updateURL    https://github.com/algineer/tampermonkey_scripts/raw/main/annotation_cycle/annotation_cycle.user.js
// ==/UserScript==

(function() {
    let next = 0

    function cycle() {
        var anno_list = document.querySelectorAll("div.css-z21m6d")

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