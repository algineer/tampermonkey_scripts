// ==UserScript==
// @name         TPV From Responces
// @namespace    https://github.com/algineer/
// @version      1.3.0
// @description  Download CSV with Clip TPV from Responces
// @author       Algineer
// @match        https://*/3d/responses*
// @grant        none
// @downloadURL  https://github.com/algineer/tampermonkey_scripts/raw/main/fetch/tpv_responces.user.js
// @updateURL    https://github.com/algineer/tampermonkey_scripts/raw/main/fetch/tpv_responces.user.js
// @run-at       context-menu
// ==/UserScript==

(function() {
    // Function to perform a single fetch request
    const getProject = () => {
        let project = document.querySelector("div.css-4c761y").textContent
        project = project.split(" ")
        project[0] = project[0].toLowerCase()
        project = project.join("").replace("(", ".").replace(")", "")

        return project
    }

    const fetchData = async(id) => {
        const response = await fetch(`/api/internal/3d/videos/${id}`)
        const data = await response.json()

        console.log(id)

        let latest_project_statuses = data.latest_project_statuses[getProject()]

        var labeling_ldap
        var labeling_tpv

        //Labeling Ldap
        try {
            labeling_ldap = latest_project_statuses.LABELLING_DONE.username
        } catch {
            labeling_ldap = ""
        }

        //Labeling T/V
        try {
            labeling_tpv = data.labelling_duration_ms[getProject()]
            labeling_tpv = new Date(labeling_tpv)
        } catch {
            labeling_tpv = ""
        }

        if (labeling_ldap != "" && labeling_ldap != undefined)
            return [id, labeling_ldap, `=TIME(${labeling_tpv.getUTCHours()}, ${labeling_tpv.getUTCMinutes()}, ${labeling_tpv.getUTCSeconds()})`]
        return [id, labeling_ldap, '=TIME(0,0,0)']

    }

    // Use Promise.all to execute fetch requests concurrently
    const fetchAllData = async(urls) => {
        try {
            let responses = []
                // const responses = await Promise.all(urls.map((id) => fetchData(id)))
            for (let id of urls) {
                responses.push(await fetchData(id))
            }

            return responses
        } catch (error) {
            console.error("Error:", error)
        }
    }

    const arrayToCsv = (data) => {
        return data.map(row =>
            row
            .map(String) // convert every value to String
            .map(v => v.replaceAll('"', '""')) // escape double quotes
            .map(v => `"${v}"`) // quote it
            .join(',') // comma-separated
        ).join('\r\n'); // rows starting on new lines
    }

    const downloadCSV = (content, filename) => {
        // Create a blob
        var blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        var url = URL.createObjectURL(blob);

        // Create a link to download it
        var link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        //Remove Object Url
        URL.revokeObjectURL(url)
    }

    const run = async() => {

        let dataHeaders = ["Clip ID ", "LDAP", "T/V"]


        let list = document.querySelectorAll("a.css-1xi4blx")

        let clip_id_list = []

        list.forEach(clip_url => {
            clip_id_list.push(clip_url.href.match(/[a-zA-Z]+-\d\d\d\d-\d\d-\d\d-\d\d-\d\d-\d\d-......../g)[0])
        })

        let data = await fetchAllData(clip_id_list)

        data.unshift(dataHeaders)
        data = arrayToCsv(data)

        downloadCSV(data, `${getProject()}_TPV.csv`)
            // console.table(data)
    }

    run()
})();