using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RootsOfHealth.Models
{
    public class PatientEmploymentEducationBO
    {
        public int PatientEmploymentEducationID { get; set; }
        public string LevelofEducation { get; set; }
        public string WorkSituation { get; set; }
        public Nullable<int> PatientID { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<bool> IsDeleted { get; set; }
        public string HighestGrade { get; set; }
        public string FullTimeNameLocation { get; set; }
        public string PartTimeNameLocation { get; set; }
        public string OtherWorkSituation { get; set; }
        public string ParticipatingInEducationalOrTrainingProgram { get; set; }
        public string ProgramSchoolAndYearAttended { get; set; }
        public string ParticipatingIn { get; set; }
        public string ProgramName { get; set; }
        public string SchoolName { get; set; }

        public List<SelectListItem> ddlLevelofEducation { get; set; }
        public List<SelectListItem> ddlWorkSituation { get; set; }
        public List<SelectListItem> ddlParticipatingInEducationalOrTrainingProgram { get; set; }


        public PatientEmploymentEducationBO()
        {
            ddlLevelofEducation = new List<SelectListItem>();
            ddlWorkSituation = new List<SelectListItem>();
            ddlParticipatingInEducationalOrTrainingProgram = new List<SelectListItem>();

        }
    }
}