var nodemailer = require('nodemailer');

export async function sendEmail(subject, toEmail, emailText) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  var mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: toEmail ? toEmail : process.env.NODEMAILER_EMAIL,
    cc: toEmail ? process.env.NODEMAILER_EMAIL : null,
    subject: subject,
    html: emailText,
  };

  await new Promise((resolve, reject) => {
    // send mail
    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
}
