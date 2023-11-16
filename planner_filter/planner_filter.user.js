// ==UserScript==
// @name         Planner Filter
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  try to take over the world!
// @author       You
// @match        https://humans.ap.tesla.services/plan*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tesla.services
// @downloadURL  https://github.com/algineer/tampermonkey_scripts/raw/main/planner_filter/planner_filter.user.js
// @updateURL    https://github.com/algineer/tampermonkey_scripts/raw/main/planner_filter/planner_filter.user.js
// @grant        none
// ==/UserScript==

(function() {
    function createChild(parent, type, innerHTML, classList) {
        const element = document.createElement(type)
        element.innerHTML = innerHTML
        element.classList.add(...classList.split(' '));

        parent.append(element)
    }

    function filter() {
        let divList = document.querySelectorAll("div.css-c9z190")
        let filterInput = document.getElementById("filter");

        if (divList) {

            divList.forEach(div => {
                let jobElements = div.querySelectorAll("select:nth-child(3n + 1)")
                jobElements.forEach(jobList => {
                    jobList.childNodes.forEach(job => {
                        let jobText = job.textContent.toLowerCase().trim();
                        job.style.display = (filterInput.value === '' || jobText.includes(filterInput.value.toLowerCase().trim())) ? '' : 'none';
                    })
                })

            })
        }
    };

    function updateListener() {

        const mutationObserver = new MutationObserver(filter);
        mutationObserver.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
        document.getElementById("filter").addEventListener("blur", filter);

    }

    requestAnimationFrame(run);

    function run() {
        let parent = document.querySelector("#root > div > div.css-t32mmx > div.css-1ifbo89 > div.css-603q35 > div > div.css-jnut47") //need to update now and then
        if (parent) {

            const filter_html = '<div class = "css-3oglug">Filter</div>' +
                '<input id="filter" cursor="initial" rows="4" class="css-c352py" value="">'

            createChild(parent, 'label', filter_html, 'css-1jjo2yn');

            //change any parent styles
            parent.style.gridTemplateColumns = '308px 320px 180px'

            updateListener()

        } else
            requestAnimationFrame(run);
    }
})();
