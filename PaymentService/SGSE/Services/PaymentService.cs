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

        public string GetPaypalAccessToken()
        {
            WebRequest request = WebRequest.Create("https://api-m.sandbox.paypal.com/v1/oauth2/token");
            request.Method = "POST";
            var username = "ASchRjlk4vOH0uRd5BwQ3Lt408sw_7wydEShg63KSyxkA5tVrIWRyJhSWZc8Ig8TFXRVRVEan3d6Ufe4";
            var password = "EPzvTyrJLKDOdyUwNh18IHA03vC8-55IM-hqoirJ9uIOu8_dFQrD_AaglbTOs70k9LUPv353Dll4h75f";
            string encoded = Convert.ToBase64String(Encoding.GetEncoding("ISO-8859-1")
                                           .GetBytes(username + ":" + password));
            request.Headers.Add("Authorization", "Basic " + encoded);
            request.Headers.Add("Accept", "application/json");
            request.ContentType = "application/x-www-form-urlencoded";
            string postData = "grant_type=client_credentials";
            byte[] byteArray = Encoding.UTF8.GetBytes(postData);
            request.ContentLength = byteArray.Length;
            // Get the request stream.
            Stream dataStream = request.GetRequestStream();
            // Write the data to the request stream.
            dataStream.Write(byteArray, 0, byteArray.Length);
            // Close the Stream object.
            dataStream.Close();
            // Get the response.
            WebResponse response = request.GetResponse();
            // Display the status.
            // Get the stream associated with the response.
            Stream receiveStream = response.GetResponseStream();
            // Pipes the stream to a higher level stream reader with the required encoding format.
            StreamReader readStream = new(receiveStream, Encoding.UTF8);
            var res = readStream.ReadToEnd();
            readStream.Close();
            receiveStream.Close();
            response.Close();
            JObject json = JObject.Parse(res);
            return (string) json["access_token"];
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

            /* var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential("imnexa@gmail.com", "test"),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress("imnexa@gmail.com"),
                Subject = "Ihre Bestellung",
                Body = "<p>Sehr geehrter Kunde,</p><p>Vielen Dank für ihre Bestellung, anbei sind die Bankinformationen, damit sie die Überweisung innerhalb von 2 Wochen durchführen können.</p><br>IBAN: xxxxx<br>Grund: Kauf #1234<br><br>Wir freuen uns auf ihren nächsten Besuch!<br><h3>MicroShop.de</h3>",
                IsBodyHtml = true,
            };

            mailMessage.To.Add(email);

            smtpClient.Send(mailMessage);    */
        }

        public async Task<ReplaceOneResult> Update(string id, Invoice invoice)
        {
            var result = await _repository.Update(id, invoice);
            return result;
        }
    }
}
