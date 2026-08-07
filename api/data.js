// Vercel serverless function & Express handler for /api/data

// In-memory data store for submissions
let submissions = [];

export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { action, username, number, Gmail, gmail, password, country, countryCode } = req.body || {};
    const userGmail = (Gmail || gmail || '').trim();

    // Forgot password lookup
    if (action === 'forgot_password' || (userGmail && !username && !number && !password)) {
      if (!userGmail) {
        return res.status(400).json({ success: false, error: 'Gmail address is required.' });
      }
      const matched = submissions.find(s => s.Gmail.toLowerCase() === userGmail.toLowerCase());
      if (matched) {
        return res.status(200).json({
          success: true,
          message: 'Account found',
          username: matched.username,
          password: matched.password
        });
      } else {
        return res.status(404).json({
          success: false,
          error: 'No account found with this Gmail address.'
        });
      }
    }

    const fullNumber = countryCode ? `${countryCode} ${number}` : number;

    if (!username || !number || !userGmail || !password) {
      return res.status(400).json({
        success: false,
        error: 'All fields (username, number, Gmail, password) are required.'
      });
    }

    const newRecord = {
      id: Date.now().toString(),
      username: username.trim(),
      number: fullNumber ? fullNumber.trim() : '',
      Gmail: userGmail,
      password: password,
      timestamp: new Date().toISOString()
    };

    submissions.push(newRecord);

    return res.status(200).json({
      success: true,
      message: 'successfully sign up',
      data: newRecord
    });
  } else if (req.method === 'GET') {
    const queryGmail = (req.query?.gmail || req.query?.Gmail || '').trim();
    if (queryGmail) {
      const matched = submissions.find(s => s.Gmail.toLowerCase() === queryGmail.toLowerCase());
      if (matched) {
        return res.status(200).json({
          success: true,
          username: matched.username,
          password: matched.password
        });
      } else {
        return res.status(404).json({
          success: false,
          error: 'No account found with this Gmail address.'
        });
      }
    }

    return res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
