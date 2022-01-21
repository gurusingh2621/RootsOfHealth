using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class SharedFormForExportBO
    {
        public int PatientId { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string DOB { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string PostalCode { get; set; }
        public string MobilePhone { get; set; }
        public string HomePhone { get; set; }
        public string Email { get; set; }
        public string Language { get; set; }
        public string UniqueLink { get; set; }


    }
}