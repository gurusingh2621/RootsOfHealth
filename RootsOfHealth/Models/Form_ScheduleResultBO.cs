using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class Form_ScheduleResultBO
    {
        public string FormName { get; set; }
        public bool IsChild { get; set; }
        public string DotColor { get; set; }
        public int FormId { get; set; }
        public int FormType { get; set; }
        public string NotificationColor { get; set; }
        public string NotificationDays { get; set; }
    }
}