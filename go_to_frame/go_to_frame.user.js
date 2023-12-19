// ==UserScript==
// @name         Go To Frame
// @namespace    https://github.com/algineer/
// @version      1.0.0
// @description  Lets users jump to last labeled frame or input frame number that is labeled
// @author       You
// @match        https://flide.ap.tesla.services/3d/TCLP*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tesla.services
// @downloadURL  https://github.com/algineer/tampermonkey_scripts/raw/main/go_to_frame/go_to_frame.user.js
// @updateURL    https://github.com/algineer/tampermonkey_scripts/raw/main/go_to_frame/go_to_frame.user.js
// @grant        none
// ==/UserScript==


(function() {
    var once = false

    var input = document.createElement("textarea")
    input.style.resize = 'none'

    var sumbit = document.createElement("button")
    sumbit.style.height = '35px'
    sumbit.style.width = '50px'
    sumbit.textContent = '->'

    async function goToFrame() {
        var id = document.URL.match(/[a-zA-Z]+-\d\d\d\d-\d\d-\d\d-\d\d-\d\d-\d\d-......../g)[0]

        fetch(`/api/internal/3d/videos/${id}`)
            .then((response) => response.json())
            .then((DATA) => {

                var frame = input.value.trim();
                let frameID = ''
                var numberPattern = /^[+-]?\d+(\.\d+)?$/;

                if (frame !== "" && numberPattern.test(frame)) {
                    frameID = DATA.labels[0].labels[Object.keys(DATA.label_ids_by_project)[0]].labels[frame - 1]._id
                } else {
                    frameID = DATA.labels[0].labels[Object.keys(DATA.label_ids_by_project)[1]].labels.slice(-1)[0]._id
                }
                if (frameID !== '') {
                    window.location.href = document.URL.replace(/#\d+/g, `#${frameID}`)
                    location.reload();
                }
            })


    }

    sumbit.onclick = goToFrame

    requestAnimationFrame(run);

    function run() {
        let flideBar = document.querySelector("#root > main > div.css-vivuko > div.css-120gz53 > div") //need to update now and then
        if (flideBar != null) {

            if (!once) {
                flideBar.insertBefore(input, flideBar.childNodes[2])
                flideBar.insertBefore(sumbit, flideBar.childNodes[3])
                once = true;
            }

        } else
            once = false;

        requestAnimationFrame(run);

    }

})();
