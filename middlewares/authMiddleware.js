// export const auth = async (req, res, next) => {
//     try {
//         const token = req.headers.authorization?.split("Bearer")[1];

//         if (!token) {
//             return res.status(401).json({ message: 'Not authorized, no token' });
//         }

//         // Verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = await User.findById(decoded.id).select('-password'); // Attach user info to request
//         next();
//     } catch (error) {
//         res.status(401).json({ message: 'Not authorized, token failed' });
//     }
// };