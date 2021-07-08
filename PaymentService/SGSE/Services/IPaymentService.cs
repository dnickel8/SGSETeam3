using MongoDB.Driver;
using SGSE.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SGSE.Services
{
    public interface IPaymentService
    {
        Task<List<Invoice>> GetAll();
        Task<Invoice> GetById(string id);
        Task<Invoice> CreateInvoice(Invoice invoice);
        Task MakePayment(string invoiceId, Amount amount, string email, bool payed);
        string GetPaypalAccessToken();

        Task<ReplaceOneResult> Update(string id, Invoice invoice);
    }
}
