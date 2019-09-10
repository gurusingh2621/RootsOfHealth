using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RootsOfHealth.Models
{
    public class PatientFinancialSecurityBO
    {
        public int PatientFinancialSecurityID { get; set; }
        public string DifficultiesInPayingBills { get; set; }
        public Nullable<bool> IncomeCoverHouseholdExpenses { get; set; }
        public string SkipMeals { get; set; }
        public string CalworksBenefits { get; set; }
        public string SocialSecurityDisabilityInsurance { get; set; }
        public string GeneralAssistance { get; set; }
        public string WomenInfantChildrenBenefits { get; set; }
        public string UnemploymentBenefits { get; set; }
        public string StateDisabilityInsuranceBenefits { get; set; }
        public string RentalAssistanceBenefits { get; set; }
        public Nullable<int> PatientID { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<bool> IsDeleted { get; set; }

        public List<SelectListItem> ddlDifficultiesInPayingBills { get; set; }
        public List<SelectListItem> ddlSkipMeals { get; set; }
        


        public PatientFinancialSecurityBO()
        {
            ddlDifficultiesInPayingBills = new List<SelectListItem>();
            ddlSkipMeals = new List<SelectListItem>();
        }
    }
}