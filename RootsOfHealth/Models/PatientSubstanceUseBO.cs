using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RootsOfHealth.Models
{
    public class PatientSubstanceUseBO
    {
        public int SubstanceUseID { get; set; }
        public Nullable<int> DAST { get; set; }
        public Nullable<int> AUDIT { get; set; }
        public Nullable<int> PatientID { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<bool> IsDeleted { get; set; }
        public DastBO Dast { get; set; }
        public AuditBO Audit { get; set; }
        public List<SelectListItem> ddlDrinkAlcohol { get; set; }
        public List<SelectListItem> ddlHowManyDrinks { get; set; }
        public List<SelectListItem> ddlSixOrMoreDrink { get; set; }
        public List<SelectListItem> ddlNotAbleToStopDrinking { get; set; }
        public List<SelectListItem> ddlFailedWhatWasExpected { get; set; }
        public List<SelectListItem> ddlFirstDrinkMorning { get; set; }
        public List<SelectListItem> ddlFeelingOfGuilt { get; set; }
        public List<SelectListItem> ddlUnableToRemember { get; set; }
        public List<SelectListItem> ddlInjuredOfYourDrinking { get; set; }
        public List<SelectListItem> ddlFriendsSuggestedYouCutDown { get; set; }


        public PatientSubstanceUseBO()
        {
            Dast = new DastBO();
            Audit = new AuditBO();
            ddlDrinkAlcohol = new List<SelectListItem>();
            ddlHowManyDrinks = new List<SelectListItem>();
            ddlSixOrMoreDrink = new List<SelectListItem>();
            ddlNotAbleToStopDrinking = new List<SelectListItem>();
            ddlFailedWhatWasExpected = new List<SelectListItem>();
            ddlFirstDrinkMorning = new List<SelectListItem>();
            ddlFeelingOfGuilt = new List<SelectListItem>();
            ddlUnableToRemember = new List<SelectListItem>();
            ddlInjuredOfYourDrinking = new List<SelectListItem>();
            ddlFriendsSuggestedYouCutDown = new List<SelectListItem>();

        }

    }

   
}