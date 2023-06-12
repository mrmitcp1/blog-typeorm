import { AppDataSource } from "./src/data-source";

import { Blog } from "./src/entity/Blog";

import multer from 'multer';

const upload = multer();

import express, {response} from "express";

import bodyParser from 'body-parser';



const PORT = 3333;
AppDataSource
    .initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

    const app = express();

    app.set("view engine", "ejs");

    app.set("views", "./src/views");

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}))

    app.use(express.json());

    const BlogRepo = AppDataSource.getRepository(Blog);

    app.get("/blog/create", (req, res) => {

        res.render("create");

    });
    app.post('/blog/create',upload.none(), async (req,res)=>{
        const blogData = {
            title: req.body.title,
            content: req.body.content
        }
        await BlogRepo.save(blogData);
        res.redirect('/blog/list')
    });

    app.get('/blog/list',async (req,res)=>{
        const blogs = await BlogRepo.find();
        res.render('list',{blogs:blogs})
    })
    app.get('/blog/:id/update',async (req,res)=>{
        const blog = await BlogRepo.findOneBy({id : +req.params.id})
        res.render('update',{blog:blog})
    })
    app.post('/blog/:id/update',async (req,res)=>{
        const blog = await BlogRepo.findOneBy({id : +req.params.id})
        let {title,content}=req.body
        blog.title=title;
        blog.content=content;
        await BlogRepo.save(blog)
        res.redirect('/blog/list')
    })
    app.get('/blog/:id/delete',async (req,res)=>{
        const blog = await BlogRepo.findOneBy({id : +req.params.id})
        await BlogRepo.remove(blog)
        res.redirect('/blog/list')
    })



    app.listen(PORT, () => {

        console.log("App running with port: " + PORT)

    })

