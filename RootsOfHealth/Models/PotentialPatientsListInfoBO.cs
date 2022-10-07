using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class PotentialPatientsListInfoBO
    {
        public Nullable<int> TotalCount { get; set; }
        public Nullable<int> PatientId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailAddress { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public string CellPhone { get; set; }
        public string SocialSecurityNumber { get; set; }
        public string CreatedDate { get; set; }
        public Nullable<bool> IsNewpatient { get; set; }
    }
}