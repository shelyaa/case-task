import {
  createSubscription,
  confirmSubscription,
  unsubscribeSubscription,
  getSubscriptionsByEmail,
} from "../services/subscriptionService.js";
import {sendConfirmationEmail} from "../services/emailService.js";

export const subscribe = async (req, res) => {
  const {email, repo} = req.body;

  if (!email || !repo) {
    return res.status(400).json({error: "Email and repo are required"});
  }

  try {
    const {confirmToken} = await createSubscription(email, repo);
    await sendConfirmationEmail(email, confirmToken);
    return res.status(200).json({message: "Confirmation email sent"});
  } catch (err) {
    console.error("Subscribe error:", err); 
    return res.status(err.status || 500).json({error: err.message});
  }
};
export const confirm = async (req, res) => {
  const {token} = req.params;

  try {
    await confirmSubscription(token);
    return res.status(200).json({message: "Subscription confirmed"});
  } catch (err) {
    return res.status(err.status || 500).json({error: err.message});
  }
};

export const unsubscribe = async (req, res) => {
  const {token} = req.params;

  try {
    await unsubscribeSubscription(token);
    return res.status(200).json({message: "Unsubscribed successfully"});
  } catch (err) {
    return res.status(err.status || 500).json({error: err.message});
  }
};

export const getSubscriptions = async (req, res) => {
  const {email} = req.query;

  if (!email) {
    return res.status(400).json({error: "Email is required"});
  }

  try {
    const subscriptions = await getSubscriptionsByEmail(email);
    return res.status(200).json({subscriptions});
  } catch (err) {
    return res.status(err.status || 500).json({error: err.message});
  }
};
