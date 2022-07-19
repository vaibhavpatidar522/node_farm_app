const fs = require('fs');
const http = require('http');
const { json } = require('stream/consumers');
const url = require('url');

// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `this is all about file system ${textIn}`;

// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("succes");
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/templates-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/templates-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const replaceTemp = (temp, product) => {
  // console.log(typeof temp);
  let output = temp.replace(/{%PRODUCT_NAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

  return output;
};

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //OVERVIEW-PAGE
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const cartHtml = dataObj.map((el) => replaceTemp(tempCard, el)).join();
    // console.log(cartHtml);
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cartHtml);
    res.end(output);
  }

  //PRODUCT-PAGE
  else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemp(tempProduct, product);
    res.end(output);
  }
  //API
  else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
  }

  //PAGE-NOTE FOUND
  else {
    res.end('404 page not found');
  }
});

server.listen(8000, () => {
  console.log('server connected');
});
