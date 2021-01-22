using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class ProgramtemplateBO
    {
        public int TemplateID { get; set; } 
        public Nullable<bool> IsSavedDraft { get; set; }
        public Nullable<int> IsActive { get; set; }
        public Nullable<int> ProgramID { get; set; }
        public string TemplatePath { get; set; }
        public string TemplateTable { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<bool> IsDeleted { get; set; }
        public bool Isactivated { get; set; }
        public bool IsBaseTemplate { get; set; }
        [NotMapped]
        public bool IsModify { get; set; }
        public string ProgramName { get; set; }
        public int TempTemplateId { get; set; }
    }
}