const Feedback = require('../models/FeedbackModel');
const sendEmail = require('../utils/sendEmail');

exports.submitFeedback = async (req, res) => {
  const { name, email, inquiry, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All required fields must be filled." });
  }

  try {
    // 1️⃣ Save feedback to the database
    const feedback = new Feedback({ name, email, inquiry, message });
    await feedback.save();

    // 2️⃣ Email to your Gmail
    const emailBody = `
      <h2>New Feedback Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Inquiry:</strong> ${inquiry}</p>
      <p><strong>Message:</strong> ${message}</p>
    `;

    await sendEmail(
      process.env.EMAIL_USER,           // to your Gmail
      `New Inquiry from ${name}`,       // subject
      emailBody                         // HTML body
    );

    res.status(200).json({ message: "Feedback submitted successfully." });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};
