const express=require ('express');
const mongoose=require('mongoose');
const cors=require ('cors');
require('dotenv').config();

//require routes
const userRoutes=require('./routes/auth');
const noteRoutes=require('./routes/notes');
const folderRoutes=require('./routes/folders');




// Initialize Express app
const app=express();
const PORT=process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// Use routes
app.use('/api/users',userRoutes);
app.use('/api/notes',noteRoutes);   
app.use('/api/folders',folderRoutes);   

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('MongoDB connected'))
.catch((err)=>console.error('MongoDB connection error:',err));

//listening to server
app.listen(PORT ,()=>{
    console.log(`Server is running on port ${PORT}`);
})
