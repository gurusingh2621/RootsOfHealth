using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class LookUpOptionBO
    {
        public int ID { get; set; }
        public string FormName { get; set; }
        public string FieldName { get; set; }
        public Nullable<int> LookUpFieldID { get; set; }
        public string OptionName { get; set; }
        public string OptionValue { get; set; }
    }
}