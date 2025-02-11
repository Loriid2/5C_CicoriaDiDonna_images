const fs = require('fs');
const http=require("http");
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const serverDB = require("./serverDB.js");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));

const path = require('path');
app.use("/", express.static(path.join(__dirname, "public")));
app.post("/image/add", (req, res) => {

    const image = req.body;
 
    serverDB.insert(image);
 
    res.json({result: "Ok"});
 
 });
 app.get("/image", async (req, res) => {
    try {
        const images = await serverDB.select();
        res.json({ images:images });
    } catch (error) {
        res.status(500).json({ error: "Errore del server" });
    }
});
app.delete("/image/:id", async (req, res) => {
    try {
      await serverDB.del(req.params.id); 
      res.json({ result: "Ok" });
    } catch (error) {
      res.status(500).json({ error: "Errore durante l'eliminazione" });
    }
  });
  const server = http.createServer(app);

  server.listen(80, () => {
  
    console.log("- server running");
  
  });
  serverDB.test();