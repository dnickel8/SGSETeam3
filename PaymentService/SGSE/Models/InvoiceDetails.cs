using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SGSE.Models
{
    public class InvoiceDetails
    {
        public string InvoiceNumber { get; set; }
        public DateTime InvoiceDate { get; set; }
        public string CurrencyCode { get; set; }
        public string Note { get; set; }
        public DateTime DueDate { get; set; }

    }
}
