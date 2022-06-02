using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class PatientMainInfo
    {
        public Nullable<int> TotalCount { get; set; }
        public Nullable<int> PatientId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Image { get; set; }
        public string Email { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public string PhoneNo { get; set; }
    }
}