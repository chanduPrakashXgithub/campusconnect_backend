import express from 'express';
import { google } from 'googleapis';
import oAuth2Client from '../config/gmailOAuth.js';

const router = express.Router();

router.get('/inbox', async (req, res) => {
  const { access_token } = req.query;

  oAuth2Client.setCredentials({ access_token });

  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
  const response = await gmail.users.messages.list({ userId: 'me', maxResults: 5 });

  const messages = await Promise.all(response.data.messages.map(async (msg) => {
    const full = await gmail.users.messages.get({ userId: 'me', id: msg.id });
    return full.data;
  }));

  res.json(messages);
});

export default router;
