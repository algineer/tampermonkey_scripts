// ==UserScript==
// @name         Escalations Bulk Editor
// @namespace    https://github.com/algineer/
// @version      1.1.0
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

            setTimeout(function() {
                window.location.reload();
            }, 5000);
        } else
            alert('Bulk Edit Option Needs to be Selected')

    };



    requestAnimationFrame(run);

    function run() {
        let starting_element = document.querySelector("[role='table']")
        if (starting_element) {
            let parent = starting_element.parentElement.parentElement.firstChild.firstChild.lastChild
            let label_class = parent.lastChild.classList.value
            let div_class = parent.lastChild.firstChild.classList.value
            let input_class = parent.lastChild.lastChild.lastChild.lastChild.classList.value
            let setlect_btn = parent.lastChild.firstChild.lastChild.classList.value
                // let parent = document.querySelector("div.css-199fc11") //need to update now and then
            if (parent) {

                const element = createElementWithProperties('label', {
                    className: label_class,
                    children: [{
                            tag: 'div',
                            className: div_class,
                            innerHTML: 'Bulk Edit Escalations'
                        },
                        {
                            tag: 'div',
                            className: input_class,
                            children: [{
                                    tag: 'select',
                                    id: 'bulkEditOption',
                                    className: setlect_btn,
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
                                    className: setlect_btn,
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
                parent.style.gridTemplateColumns = '500px 500px 175px'
            }
        } else
            requestAnimationFrame(run);
    }
})();