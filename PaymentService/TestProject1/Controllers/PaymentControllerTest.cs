using Autofac.Extras.Moq;
using Microsoft.AspNetCore.Mvc;
using Moq;
using SGSE.Controllers;
using SGSE.Models;
using SGSE.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Tests.Controllers
{
    public class PaymentControllerTest
    {
        [Fact]
        public async Task getAllInvoicesForUser_List_ReturnsSuccess()
        {
            using var context = AutoMock.GetLoose();
            // Arrange
            var recipient = new Recipient()
            {

            };
            var invoiceDetails = new InvoiceDetails()
            {
                CurrencyCode = "EUR",
                DueDate = new DateTime(),
                InvoiceDate = new DateTime(),
                InvoiceNumber = "1",
                Note = ""
            };
            var expectedResult = new List<Invoice>
            {
                new() {Id = "1", InvoiceDetails = invoiceDetails, Items = new List<Item>(), Recipient = recipient}
            };
            context.Mock<IPaymentService>()
                .Setup(repository => repository.GetAll())
                .ReturnsAsync(expectedResult);
            var controller = context.Create<PaymentController>();

            // Act
            var result = await controller.getAllInvoicesForUser();

            // Assert
            Assert.Equal(expectedResult, result.Value);
            context.Mock<IPaymentService>().Verify(repository => repository.GetAll(), Times.Once);
        }

        [Fact]
        public async Task GetInvoiceForUser_ReturnsSuccess()
        {
            using var context = AutoMock.GetLoose();
            // Arrange
            var recipient = new Recipient()
            {

            };
            var invoiceDetails = new InvoiceDetails()
            {
                CurrencyCode = "EUR",
                DueDate = new DateTime(),
                InvoiceDate = new DateTime(),
                InvoiceNumber = "1",
                Note = ""
            };
            var expectedResult = new Invoice() { Id = "1", InvoiceDetails = invoiceDetails, Items = new List<Item>(), Recipient = recipient };
            context.Mock<IPaymentService>()
                .Setup(repository => repository.GetById("1"))
                .ReturnsAsync(expectedResult);
            var controller = context.Create<PaymentController>();

            // Act
            var result = await controller.GetInvoiceForUser("1");

            // Assert
            Assert.Equal(expectedResult, result.Value);
            context.Mock<IPaymentService>().Verify(repository => repository.GetById("1"), Times.Once);
        }

        [Fact]
        public async Task createInvoiceAndPay_ReturnsSuccess()
        {
            using var context = AutoMock.GetLoose();
            // Arrange
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
            var invoiceAndAmount = new InvoiceAndAmount()
            {
                Invoice = invoice,
                Amount = new Amount()
                {
                    Id = "1",
                    CurrencyCode = "EUR",
                    Value = 10.99f
                }
            };
            context.Mock<IPaymentService>()
                .Setup(repository => repository.CreateInvoice(invoice))
                .ReturnsAsync(invoice);

            context.Mock<IPaymentService>()
                .Setup(repository => repository.MakePayment(invoice.Id, invoiceAndAmount.Amount, "test@test.de", false)).Verifiable();
            var controller = context.Create<PaymentController>();

            // Act
            controller.CreateInvoiceAndPay(invoiceAndAmount, false);

            // Assert
            // Assert.Equal(invoice, result.Value);
            context.Mock<IPaymentService>().Verify(repository => repository.CreateInvoice(invoice), Times.Once);
            context.Mock<IPaymentService>().Verify(repository => repository.MakePayment(invoice.Id, invoiceAndAmount.Amount, "test@test.de", false), Times.Once);
        }

        [Fact]
        public async Task Update_ExistingInvoice_Success()
        {
            using var context = AutoMock.GetLoose();
            // Arrange
            context.Mock<IPaymentService>()
                .Setup(service => service.Update(It.IsAny<string>(), It.IsAny<Invoice>()))
                .Returns(Task.CompletedTask);
            var controller = context.Create<PaymentController>();

            // Act
            var result = await controller.Update("id", new Invoice());

            // Assert
            Assert.True(result is OkResult);
            context.Mock<IPaymentService>()
                .Verify(repository => repository.Update(It.IsAny<string>(), It.IsAny<Invoice>()), Times.Once);
        }
    }
}
