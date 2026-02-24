import express from "express"
const app = express()
app.get("/",(req,res)=>{
    res.send("<h1>hello sohel</h1>")
})

// API that sends JSON
app.get("/api/user", (req, res) => {
    res.json({
        name: "Sohel",
        job: "Future Web Developer",
        skill: "MERN Stack"
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});