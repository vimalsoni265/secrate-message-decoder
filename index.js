const fetch = require("node-fetch");
const cheerio = require("cheerio");

async function decodeSecrateMessage(url) {
  try {
    const gridData = await fetchAndPrepareJson(url);
    if (!gridData || !gridData.grid) {
      throw new Error("Processing failed: Invalid data structure provided.");
    }

    const gridArray = gridData.grid;
    // console.log(gridArray);

    if (!Array.isArray(gridArray)) {
      throw new Error("Processing failed: data type is not an array");
    }

    const grid = new Map();
    let maxX = 0;
    let maxY = 0;

    gridData.grid.forEach((row) => {
      const x = parseInt(row.x, 10);
      const y = parseInt(row.y, 10);
      const char = row.character;

      if (!isNaN(x) && !isNaN(y)) {
        grid.set(`${x},${y}`, char);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    });

    // Print the letter
    for (let y = maxY; y >= 0; y--) {
      let line = "";
      for (let x = 0; x <= maxX; x++) {
        line += grid.get(`${x},${y}`) || " ";
      }
      console.log(line);
    }
  } catch (err) {
    console.error("Processing failed:", err);
  }
}

async function fetchAndPrepareJson(url) {
  const response = await fetch(url);
  const html = await response.text();

  const $ = cheerio.load(html);
  const data = [];

  // Parse the table rows for x, character, and y coordinates
  $("table tr").each((index, row) => {
    const cells = $(row).find("td");
    if (cells.length >= 3) {
      const x = $(cells[0]).text().trim();
      const character = $(cells[1]).text().trim();
      const y = $(cells[2]).text().trim();
      data.push({ x, character, y });
    }
  });

  // Return the JSON structure
  return { grid: data };
}

let inputActualUrl =
  "https://docs.google.com/document/d/e/2PACX-1vQGUck9HIFCyezsrBSnmENk5ieJuYwpt7YHYEzeNJkIb9OSDdx-ov2nRNReKQyey-cwJOoEKUhLmN9z/pub";

let inputTestingUrl =
  "https://docs.google.com/document/d/e/2PACX-1vRMx5YQlZNa3ra8dYYxmv-QIQ3YJe8tbI3kqcuC7lQiZm-CSEznKfN_HYNSpoXcZIV3Y_O3YoUB1ecq/pub";

// Decoding a Secret Message
decodeSecrateMessage(inputActualUrl);
