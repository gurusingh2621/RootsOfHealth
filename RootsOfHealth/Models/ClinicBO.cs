using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class ClinicBO
    {
        public int ClinicOnlyID { get; set; }
        public string PrescriptionAndNonPrescriptionMedications { get; set; }
        public string AllergiesMedications { get; set; }
        public string NameOfSurgeries { get; set; }
        public string DateOfSurgeries { get; set; }
        public string FamilyMembersMedicalConditions { get; set; }
        public string AnyVaccinations { get; set; }
        public string Pregnant { get; set; }
        public string ReceivePrenatalCare { get; set; }
        public string DueDateOfPrenatalCare { get; set; }
        public string MenstrualPeriod { get; set; }
        public Nullable<bool> BirthControl { get; set; }
        public string CurrentMethodOfBirthControl { get; set; }
        public Nullable<bool> EmergencyContraception { get; set; }
        public Nullable<bool> EverBeenPregnant { get; set; }
        public Nullable<int> NoOfPregnancies { get; set; }
        public Nullable<int> NoOflivingchildren { get; set; }
        public Nullable<int> NoOfabortions { get; set; }
        public Nullable<int> NoOfmiscarriages { get; set; }
        public string PreventativeScreeningTests { get; set; }
        public string YearOflastScreening { get; set; }
        public Nullable<bool> HealthcareDirective { get; set; }
        public Nullable<bool> AdvancedHealthcareDirectives { get; set; }
        public Nullable<bool> TestedForTB { get; set; }
        public Nullable<bool> TBdiseaseAtAnyTime { get; set; }
        public Nullable<bool> WeakenedImmuneSystem { get; set; }
        public Nullable<bool> ElevatedRateOfTB { get; set; }
        public Nullable<bool> VolunteerOfHighRisk { get; set; }
        public Nullable<int> PatientID { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<bool> IsDeleted { get; set; }

    }
}