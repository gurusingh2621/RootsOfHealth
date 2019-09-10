using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class DastBO
    {
        public int DastID { get; set; }
        public string DrugsContaining { get; set; }
        public string OtherDrug { get; set; }
        public string HowOftenUse { get; set; }
        public Nullable<bool> UsedDrugsForMedicalReasons { get; set; }
        public Nullable<bool> OneDrugAtATime { get; set; }
        public Nullable<bool> UnableToStopUsingDrugs { get; set; }
        public Nullable<bool> Blackouts { get; set; }
        public Nullable<bool> GuiltyAboutYourDrug { get; set; }
        public Nullable<bool> SpouseComplain { get; set; }
        public Nullable<bool> NeglectedFamily { get; set; }
        public Nullable<bool> EngagedInIllegalActivities { get; set; }
        public Nullable<bool> WithdrawalSymptoms { get; set; }
        public Nullable<bool> MedicalLoss { get; set; }
        public string EverInjectedDrugs { get; set; }
        public string TreatmentForSubstanceAbuse { get; set; }
        public string InjectedDrugInLast90OrMoreThen90Days { get; set; }
        public Nullable<int> PatientID { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<bool> IsDeleted { get; set; }
    }
}