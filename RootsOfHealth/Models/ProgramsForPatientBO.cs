using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class ProgramsForPatientBO
    {
        public int ProgramID { get; set; }
        public string ProgramName { get; set; }
        public string TemplatePath { get; set; }
        public string TemplateTable { get; set; }
        public int TemplateID { get; set; }
        public int patientID { get; set; }
        public bool Saved { get; set; }

    }
}