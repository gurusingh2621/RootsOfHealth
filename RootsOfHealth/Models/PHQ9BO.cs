using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class PHQ9BO
    {
        public int PHQ9ID { get; set; }
        public Nullable<int> PHQ9Interpretation { get; set; }
        public Nullable<int> LittleInterest { get; set; }
        public Nullable<int> FeelingDown { get; set; }
        public Nullable<int> TroubleFalling { get; set; }
        public Nullable<int> FeelingTired { get; set; }
        public Nullable<int> PoorAppetite { get; set; }
        public Nullable<int> FeelingBad { get; set; }
        public Nullable<int> TroubleConcentraiting { get; set; }
        public Nullable<int> restless { get; set; }
        public Nullable<int> HurtingYourself { get; set; }
        public Nullable<int> ProblemsMade { get; set; }
        public Nullable<int> PatientID { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<bool> IsDeleted { get; set; }
    }
}