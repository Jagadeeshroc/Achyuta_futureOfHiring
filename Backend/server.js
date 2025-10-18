// Backend Server: server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');     // for file system operation
const http = require('http');
const { Server } = require('socket.io');

const multer = require('multer');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
// Placeholder for missing routes (add these files as needed)
const usersRoutes = require('./routes/usersRoutes');
const jobRoutes = require('./routes/jobs');
const reviewRoutes = require('./routes/reviews');
const connectionRoutes = require('./routes/connections');
const notificationRoutes = require('./routes/notifications');
const conversationRoutes = require('./routes/conversations');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

// Middleware to attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Multer configuration (for reference, used in routes)
const uploadDir = path.join(__dirname, 'Uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const validTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    validTypes.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Only JPG, PNG, GIF, WebP, PDF, DOC, or DOCX files allowed'), false);
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/Uploads', express.static(uploadDir));

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/auth', authRoutes); // No upload here; handled in auth.js
app.use('/api/users', usersRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/conversations', conversationRoutes);

// Socket.IO
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('connect_error', (error) => {
    console.error('Socket.IO server connection error:', error.message);
  });

  socket.on('joinUser', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their notification room`);
  });

  socket.on('joinConversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`User joined conversation: ${conversationId}`);
  });

  socket.on('leaveConversation', (conversationId) => {
    socket.leave(conversationId);
    console.log(`User left conversation: ${conversationId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error('Server error:', {
    message: err?.message,
    stack: err?.stack,
    url: req?.url,
    method: req?.method
  });
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));