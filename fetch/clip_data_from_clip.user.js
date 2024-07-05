// ==UserScript==
// @name         Clip Data
// @namespace    https://github.com/algineer/
// @version      1.1.0
// @description  Console.log() clip data 
// @author       Algineer
// @match        https://*/3d/MESH*
// @match        https://*/3d/TCLP*
// @match        https://*/3d/FLDE*
// @match        https://*/viz/tclip*
// @grant        none
// @downloadURL  https://github.com/algineer/tampermonkey_scripts/raw/main/fetch/clip_data_from_clip.user.js
// @updateURL    https://github.com/algineer/tampermonkey_scripts/raw/main/fetch/clip_data_from_clip.user.js
// @run-at       context-menu
// ==/UserScript==

(function() {

    //fetch the data
    const fetchData = async(path, id) => {
        const response = await fetch(`${path}${id}`)
        const data = await response.json()

        console.log(id)

        return data
    }

    //process the fetched data
    const run = async() => {
        let domain = window.location.href.match(/(?<=\/\/)(.*?)(?=\.)/)[0]
        let id = window.location.href.match(/[a-zA-Z]+(?:-\d+){6}-[[:alnum:]]+/g)[0]
        let data

        if (domain == 'flide')
            data = await fetchData('/api/internal/3d/videos/', id)
        else if (domain == 'tclip')
            data = await fetchData('/api/internal/v1/clips/', id)

        window.data = data

        console.log(data)
    }

    run()

})();