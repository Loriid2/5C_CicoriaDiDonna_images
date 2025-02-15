const fs = require('fs');
const mysql = require('mysql2');
const conf = JSON.parse(fs.readFileSync('./public/conf.json'));
conf.ssl = {
    ca: fs.readFileSync(__dirname + '/ca.pem')
}
const connection = mysql.createConnection(conf);

const executeQuery = (sql) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, function (err, result) {
            if (err) {
                console.error(err);
                reject(err);
            }
            console.log('done');
            resolve(result);
        });
    });
};

const serverDB = {
    createTable: function () {
        return executeQuery(`
        CREATE TABLE IF NOT EXISTS images
        ( id INT PRIMARY KEY AUTO_INCREMENT, 
            url VARCHAR(255) NOT NULL ) 
        `);
    },
    insert: function (image) {
        const template = `
        INSERT INTO images (url) VALUES ('$URL')
        `;
        let sql = template.replace("$URL",image.url);
        return executeQuery(sql);
    },
    select: function () {
        const sql = `
        SELECT id, url FROM images
        `;
        return executeQuery(sql);
    },
    selectById: function (id) {
        const sql = `
        SELECT id, url FROM images WHERE id=$ID
        `;
        return executeQuery(sql.replace("$ID", id));
    },
    del: function (id) {
        let sql = `
        DELETE FROM images
        WHERE id=$ID
        `;
        sql = sql.replace("$ID", id);
        return executeQuery(sql);
    },
    test: async function () {
        await this.createTable();
        // await this.insert({url: "test " + new Date().getTime()});
        const images = await this.select();
        console.log("Risultato della query SELECT:", images);
    },
    clear : function(){
        const sql = `
        DELETE FROM images
        `;
        return executeQuery(sql);
    }
};

module.exports = serverDB;