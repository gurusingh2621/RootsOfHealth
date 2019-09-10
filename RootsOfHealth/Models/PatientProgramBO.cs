using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RootsOfHealth.Models
{
    public class PatientProgramBO
    {
        public int PatientProgramsID { get; set; }
        public Nullable<int> ProgramsID { get; set; }
        public Nullable<int> PatientID { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<bool> IsDeleted { get; set; }
        public ClinicBO ClinicOnly { get; set; }
        public DreamOnlyBO DreamOnly { get; set; }
        public OUOnlyBO OUOnly { get; set; }
        public List<SelectListItem> ddlAnyVaccinations { get; set; }
        //public List<SelectListItem> ddlPregnantYes { get; set; }
        public List<SelectListItem> ddlScreeningTests { get; set; }
        public List<SelectListItem> ddlReferralSource { get; set; }
        public List<SelectListItem> ddlCurrentLivingSituation { get; set; }

        public List<string> safetyoptions { get; set; }
        public List<string> employmentoptions { get; set; }
        public List<string> housingshelteroptions { get; set; }
        public List<string> educationoptions { get; set; }
        public List<string> legaloptions { get; set; }
        public List<string> socialrecreationaloptions { get; set; }
        public PeraltaCollegeBO PeraltaCollege { get; set; }

        public List<SelectListItem> ddlOneYouAre { get; set; }

        public PatientProgramBO()
        {

            ClinicOnly = new ClinicBO();
            ddlAnyVaccinations = new List<SelectListItem>();
            //ddlPregnantYes = new List<SelectListItem>();
            ddlScreeningTests = new List<SelectListItem>();
            DreamOnly = new DreamOnlyBO();
            ddlReferralSource = new List<SelectListItem>();
            ddlCurrentLivingSituation = new List<SelectListItem>();
            OUOnly = new OUOnlyBO();
            safetyoptions = new List<string>();
            employmentoptions = new List<string>();
            housingshelteroptions = new List<string>();
            educationoptions = new List<string>();
            legaloptions = new List<string>();
            socialrecreationaloptions = new List<string>();
            PeraltaCollege = new PeraltaCollegeBO();
            ddlOneYouAre = new List<SelectListItem>();


        }
    }
}