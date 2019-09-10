using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RootsOfHealth.Models
{
    public class PatientHousingBO
    {
        public int PatientHousingID { get; set; }
        public string PlaceLiveNow { get; set; }
        public string EmergencyShelter { get; set; }
        public Nullable<int> PatientID { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<bool> IsDeleted { get; set; }
        public List<SelectListItem> ddlPlaceLiveNow { get; set; }
        public List<SelectListItem> ddlEmergencyShelter { get; set; }

        public virtual PatientMainBO PatientMain { get; set; }

        public PatientHousingBO()
        {
            ddlPlaceLiveNow = new List<SelectListItem>();
            ddlEmergencyShelter = new List<SelectListItem>();
        }
    }
}