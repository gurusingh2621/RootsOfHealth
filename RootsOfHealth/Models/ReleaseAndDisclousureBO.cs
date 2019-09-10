using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class ReleaseAndDisclousureBO
    {
        public int ReleaseAndDisclousureID { get; set; }
        public string HealthRecordNumber { get; set; }
        public Nullable<System.DateTime> DateOfBirth { get; set; }
        public string AuthorizedBy { get; set; }
        public string AuthorizedPerson { get; set; }
        public string TypeOfInformation { get; set; }
        public Nullable<System.DateTime> DatesOfService { get; set; }
        public string Other { get; set; }
        public string XRayReports { get; set; }
        public string Consultation { get; set; }
        public string OrganizationName1 { get; set; }
        public string OrganizationAddress1 { get; set; }
        public string OrganizationName2 { get; set; }
        public string OrganizationAddress2 { get; set; }
        public string PersonalRecords { get; set; }
        public string ExpireEvent { get; set; }
        public string SignatureOfPatient { get; set; }
        public string SignatureOfWitness { get; set; }
        public Nullable<System.DateTime> WitnessDate { get; set; }
        public Nullable<int> PatientID { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<bool> IsDeleted { get; set; }
        public Nullable<System.DateTime> SignatureDate { get; set; }
        public string RepresentativeRelation { get; set; }
        public string DisclosureAs { get; set; }


    }
}