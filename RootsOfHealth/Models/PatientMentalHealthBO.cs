using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RootsOfHealth.Models
{
    public class PatientMentalHealthBO
    {
        public int MentalHealthID { get; set; }
        public Nullable<int> PHQ9ID { get; set; }
        public Nullable<int> PHQ9Interpretation { get; set; }
        public string MentalHealthConditions { get; set; } = "0"; 
        public string PoorMentalHealth { get; set; }
        public string SufferExcessive { get; set; }
        public Nullable<int> PatientID { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<bool> IsDeleted { get; set; }

        public PHQ9BO PHQ9 { get; set; }

        public List<SelectListItem> ddlPoorMentalHealth { get; set; }
        public List<SelectListItem> ddlSufferExcessive { get; set; }
        public List<SelectListItem> ddlMentalHealthConditions { get; set; }

        public PatientMentalHealthBO()
        {
            ddlPoorMentalHealth = new List<SelectListItem>();
            ddlSufferExcessive = new List<SelectListItem>();
            ddlMentalHealthConditions = new List<SelectListItem>();

            PHQ9 = new PHQ9BO();
        }
    }
}