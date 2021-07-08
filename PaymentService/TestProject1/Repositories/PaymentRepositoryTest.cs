using Autofac;
using Autofac.Extras.Moq;
using MongoDB.Driver;
using SGSE.Models;
using SGSE.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Tests.Repositories
{
    public class PaymentRepositoryTest : IDisposable
    {

        private readonly InvoiceDatabaseSettings _invoiceDbSettings = new()
        {
            InvoiceCollectionName = "InvoiceTest",
            ConnectionString = "mongodb://localhost:27017",
            DatabaseName = "MicroShopTest"
        };
        private readonly PaymentDatabaseSettings _paymentDbSettings = new()
        {
            PaymentCollectionName = "PaymentTest",
            ConnectionString = "mongodb://localhost:27017",
            DatabaseName = "MicroShopTest"
        };

        

        public void Dispose()
        {
            var client = new MongoClient(_invoiceDbSettings.ConnectionString);
            var database = client.GetDatabase(_invoiceDbSettings.DatabaseName);

            var invoiceCollection = database.GetCollection<Invoice>(_invoiceDbSettings.InvoiceCollectionName);
            invoiceCollection.DeleteMany(item => item.Id != null);

            var paymentCollection = database.GetCollection<Payment>(_paymentDbSettings.PaymentCollectionName);
            paymentCollection.DeleteMany(item => item.Id != null);

            
        }

        private static Invoice InvoiceDummy()
        {
            var recipient = new Recipient()
            {
                EmailAddress = "test@test.de"
            };
            var invoiceDetails = new InvoiceDetails()
            {
                CurrencyCode = "EUR",
                DueDate = new DateTime(),
                InvoiceDate = new DateTime(),
                InvoiceNumber = null,
                Note = ""
            };
            var invoice = new Invoice() { Id = "1", InvoiceDetails = invoiceDetails, Items = new List<Item>(), Recipient = recipient };
            return invoice;
        }

        [Fact]
        public async Task GetAll_EntryInCollection_ReturnsEntryList()
        {
            using var context = AutoMock.GetLoose(config =>
            {
                config.RegisterInstance(_invoiceDbSettings).As<InvoiceDatabaseSettings>();
                config.RegisterInstance(_paymentDbSettings).As<PaymentDatabaseSettings>();
            });

            // Arrange
            var repository = context.Create<PaymentRepository>();
            await repository.Create(InvoiceDummy());

            // Act
            var result = await repository.GetAll();

            // Assert
            Assert.Single(result);
        }
    }
}
