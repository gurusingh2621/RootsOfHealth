using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class CarePlanTemplateFieldBO
    {
        public int TemplateFieldID { get; set; }
        public string FieldType { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<bool> IsDeleted { get; set; }
        public Nullable<int> TemplateID { get; set; }
        public string Field { get; set; }
        public string FieldValue { get; set; }

    }
}