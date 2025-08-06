require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const connectDB = require('./config/db');

// Import route files
const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/usersRoutes');
const jobRoutes = require('./routes/jobs');
const postRoutes = require('./routes/posts');
const reviewRoutes = require('./routes/reviews');
const messagesRoutes = require('./routes/messagesRoutes');
const conversationRoutes = require('./routes/conversationsRoutes');
const connectionRoutes = require('./routes/connectionRoutes');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Ensure Uploads directory exists
const uploadDir = path.join(__dirname, 'Uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
    fieldSize: 50 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const validTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    validTypes.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Only JPG, PNG, GIF, WebP, PDF, DOC, or DOCX files allowed'), false);
  },
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use('/Uploads', express.static(uploadDir));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/auth', upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'resume', maxCount: 1 },
]), authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/connections', connectionRoutes);

// Socket.io
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('joinConversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`User joined conversation: ${conversationId}`);
  });

  socket.on('leaveConversation', (conversationId) => {
    socket.leave(conversationId);
    console.log(`User left conversation: ${conversationId}`);
  });

  socket.on('sendMessage', (messageData) => {
    io.to(messageData.conversation).emit('receiveMessage', messageData);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }
  res.status(500).json({ message: err.message || 'Internal server error' });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
