import express from 'express';
import fetch from 'node-fetch';
const app = express();
app.use(express.urlencoded());
const port = 7777;
import mongoose from 'mongoose';


// mongoose.connect(`mongodb://localhost/Gorest`);
const dbUrl = 'mongodb+srv://UsernameZero:UsernameZero@cluster0.oe1eg.mongodb.net/Gorest';
mongoose.connect( dbUrl , {useNewUrlParser: true});

const db = mongoose.connection;// storing the data from mongoDB to initialized variable

db.on('error',console.error.bind(console, "Error connecting MongoDB"));

db.once('open',function(){
    console.log(`Mongo-Db is Connected, the data can be stored now.`);
});

//Creating a schema
const postSchema = new mongoose.Schema({
    id: {
        type: Number,
        required:true,
    },
    user_id: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
},{timestamps: true});


//Creating a Model
const Posts =  mongoose.model('Posts', postSchema);

//Fetching APi data through node-fetch
async function fetchingPosts(){
    const fetchPosts = await fetch('https://gorest.co.in/public/v2/posts');
    const res = await fetchPosts.json();
    for(let i =0;i< res.length;i++){
       const posts =  new Posts({
            id: res[i]['id'],
            user_id: res[i]['user_id'],
            title: res[i]['title'],
            body: res[i]['body'],
        });
        posts.save();// Saving Api data in mongoDB
    }
}

fetchingPosts()


//Router for Getting information through Id
app.get('/:id', (req, res)=>{
    console.log(req.params.id);
    Posts.findOne({id : req.params.id}, (err, post)=>{
        if (err) {
            console.log(Error , " error in finding");
            return res.status(500).json({error:"  id is not in the list"});
        }else{
            return res.status(200).json({data:{
                id: post.id,
                user_id: post.user_id,
                title: post.title,
                body: post.body

            }})
        }
        
    });
    
})

// Server
app.listen(9999, (err)=>{
    if (err) {
        console.log(err);
    }else{
        console.log(`Server running on 9999`);
    }
} )

