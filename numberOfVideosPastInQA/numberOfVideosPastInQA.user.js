// ==UserScript==
// @name         Number Of Videos Past In QA
// @namespace    https://github.com/algineer/
// @version      1.0.0
// @description  Create a CSV to view Team QASO amount by day
// @author       Algineer
// @match        https://humans.ap.tesla.services/performance/labeling*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tesla.services
// @grant        none
// @downloadURL  https://github.com/algineer/tampermonkey_scripts/raw/main/numberOfVideosPastInQA/numberOfVideosPastInQA.user.js
// @updateURL    https://github.com/algineer/tampermonkey_scripts/raw/main/numberOfVideosPastInQA/numberOfVideosPastInQA.user.js
// ==/UserScript==

(function() {
    const getProject = () => {
        return window.location.href.match(/project=\w+/g)[0].replace("project=", "")
    }

    // Function to perform a single fetch request
    const fetchData = async(url) => {
        const response = await fetch(url)
        const data = await response.json()
        if (JSON.stringify(data.stats) !== "{}")
            return data.stats[getProject()].numberOfVideosPastInQA
        else return 0
    }

    // Use Promise.all to execute fetch requests concurrently
    const fetchAllData = async(urls) => {
        try {
            const responses = await Promise.all(urls.map((url) => fetchData(url)))

            return responses
        } catch (error) {
            console.error("Error:", error)
        }
    }

    const convertTo2DArray = (arr, chunkSize) => {
        const result = []
        for (let i = 0; i < arr.length; i += chunkSize) {
            result.push(arr.slice(i, i + chunkSize))
        }
        return result
    }

    const generateDateArray = (startDate, numberOfDays = 5) => {
        const dateArray = [startDate]
        let currentDate = new Date(startDate)

        for (let i = 1; i < numberOfDays; i++) {
            currentDate.setDate(currentDate.getDate() + 1)
            const formattedDate = currentDate.toISOString().split("T")[0]
            dateArray.push(formattedDate)
        }

        return dateArray
    }

    const generateLdapArray = (list) => {
        const ldapArray = []
        list.forEach((element) => {
            ldapArray.push(
                element.childNodes[0].textContent
                .match(/\(\w+\)/g)[0]
                .replace()
                .replace(/[()]/g, "")
            )
        })

        return ldapArray
    }

    const generateUrlArray = (ldapArray, dateArray) => {
        const urlArray = []
        ldapArray.forEach((ldap) => {
            dateArray.forEach((date) => {
                urlArray.push(
                    `https://humans.ap.tesla.services/api/internal/performance/${ldap}/${date}?`
                )
            })
        })
        return urlArray
    }

    const createElementWithProperties = (tag, properties) => {
        const element = document.createElement(tag);

        for (const [key, value] of Object.entries(properties)) {
            if (key === 'style' && typeof value === 'object') {
                // If the property is 'style' and the value is an object, apply styles recursively
                for (const [styleKey, styleValue] of Object.entries(value)) {
                    element.style[styleKey] = styleValue;
                }
            } else {
                // For other properties, directly set the value
                element[key] = value;
            }
        }

        return element;
    }

    const generateCSVData = ({ dateArray, ldapArray, data2D }) => {
        dateArray.unshift("Dates")
        data2D.forEach((data1D, index) => {
            data1D.unshift(ldapArray[index])
        })
        data2D.unshift(dateArray)

        return data2D
    }

    const createCSV = (csvData) => {
        let csvContent =
            "data:text/csv;charset=utf-8," +
            csvData.map((e) => e.join(",")).join("\n")
        var encodedUri = encodeURI(csvContent)
        window.open(encodedUri)
    }

    const run = async() => {
        let startDate = window.location.href.match(/\d+-\d+-\d+/g)[0]
        let dates = generateDateArray(startDate)

        //LDAPs
        let rowList = document.querySelectorAll('[role="row"]')
        rowList = Array.from(rowList).slice(1)

        let ldaps = generateLdapArray(rowList)

        //Urls
        let urls = generateUrlArray(ldaps, dates)

        // Call the function to initiate the requests

        let data = await fetchAllData(urls)
        let d2 = convertTo2DArray(data, 5)

        createCSV(
            generateCSVData({
                dateArray: dates,
                ldapArray: ldaps,
                data2D: d2,
            })
        )
    }

    const loopUntil = () => {
        let parent = document.querySelector(
                "#root > div > div.css-t32mmx > div.css-1ifbo89 > div.css-603q35 > div"
            ) //need to update now and then
        if (parent) {
            //style--------
            const element = createElementWithProperties("button", {
                className: "css-93hyt",
                innerText: "Q",
                onclick: () => {
                    run();
                },
                style: {
                    backgroundColor: "#666666",
                    color: "white",
                    fontSize: "16px", // You can add more styles here
                },
            })
            parent.append(element)

            //change any parent styles
            parent.style.gridTemplateColumns =
                "100px 240px 160px 256px 160px 160px auto 1fr auto auto auto auto"

            //Logic--------

            // Dates
        } else requestAnimationFrame(loopUntil)
    }
    requestAnimationFrame(loopUntil)
})()