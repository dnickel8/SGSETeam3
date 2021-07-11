using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using SGSE.Models;
using SGSE.Repositories;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace SGSE.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepository _repository;
        private readonly HttpClient _client;

        public PaymentService(IPaymentRepository repository)
        {
            _repository = repository;
            _client = new HttpClient();
        }

        public async Task<Invoice> CreateInvoice(Invoice invoice)
        {

            if (invoice.InvoiceDetails.InvoiceNumber is not null)
            {
                throw new ArgumentException("Invoice Number is not null");
            }
            invoice.InvoiceDetails.InvoiceNumber = Guid.NewGuid().ToString();
            var createdInvoice = await _repository.Create(invoice);
            return createdInvoice;
        }

        public async Task<List<Invoice>> GetAll()
        {
            var invoices = await _repository.GetAll();
            return invoices;
        }

        public async Task<Invoice> GetById(string id)
        {
            var invoice = await _repository.GetById(id);
            return invoice;
        }

        public async Task MakePayment(string invoiceId, Amount amount, string email, bool payed)
        {
            var payment = new Payment()
            {
                Amount = amount,
                InvoiceId = invoiceId,
                Status = payed ? "BEZAHLT" : "UNBEZAHLT"
            };
            await _repository.CreatePayment(payment);

            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential("hans.olafthebest@gmail.com", "RW7rFhkGBwQrpGwYfcPV"),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress("hans.olafthebest@gmail.com"),
                Subject = "Ihre Bestellung",
                Body = $"<p>Sehr geehrter Kunde,</p><p>Vielen Dank für ihre Bestellung, anbei sind die Bankinformationen, damit sie die Überweisung innerhalb von 2 Wochen durchführen können.</p><br>IBAN: xxxxx<br>Grund: Kauf #{invoiceId}<br><br>Wir freuen uns auf ihren nächsten Besuch!<br><h3>MicroShop.de</h3>",
                IsBodyHtml = true,
            };

            mailMessage.To.Add(email);

            smtpClient.Send(mailMessage);
        }

        public async Task Update(string id, Invoice invoice)
        {
            await _repository.Update(id, invoice);
        }
    }
}
