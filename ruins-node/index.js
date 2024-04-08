import express from "express";
import multer from "multer";
import johnnyRouter from "./routes/johnny/community-node.js";
import memberRouter from "./routes/linda/member.js";
import productRouter from "./routes/kevin/product.js"
import db from "./utils/mysql2-connect.js";
import cors from "cors"

const upload = multer({ dest: "profile_uploads/" });

const app = express();

// top level middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/johnny", johnnyRouter);

const corsOptions = {
    credentials: true,
    origin: (origin, callback)=>{
        callback(null, true)
    }
}
app.use(cors(corsOptions))

app.use("/member", memberRouter);
app.use("/product", productRouter);



app.use((req, res) => {
  res.status(404).send(`<h2>404 wrong path</h2>`);
});

const port = process.env.WEB_PORT || 3002;
app.listen(port, () => {
  console.log(`server started at ${port}`);
});
