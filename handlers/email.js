const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');

let transporter = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    } 
});

const generarHTML = ( file, payload = {} ) => {
    const html = pug.renderFile(`${__dirname}/templates/${file}.pug`, payload);
    return juice(html);
}

exports.send = async (payload) => {
    const html = generarHTML(payload.file, payload);
    const text = htmlToText.fromString(html);
    
    let mailOptions = {
        from: "CalendarAPP <no-reply@calendarapp.com>",
        to: payload.user.email,
        subject: payload.subject,
        text ,
        html
    };
    //util hace que algo que no soporte async await si lo pueda trabajar
    const sendEmail = util.promisify(transporter.sendMail, transporter);
    return sendEmail.call(transporter, mailOptions);
}

