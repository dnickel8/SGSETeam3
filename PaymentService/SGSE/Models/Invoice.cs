using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SGSE.Models
{

    
    public class Invoice
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public InvoiceDetails InvoiceDetails { get; set; }
        public Recipient Recipient { get; set; }
        public List<Item> Items { get; set; }
    }
}
