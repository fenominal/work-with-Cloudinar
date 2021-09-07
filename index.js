const http = require('http');
const util = require('util');
const mysql = require('mysql');


const con=mysql.createConnection(
    {
        host:'localhost',
        user:'root',
        password:'' ,
        database:'node_test1'
    }
);

const Formidable = require('formidable');

//https://www.npmjs.com/package/dotenv
const cloudinary = require("cloudinary");
require('dotenv').config()


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

//Create a server
http.createServer((req, res) => {
    if (req.url === '/upload' && req.method.toLowerCase() === 'post') {

        // parse a file upload
        const form = new Formidable();

        form.parse(req, (err, fields, files) => {

            //https://cloudinary.com/documentation/upload_images
            cloudinary.uploader.upload(files.upload.path, result => {
                var v=result.url;   
                console.log(v);
                
                //sql logic

                con.connect(function(err) {
                    if (err) throw err;  
                    console.log("Connected!"); 
                    var sql = "INSERT INTO `Image` ( `image_url`) VALUES ? ";  
                    var values = [[v]]
                    con.query(sql,[values], function (err, result) {  
                        if (err) throw err;  
                        console.log("1 record inserted");  
                    })
                }); 
                
                if (result.public_id) {
                    res.writeHead(200, { 'content-type': 'text/plain' });
                   // res.write('received upload:\n\n');
                    res.write(result.url);             
                res.end(util.inspect(/*{ fields: fields, files: files  }*/));
                }
            }
            );
        });
        return;
    }






    // show a file upload form
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(`
    <form action="/upload" enctype="multipart/form-data" method="post">
      <input type="text" name="title" /><br/>
      <input type="file" name="upload" multiple="multiple" /><br/>
      <input type="submit" value="Upload" />
    </form>
  `);
}



).listen(5000);



