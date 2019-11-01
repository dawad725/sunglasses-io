var http = require('http');
var fs = require('fs');
var finalHandler = require('finalhandler');
var queryString = require('querystring');
var Router = require('router');
var bodyParser = require('body-parser');
var uid = require('rand-token').uid;

const PORT = process.env.PORT || 3001;

// State holding variables 
let brands = [];

// Setup router
const router = Router();
router.use(bodyParser.json());


const server = http.createServer((req, res) => {
    res.writeHead(200);
    router(req, res, finalHandler(req, res));
});

server.listen(PORT, err => {
    if (err) throw err;
    console.log(`server running on port ${PORT}`);
    //populate brands  
    brands = JSON.parse(fs.readFileSync("../initial-data/brands.json", "utf-8"));
});

router.get("/api/brands", (request, response) => {




    response.writeHead(200, { "Content-Type": "application/json" });
    return response.end(JSON.stringify(brands));
});



module.exports = server