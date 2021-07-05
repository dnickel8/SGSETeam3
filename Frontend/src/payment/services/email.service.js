/*import { createTestAccount, createTransport } from "nodemailer";

class EmailService {
  constructor() {}

  async sendEmail(email) {
    console.log("test");
    let testAccount = await createTestAccount();

    let transporter = createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
    console.log("test2");
    transporter.sendMail(
      {
        from: '"MicroShop" <micro-shop@example.com>', // sender address
        to: email, // list of receivers
        subject: "Bestätitgung ihrer Zahlung", // Subject line
        text: "Sehr geehrter Kunde,\nvielen Dank für ihre Bestellung, sie erhalten alle Informationen um die Zahlung per Rechnung durchführen zu können.", // plain text body
      },
      (error, info) => {
        if (error) {
          console.error(`Status: 500, Message: ${error.message}`);
        } else {
          console.log(info);
        }
      }
    );
  }
}

export default new EmailService();*/
