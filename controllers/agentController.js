import db from '../services/databaseService.js';

export class AgentController {
  constructor({ db }) {
    this.db = db;
  }
  getAgentHtml(req, res) {
    try {
      res.sendFile('agent.html', { root: './public' });
    } catch (error) {
      console.error('Error sending agent HTML:', error);
      res.status(500).send('Internal Server Error');
    }
  }
  // ✅ Save agent reply
  async sendReply(req, res) {
    const { reply_message, agent_name, customer_message_id, new_status } = req.body;

    console.log('Received reply from agent:', { reply_message, agent_name, customer_message_id, new_status });

    // Validate input first
    if (!reply_message || !agent_name || !customer_message_id) {
      return res.status(400).json({
        error: 'reply_message, agent_name, and customer_message_id are required',
      });
    }

    try {
      // ✅ Insert agent reply
      const { data: replyData, error: replyError } = await this.db
        .schema('branchinternational')
        .from('agents_replies')
        .insert([{ reply_message, agent_name, customer_message_id }])
        .select()
        .single();

      if (replyError) {
        console.error('Error saving reply:', replyError);
        return res.status(500).json({ error: replyError.message });
      }

      // ✅ Optionally update message status (e.g., to "working" or "closed")
      if (new_status && ['open', 'working', 'closed'].includes(new_status)) {
        const { error: updateError } = await this.db
          .schema('branchinternational')
          .from('customer_messages')
          .update({
            status: new_status,
            resolved_at: new_status === 'closed' ? new Date().toISOString() : null,
          })
          .eq('id', customer_message_id);

        if (updateError) {
          console.error('Error updating message status:', updateError);
          return res.status(500).json({ error: updateError.message });
        }
      }

      return res.status(201).json({
        success: true,
        message: 'Reply saved successfully',
        data: replyData,
      });
    } catch (err) {
      console.error('Error sending reply:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // ✅ Get all messages that are still open or working (not closed)
  async getAllCustomerMessages(req, res) {
    try {
      const { data, error } = await this.db
        .schema('branchinternational')
        .from('customer_messages')
        .select('*')
        .in('status', ['open', 'working'])
        .order('urgency_score', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        return res.status(500).json({ error: error.message });
      }

      console.log('Fetched customer messages for agent:', data);
      return res.status(200).json({ success: true, data });
    } catch (err) {
      console.error('Error fetching messages:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // ✅ Get top priority (most urgent) customer message
  async getCustomerMessageForReply(req, res) {
    try {
      const { data, error } = await this.db
        .schema('branchinternational')
        .from('customer_messages')
        .select('*')
        .eq('status', 'open')
        .order('urgency_score', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching message:', error);
        return res.status(500).json({ error: error.message });
      }
      if (!data || data.length === 0) {
        return res.status(404).json({ error: 'No open messages found' });
      }

      const message = data[0];
      await this.db
        .schema('branchinternational')
        .from('customer_messages')
        .update({ status: 'working' })
        .eq('id', message.id);
      return res.status(200).json({ success: true, data: message });
    } catch (err) {
      console.error('Error fetching message for reply:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

// ✅ Bind and export
const agentController = new AgentController({ db });
agentController.sendReply = agentController.sendReply.bind(agentController);
agentController.getAllCustomerMessages = agentController.getAllCustomerMessages.bind(agentController);
agentController.getCustomerMessageForReply = agentController.getCustomerMessageForReply.bind(agentController);
agentController.getAgentHtml = agentController.getAgentHtml.bind(agentController);

export default agentController;
