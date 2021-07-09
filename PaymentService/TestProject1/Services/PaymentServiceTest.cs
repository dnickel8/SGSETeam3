using Autofac.Extras.Moq;
using Moq;
using SGSE.Models;
using SGSE.Repositories;
using SGSE.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Tests.Services
{
    public class PaymentServiceTest
    {
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
        public async Task Create_Invoice_InsertsIntoRepository()
        {
            using var context = AutoMock.GetLoose();

            // Arrange
            context.Mock<IPaymentRepository>()
                .Setup(repository => repository.Create(It.IsAny<Invoice>())).ReturnsAsync(
                    (Invoice param) =>
                    {
                        param.Id = "1";
                        return param;
                    });
            var service = context.Create<PaymentService>();

            // Act
            await service.CreateInvoice(InvoiceDummy());

            // Assert
            context.Mock<IPaymentRepository>()
                .Verify(repository =>
                        repository.Create(
                            It.Is<Invoice>(item => item.Recipient.EmailAddress == "test@test.de")),
                    Times.Once);

        }

        [Fact]
        public async Task GetList_Invoice_ReturnsFromRepository()
        {
            using var context = AutoMock.GetLoose();
            // Arrange       
            var expectedResult = new List<Invoice>
                {
                    InvoiceDummy()
                };
            context.Mock<IPaymentRepository>()
                .Setup(repository => repository.GetAll()).ReturnsAsync(expectedResult);
            var service = context.Create<PaymentService>();

            // Act
            var result = await service.GetAll();

            // Assert
            Assert.Equal(expectedResult[0].Id, result[0].Id);
            context.Mock<IPaymentRepository>()
                .Verify(repository =>
                        repository.GetAll(),
                    Times.Once);

        }

        [Fact]
        public async Task Get_Id_Invoice_ReturnsFromRepository()
        {
            using var context = AutoMock.GetLoose();
            // Arrange       
            context.Mock<IPaymentRepository>()
                .Setup(repository => repository.GetById("1")).ReturnsAsync(InvoiceDummy());
            var service = context.Create<PaymentService>();

            // Act
            var result = await service.GetById("1");

            // Assert
            Assert.Equal(InvoiceDummy().Id, result.Id);
            context.Mock<IPaymentRepository>()
                .Verify(repository =>
                        repository.GetById("1"),
                    Times.Once);
        }

        [Fact]
        public async Task Update_ExistingInvoice_ReturnsSuccess()
        {
            using var context = AutoMock.GetLoose();
            // Arrange
            context.Mock<IPaymentRepository>()
                .Setup(repository => repository.Update(It.IsAny<string>(), It.IsAny<Invoice>()));
            var service = context.Create<PaymentService>();

            // Act
            await service.Update("1", new Invoice() { Id = "1" });

            // Assert
            context.Mock<IPaymentRepository>()
                .Verify(repository => repository.Update(It.IsAny<string>(), It.IsAny<Invoice>()), Times.Once);
        }

        [Fact]
        public async Task MakePayment_Success()
        {
            using var context = AutoMock.GetLoose();
            // Arrange
            context.Mock<IPaymentRepository>()
                .Setup(repository => repository.CreatePayment(It.IsAny<Payment>())).ReturnsAsync(new Payment());
            var service = context.Create<PaymentService>();

            // Act
            await service.MakePayment("id", new Amount(), "test@test.de", false);

            // Assert
            context.Mock<IPaymentRepository>()
                .Verify(repository => repository.CreatePayment(It.IsAny<Payment>()), Times.Once);
        }
    }
}
