// ==UserScript==
// @name         Planner Filter
// @namespace    https://github.com/algineer/
// @version      1.7.0
// @description  Allow user to filter planner tasks
// @author       Algineer
// @match        https://humans.ap.tesla.services/plan*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tesla.services
// @downloadURL  https://github.com/algineer/tampermonkey_scripts/raw/main/planner_filter/planner_filter.user.js
// @updateURL    https://github.com/algineer/tampermonkey_scripts/raw/main/planner_filter/planner_filter.user.js
// @grant        none
// ==/UserScript==

(function() {
    const createElementWithProperties = (tag, properties) => {
        const element = document.createElement(tag);

        for (const [key, value] of Object.entries(properties)) {
            if (key === 'style' && typeof value === 'object') {
                // If the property is 'style' and the value is an object, apply styles
                for (const [styleKey, styleValue] of Object.entries(value)) {
                    element.style[styleKey] = styleValue;
                }
            } else if (key === 'children' && Array.isArray(value)) {
                // If the property is 'children' and the value is an array of objects representing nested elements,
                // recursively create and append each nested element to the parent
                value.forEach(child => {
                    if (typeof child === 'object') {
                        const { tag: childTag, ...childProps } = child;
                        const childElement = createElementWithProperties(childTag, childProps);
                        element.appendChild(childElement);
                    }
                });
            } else {
                // For other properties, directly set the value
                element[key] = value;
            }
        }

        return element;
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

            const element = createElementWithProperties('label', {
                className: 'css-1jjo2yn',
                Children: [{
                        tag: 'div',
                        className: 'css-3oglug',
                        innerHTML: 'Filter'
                    },
                    {
                        tag: 'input',
                        id: 'filter',
                        className: 'css-c352py',
                        value: ''
                    }
                ]
            })
            parent.append(element)

            //change any parent styles
            parent.style.gridTemplateColumns = '308px 320px 180px'

            updateListener()

        } else
            requestAnimationFrame(run);
    }
})();