#!/usr/bin/env node
const yargs = require("yargs");
const XLSX = require("sheetjs-style");
const fs = require("fs");

const excelPath = yargs.argv["excel-path"];
const outputPath = yargs.argv["output-path"];
const keyColumn = yargs.argv["key-column"];
const i18nColumns = yargs.argv["i18n-columns"];

const workbook = XLSX.readFile(excelPath);
const sheetNames = workbook.SheetNames;

const jsonData = i18nColumns.reduce((prev, column) => {
    return {
        ...prev,
        [column]: {},
    };
}, {});

for (const sheetName of sheetNames) {
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    for (const row of rows.filter((row) => row[keyColumn])) {
        const key = row[keyColumn];

        for (const column of i18nColumns) {
            jsonData[column][key] = row[column] ?? "";
        }
    }
}

const writeFile = async (data) => {
    for (const fileName of Object.keys(data)) {
        await fs.writeFileSync(
            `${outputPath}/${fileName}.json`,
            JSON.stringify(data[fileName]),
            { encoding: "utf-8" }
        );
    }
};

writeFile(jsonData);
