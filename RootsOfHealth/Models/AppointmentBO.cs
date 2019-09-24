using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class AppointmentBO
    {
        public List<TypeOfAppointmentBO> Type { get; set; }
        public List<LocationOfAppointmentBO> Location { get; set; }
    }
}