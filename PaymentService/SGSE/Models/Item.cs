using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SGSE.Models
{
    public class Item
    {
        
        public string Description { get; set; }
        public int Quantity { get; set; }
        public float Discount { get; set; }
        public float Tax { get; set; }
        public Amount Amount { get; set; }

    }
}
