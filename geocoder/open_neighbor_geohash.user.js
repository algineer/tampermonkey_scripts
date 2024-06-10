// ==UserScript==
// @name         Open Neighbor
// @namespace    https://github.com/algineer/
// @version      1.0.0
// @description  Open Neighbor Geohash 
// @author       Algineer
// @match        https://*/3d/MESH*
// @match        https://*/3d/TCLP*
// @match        https://*/3d/FLDE*
// @downloadURL  https://github.com/algineer/tampermonkey_scripts/raw/main/geocoder/open_neighbor_geohash.user.js
// @updateURL    https://github.com/algineer/tampermonkey_scripts/raw/main/geocoder/open_neighbor_geohash.user.js
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {

    const BITS = [16, 8, 4, 2, 1];
    const BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";
    const BASE32_MAP = {};
    for (let i = 0; i < BASE32.length; i++) {
        BASE32_MAP[BASE32[i]] = i;
    }

    const decodeGeoHash = (geohash) => {
        let isEven = true;
        const latRange = [-90, 90];
        const lonRange = [-180, 180];
        for (let i = 0; i < geohash.length; i++) {
            const chr = geohash[i];
            const idx = BASE32_MAP[chr];
            for (let n = 4; n >= 0; n--) {
                const bitN = idx >> n & 1;
                if (isEven) {
                    refineInterval(lonRange, bitN);
                } else {
                    refineInterval(latRange, bitN);
                }
                isEven = !isEven;
            }
        }
        return [(latRange[0] + latRange[1]) / 2, (lonRange[0] + lonRange[1]) / 2];
    };

    const refineInterval = (interval, bit) => {
        if (bit === 1) {
            interval[0] = (interval[0] + interval[1]) / 2;
        } else {
            interval[1] = (interval[0] + interval[1]) / 2;
        }
    };

    const encodeGeoHash = (latitude, longitude, precision) => {
        let isEven = true;
        let bit = 0;
        let ch = 0;
        let geohash = '';
        const latRange = [-90, 90];
        const lonRange = [-180, 180];
        while (geohash.length < precision) {
            let mid;
            if (isEven) {
                mid = (lonRange[0] + lonRange[1]) / 2;
                if (longitude > mid) {
                    ch |= BITS[bit];
                    lonRange[0] = mid;
                } else {
                    lonRange[1] = mid;
                }
            } else {
                mid = (latRange[0] + latRange[1]) / 2;
                if (latitude > mid) {
                    ch |= BITS[bit];
                    latRange[0] = mid;
                } else {
                    latRange[1] = mid;
                }
            }
            isEven = !isEven;
            if (bit < 4) {
                bit++;
            } else {
                geohash += BASE32[ch];
                bit = 0;
                ch = 0;
            }
        }
        return geohash;
    };

    const nextGeohash = (n, direction, geohash) => {
        const latLon = decodeGeoHash(geohash.toLocaleLowerCase());
        let newLatLon = [];
        switch (direction.toLowerCase()) {
            case 'north':
                newLatLon = [latLon[0] + n * 0.0013697, latLon[1]];
                break;
            case 'south':
                newLatLon = [latLon[0] - n * 0.0013697, latLon[1]];
                break;
            case 'east':
                newLatLon = [latLon[0], latLon[1] + n * 0.0013697];
                break;
            case 'west':
                newLatLon = [latLon[0], latLon[1] - n * 0.0013697];
                break;
            default:
                return "Invalid direction";
        }
        return encodeGeoHash(newLatLon[0], newLatLon[1], geohash.length).toLocaleUpperCase();
    };

    let geohash = window.location.href.match(/[0-9B-Z]{1,12}(?=\?)/gi)[0]

    const menu_command_north = GM_registerMenuCommand("North", function(event) {
        const neighborGeohash = nextGeohash(3, 'north', geohash);
        window.open(window.location.href.replace(/[0-9B-Z]{1,12}(?=\?)/gi, neighborGeohash), "_blank")
    });
    const menu_command_east = GM_registerMenuCommand("East", function(event) {
        const neighborGeohash = nextGeohash(3, 'east', geohash);
        window.open(window.location.href.replace(/[0-9B-Z]{1,12}(?=\?)/gi, neighborGeohash), "_blank")
    });
    const menu_command_west = GM_registerMenuCommand("West", function(event) {
        const neighborGeohash = nextGeohash(3, 'west', geohash);
        window.open(window.location.href.replace(/[0-9B-Z]{1,12}(?=\?)/gi, neighborGeohash), "_blank")
    });
    const menu_command_south = GM_registerMenuCommand("South", function(event) {
        const neighborGeohash = nextGeohash(3, 'south', geohash);
        window.open(window.location.href.replace(/[0-9B-Z]{1,12}(?=\?)/gi, neighborGeohash), "_blank")
    });

})();