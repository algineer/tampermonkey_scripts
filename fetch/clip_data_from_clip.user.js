// ==UserScript==
// @name         Clip Data
// @namespace    https://github.com/algineer/
// @version      1.0.1
// @description  Console.log() clip data 
// @author       Algineer
// @match        https://*/3d/MESH*
// @match        https://*/3d/TCLP*
// @match        https://*/3d/FLDE*
// @grant        none
// @downloadURL  https://github.com/algineer/tampermonkey_scripts/raw/main/fetch/clip_data_from_clip.user.js
// @updateURL    https://github.com/algineer/tampermonkey_scripts/raw/main/fetch/clip_data_from_clip.user.js
// @run-at       context-menu
// ==/UserScript==

(function() {

    //fetch the data
    const fetchData = async(id) => {
        const response = await fetch(`/api/internal/3d/videos/${id}`)
        const data = await response.json()

        console.log(id)

        return data
    }

    //process the fetched data
    const run = async() => {
        let id = window.location.href.match(/[a-zA-Z]+-\d\d\d\d-\d\d-\d\d-\d\d-\d\d-\d\d-......../g)[0]

        let data = await fetchData(id)

        window.data = data

        console.log(window.data)
    }

    run()

})();