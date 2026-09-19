import app from "./src/app.js";
import connectDB from "./src/config/database.js";
connectDB();
const port = 3000

app.get("/",(req,res)=>{
    res.send("hello backend")
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})