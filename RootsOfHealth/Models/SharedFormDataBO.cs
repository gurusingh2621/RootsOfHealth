using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class SharedFormDataBO
    {
        public Nullable<int> FormId { get; set; }
        public int ShareId { get; set; }
        public Nullable<int> ClientId { get; set; }
        public int Templateid { get; set; }
        public Nullable<bool> IsSaved { get; set; }
        public Nullable<bool> IsExpired { get; set; }
        public Nullable<bool> IsActivated { get; set; }
        public string FormName { get; set; }
        public string FormTable { get; set; }
        public Nullable<bool> IsUpdated { get; set; }
        public Nullable<bool> IsBaseTemplateDataSaved { get; set; }
    }
}