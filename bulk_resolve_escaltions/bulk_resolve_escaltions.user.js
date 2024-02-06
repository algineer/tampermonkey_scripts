// ==UserScript==
// @name         Bulk Resolve Escations
// @namespace    https://github.com/algineer/
// @version      1.0.1
// @description  Allow user to bulk ressolve escations
// @author       Algineer
// @match        https://flide.ap.tesla.services/3d/escalations*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tesla.services
// @downloadURL  https://github.com/algineer/tampermonkey_scripts/raw/main/bulk_resolve_escaltions/bulk_resolve_escaltions.user.js
// @updateURL    https://github.com/algineer/tampermonkey_scripts/raw/main/bulk_resolve_escaltions/bulk_resolve_escaltions.user.js
// @grant        none
// ==/UserScript==

(function() {
    function createElementWithProperties(tag, properties) {
        const element = document.createElement(tag);

        for (const [key, value] of Object.entries(properties)) {
            element[key] = value;
        }

        return element;
    }

    function resolve() {

        let btnList = document.querySelectorAll('button')
        let resolveBtnList = Array.from(btnList).filter(btn => btn.textContent === 'Resolve');

        resolveBtnList.forEach(b => {
            b.click()
        })

        setTimeout(window.location.reload(), 5000)
    };



    requestAnimationFrame(run);

    function run() {
        let parent = document.querySelector("#root > main > div > div.css-1lyloya > div > div.css-603q35 > div > div.css-iixgso") //need to update now and then
        if (parent) {

            const element = createElementWithProperties('label', {
                className: 'css-1jjo2yn',
                innerHTML: '<div class = "css-3oglug">Bulk Resolve</div>' +
                    '<Button id="bulkResolveBtn" class="css-c352py" title="Window will reload after completion">Click to Resolve</button>'
            })
            parent.append(element)

            //change any parent styles
            parent.style.gridTemplateColumns = '500px 500px 100px'


            //add button onclick()
            document.querySelector('#bulkResolveBtn').onclick = () => {
                resolve()
            }

        } else
            requestAnimationFrame(run);
    }
})();