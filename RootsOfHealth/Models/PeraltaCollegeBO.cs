using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class PeraltaCollegeBO
    {
        public int PeraltaCollegesID { get; set; }
        public string OneYouAre { get; set; } = "0";
        public Nullable<int> StudentID { get; set; }
        public Nullable<int> PatientID { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<bool> IsDeleted { get; set; }
    }
}