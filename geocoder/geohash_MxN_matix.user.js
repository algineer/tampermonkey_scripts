// ==UserScript==
// @name         MxN Geohash Matix
// @namespace    https://github.com/algineer/
// @version      1.0.0
// @description  Generate MxN Geohash Matix
// @author       Algineer
// @match        https://*/*
// @downloadURL  https://github.com/algineer/tampermonkey_scripts/raw/main/geocoder/geohash_MxN_matix.user.js
// @updateURL    https://github.com/algineer/tampermonkey_scripts/raw/main/geocoder/geohash_MxN_matix.user.js
// @grant        GM_registerMenuCommand
// ==/UserScript==



(function() {

    BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";
    NEIGHBORS = {
        east: { even: "bc01fg45238967deuvhjyznpkmstqrwx" },
        right: { even: "bc01fg45238967deuvhjyznpkmstqrwx" },
        west: { even: "238967debc01fg45kmstqrwxuvhjyznp" },
        left: { even: "238967debc01fg45kmstqrwxuvhjyznp" },
        north: { even: "p0r21436x8zb9dcf5h7kjnmqesgutwvy" },
        top: { even: "p0r21436x8zb9dcf5h7kjnmqesgutwvy" },
        south: { even: "14365h7k9dcfesgujnmqp0r2twvyx8zb" },
        bottom: { even: "14365h7k9dcfesgujnmqp0r2twvyx8zb" }
    };
    BORDERS = {
        east: { even: "bcfguvyz" },
        right: { even: "bcfguvyz" },
        west: { even: "0145hjnp" },
        left: { even: "0145hjnp" },
        north: { even: "prxz" },
        top: { even: "prxz" },
        south: { even: "028b" },
        bottom: { even: "028b" }
    };

    //EWNS
    NEIGHBORS.south.odd = NEIGHBORS.west.even;
    NEIGHBORS.north.odd = NEIGHBORS.east.even;
    NEIGHBORS.west.odd = NEIGHBORS.south.even;
    NEIGHBORS.east.odd = NEIGHBORS.north.even;

    BORDERS.south.odd = BORDERS.west.even;
    BORDERS.north.odd = BORDERS.east.even;
    BORDERS.west.odd = BORDERS.south.even;
    BORDERS.east.odd = BORDERS.north.even;

    //RLTB
    NEIGHBORS.bottom.odd = NEIGHBORS.left.even;
    NEIGHBORS.top.odd = NEIGHBORS.right.even;
    NEIGHBORS.left.odd = NEIGHBORS.bottom.even;
    NEIGHBORS.right.odd = NEIGHBORS.top.even;

    BORDERS.bottom.odd = BORDERS.left.even;
    BORDERS.top.odd = BORDERS.right.even;
    BORDERS.left.odd = BORDERS.bottom.even;
    BORDERS.right.odd = BORDERS.top.even;


    /**
     * Calculates adjacent geohash given following paramiters.
     *
     * @param   {string} srcHash  The starting geohash.
     * @param   {string} dir  The direction of the next geohash.
     * @param   {number} step  The number of geohashes till the next geohash.
     * @returns {string} The adjacent geohash.
     */
    function calculateAdjacent(srcHash, dir, step = 1) {
        srcHash = srcHash.toLowerCase();
        var lastChr = srcHash.charAt(srcHash.length - 1);
        var type = (srcHash.length % 2) ? 'odd' : 'even';
        var base = srcHash.substring(0, srcHash.length - 1);

        // Base case: if n is 0, return the srcHash
        if (step === 0) return srcHash;

        // Recursive case
        if (BORDERS[dir][type].indexOf(lastChr) != -1) {
            base = calculateAdjacent(base, dir);
        }

        return calculateAdjacent(base + BASE32[NEIGHBORS[dir][type].indexOf(lastChr)], dir, step - 1);
    }

    function getMxN(row, col, centerhash, mult = 1, arrType = "array") {

        if (row % 2 == 0 || col % 2 == 0)
            throw new Error("MxN matrix needs odd values for both M and N")

        const hashMatix = []

        let starting_hash = calculateAdjacent(calculateAdjacent(centerhash, "left", ((col - 1) / 2) * mult), "top", ((row - 1) / 2) * mult)

        if (starting_hash == centerhash.toLowerCase())
            return [starting_hash]

        for (let i = 1; i <= row; i++) {
            let hashArr = []
            hashArr.push(starting_hash)
            for (let j = 1; j < col; j++) {
                starting_hash = calculateAdjacent(starting_hash, "right")
                hashArr.push(starting_hash)
            }
            hashMatix.push(hashArr)
            starting_hash = calculateAdjacent(hashArr[0], "bottom")
        }
        if (arrType == "matrix")
            return hashMatix
        else if (arrType == "array")
            return hashMatix.flatMap(innerArray => innerArray.map(item => [item]));
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


    //-----------------------
    let dataHeaders = [
        "geoahashes"
    ]

    let m = window.prompt("M")
    let n = window.prompt("N")
    let geohash = window.prompt("Center Geohash")


    let data = getMxN(m, n, geohash)

    data.unshift(dataHeaders)
    data = arrayToCsv(data)
    downloadCSV(data, `geohash_matix_${geohash}_${m}x${n}.csv`)
})();