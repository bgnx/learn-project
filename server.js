require(`http`).createServer((req, res) => {
  console.log(new Date().toString(), req.url);
  if (req.url === `/`) {
    res.end(require(`fs`).readFileSync(__dirname + `/index.html`));
    return;
  }
  if(req.url === `/client.js`){
    res.setHeader(`content-type`, `application/js`);
    res.end(require(`fs`).readFileSync(__dirname + `/client.js`));
    return;
  }
}).listen(3000);