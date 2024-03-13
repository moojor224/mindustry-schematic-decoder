import * as fs from 'fs';
import { Schematic, Items, Blocks } from 'mindustry-schematic-parser';
import * as parser from 'mindustry-schematic-parser';
import * as msch from "msch";

const base64 = 'bXNjaAF4nE2N227CMAyGf9KjhrRpSNznBXqFtBfhCUJjUBEklUkH7NG5oDhppWHH+Rwf/iBDqZA7cyZ8b24/emuc1cHrbcumx9LSpeWuD513WL899MFrvWOxGh/9cPol7v6IJfdX4sZ5S/jqnJQD2ebiBYzPwVni/clfm4MJhPo4uDZJl/NEyX6IrHYmCO8AVvi3RTpQdQWMT6hxlBBKVYlLZ3zMo9mEHKleFDHN0vYiQjxPW6koUQjyNFVKVsSOmiSiOqr5A7myCUlZzcovD0488Q==';
const baseSchematic = "bXNjaAF4nGNgYmBiZmDJS8xNZWBPzs/JL1IwYOBOSS1OLsosKMnMz2NgYGDLSUxKzSlmYIqOZWRgS07MK0ssBgozMoAAHxCbMZAHAG64Ds0=";
let shapes = "bXNjaAF4nGNgYmBiZmDJS8xNZWArzkgsSC1m4E5JLU4uyiwoyczPY2BgYMtJTErNKWZgio5lZGBLTswrSywGCjMygAAfEJv9nP///38FIHb/8P9///8f/3GC+yDiL4TBAAD15EHm";
let arr = [128, 64, 32, 16, 8, 4, 2, 1];
let charArr = new Array(432);
[shapes].forEach(e => {
    let s = Schematic.decode(e);
    console.log(s);
    // debugger;

    let eight = s.tiles[0].config.reverse().map(e => {
        return (e + 128).toString(2).padStart(8, 0);
    }).join("").split("");
    let counter = 0;
    s.tiles[0].config.forEach(e => {
        for (var i = 0; i < 8; i++) {
            if (arr[i] & e) {
                charArr[counter] = "1";
            } else {
                charArr[counter] = "0";
            }
            counter++;
        }
    });

    charArr = charArr.join("").match(/.{3}/g);
    let chunks = [];
    let chunkSize = 12;
    for (let i = 0; i < charArr.length; i += chunkSize) {
        const chunk = charArr.slice(i, i + chunkSize);
        chunks.push(chunk);
    }
    chunks = chunks.reverse().map(e => e.reverse().join(",")).join("\n");
    encode(chunks);
});

function encode(data) {
    let array = data.split("\n").map(e => e.replaceAll(",", "").match(/.{3}/g).reverse().join("").split("")).reverse();
    array = (array.flat());
    let compressed = new Array(54);
    let counter = 0;
    for (var i = 0; i < 54; i++) {
        let sum = 0;
        for (var e = 0; e < 8; e++) {
            sum *= 2;
            if (array[counter] === "1") {
                sum += 1;
            }
            counter++;
        }
        if (sum > 127) {
            sum -= 256;
        }
        compressed[i] = sum;
    }
    return compressed.reverse();
}
function makeSchematic(colorsArr) {
    let schematic = new msch.Schematic(2, 2, 6, {}, {}, []);
    schematic.setTileAt(0, 1, new msch.Tile("Canvas", 2, 2));
    let s = parser;
    debugger;
}
makeSchematic();
// save a preview of the schematic
let schem = Schematic.decode(base64);
let a = new Blocks.crafting.AtmosphericConcentrator();
// debugger
schem.render({
    background: false
    // disable background
}).then(nodeCanvas => nodeCanvas.toBuffer()).then(buffer => fs.writeFileSync('my_file.png', buffer));
