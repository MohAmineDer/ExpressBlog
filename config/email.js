const nodemailer = require('nodemailer');
const pug = require('pug');
const {htmlToText} = require('html-to-text');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.username = user.username;
        this.url = url;
        this.from = `Express Blog <${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        // if (process.env.NODE_ENV === 'production') {
            // for production use sedgrid
        // }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async send(template, subject) {
        // Send the actual email
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
            username: this.username,
            url: this.url,
            subject
        });

        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText(html)
        };

        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to the ExpressBlog');
    }

    async sendResetPassword() {
        await this.send('resetPassword', 'Reset Password Instructions:')
    }
}