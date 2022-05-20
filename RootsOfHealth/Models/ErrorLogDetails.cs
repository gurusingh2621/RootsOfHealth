using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class ErrorLogDetails
    {
        public Nullable<int> TotalCount { get; set; }
        public Nullable<int> ErrorLogID { get; set; }
        public string ErrorMessage { get; set; }
        public string StackTrace { get; set; }
        public string InnerException { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
    }
}