using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class ReportCategoriesInfoBO
    {
        public Nullable<int> TotalCount { get; set; }
        public Nullable<int> CategoryID { get; set; }
        public string Name { get; set; }
        public string ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedOn { get; set; }
    }
}