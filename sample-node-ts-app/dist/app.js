"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser"); // parse bodies of all inc req's; extract any json found, and populate body key found in req obj (in /controllers/todos.ts on line 9)
const todos_1 = __importDefault(require("./routes/todos"));
const app = express_1.default();
app.use(body_parser_1.json());
app.use('/todos', todos_1.default);
app.use((err, req, res, next) => {
    res.status(500).json(err.message);
});
app.listen(3000);
