// ==UserScript==
// @name         Bulk Resolve Escations
// @namespace    https://github.com/algineer/
// @version      1.1.0
// @description  Allow user to bulk ressolve escations
// @author       Algineer
// @match        https://flide.ap.tesla.services/3d/escalations*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tesla.services
// @downloadURL  https://github.com/algineer/tampermonkey_scripts/raw/main/bulk_resolve_escaltions/bulk_resolve_escaltions.user.js
// @updateURL    https://github.com/algineer/tampermonkey_scripts/raw/main/bulk_resolve_escaltions/bulk_resolve_escaltions.user.js
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
                children: [{
                        tag: 'div',
                        className: 'css-3oglug',
                        innerHTML: 'Bulk Resolve'
                    },
                    {
                        tag: 'button',
                        id: 'bulkResolveBtn',
                        className: 'css-c352py',
                        title: 'Window will reload after completion',
                        innerText: 'Click to Resolve',
                        onclick: () => {
                            resolve()
                        }
                    }
                ]
            });
            parent.append(element)

            //change any parent styles
            parent.style.gridTemplateColumns = '500px 500px 100px'


            //add button onclick()


        } else
            requestAnimationFrame(run);
    }
})();