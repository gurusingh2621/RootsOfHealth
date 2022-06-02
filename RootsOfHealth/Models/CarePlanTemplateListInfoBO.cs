using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class CarePlanTemplateListInfoBO
    {
        public Nullable<int> TotalCount { get; set; }
        public Nullable<int> TemplateID { get; set; }
        public string TemplateName { get; set; }
        public string ProgramsName { get; set; }
        public Nullable<bool> IsSavedDraft { get; set; }
        public Nullable<bool> IsActive { get; set; }
        public Nullable<bool> Isactivated { get; set; }
        public string TemplatePath { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<int> ProgramsID { get; set; }
        public string TemplateTable { get; set; }
        public Nullable<bool> IsBaseTemplate { get; set; }
    }
}