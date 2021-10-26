using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class FormLogHistoryBO
    {
        public Nullable<int> LogId { get; set; }
        public string UserName { get; set; }
        public string UserEmail { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}