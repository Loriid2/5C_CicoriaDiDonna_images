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
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "files"));
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
const upload = multer({ storage: storage }).single('file');
app.use("/", express.static(path.join(__dirname, "public")));
app.post("/image/add", (req, res) => {
   upload(req, res, (err) => {
      console.log(req.file.filename);    
      res.json({ url: "./files/" + req.file.filename });    
  });

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
      fs.unlink(await serverDB.selectById(req.params.id).url, (err) => {
         if (err) {
           console.error(`Error removing file: ${err}`);
           return;
         }
       
         console.log(`File has been successfully removed.`);
       });
    } catch (error) {
      res.status(500).json({ error: "Errore durante l'eliminazione" });
    }
  });
  const server = http.createServer(app);

  server.listen(80, () => {
  
    console.log("- server running");
  
  });
  serverDB.test();