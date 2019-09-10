using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RootsOfHealth.Models
{
    public class PatientLegalStatuBO
    {
        public int LegalStatusID { get; set; }
        public string EverBeenArrested { get; set; }
        public string OnGoingCriminalCase { get; set; }
        public string EverBeenInPrison { get; set; }
        public string LastReleased { get; set; } = "0";
        public string CDCAndPFNNumber { get; set; }
        public Nullable<bool> InterestedInCriminalRecordClearing { get; set; }
        public Nullable<bool> OweRestitution { get; set; }
        public string HowMuchOwe { get; set; }
        public string CurrentlyOnParole { get; set; }
        public string ParoleProbation { get; set; } = "0";
        public string ParoleProbationEnd { get; set; }
        public string DifficultiesInGettingAJob { get; set; }
        public Nullable<bool> GovernmentIssuedID { get; set; }
        public string GovernmentIDImg { get; set; }
        public Nullable<bool> ConcernsAboutFamilyImmigrationStatus { get; set; }
        public Nullable<bool> ConcernsWithLandlord { get; set; }
        public Nullable<int> PatientID { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<bool> IsDeleted { get; set; }

        public List<SelectListItem> ddlLastReleased { get; set; }
        public List<SelectListItem> ddlParoleProbation { get; set; }

        public PatientLegalStatuBO()
        {
            ddlLastReleased = new List<SelectListItem>();
            ddlParoleProbation = new List<SelectListItem>();
        }
    }
}