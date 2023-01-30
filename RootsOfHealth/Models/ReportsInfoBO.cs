using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class ReportsInfoBO
    {
        public Nullable<int> TotalCount { get; set; }
        public Nullable<int> ID { get; set; }
        public string ReportName { get; set; }
        public string ReportLink { get; set; }
        public string Description { get; set; }
        public string ReportCategory { get; set; }
    }
}