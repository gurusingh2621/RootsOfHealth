using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RootsOfHealth.Models
{
    public class PatientSocialSupportBO
    {
        public int SocialSupportsID { get; set; }
        public string IsSomeoneYouCanDependOn { get; set; }
        public Nullable<bool> InvolvedInCommunityGroup { get; set; }
        public Nullable<bool> IsSomeoneYouCanCall { get; set; }
        public Nullable<bool> IsAnyoneThreatenYou { get; set; }
        public string FeelSafeNeighborhood { get; set; } = "0";
        public string FinancialSecurity { get; set; }
        public string PlaceToStay { get; set; }
        public Nullable<int> PatientID { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<bool> IsDeleted { get; set; }

        public List<SelectListItem> ddlFinancialSecurity { get; set; }
        public List<SelectListItem> ddlPlaceToStay { get; set; }
        public List<SelectListItem> ddlFeelSafeNeighborhood { get; set; }

        public PatientSocialSupportBO()
        {
            ddlFinancialSecurity = new List<SelectListItem>();
            ddlPlaceToStay = new List<SelectListItem>();
            ddlFeelSafeNeighborhood = new List<SelectListItem>();
        }
    }
}