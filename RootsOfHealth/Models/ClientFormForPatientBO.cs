using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class ClientFormForPatientBO
    {
        public int ClientFormID { get; set; }
        public string FormName { get; set; }
        public string TemplatePath { get; set; }
        public string TemplateTable { get; set; }
        public int TemplateID { get; set; }
        public int patientID { get; set; }
        public bool Saved { get; set; }
        public Nullable<int> ParentFormID { get; set; }

    }
}