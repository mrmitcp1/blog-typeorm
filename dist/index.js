"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("./src/data-source");
const Blog_1 = require("./src/entity/Blog");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const PORT = 3333;
data_source_1.AppDataSource
    .initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
})
    .catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
const app = (0, express_1.default)();
app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
const BlogRepo = data_source_1.AppDataSource.getRepository(Blog_1.Blog);
app.get("/blog/create", (req, res) => {
    res.render("create");
});
app.post('/blog/create', upload.none(), async (req, res) => {
    const blogData = {
        title: req.body.title,
        content: req.body.content
    };
    await BlogRepo.save(blogData);
    res.redirect('/blog/list');
});
app.get('/blog/list', async (req, res) => {
    const blogs = await BlogRepo.find();
    res.render('list', { blogs: blogs });
});
app.get('/blog/:id/update', async (req, res) => {
    const blog = await BlogRepo.findOneBy({ id: +req.params.id });
    res.render('update', { blog: blog });
});
app.post('/blog/:id/update', async (req, res) => {
    const blog = await BlogRepo.findOneBy({ id: +req.params.id });
    let { title, content } = req.body;
    blog.title = title;
    blog.content = content;
    await BlogRepo.save(blog);
    res.redirect('/blog/list');
});
app.get('/blog/:id/delete', async (req, res) => {
    const blog = await BlogRepo.findOneBy({ id: +req.params.id });
    await BlogRepo.remove(blog);
    res.redirect('/blog/list');
});
app.listen(PORT, () => {
    console.log("App running with port: " + PORT);
});
//# sourceMappingURL=index.js.map