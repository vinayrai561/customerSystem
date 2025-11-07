// controllers/customerController.ts
import db from '../services/databaseService.js';

function computeUrgencyScore(text = '') {
  const t = text.toLowerCase();
  const weights = [
    { kw: ['urgent', 'immediately', 'asap', 'right away'], w: 8 },
    { kw: ['disburse', 'disbursed', 'payout', 'withdraw', 'cash out'], w: 7 },
    { kw: ['approval', 'approved', 'approve', 'reject', 'rejected'], w: 6 },
    { kw: ['loan', 'limit', 'increase'], w: 5 },
    { kw: ['cannot', "can't", 'failed', 'error', 'bug'], w: 4 },
    { kw: ['update info', 'change phone', 'change number', 'email change'], w: 2 },
  ];
  let score = 0;
  for (const { kw, w } of weights) for (const k of kw) if (t.includes(k)) score += w;
  if (t.length < 80 && (t.includes('help') || t.includes('now'))) score += 2;
  return score;
}

export class CustomerController {
  constructor({ db }) {
    this.db = db;
  }

  getMessageHtml(req, res) {
    try {
      res.sendFile('customer.html', { root: './public' });
    } catch (error) {
      console.error('Error sending customer HTML:', error);
      res.status(500).send('Internal Server Error');
    }
  }

  async sendMessage(req, res) {
    const { message, name, email } = req.body;
    if (!message || !name || !email) {
      return res.status(400).json({ error: 'message, name, and email required' });
    }

    try {
      const urgency_score = computeUrgencyScore(message);

      // Ensure we return the inserted row
      const { data, error } = await this.db
        .schema('branchinternational')
        .from('customer_messages')
        .insert({ message, name, email, urgency_score })
        .select('*')
        .single();

      if (error) return res.status(500).json({ error: error.message });
      res.status(201).json({ success: true, data });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getReplies(req, res) {
    const { messageId } = req.params;
    try {
      const { data: message, error: mErr } = await this.db
        .schema('branchinternational')
        .from('customer_messages')
        .select('*')
        .eq('id', messageId)
        .single();

      if (mErr) return res.status(404).json({ error: 'Message not found' });

      const { data: replies, error: rErr } = await this.db
        .schema('branchinternational')
        .from('agents_replies')
        .select('*')
        .eq('customer_message_id', messageId)
        .order('created_at', { ascending: true });

      if (rErr) return res.status(500).json({ error: rErr.message });

      res.json({ message, replies });
    } catch (e) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // NEW: find messages by email — latest or all
  async getMessagesByEmail(req, res) {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'email is required' });

    try {
      const { data: messages, error } = await this.db
        .schema('branchinternational')
        .from('customer_messages')
        .select('*')
        .eq('email', email)
        .order('created_at', { ascending: false });

      if (error) return res.status(500).json({ error: error.message });

      if (messages.length === 0) {
        return res.json({ messages: [], latest: null, replies: [] });
      }
      const latest = messages[0];
      const { data: replies = [] } = await this.db
        .schema('branchinternational')
        .from('agents_replies')
        .select('*')
        .eq('customer_message_id', latest.id)
        .order('created_at', { ascending: true });

      return res.json({ latest, replies, messages});
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

const customerController = new CustomerController({ db });
customerController.sendMessage = customerController.sendMessage.bind(customerController);
customerController.getReplies = customerController.getReplies.bind(customerController);
customerController.getMessageHtml = customerController.getMessageHtml.bind(customerController);
customerController.getMessagesByEmail = customerController.getMessagesByEmail.bind(customerController); // NEW
export default customerController;
