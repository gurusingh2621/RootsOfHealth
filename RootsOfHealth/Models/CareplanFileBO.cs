using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class CareplanFileBO
    {
        public int FileId { get; set; }
        public string FileNames { get; set; }
        public string Files { get; set; }
        public string ControlId { get; set; }
        public Nullable<System.DateTime> UploadedDate { get; set; }
        public Nullable<int> CareplanId { get; set; }
        public Nullable<int> PatientId { get; set; }
        public Nullable<bool> IsBaseField { get; set; }
    }
}