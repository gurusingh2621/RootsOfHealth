using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RootsOfHealth.Models
{
    public class PatientHealthcareBO
    {
        public int PatientHealthcareID { get; set; }
        public Nullable<bool> HealthInsurance { get; set; }
        public string PlanName { get; set; }
        public string PolicyNumber { get; set; }
        public string SSN { get; set; }
        public Nullable<bool> PrimaryCareDoctor { get; set; }
        public string LastSeeDoctor { get; set; } = "0";
        public string NameOfDoctor { get; set; }
        public string DoctorLocation { get; set; }
        public Nullable<bool> RegularDentist { get; set; }
        public string LastSeeDentist { get; set; } = "0";
        public string NameOfDentist { get; set; }
        public string DentistLocation { get; set; }
        public Nullable<bool> OtherDoctorsTherapists { get; set; }
        public string TherapistsName { get; set; }
        public string TherapistsLocation { get; set; }
        public Nullable<bool> CaseManager { get; set; }
        public string CaseManagerName { get; set; }
        public string CaseManagerLocation { get; set; }
        public string YourHealthIs { get; set; } = "0";
        public string PastMonthPoorPhysicalHealth { get; set; }
        public string Diagnosed { get; set; } = "0";
        public string PerWeekStrenuousExercise { get; set; }
        public string PerDayStrenuousExercise { get; set; }
        public string PastYearEmergency { get; set; }
        public Nullable<bool> SmokeCigarettes { get; set; }
        public string SmokePerDay { get; set; } = "0";
        public string FrequentlySmoke { get; set; } = "0";
        public Nullable<bool> TobaccoProducts { get; set; }

        public Nullable<int> PatientID { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<bool> IsDeleted { get; set; }

        public List<SelectListItem> ddlLastSeeDoctor { get; set; }
        public List<SelectListItem> ddlLastSeeDentist { get; set; }
        public List<SelectListItem> ddlYourHealthIs { get; set; }
        public List<SelectListItem> ddlPastMonthPoorPhysicalHealth { get; set; }
        public List<SelectListItem> ddlPerWeekStrenuousExercise { get; set; }
        public List<SelectListItem> ddlPerDayStrenuousExercise { get; set; }
        public List<SelectListItem> ddlPastYearEmergency { get; set; }
        public List<SelectListItem> ddlSmokePerDay { get; set; }
        public List<SelectListItem> ddlFrequentlySmoke { get; set; }
        public List<SelectListItem> ddlDiagnosed { get; set; }

        public PatientHealthcareBO()
        {
            ddlLastSeeDoctor = new List<SelectListItem>();
            ddlLastSeeDentist = new List<SelectListItem>();
            ddlYourHealthIs = new List<SelectListItem>();
            ddlPastMonthPoorPhysicalHealth = new List<SelectListItem>();
            ddlPerWeekStrenuousExercise = new List<SelectListItem>();
            ddlPerDayStrenuousExercise = new List<SelectListItem>();
            ddlPastYearEmergency = new List<SelectListItem>();
            ddlSmokePerDay = new List<SelectListItem>();
            ddlFrequentlySmoke = new List<SelectListItem>();
            ddlDiagnosed = new List<SelectListItem>();
        }
    }
}