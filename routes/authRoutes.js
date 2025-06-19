import express from 'express';
import oAuth2Client from '../config/gmailOAuth.js';

const router = express.Router();

// Step 1: Send login URL to frontend
router.get('/google', (req, res) => {
  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent', // 👈 Important: always request a fresh grant
    scope: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'openid',
    ],
  });

  res.json({ url });
});

// Step 2: Handle callback from Google
router.get('/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send('Missing authorization code.');

  try {
    const { tokens } = await oAuth2Client.getToken(code); // 👈 Don't manually add redirect_uri here
    oAuth2Client.setCredentials(tokens);

    const redirectUrl = `https://campusconnect-frontend-mu.vercel.app/auth-success?access_token=${tokens.access_token}`;
    return res.redirect(redirectUrl);
  } catch (err) {
    console.error('❌ Error during getToken:', err.message);
    return res.status(500).send('Google login failed. Please try again.');
  }
});

export default router;
