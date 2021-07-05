using MongoDB.Driver;
using SGSE.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SGSE.Repositories
{
    public interface IPaymentRepository
    {
        Task<List<Invoice>> GetAll();
        Task<Invoice> GetById(string id);
        Task<Invoice> Create(Invoice invoice);
        Task<ReplaceOneResult> Update(string id, Invoice invoice);
        Task<Payment> CreatePayment(Payment payment);
    }
}
