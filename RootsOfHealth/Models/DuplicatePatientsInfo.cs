using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class DuplicatePatientsInfo
    {
        public Nullable<int> PatientID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailAddress { get; set; }
        public string SocialSecurityNumber { get; set; }
        public string DateOfBirth { get; set; }
        public string CellPhone { get; set; }
        public string HomePhone { get; set; }
        public Nullable<bool> IsFromMainTable { get; set; }
    }
}