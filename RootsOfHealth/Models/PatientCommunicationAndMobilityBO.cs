using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RootsOfHealth.Models
{
    public class PatientCommunicationAndMobilityBO
    {
        public int PatientCommunicationAndMobilityID { get; set; }
        public Nullable<bool> PersonalPhone { get; set; }
        public string DifficultyGoingPlaces { get; set; }
        public string ModesOfTransportation { get; set; }
        public Nullable<int> PatientID { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<bool> IsDeleted { get; set; }
        public string OtherTransportation { get; set; }

        public List<SelectListItem> ddlDifficultyGoingPlaces { get; set; }
        public List<SelectListItem> ddlModesOfTransportation { get; set; }

        public PatientCommunicationAndMobilityBO()
        {
            ddlDifficultyGoingPlaces = new List<SelectListItem>();
            ddlModesOfTransportation = new List<SelectListItem>();
        }

    }
}