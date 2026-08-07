const fs = require("fs");

const SOURCE_URL = "https://api.riel.ua/feeds/vtour_Maxima_3.json";

async function main() {
    const response = await fetch(SOURCE_URL);

    if (!response.ok) {
        throw new Error(`Failed to download JSON: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();

    const sanitized = {
        status: json.status,
        code: json.code,
        messages: json.messages,
        meta: json.meta,
        data: json.data.map(item => ({
            number: item.number,
            system_status: item.system_status,
            is_selling: item.is_selling,
            id: item.id,
            building: item.building?.name ?? null,
            section: item.section?.name ?? null,
            floor: item.floor?.name ?? null
        }))
    };

    fs.writeFileSync(
        "sanitized.json",
        JSON.stringify(sanitized, null, 2),
        "utf8"
    );

    console.log(`Generated sanitized.json (${sanitized.data.length} records)`);
}

main().catch(error => {
    console.error(error);
    process.exit(1);
});
