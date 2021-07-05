using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SGSE.Models
{
    public class ShippingInfo
    {
        
        public string FirstName { get; set; }
        public string Surname { get; set; }
        public Address Address { get; set; }
    }
}
