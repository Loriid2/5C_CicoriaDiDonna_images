const fs = require('fs');
const http=require("http");
const mysql = require('mysql2');
const conf = JSON.parse(fs.readFileSync('conf.json'));
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));
conf.ssl = {
    ca: fs.readFileSync(__dirname + '/ca.pem')
}
const path = require('path');
app.use("/", express.static(path.join(__dirname, "public")));
const connection = mysql.createConnection(conf);
const executeQuery = (sql) => {
    return new Promise((resolve, reject) => {      
          connection.query(sql, function (err, result) {
             if (err) {
                console.error(err);
                reject();     
             }   
             console.log('done');
             resolve(result);         
       });
    })
 }
 const createTable = () => {
    return executeQuery(`
    CREATE TABLE IF NOT EXISTS images
       ( id INT PRIMARY KEY AUTO_INCREMENT, 
          url VARCHAR(255) NOT NULL ) 
       `);      
 }
 const insert = (image) => {
    const template = `
    INSERT INTO images (url) VALUES ('$URL')
       `;
    let sql = template.replace("$URL", image.url);
    return executeQuery(sql); 
 }
 const select = () => {
    const sql = `
    SELECT id, url FROM images 
       `;
    return executeQuery(sql); 
 }
 const del = (id) => {
    let sql = `
    DELETE FROM images
    WHERE id=$ID
    `;
    sql = sql.replace("$ID", id); 
    return executeQuery(sql);
};

 const test = async () => {
    await createTable();
   // await await insert({url: "test " + new Date().getTime()});
    const images = await select();
    console.log("Risultato della query SELECT:", images);
};
test();
app.post("/image/add", (req, res) => {

    const image = req.body;
 
    insert(image);
 
    res.json({result: "Ok"});
 
 });
 app.get("/image", async (req, res) => {
    try {
        const images = await select();
        res.json({ images:images });
    } catch (error) {
        res.status(500).json({ error: "Errore del server" });
    }
});
app.delete("/image/:id", async (req, res) => {
    try {
      await del(req.params.id); 
      res.json({ result: "Ok" });
    } catch (error) {
      res.status(500).json({ error: "Errore durante l'eliminazione" });
    }
  });
  const server = http.createServer(app);

  server.listen(80, () => {
  
    console.log("- server running");
  
  });