const express = require("express");
const path = require("path");
const fs = require("fs");
const http = require("http");
const Server = require("socket.io").Server;

const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app);
exports.Socket = new Server(server);

// Routes
const snakeRouter = require("./api/snake").default;

app.use("/api/snake", snakeRouter);

app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend", "build")));

// Send client Index.html for web data (Doesn't work without static build from React)
if (process.env.NODE_ENV === "production") {
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, "frontend", "build", "index.html");
    
    app.get("/*", (req, res) => {
        RenderSite(res);
    });

    function RenderSite(res) {
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                return console.log(err);
            } else {
                res.send(data);
            }
        });
    }
}

// Start server listening on port
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});