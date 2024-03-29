﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class PatientAllDetailByIDBO
    {
        private PatientDetailBO _patientdetail = new PatientDetailBO();
        public PatientDetailBO PatientDetail { get { return _patientdetail; } set { _patientdetail = value; } }
        private PatientScoreBO _patientscore = new PatientScoreBO();
        public PatientScoreBO PatientScore { get { return _patientscore; } set { _patientscore = value; } }
        private List<FormSchedulingBO> _formschedule = new List<FormSchedulingBO>();
        private List<Form_ScheduleResultBO> _form_schedule = new List<Form_ScheduleResultBO>();
        public List<FormSchedulingBO> FormScheduling { get { return _formschedule; } set { _formschedule = value; } }
        public List<Form_ScheduleResultBO> FormSchedulingResult { get { return _form_schedule; } set { _form_schedule = value; } }
        public ClientMainFormInfoBO MainFormInfoBO { get; set; }
        public ClientMainFormTemplateBO ClientMainFormTemplate { get; set; }

    }
}