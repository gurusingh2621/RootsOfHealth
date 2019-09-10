using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class WholePersonCareBo
    {
        public int WholePersonCareID { get; set; }
        public string PatientName { get; set; }
        public Nullable<System.DateTime> DateOfBirth { get; set; }
        public string MedicalRecordNumber { get; set; }
        public string Address { get; set; }
        public string Address2 { get; set; }
        public string Tel { get; set; }
        public string PermissionTo { get; set; }
        public string ComprisedOf { get; set; }
        public string Recipient { get; set; }
        public string Purpose { get; set; }
        public string Purpose2 { get; set; }
        public string Purpose3 { get; set; }
        public string InformationToBeReleased { get; set; }
        public string MedicalRecord { get; set; }
        public string AidsTestResultsInitial { get; set; }
        public string AlcoholTreatementInitial { get; set; }
        public string MentalHealthInitial { get; set; }
        public string OtherInformationToBeReleased { get; set; }
        public string OtherInitial { get; set; }
        public string DelieveryPreference { get; set; }
        public string OtherDelieveryPreference { get; set; }
        public string DelieveryFormat { get; set; }
        public string OtherDelieveryFormat { get; set; }
        public Nullable<System.DateTime> ValidUntilDate { get; set; }
        public string PatientOrRepresentativeName { get; set; }
        public string PatientOrRepresentativeSignature { get; set; }
        public string RelationShip { get; set; }
        public Nullable<System.DateTime> SignatureDate { get; set; }
        public Nullable<int> PatientID { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<bool> IsDeleted { get; set; }
    }
}