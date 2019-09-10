using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class PotientialPatientBO
    {
        public int PatientID { get; set; }
        public string PatientImg { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string NickName { get; set; }
        public string Gender { get; set; }
        public string OtherGender { get; set; }
        public string DateOfBirth { get; set; }
        public string SocialSecurityNumber { get; set; }
        public string RaceEthnicity { get; set; }
        public string OtherRace { get; set; }
        public string Address { get; set; }
        public Nullable<bool> IsPermanentAddress { get; set; }
        public string PermanentAddress { get; set; }
        public string EmailAddress { get; set; }
        public string HomePhone { get; set; }
        public string CellPhone { get; set; }
        public string WayToContact { get; set; }
        public string OtherContact { get; set; }
        public Nullable<int> PatientChildren { get; set; }
        public string PatientChildrensAges { get; set; }
        public Nullable<int> ChildrenUnder18 { get; set; }
        public Nullable<int> Adults18to65 { get; set; }
        public Nullable<int> Adults65Plus { get; set; }
        public string PreferredPharmacyName { get; set; }
        public string PreferredPharmacyLocation { get; set; }
        public Nullable<bool> EverMemberOfUSArmedForces { get; set; }
        public string MaritalStatus { get; set; }
        public string OtherMaritalStatus { get; set; }
        public string LanguagesSpeak { get; set; }
        public string OtherLanguageSpeak { get; set; }
        public Nullable<bool> EverBeenSmoker { get; set; }
        public Nullable<bool> QuitSmoking { get; set; }
        public string SmokingQuitDate { get; set; }
        public string PreferredPronouns { get; set; }
        public string OtherPronouns { get; set; }
        public string ThinkYourselfAs { get; set; }
        public string OtherThinkYourselfAs { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<bool> IsDeleted { get; set; }
        public string EmergencyContact1Name { get; set; }
        public string EmergencyContact1Address { get; set; }
        public string EmergencyContact1EmailAddress { get; set; }
        public string EmergencyContact1Relationship { get; set; }
        public string EmergencyContact2Name { get; set; }
        public string EmergencyContact2Address { get; set; }
        public string EmergencyContact2EmailAddress { get; set; }
        public string EmergencyContact2Relationship { get; set; }
        public string LastTimeYouSmoked { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string EmergencyContact1City { get; set; }
        public string EmergencyContact1State { get; set; }
        public string EmergencyContact1Zip { get; set; }
        public string EmergencyContact2City { get; set; }
        public string EmergencyContact2State { get; set; }
        public string EmergencyContact2Zip { get; set; }
        public Nullable<int> LocalMedicalRecordNumber { get; set; }
        public string AmdMedicalRecordNumber { get; set; }
    }
}