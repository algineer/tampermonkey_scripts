const getProject = () => {
    return window.location.href.match(/project=\w+/g)[0].replace('project=', '')
}

// Function to perform a single fetch request
async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    if (JSON.stringify(data.stats) !== '{}')
        return data.stats[getProject()].numberOfVideosPastInQA
    else
        return 0
}

// Use Promise.all to execute fetch requests concurrently
const fetchAllData = async(urls) => {
    try {
        const responses = await Promise.all(urls.map(url => fetchData(url)));
        // responses is an array of the resolved data from all requests
        // const convertedData = await convertTo2DArray(responses, 5)
        return responses
    } catch (error) {
        console.error('Error:', error);
    }
}

const convertTo2DArray = async(arr, chunkSize) => {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        result.push(arr.slice(i, i + chunkSize));
    }
    return result;
}

const generateDateArray = (startDate, numberOfDays = 5) => {
    const dateArray = [startDate];
    let currentDate = new Date(startDate);

    for (let i = 1; i < numberOfDays; i++) {
        currentDate.setDate(currentDate.getDate() + 1);
        const formattedDate = currentDate.toISOString().split('T')[0];
        dateArray.push(formattedDate);
    }

    return dateArray;
}

const generateLdapArray = (list) => {
    const ldapArray = [];
    list.forEach(element => {
        ldapArray.push(element.childNodes[0].textContent.match(/\(\w+\)/g)[0].replace().replace(/[()]/g, ''))
    });

    return ldapArray;
}

const generateUrlArray = (ldapArray, dateArray) => {
    const urlArray = [];
    ldapArray.forEach(ldap => {
        dateArray.forEach(date => {
            urlArray.push(`https://humans.ap.tesla.services/api/internal/performance/${ldap}/${date}?`)
        })

    });
    return urlArray;
}

// Dates
let startDate = window.location.href.match(/\d+-\d+-\d+/g)[0]
let dates = generateDateArray(startDate)

//LDAPs
let rowList = document.querySelectorAll('[role="row"]')
rowList = Array.from(rowList).slice(1)

let ldaps = generateLdapArray(rowList)

//Urls
let urls = generateUrlArray(ldaps, dates)

// Call the function to initiate the requests
let data
fetchAllData(urls)
    .then(DATA => {
        data = DATA
    })