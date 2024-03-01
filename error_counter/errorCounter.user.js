const getId = () => {
    return window.location.href.match(/\w+-\d+-\d+-\d+-\d+-\d+-\d+-[^?]+/g)[0]
}
const getProject = () => {
    return window.location.href.match(/task=\w+/g)[0].replace("task=", "")
}


// Function to perform a single fetch request
const fetchData = async() => {
    const response = await fetch(`/tesla.services/3d/api/${getId()}`)
    const data = await response.json()
    if (JSON.stringify(data.conments) !== "{}" && data.coments.hasOwnProperty(getProject())) {
        return data.coments.getProject()
    } else
        return 0
}


const perFrameNWCount = async() => {

    const result = {};
    const commentObjList = await fetchData()

    if (commentObjList){
        commentObjList.forEach(commentObj => {
            const { comment, data, disputed_reason } = commentObj
            const cameraFrameMatch = comment.match(/camera=([^&]+)&frame=(\d+)/);

            if (cameraFrameMatch) {
                const [, camera, frame] = cameraFrameMatch;
                const key = `Frame ${frame} "${camera}" camera`;

                if (!result[key]) {
                    result[key] = { Mistake: 0, minorMistake: 0 };
                }

                if (data.subtype === 'minorMistake') {
                    result[key].minorMistake++;
                } else if (data.subtype === 'mistake') {
                    result[key].Mistake++;
                }
            }
        });
    }
    console.log(result);
}

const totalNWCount = async() => {

    const result = {};
    const commentObjList = await fetchData()

    if (commentObjList){
        commentObjList.forEach(commentObj => {
            const { comment, data, disputed_reason } = commentObj
            const cameraFrameMatch = comment.match(/camera=([^&]+)&frame=(\d+)/);

            if (cameraFrameMatch) {
                const [, camera, frame] = cameraFrameMatch;
                const key = `Frame ${frame} "${camera}" camera`;

                if (!result[key]) {
                    result[key] = { Mistake: 0, minorMistake: 0 };
                }

                if (data.subtype === 'minorMistake') {
                    result[key].minorMistake++;
                } else if (data.subtype === 'mistake') {
                    result[key].Mistake++;
                }
            }
        });
    }
    console.log(result);
}

// ==UserScript==
// @name         Error Counter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://flide.ap.tesla.services/3d/TCLP*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tesla.services
// @grant        none
// ==/UserScript==

(function() {



    function create(parent) {
        const commentBoxHTML = '<div class="css-1vft9uj" style="border-top: thin solid red;">' +
            '<div class="css-vujjmw" style="margin-left: 10px;">' +
            '<div class="css-1xi4blx"><label id="major" cursor="pointer" class="css-gb89ao">' +
            '<div class="css-14njx65">Needs Work (Mistake): 0</div>' +
            '</label></div>' +
            '<div class="css-1xi4blx"><label id="minor" cursor="pointer" class="css-gb89ao">' +
            '<div class="css-14njx65">Needs Work (Minor Mistake): 0</div>' +
            '</label></div>' +
            '<div class="css-1xi4blx"><label id="guideline" cursor="pointer" class="css-gb89ao">' +
            '<div class="css-14njx65">Needs Work (Guideline Change): 0</div>' +
            '</label></div>' +
            '</div>' +
            '</div>'

        let noteArea = document.createElement('div');
        noteArea.innerHTML = commentBoxHTML;
        parent.append(noteArea);
    };

    function exe(parent) {

        let Major = document.querySelector("#major")
        let Minor = document.querySelector("#minor")
        let Guideline = document.querySelector("#guideline")

        let Major_count = 0;
        let Minor_count = 0;
        let Guideline_count = 0;

        let commentBoxes = parent.childNodes[1].childNodes[1].childNodes[1].childNodes[1].childNodes[1].childNodes;

        commentBoxes.forEach(
            function(item) {
                // if (item.textContent.includes("Incorrect lane logic")){
                //     var crit = item.textContent.match(/\dx|x\d/g)
                //     if (crit !== null)
                //         Major.lastChild.textContent = parseInt(Major.lastChild.textContent) + parseInt(crit[0].replace(/x/g, ""))
                // }
                // else
                if (item.textContent.includes("Needs Work (Mistake)"))
                    Major_count += 1;
                else if (item.textContent.includes("Needs Work (Minor Mistake)"))
                    Minor_count += 1;
                else if (item.textContent.includes("Needs Work (Guideline Change)"))
                    Guideline_count += 1;;

            }
        );

        Major.firstChild.textContent = `Needs Work (Mistake): ${Major_count}`
        Minor.firstChild.textContent = `Needs Work (Minor Mistake): ${Minor_count}`
        Guideline.firstChild.textContent = `Needs Work (Guideline Change): ${Guideline_count}`



    };



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

    let hasRun = false
    requestAnimationFrame(run)

    function run() {
        let parent = document.querySelector("#root > main > div.css-vivuko > div.css-q2jbf2 > div.react-draggable > div.css-yncms1 > div") //need to update now and then
        if (parent) {
            if (!hasRun) {

                const element = createElementWithProperties('div', {
                    className: 'css-1vft9uj',
                    style: {
                        borderTop: 'thin solid red'
                    },
                    children: [{
                            tag: 'div',
                            className: 'css-vujjmw',
                            style: {
                                marginLeft: '10px',
                                gridTemplateColumns: 'auto auto auto auto auto'
                            },
                            children: [{
                                tag: 'button',
                                id: 'showFrameBreakDown',
                                className: 'css-14njx65',///////////////////
                                style: {
                                    transform: 'rotate(0deg)',
                                    testAlign: 'center',
                                    height: '20px',
                                    width: '20px'
                                },
                                onclick: () => {
                                    document.getElementById('frameBreakDown').style.display = document.getElementById('frameBreakDown').style.display == '' ? 'none' : ''
                                    document.getElementById('showFrameBreakDown').style.transform = document.getElementById('frameBreakDown').style.transform == 'rotate(0deg)' ? 'rotate(90deg)' : 'rotate(0deg)'
                                },
                                innerHTML: '▶'
                                },
                                {
                                    tag: 'select',
                                    id: 'countBreakDown',
                                    innerHTML: '<option value="total">Total</option>'+
                                               '<option value="unresolved">Unresolved</option>'+
                                               '<option value="pending">Pending</option>'+
                                               '<option value="resolved">Resolved</option>'
                                },
                                {
                                    tag: 'span',
                                    id: 'mistake',
                                    className: 'css-14njx65',
                                    innerHTML: 'Mistake'
                                },
                                {
                                    tag: 'span',
                                    id: 'minorMistake',
                                    className: 'css-14njx65',
                                    innerHTML: 'minorMistake'
                                },
                                {
                                    tag: 'button',
                                    className: 'css-14njx65',///////////////////
                                    innerHTML: '|R|'
                                },
                            ]
                        },
                        {
                            tag: 'div',
                            id: 'frameBreakDown',
                            className: 'css-1vft9uj',
                            style: {
                                borderTop: 'thin solid grey',
                                display: 'none'
                            },
                        }
                    ]
                });
                parent.append(element)

                //change any parent styles
                // parent.firstChild.style.gridTemplateColumns = 'auto auto auto'

                hasRun = true
            }

            //add button onclick()
        } else
            hasRun = false

        requestAnimationFrame(run);
    }
})();

//↻