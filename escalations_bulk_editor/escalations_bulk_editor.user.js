// ==UserScript==
// @name         Escalations Bulk Editor
// @namespace    https://github.com/algineer/
// @version      1.0.6
// @description  Allow user to bulk edit escations (resolve/further escalte)
// @author       Algineer
// @match        https://*/3d/escalations*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tesla.services
// @downloadURL  https://github.com/algineer/tampermonkey_scripts/raw/main/escalations_bulk_editor/escalations_bulk_editor.user.js
// @updateURL    https://github.com/algineer/tampermonkey_scripts/raw/main/escalations_bulk_editor/escalations_bulk_editor.user.js
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

    function bulkEdit() {
        let bulkEditOption = document.getElementById('bulkEditOption').value
        if (bulkEditOption !== 'selectOption') {
            let btnList = document.querySelectorAll('button')
            let bulkEditBtnList = Array.from(btnList).filter(btn => btn.textContent === bulkEditOption);

            bulkEditBtnList.forEach(b => {
                b.click()
            })

            setTimeout(window.location.reload(), 5000)
        } else
            alert('Bulk Edit Option Needs to be Selected')

    };



    requestAnimationFrame(run);

    function run() {
        let parent = document.querySelector("#root > main > div > div.css-6vzluo > div > div.css-660msb > div > div.css-10p649b") //need to update now and then
        if (parent) {

            const element = createElementWithProperties('label', {
                className: 'css-1sr1772',
                children: [{
                        tag: 'div',
                        className: 'css-1xhs0h5',
                        innerHTML: 'Bulk Edit Escalations'
                    },
                    {
                        tag: 'div',
                        className: ' css-1b72rnb-control',
                        children: [{
                                tag: 'select',
                                id: 'bulkEditOption',
                                className: 'css-1vlq6kh',
                                style: {
                                    height: '30px',
                                },
                                innerHTML: '<option value="selectOption">Select Option</option>' +
                                    '<option value="Resolve">Resolve</option>' +
                                    '<option value="Further Escalate">Further Escalate</option>'

                            },
                            {
                                tag: 'button',
                                id: 'bulkBtn',
                                className: 'css-1vlq6kh',
                                style: {
                                    height: '30px',
                                },
                                title: 'Window will reload after completion',
                                innerText: '->',
                                onclick: () => {
                                    bulkEdit()
                                }
                            }
                        ]

                    }
                ]
            });
            parent.append(element)

            //change any parent styles
            parent.style.gridTemplateColumns = '500px 500px 153px'

        } else
            requestAnimationFrame(run);
    }
})();