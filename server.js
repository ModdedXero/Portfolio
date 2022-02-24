const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 5000;
const server = require("http").createServer(app);
const Socket = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
});
exports.Socket = Socket;

app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend", "build")));

// Routes
const snakeRouter = require("./api/snake");

app.use("/api/snake", snakeRouter);

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