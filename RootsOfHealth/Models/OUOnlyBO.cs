using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class OUOnlyBO
    {
        public int OUOnlyID { get; set; }
        public string ReferralSource { get; set; }
        public Nullable<bool> UnsafeCity { get; set; }
        public string Neighborhoods { get; set; }
        public string Safety { get; set; }
        public string OtherSafety { get; set; }
        public Nullable<bool> DrugTest { get; set; }
        public string DreamJob { get; set; }
        public string Employment { get; set; }
        public string OtherEmployment { get; set; }
        public string LivingSituation { get; set; }
        public string HousingShelter { get; set; }
        public string OtherHousingShelter { get; set; }
        public Nullable<bool> LearningDisabilities { get; set; }
        public string Education { get; set; }
        public string OtherEducation { get; set; }
        public Nullable<bool> AnyPendingCourtDates { get; set; }
        public string PendingCourtDates { get; set; }
        public Nullable<bool> ConvictedOfAnyOffense { get; set; }
        public Nullable<bool> Misdemeanor { get; set; }
        public string MisdemeanorDate { get; set; }
        public Nullable<bool> Felony { get; set; }
        public string FelonyDate { get; set; }
        public Nullable<bool> RestrainingOrders { get; set; }
        public string Restrictions { get; set; }
        public string Legal { get; set; }
        public string OtherLegal { get; set; }
        public string NatureOfTreatment { get; set; }
        public Nullable<bool> AngerManagement { get; set; }
        public string AngerPrograms { get; set; }
        public string AngerYear { get; set; }
        public string SocialRecreational { get; set; }
        public string OtherSocial { get; set; }
        public string TermsOfProbation { get; set; }
        public Nullable<bool> EligibleForEmployment { get; set; }
        public Nullable<bool> GunInvolvedActivity { get; set; }
        public Nullable<bool> GangRelatedStreetViolence { get; set; }
        public Nullable<bool> KilledDueToTurf { get; set; }
        public Nullable<bool> HotSpotArea { get; set; }
        public Nullable<bool> AssociateWithTurfs { get; set; }
        public Nullable<bool> ViolentOffense { get; set; }
        public string ProgramConsentForm { get; set; }
        public Nullable<int> PatientID { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<bool> IsDeleted { get; set; }
        public Nullable<bool> HaveSSN { get; set; }
        public Nullable<bool> HaveStateIssuedPhotoID { get; set; }
        public Nullable<bool> HaveI9 { get; set; }

    }
}