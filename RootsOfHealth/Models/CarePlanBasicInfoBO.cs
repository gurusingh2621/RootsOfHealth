using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class CarePlanBasicInfoBO
    {
        public int InfoID { get; set; }
        public Nullable<int> ProgramID { get; set; }
        public string Value { get; set; }
        public int TemplateID { get; set; }
        public int TemplateFieldID { get; set; }
    }
}