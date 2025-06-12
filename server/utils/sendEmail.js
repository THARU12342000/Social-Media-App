const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Check if email configuration exists
    if (!process.env.SMTP_HOST || !process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
      console.warn('Email configuration not found. Email will not be sent.');
      return;
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
      port: process.env.SMTP_PORT || 2525,
      auth: {
        user: process.env.SMTP_EMAIL || 'default_user',
        pass: process.env.SMTP_PASSWORD || 'default_pass'
      }
    });

    // Define email options
    const mailOptions = {
      from: `${process.env.FROM_NAME || 'Social Media App'} <${process.env.FROM_EMAIL || 'noreply@socialmediaapp.com'}>`,
      to: options.email,
      subject: options.subject,
      html: options.html
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Email sending failed:', error);
    // Don't throw the error, just log it
  }
};

module.exports = sendEmail; 