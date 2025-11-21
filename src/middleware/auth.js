import jwt from 'jsonwebtoken';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (handler) => async (req, res) => {
  await connectDB();
  
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Access denied. No token provided.' }),
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("decoded token: ", decoded);
    
    // Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found.' }),
        { status: 401 }
      );
    }

    // Check if email is verified (for admin routes)
    if (!user.emailVerified) {
      return new Response(
        JSON.stringify({ error: 'Email not verified.' }),
        { status: 403 }
      );
    }

    // Check if user has admin role
    if (user.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Admin access required.' }),
        { status: 403 }
      );
    }

    // Add user to request object
    req.user = user;
    return handler(req, res);
  } catch (error) {
    console.error('Auth error:', error);
    return new Response(
      JSON.stringify({ error: 'Invalid token.' }),
      { status: 401 }
    );
  }
};