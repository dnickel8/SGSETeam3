using MongoDB.Driver;
using SGSE.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SGSE.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly IMongoCollection<Invoice> _invoices;
        private readonly IMongoCollection<Payment> _payments;

        public PaymentRepository(IInvoiceDatabaseSettings invoiceSettings, IPaymentDatabaseSettings paymentSettings)
        {
            Console.WriteLine(invoiceSettings.ConnectionString);
            var client = new MongoClient(invoiceSettings.ConnectionString);
            var database = client.GetDatabase(invoiceSettings.DatabaseName);

            _invoices = database.GetCollection<Invoice>(invoiceSettings.InvoiceCollectionName);
            _payments = database.GetCollection<Payment>(paymentSettings.PaymentCollectionName);
        }

        public async Task<List<Invoice>> GetAll() =>
            await _invoices.Find(Invoice => true).ToListAsync();

        public async Task<Invoice> GetById(string id) =>
            await _invoices.Find(Invoice => Invoice.Id == id).FirstOrDefaultAsync();

        public async Task<Invoice> Create(Invoice invoice)
        {
            if (invoice.Id != null) throw new ArgumentException("Expected ID to be null");
            await _invoices.InsertOneAsync(invoice);
            return invoice;
        }

        public async Task Update(string id, Invoice InvoiceIn)
        {
            await _invoices.ReplaceOneAsync(Invoice => Invoice.Id == id, InvoiceIn);
            
        }

        public async Task<Payment> CreatePayment(Payment payment)
        {
            if (payment.Id != null) throw new ArgumentException("Expected ID to be null");
            await _payments.InsertOneAsync(payment);
            return payment;
        }
    }
}
