const google = require('googlethis');
const nameToSearch = 'Hatchet';

async function test() {
    try {
        const response = await google.search(`${nameToSearch} founders CEO CTO LinkedIn`, {
            page: 0,
            safe: false,
            parse_ads: false
        });
        console.log("Founders:", response.results.slice(0, 3));
    } catch (e) {
        console.error("Google Founders error:", e);
    }
}

test();
