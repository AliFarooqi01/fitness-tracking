const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {

    // this is for sending email using nodemailer Mail trap 
    //   const transporter = nodemailer.createTransport({
    //     host: process.env.EMAIL_HOST,     // Mailtrap host
    //     port: process.env.EMAIL_PORT,     // Mailtrap port (2525 or 587)
    //     auth: {
    //       user: process.env.EMAIL_USER,   // Mailtrap username
    //       pass: process.env.EMAIL_PASS,   // Mailtrap password
    //     },
    //   });

    // this is for gmail 

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });


    await transporter.sendMail({
        from: `"Fitness Tracker" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
};

module.exports = sendEmail;
