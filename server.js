const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://akhileshasapu:OcdbjwfLKqCn4dfx@cluster0.e9r0vis.mongodb.net/students');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Create Mongoose Schema
const studentSchema = new mongoose.Schema({
  name: String,
  rollNo: String,
  email: String,
  branch: String,
  city: String
});

const Student = mongoose.model('Student', studentSchema);

// Set up EJS
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

// Assuming this is the code causing the error
// You need to update this part of your code

app.post('/save', async (req, res) => {
    const { name, rollNo, email, branch, city } = req.body;
    const student = new Student({ name, rollNo, email, branch, city });

    try {
        await student.save(); // Use async/await to handle promise returned by save()
        
        res.redirect("/")
    } catch (error) {
        console.error('Error saving student details:', error.message);
        res.status(500).send('Error saving student details');
    }
});


app.get('/display', async (req, res) => {
    try {
      const students = await Student.find({});
      res.render('display', { students });
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).send('Error fetching students');
    }
  });
  app.post('/delete', async (req, res) => {
    const studentId = req.body.id;
  
    try {
      await Student.findByIdAndDelete(studentId);
      res.redirect('/display');
    } catch (error) {
      console.error('Error deleting student:', error.message);
      res.status(500).send('Error deleting student');
    }
  });
  
  // Update functionality
  app.post('/update', async (req, res) => {
    const { id, name, rollNo, email, branch, city } = req.body;
  
    try {
      await Student.findByIdAndUpdate(id, { name, rollNo, email, branch, city });
      res.redirect('/display');
    } catch (error) {
      console.error('Error updating student:', error.message);
      res.status(500).send('Error updating student');
    }
  });
  

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
