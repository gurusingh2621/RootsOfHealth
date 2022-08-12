using ExcelDataReader;
using RootsOfHealth.Commom;
using RootsOfHealth.Models;
using System;
using System.IO;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using Newtonsoft.Json;
using System.Text.RegularExpressions;
using RootsOfHealth.CustomFilters;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using S = DocumentFormat.OpenXml.Spreadsheet.Sheets;
using E = DocumentFormat.OpenXml.OpenXmlElement;
using A = DocumentFormat.OpenXml.OpenXmlAttribute;
using System.Reflection;

namespace RootsOfHealth.Controllers
{
    [SessionTimeout]
    [CustomErrorFilter]
    public class ClientController : Controller
    {
        string WebApiKey = WebConfigurationManager.AppSettings["WebApiForBackend"];
        string ProgramUploadPath = WebConfigurationManager.AppSettings["ProgramUploadPath"];
        private string[] necessaryColumnsForPotentialClient = new string[]
              { "FirstName",
                  "LastName",
                  "Gender",
                  "DateOfBirth",
                  "RaceEthnicity",
                  "EmergencyContact1Name",
                  "EmergencyContact1Address",
                  "EmergencyContact1EmailAddress",
                  "EmergencyContact1Relationship",
                  "ChildrenUnder18",
                  "Adults18to65",
                  "Adults65Plus",
                  "EverBeenSmoker",
                  "LanguagesSpeak",
                  "QuitSmoking",
                  "SmokingQuitDate"

              };
        private enum Formats
        {
            General = 0,
            Number = 1,
            Decimal = 2,
            Currency = 164,
            Accounting = 44,
            DateShort = 14,
            DateLong = 165,
            Time = 166,
            Percentage = 10,
            Fraction = 12,
            Scientific = 11,
            Text = 49
        }
        // GET: Client
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ClientsFormList()
        {
            return View();
        }
        [HttpPost]
        public ActionResult GetClientFormtemplatelist()
        {
            string draw = Request.Form.GetValues("draw")[0];
            string sortBy = Request.Form.GetValues("order[0][column]")[0];
            string sortDir = Request.Form.GetValues("order[0][dir]")[0];
            int skipRecords = Convert.ToInt32(Request.Form.GetValues("start")[0]);

            int pageSize = Convert.ToInt32(Request.Form.GetValues("length")[0]);
            var searchTerm = Request.Form.GetValues("search[value]").FirstOrDefault();


            List<ClientFormtemplateListInfoBO> clientformtemplateList = new List<ClientFormtemplateListInfoBO>();

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/getClientFormtemplatelist?skipRecords=" + skipRecords + "&pageSize=" + pageSize + "&sortby=" + sortBy + "&sortDir=" + sortDir + "&search=" + searchTerm);
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<List<ClientFormtemplateListInfoBO>>();
                    readTask.Wait();
                    clientformtemplateList = readTask.Result;
                }

            }
            var TotalCount = 0;
            if (clientformtemplateList.Count > 0)
            {
                TotalCount = clientformtemplateList[0].TotalCount ?? 0;
            }
            return Json(new
            {
                draw = Convert.ToInt32(draw),
                recordsTotal = TotalCount,
                recordsFiltered = TotalCount,
                data = clientformtemplateList
            });

        }
        public ActionResult Info(string PatientID, string CurrentTab = null, string Subtab = null, int ClientFormID = 0)
        {

            double sub;
            Common objCommon = new Common();
            List<ClientFormForPatientBO> clientForm = new List<ClientFormForPatientBO>();
            if (PatientID != "0")
            {
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri(WebApiKey);
                    //HTTP GET
                    var responseTask = client.GetAsync("/api/PatientMain/GetDetailOfClientForm?id=" + PatientID);


                    responseTask.Wait();


                    var result = responseTask.Result;


                    if (result.IsSuccessStatusCode)
                    {

                        var readTask = result.Content.ReadAsAsync<List<ClientFormForPatientBO>>();
                        readTask.Wait();
                        clientForm = readTask.Result;
                        //clientForm= readTask.Result.PatientDetail;

                    }
                    else //web api sent error response 
                    {
                        //log response status here..

                    }

                }
            }
            ViewBag.PatientID = PatientID;
            ViewBag.CurrentTab = CurrentTab;
            ViewBag.CurrentSubtab = Subtab;
            ViewBag.ClientFormID = ClientFormID;

            HttpCookie PatientIdCookie = new HttpCookie("patientid");
            Response.Cookies.Add(PatientIdCookie);
            Response.Cookies["patientid"].Expires = DateTime.Now.AddDays(1);
            return View(clientForm);
        }

        public ActionResult Add(string patientId = "0", string CurrentTab = null, string Subtab = null,int ClientFormID=0)
        {
            double sub;
            Common objCommon = new Common();
            PatientDetailBO patientdetailobj = new PatientDetailBO();
            List<FormSchedulingBO> formscheduleobj = new List<FormSchedulingBO>();
            ScheduleDateBO sheduleobj = new ScheduleDateBO();

            if (patientId != "0")
            {
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri(WebApiKey);
                    //HTTP GET
                    var responseTask = client.GetAsync("/api/PatientMain/GetDetailOfPatientForClientForm?patientid=" + patientId);
                    //  var responseTask1 = client.GetAsync("/api/PatientMain/GetFormScheduling");

                    responseTask.Wait();
                    //  responseTask1.Wait();

                    var result = responseTask.Result;
                    //var result1 = responseTask1.Result;
                    if (result.IsSuccessStatusCode)
                    {
                        var readTask = result.Content.ReadAsAsync<PatientAllDetailByIDBO>();
                        readTask.Wait();

                        //var readTask1 = result1.Content.ReadAsAsync<List<FormSchedulingBO>>();
                        //readTask1.Wait();


                        patientdetailobj = readTask.Result.PatientDetail;
                        patientdetailobj.PatientSubstanceUse.Dast = patientdetailobj.Dast;
                        patientdetailobj.PatientSubstanceUse.Audit = patientdetailobj.Audit;
                        patientdetailobj.PatientMain.CareplanCount = patientdetailobj.CarePlanCount.CarePlanCount;
                        patientdetailobj.PatientMentalHealth.PHQ9 = patientdetailobj.PHQ9;
                        patientdetailobj.PatientProgram.ClinicOnly = patientdetailobj.ClinicOnly;
                        patientdetailobj.PatientProgram.DreamOnly = patientdetailobj.DreamOnly;
                        patientdetailobj.PatientProgram.OUOnly = patientdetailobj.OUOnly;
                        patientdetailobj.PatientProgram.PeraltaCollege = patientdetailobj.PeraltaCollege;
                        patientdetailobj.FormScheduling = readTask.Result.FormSchedulingResult;

                        ViewBag.FirstName = patientdetailobj.PatientMain.FirstName + " " + patientdetailobj.PatientMain.MiddleName + " " + patientdetailobj.PatientMain.LastName;
                        ViewBag.DOB = patientdetailobj.PatientMain.DateOfBirth;
                        ViewBag.mentalPDOB = patientdetailobj.PatientMentalHealth.CreatedDate == null ? DateTime.Now.ToShortDateString() : patientdetailobj.PatientMentalHealth.CreatedDate.ToString();
                        ViewBag.SSNNumber = patientdetailobj.PatientMain.SocialSecurityNumber;

                        ViewBag.PatientID = patientId;


                        formscheduleobj = readTask.Result.FormScheduling;
                        foreach (var m in formscheduleobj)
                        {
                            if (m.FormName == "Housing")
                            {
                                var modifydate = patientdetailobj.PatientHousing.ModifiedDate;
                                if (modifydate != null)
                                {
                                    var dt = patientdetailobj.PatientHousing.ModifiedDate.Value.ToShortDateString();

                                    var t = "";
                                    var currentdate = "";
                                    var count = m.ForEvery;
                                    var type = m.ForType;
                                    if (type == "Days")
                                    {
                                        var everyd = Convert.ToDouble(count);
                                        t = Convert.ToDateTime(dt).AddDays(everyd).ToShortDateString();
                                        currentdate = DateTime.Now.ToShortDateString();

                                    }
                                    else if (type == "Week")
                                    {
                                        var everyw = Convert.ToDouble(7 * count);
                                        t = Convert.ToDateTime(dt).AddDays(everyw).ToShortDateString();
                                    }
                                    else if (type == "Month")
                                    {
                                        var everym = Convert.ToInt16(count);
                                        t = Convert.ToDateTime(dt).AddMonths(everym).ToShortDateString();
                                    }

                                    var todaydate = DateTime.Now.ToShortDateString();
                                    var houschedule = DateTime.Parse(t);
                                    var today = DateTime.Parse(todaydate);
                                    if (today > houschedule)
                                    {

                                        sheduleobj.IsHousingDue = "Red";
                                        sub = (today - houschedule).TotalDays;
                                        sheduleobj.HousingNotification = (sub - 1).ToString();
                                    }
                                    else if (today <= houschedule)
                                    {

                                        sub = (houschedule - today).TotalDays;
                                        if (sub >= 3 && sub < 7)
                                        {
                                            sheduleobj.IsHousingDue = "Green";
                                        }
                                        else if (sub >= 0 && sub < 3)
                                        {
                                            sheduleobj.IsHousingDue = "Orange";
                                        }
                                        sheduleobj.HousingNotification = (sub + 1).ToString();
                                    }
                                }
                                else
                                {

                                }
                            }

                            else if (m.FormName == "Financial Security")
                            {
                                var modifydate = patientdetailobj.PatientFinancialSecurity.ModifiedDate;
                                if (modifydate != null)
                                {
                                    var dt = patientdetailobj.PatientFinancialSecurity.ModifiedDate.Value.ToShortDateString();

                                    var t = "";
                                    var count = m.ForEvery;
                                    var type = m.ForType;
                                    if (type == "Days")
                                    {
                                        var everyd = Convert.ToDouble(count);
                                        t = Convert.ToDateTime(dt).AddDays(everyd).ToShortDateString();
                                    }
                                    else if (type == "Week")
                                    {
                                        var everyw = Convert.ToDouble(7 * count);
                                        t = Convert.ToDateTime(dt).AddDays(everyw).ToShortDateString();
                                    }
                                    else if (type == "Month")
                                    {
                                        var everym = Convert.ToInt16(count);
                                        t = Convert.ToDateTime(dt).AddMonths(everym).ToShortDateString();
                                    }

                                    var todaydate = DateTime.Now.ToShortDateString();
                                    var houschedule = DateTime.Parse(t);
                                    var today = DateTime.Parse(todaydate);
                                    if (today > houschedule)
                                    {

                                        sheduleobj.IsFinancialDue = "Red";
                                        sub = (today - houschedule).TotalDays;
                                        sheduleobj.FinancialNotification = (sub - 1).ToString();
                                    }
                                    else if (today <= houschedule)
                                    {

                                        sub = (houschedule - today).TotalDays;
                                        if (sub >= 3 && sub < 7)
                                        {
                                            sheduleobj.IsFinancialDue = "Green";
                                        }
                                        else if (sub >= 0 && sub < 3)
                                        {
                                            sheduleobj.IsFinancialDue = "Orange";
                                        }
                                        sheduleobj.FinancialNotification = (sub + 1).ToString();
                                    }
                                }
                                else
                                {

                                }
                            }

                            else if (m.FormName == "Employment/Education")
                            {
                                var modifydate = patientdetailobj.PatientEmploymentEducation.ModifiedDate;
                                if (modifydate != null)
                                {
                                    var dt = patientdetailobj.PatientEmploymentEducation.ModifiedDate.Value.ToShortDateString();

                                    var t = "";
                                    var count = m.ForEvery;
                                    var type = m.ForType;
                                    if (type == "Days")
                                    {
                                        var everyd = Convert.ToDouble(count);
                                        t = Convert.ToDateTime(dt).AddDays(everyd).ToShortDateString();
                                    }
                                    else if (type == "Week")
                                    {
                                        var everyw = Convert.ToDouble(7 * count);
                                        t = Convert.ToDateTime(dt).AddDays(everyw).ToShortDateString();
                                    }
                                    else if (type == "Month")
                                    {
                                        var everym = Convert.ToInt16(count);
                                        t = Convert.ToDateTime(dt).AddMonths(everym).ToShortDateString();
                                    }

                                    var todaydate = DateTime.Now.ToShortDateString();
                                    var houschedule = DateTime.Parse(t);
                                    var today = DateTime.Parse(todaydate);
                                    if (today > houschedule)
                                    {

                                        sheduleobj.IsEmploymentDue = "Red";
                                        sub = (today - houschedule).TotalDays;
                                        sheduleobj.EmploymentNotification = (sub - 1).ToString();
                                    }
                                    else if (today <= houschedule)
                                    {

                                        sub = (houschedule - today).TotalDays;
                                        if (sub >= 3 && sub < 7)
                                        {
                                            sheduleobj.IsEmploymentDue = "Green";
                                        }
                                        else if (sub >= 0 && sub < 3)
                                        {
                                            sheduleobj.IsEmploymentDue = "Orange";
                                        }
                                        sheduleobj.EmploymentNotification = (sub + 1).ToString();
                                    }

                                }
                                else
                                {

                                }
                            }

                            else if (m.FormName == "Communication & Mobility")
                            {
                                var modifydate = patientdetailobj.PatientCommunicationAndMobility.ModifiedDate;
                                if (modifydate != null)
                                {
                                    var dt = patientdetailobj.PatientCommunicationAndMobility.ModifiedDate.Value.ToShortDateString();

                                    var t = "";
                                    var count = m.ForEvery;
                                    var type = m.ForType;
                                    if (type == "Days")
                                    {
                                        var everyd = Convert.ToDouble(count);
                                        t = Convert.ToDateTime(dt).AddDays(everyd).ToShortDateString();
                                    }
                                    else if (type == "Week")
                                    {
                                        var everyw = Convert.ToDouble(7 * count);
                                        t = Convert.ToDateTime(dt).AddDays(everyw).ToShortDateString();
                                    }
                                    else if (type == "Month")
                                    {
                                        var everym = Convert.ToInt16(count);
                                        t = Convert.ToDateTime(dt).AddMonths(everym).ToShortDateString();
                                    }
                                    //ViewBag.HouSchedule=t;
                                    var todaydate = DateTime.Now.ToShortDateString();
                                    var houschedule = DateTime.Parse(t);
                                    var today = DateTime.Parse(todaydate);
                                    if (today > houschedule)
                                    {
                                        sheduleobj.IsCommunicationDue = "Red";
                                        sub = (today - houschedule).TotalDays;
                                        sheduleobj.CommunicationNotification = (sub - 1).ToString();
                                    }
                                    else if (today <= houschedule)
                                    {

                                        sub = (houschedule - today).TotalDays;
                                        if (sub >= 3 && sub < 7)
                                        {
                                            sheduleobj.IsCommunicationDue = "Green";
                                        }
                                        else if (sub >= 0 && sub < 3)
                                        {
                                            sheduleobj.IsCommunicationDue = "Orange";
                                        }
                                        sheduleobj.CommunicationNotification = (sub + 1).ToString();
                                    }

                                }
                                else
                                {

                                }
                            }

                            else if (m.FormName == "Healthcare")
                            {
                                var modifydate = patientdetailobj.PatientHealthcare.ModifiedDate;
                                if (modifydate != null)
                                {
                                    var dt = patientdetailobj.PatientHealthcare.ModifiedDate.Value.ToShortDateString();

                                    var t = "";
                                    var count = m.ForEvery;
                                    var type = m.ForType;
                                    if (type == "Days")
                                    {
                                        var everyd = Convert.ToDouble(count);
                                        t = Convert.ToDateTime(dt).AddDays(everyd).ToShortDateString();
                                    }
                                    else if (type == "Week")
                                    {
                                        var everyw = Convert.ToDouble(7 * count);
                                        t = Convert.ToDateTime(dt).AddDays(everyw).ToShortDateString();
                                    }
                                    else if (type == "Month")
                                    {
                                        var everym = Convert.ToInt16(count);
                                        t = Convert.ToDateTime(dt).AddMonths(everym).ToShortDateString();
                                    }
                                    //ViewBag.HouSchedule=t;
                                    var todaydate = DateTime.Now.ToShortDateString();
                                    var houschedule = DateTime.Parse(t);
                                    var today = DateTime.Parse(todaydate);
                                    if (today > houschedule)
                                    {
                                        sheduleobj.IsHealthcareDue = "Red";
                                        sub = (today - houschedule).TotalDays;
                                        sheduleobj.HealthcareNotification = (sub - 1).ToString();
                                    }
                                    else if (today <= houschedule)
                                    {

                                        sub = (houschedule - today).TotalDays;
                                        if (sub >= 3 && sub < 7)
                                        {
                                            sheduleobj.IsHealthcareDue = "Green";
                                        }
                                        else if (sub >= 0 && sub < 3)
                                        {
                                            sheduleobj.IsHealthcareDue = "Orange";
                                        }
                                        sheduleobj.HealthcareNotification = (sub + 1).ToString();
                                    }

                                }
                                else
                                {

                                }
                            }

                            else if (m.FormName == "Social Supports and Safety")
                            {
                                var modifydate = patientdetailobj.PatientSocialSupport.ModifiedDate;
                                if (modifydate != null)
                                {
                                    var dt = patientdetailobj.PatientSocialSupport.ModifiedDate.Value.ToShortDateString();

                                    var t = "";
                                    var count = m.ForEvery;
                                    var type = m.ForType;
                                    if (type == "Days")
                                    {
                                        var everyd = Convert.ToDouble(count);
                                        t = Convert.ToDateTime(dt).AddDays(everyd).ToShortDateString();
                                    }
                                    else if (type == "Week")
                                    {
                                        var everyw = Convert.ToDouble(7 * count);
                                        t = Convert.ToDateTime(dt).AddDays(everyw).ToShortDateString();
                                    }
                                    else if (type == "Month")
                                    {
                                        var everym = Convert.ToInt16(count);
                                        t = Convert.ToDateTime(dt).AddMonths(everym).ToShortDateString();
                                    }
                                    //ViewBag.HouSchedule=t;
                                    var todaydate = DateTime.Now.ToShortDateString();
                                    var houschedule = DateTime.Parse(t);
                                    var today = DateTime.Parse(todaydate);
                                    if (today > houschedule)
                                    {
                                        sheduleobj.IsSocialSupportsDue = "Red";
                                        sub = (today - houschedule).TotalDays;
                                        sheduleobj.SocialNotification = (sub - 1).ToString();
                                    }
                                    else if (today <= houschedule)
                                    {

                                        sub = (houschedule - today).TotalDays;
                                        if (sub >= 3 && sub < 7)
                                        {
                                            sheduleobj.IsSocialSupportsDue = "Green";
                                        }
                                        else if (sub >= 0 && sub < 3)
                                        {
                                            sheduleobj.IsSocialSupportsDue = "Orange";
                                        }
                                        sheduleobj.SocialNotification = (sub + 1).ToString();
                                    }

                                }
                                else
                                {

                                }
                            }

                            else if (m.FormName == "Legal Status")
                            {
                                var modifydate = patientdetailobj.PatientLegalStatus.ModifiedDate;
                                if (modifydate != null)
                                {
                                    var dt = patientdetailobj.PatientLegalStatus.ModifiedDate.Value.ToShortDateString();

                                    var t = "";

                                    var count = m.ForEvery;
                                    var type = m.ForType;
                                    if (type == "Days")
                                    {
                                        var everyd = Convert.ToDouble(count);
                                        t = Convert.ToDateTime(dt).AddDays(everyd).ToShortDateString();
                                    }
                                    else if (type == "Week")
                                    {
                                        var everyw = Convert.ToDouble(7 * count);
                                        t = Convert.ToDateTime(dt).AddDays(everyw).ToShortDateString();
                                    }
                                    else if (type == "Month")
                                    {
                                        var everym = Convert.ToInt16(count);
                                        t = Convert.ToDateTime(dt).AddMonths(everym).ToShortDateString();
                                    }
                                    //ViewBag.HouSchedule=t;
                                    var todaydate = DateTime.Now.ToShortDateString();
                                    var houschedule = DateTime.Parse(t);
                                    var today = DateTime.Parse(todaydate);
                                    if (today > houschedule)
                                    {
                                        sheduleobj.IsLegalStatusDue = "Red";
                                        sub = (today - houschedule).TotalDays;
                                        sheduleobj.LegalNotification = (sub - 1).ToString();
                                    }
                                    else if (today <= houschedule)
                                    {

                                        sub = (houschedule - today).TotalDays;
                                        if (sub >= 3 && sub < 7)
                                        {
                                            sheduleobj.IsLegalStatusDue = "Green";
                                        }
                                        else if (sub >= 0 && sub < 3)
                                        {
                                            sheduleobj.IsLegalStatusDue = "Orange";
                                        }
                                        sheduleobj.LegalNotification = (sub + 1).ToString();
                                    }


                                }
                                else
                                {

                                }
                            }

                            else if (m.FormName == "Substance Use")
                            {
                                double subaudit = 0, subdast = 0;

                                var modifydateaudit = patientdetailobj.Audit.ModifiedDate;
                                var modifydatedast = patientdetailobj.Dast.ModifiedDate;


                                if (modifydatedast != null)
                                {

                                    var dastdt = patientdetailobj.Dast.ModifiedDate.Value.ToShortDateString();
                                    var tdast = "";
                                    var count = m.ForEvery;
                                    var type = m.ForType;
                                    if (type == "Days")
                                    {
                                        var everyd = Convert.ToDouble(count);
                                        tdast = Convert.ToDateTime(dastdt).AddDays(everyd).ToShortDateString();
                                    }
                                    else if (type == "Week")
                                    {
                                        var everyw = Convert.ToDouble(7 * count);
                                        tdast = Convert.ToDateTime(dastdt).AddDays(everyw).ToShortDateString();
                                    }
                                    else if (type == "Month")
                                    {
                                        var everym = Convert.ToInt16(count);
                                        tdast = Convert.ToDateTime(dastdt).AddMonths(everym).ToShortDateString();
                                    }
                                    //ViewBag.HouSchedule=t;
                                    var todaydate = DateTime.Now.ToShortDateString();
                                    var houscheduledast = DateTime.Parse(tdast);
                                    var today = DateTime.Parse(todaydate);
                                    if (today > houscheduledast)
                                    {
                                        sheduleobj.IsDastDue = "Red";
                                        subdast = (today - houscheduledast).TotalDays;
                                        sheduleobj.DastNotification = (subdast - 1).ToString();
                                    }
                                    if (today <= houscheduledast)
                                    {

                                        subdast = (houscheduledast - today).TotalDays;
                                        if (subdast >= 3 && subdast < 7)
                                        {
                                            sheduleobj.IsDastDue = "Green";
                                        }
                                        else if (subdast >= 0 && subdast < 3)
                                        {
                                            sheduleobj.IsDastDue = "Orange";
                                        }
                                        sheduleobj.DastNotification = (subdast + 1).ToString();
                                    }
                                }

                                else
                                {

                                }
                                if (modifydateaudit != null)
                                {
                                    var auditdt = patientdetailobj.Audit.ModifiedDate.Value.ToShortDateString();

                                    var taudit = "";
                                    var count = m.ForEvery;
                                    var type = m.ForType;
                                    if (type == "Days")
                                    {
                                        var everyd = Convert.ToDouble(count);
                                        taudit = Convert.ToDateTime(auditdt).AddDays(everyd).ToShortDateString();
                                    }
                                    else if (type == "Week")
                                    {
                                        var everyw = Convert.ToDouble(7 * count);
                                        taudit = Convert.ToDateTime(auditdt).AddDays(everyw).ToShortDateString();
                                    }
                                    else if (type == "Month")
                                    {
                                        var everym = Convert.ToInt16(count);
                                        taudit = Convert.ToDateTime(auditdt).AddMonths(everym).ToShortDateString();
                                    }
                                    //ViewBag.HouSchedule=t;
                                    var todaydate = DateTime.Now.ToShortDateString();
                                    var houscheduleaudit = DateTime.Parse(taudit);
                                    var today = DateTime.Parse(todaydate);

                                    if (today > houscheduleaudit)
                                    {
                                        sheduleobj.IsAuditDue = "Red";
                                        subaudit = (today - houscheduleaudit).TotalDays;
                                        sheduleobj.AuditNotification = (subaudit - 1).ToString();
                                    }
                                    if (today <= houscheduleaudit)
                                    {
                                        subaudit = (houscheduleaudit - today).TotalDays;
                                        if (subaudit >= 3 && subaudit < 7)
                                        {
                                            sheduleobj.IsAuditDue = "Green";
                                        }
                                        else if (subaudit >= 0 && subaudit < 3)
                                        {
                                            sheduleobj.IsAuditDue = "Orange";
                                        }
                                        sheduleobj.AuditNotification = (subaudit + 1).ToString();
                                    }


                                }

                                else
                                {

                                }
                            }



                            //else if (m.FormName == "Substance Use")
                            //{
                            //    double subaudit=0, subdast=0;

                            //    var modifydateaudit = patientdetailobj.Audit.ModifiedDate;
                            //    var modifydatedast = patientdetailobj.Dast.ModifiedDate;
                            //    if (modifydateaudit != null || modifydatedast != null)
                            //    {
                            //        var auditdt = patientdetailobj.Audit.ModifiedDate.Value.ToShortDateString();
                            //        var dastdt = patientdetailobj.Dast.ModifiedDate.Value.ToShortDateString();

                            //        var taudit = "";
                            //        var tdast = "";
                            //        var count = m.ForEvery;
                            //        var type = m.ForType;
                            //        if (type == "Days")
                            //        {
                            //            var everyd = Convert.ToDouble(count);
                            //            taudit = Convert.ToDateTime(auditdt).AddDays(everyd).ToString("dd-MM-yyyy");
                            //            tdast = Convert.ToDateTime(dastdt).AddDays(everyd).ToString("dd-MM-yyyy");
                            //        }
                            //        else if (type == "Week")
                            //        {
                            //            var everyw = Convert.ToDouble(7 * count);
                            //            taudit = Convert.ToDateTime(auditdt).AddDays(everyw).ToString("dd-MM-yyyy");
                            //            tdast = Convert.ToDateTime(dastdt).AddDays(everyw).ToString("dd-MM-yyyy");
                            //        }
                            //        else if (type == "Month")
                            //        {
                            //            var everym = Convert.ToInt16(count);
                            //            taudit = Convert.ToDateTime(auditdt).AddMonths(everym).ToString("dd-MM-yyyy");
                            //            tdast = Convert.ToDateTime(dastdt).AddMonths(everym).ToString("dd-MM-yyyy");
                            //        }
                            //        //ViewBag.HouSchedule=t;
                            //        var todaydate = DateTime.Now.ToShortDateString();
                            //        var houscheduleaudit = DateTime.Parse(taudit);
                            //        var houscheduledast = DateTime.Parse(tdast);
                            //        var today = DateTime.Parse(todaydate);
                            //        if (today > houscheduleaudit || today > houscheduledast)
                            //        {
                            //            if (today > houscheduleaudit)
                            //            {
                            //                sheduleobj.IsSubstanceUseDue = "Red";
                            //                subaudit = (today - houscheduleaudit).TotalDays;
                            //            }
                            //            if (today > houscheduledast)
                            //            {
                            //                sheduleobj.IsSubstanceUseDue = "Red";
                            //                subdast = (today - houscheduledast).TotalDays;
                            //            }
                            //            if (subaudit > subdast)
                            //            {
                            //                if (subdast == 0)
                            //                {
                            //                    sheduleobj.SubstanceNotification = (subaudit - 1).ToString();
                            //                }
                            //                else
                            //                {
                            //                    sheduleobj.SubstanceNotification = (subdast - 1).ToString();
                            //                }

                            //            }
                            //            else
                            //            {
                            //                if (subaudit == 0)
                            //                {
                            //                    sheduleobj.SubstanceNotification = (subdast - 1).ToString();
                            //                }
                            //                else
                            //                {
                            //                    sheduleobj.SubstanceNotification = (subaudit - 1).ToString();
                            //                }

                            //            }
                            //        }
                            //        else if (today <= houscheduleaudit || today <= houscheduledast)
                            //        {

                            //            if (today <= houscheduleaudit)
                            //            {

                            //                subaudit = (houscheduleaudit - today).TotalDays;
                            //            }
                            //            if (today <= houscheduledast)
                            //            {

                            //                subdast = (houscheduledast - today).TotalDays;
                            //            }
                            //            if (subaudit > subdast)
                            //            {
                            //                if (subdast == 0)
                            //                {
                            //                    sheduleobj.IsSubstanceUseDue = "Orange";
                            //                    sheduleobj.SubstanceNotification = (subaudit + 1).ToString();
                            //                }
                            //                else
                            //                {
                            //                    if(subdast>=3 && subdast<7)
                            //                    {
                            //                        sheduleobj.IsSubstanceUseDue = "Green";
                            //                    }
                            //                    if (subdast >= 1 && subdast < 3)
                            //                    {
                            //                        sheduleobj.IsSubstanceUseDue = "Orange";
                            //                    }
                            //                    sheduleobj.SubstanceNotification = (subdast + 1).ToString();
                            //                }

                            //            }
                            //            else
                            //            {
                            //                if (subaudit == 0)
                            //                {
                            //                    sheduleobj.IsSubstanceUseDue = "Orange";
                            //                    sheduleobj.SubstanceNotification = (subdast + 1).ToString();
                            //                }
                            //                else
                            //                {
                            //                    if (subaudit >= 3 && subaudit < 7)
                            //                    {
                            //                        sheduleobj.IsSubstanceUseDue = "Green";
                            //                    }
                            //                    if (subaudit >= 1 && subaudit < 3)
                            //                    {
                            //                        sheduleobj.IsSubstanceUseDue = "Orange";
                            //                    }
                            //                    sheduleobj.SubstanceNotification = (subaudit + 1).ToString();
                            //                }

                            //            }

                            //        }


                            //    }
                            //    else
                            //    {

                            //    }
                            //}



                            else if (m.FormName == "Mental Health")
                            {
                                var modifydate = patientdetailobj.PatientMentalHealth.ModifiedDate;
                                if (modifydate != null)
                                {
                                    var dt = patientdetailobj.PatientMentalHealth.ModifiedDate.Value.ToShortDateString();

                                    var t = "";
                                    var count = m.ForEvery;
                                    var type = m.ForType;
                                    if (type == "Days")
                                    {
                                        var everyd = Convert.ToDouble(count);
                                        t = Convert.ToDateTime(dt).AddDays(everyd).ToShortDateString();
                                    }
                                    else if (type == "Week")
                                    {
                                        var everyw = Convert.ToDouble(7 * count);
                                        t = Convert.ToDateTime(dt).AddDays(everyw).ToShortDateString();
                                    }
                                    else if (type == "Month")
                                    {
                                        var everym = Convert.ToInt16(count);
                                        t = Convert.ToDateTime(dt).AddMonths(everym).ToShortDateString();
                                    }

                                    var todaydate = DateTime.Now.ToShortDateString();
                                    var houschedule = DateTime.Parse(t);
                                    var today = DateTime.Parse(todaydate);
                                    if (today > houschedule)
                                    {
                                        sheduleobj.IsMentalHealthDue = "Red";
                                        sub = (today - houschedule).TotalDays;
                                        sheduleobj.MentalNotification = (sub - 1).ToString();
                                    }
                                    else if (today <= houschedule)
                                    {

                                        sub = (houschedule - today).TotalDays;
                                        if (sub >= 3 && sub < 7)
                                        {
                                            sheduleobj.IsMentalHealthDue = "Green";
                                        }
                                        else if (sub >= 0 && sub < 3)
                                        {
                                            sheduleobj.IsMentalHealthDue = "Orange";
                                        }
                                        sheduleobj.MentalNotification = (sub + 1).ToString();
                                    }

                                }
                                else
                                {

                                }
                            }

                            else if (m.FormName == "Food Access")
                            {
                                var modifydate = patientdetailobj.PatientFoodAccess.ModifiedDate;
                                if (modifydate != null)
                                {
                                    var dt = patientdetailobj.PatientFoodAccess.ModifiedDate.Value.ToShortDateString();

                                    var t = "";
                                    var count = m.ForEvery;
                                    var type = m.ForType;
                                    if (type == "Days")
                                    {
                                        var everyd = Convert.ToDouble(count);
                                        t = Convert.ToDateTime(dt).AddDays(everyd).ToShortDateString();
                                    }
                                    else if (type == "Week")
                                    {
                                        var everyw = Convert.ToDouble(7 * count);
                                        t = Convert.ToDateTime(dt).AddDays(everyw).ToShortDateString();
                                    }
                                    else if (type == "Month")
                                    {
                                        var everym = Convert.ToInt16(count);
                                        t = Convert.ToDateTime(dt).AddMonths(everym).ToShortDateString();
                                    }

                                    var todaydate = DateTime.Now.ToShortDateString();
                                    var houschedule = DateTime.Parse(t);
                                    var today = DateTime.Parse(todaydate);
                                    if (today > houschedule)
                                    {
                                        sheduleobj.IsFoodAccessDue = "Red";
                                        sub = (today - houschedule).TotalDays;
                                        sheduleobj.FoodNotification = (sub - 1).ToString();
                                    }
                                    else if (today <= houschedule)
                                    {

                                        sub = (houschedule - today).TotalDays;
                                        if (sub >= 3 && sub < 7)
                                        {
                                            sheduleobj.IsFoodAccessDue = "Green";
                                        }
                                        else if (sub >= 0 && sub < 3)
                                        {
                                            sheduleobj.IsFoodAccessDue = "Orange";
                                        }
                                        sheduleobj.FoodNotification = (sub + 1).ToString();
                                    }

                                }
                                else
                                {

                                }
                            }



                        }

                        patientdetailobj.ScheduleDate = sheduleobj;
                        objCommon.BindDBOptions(ref patientdetailobj);
                    }
                    else //web api sent error response 
                    {
                        //log response status here..
                    }
                }
            }
            else
            {

                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri(WebApiKey);
                    //HTTP GET
                    var responseTask = client.GetAsync("/api/PatientMain/GetDetailOfClientForm?id=" + patientId);


                    responseTask.Wait();


                    var result = responseTask.Result;


                    if (result.IsSuccessStatusCode)
                    {

                        var readTask = result.Content.ReadAsAsync<List<ClientFormForPatientBO>>();
                        readTask.Wait();
                        patientdetailobj.ClientForm = readTask.Result;
                        //clientForm= readTask.Result.PatientDetail;

                    }
                    else //web api sent error response 
                    {
                        //log response status here..

                    }

                }

                objCommon.BindSafetyOptions(ref patientdetailobj);
                objCommon.BindEmploymentOptions(ref patientdetailobj);
                objCommon.BindHousingShelterOptions(ref patientdetailobj);
                objCommon.BindEducationOptions(ref patientdetailobj);
                objCommon.BindLegalOptions(ref patientdetailobj);
                objCommon.BindSocialRecreationalOptions(ref patientdetailobj);
                patientdetailobj.Programs = new List<ProgramsForPatientBO>();

            }

            objCommon.BindDropDowns(ref patientdetailobj);

            ViewBag.PatientID = patientId;
            ViewBag.CurrentTab = CurrentTab;
            ViewBag.CurrentSubtab = Subtab;
            ViewBag.ClientFormID = ClientFormID;
            Response.Cookies["patientid"].Value = patientId.ToString();
            Response.Cookies["patientid"].Expires = DateTime.Now.AddDays(1);
            return View(patientdetailobj);
        }

        [HttpGet]
        public ActionResult GetRecentClientForm()
        {

            List<PatientMainBO> patientdetailobj = new List<PatientMainBO>();

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/GetRecentPatientsForClientForm?clinicid=" + Session["ClinicID"]);
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<List<PatientMainBO>>();
                    readTask.Wait();
                    patientdetailobj = readTask.Result;
                }
                else //web api sent error response 
                {
                    //log response status here..


                }
            }

            return PartialView("~/Views/Shared/Patient/_RecentPatients.cshtml", patientdetailobj);

        }

        [HttpPost]
        public ActionResult GetClientFormDetail(string PatientID)
        {
            double sub;
            Common objCommon = new Common();
            PatientDetailBO patientdetailobj = new PatientDetailBO();
            List<FormSchedulingBO> formscheduleobj = new List<FormSchedulingBO>();
            ScheduleDateBO sheduleobj = new ScheduleDateBO();

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/GetDetailOfPatientForClientForm?patientid=" + PatientID);

                responseTask.Wait();

                var result = responseTask.Result;

                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<PatientAllDetailByIDBO>();
                    readTask.Wait();


                    patientdetailobj = readTask.Result.PatientDetail;
                    patientdetailobj.PatientScore = readTask.Result.PatientScore;
                    patientdetailobj.PatientSubstanceUse.Audit = patientdetailobj.Audit;
                    patientdetailobj.PatientSubstanceUse.Dast = patientdetailobj.Dast;
                    patientdetailobj.PatientMain.CareplanCount = patientdetailobj.CarePlanCount.CarePlanCount;
                    patientdetailobj.PatientMentalHealth.PHQ9 = patientdetailobj.PHQ9;
                    patientdetailobj.PatientProgram.ClinicOnly = patientdetailobj.ClinicOnly;
                    patientdetailobj.PatientProgram.DreamOnly = patientdetailobj.DreamOnly;
                    patientdetailobj.PatientProgram.OUOnly = patientdetailobj.OUOnly;
                    patientdetailobj.PatientProgram.PeraltaCollege = patientdetailobj.PeraltaCollege;
                    patientdetailobj.FormScheduling = readTask.Result.FormSchedulingResult;

                    ViewBag.PatientId = patientdetailobj.PatientMain.PatientID;
                    ViewBag.FirstName = patientdetailobj.PatientMain.FirstName + " " + patientdetailobj.PatientMain.MiddleName + " " + patientdetailobj.PatientMain.LastName;
                    ViewBag.DOB = patientdetailobj.PatientMain.DateOfBirth;
                    ViewBag.mentalPDOB = patientdetailobj.PatientMentalHealth.CreatedDate == null ? DateTime.Now.ToShortDateString() : patientdetailobj.PatientMentalHealth.CreatedDate.ToString();
                    ViewBag.SSNNumber = patientdetailobj.PatientMain.SocialSecurityNumber;



                    formscheduleobj = readTask.Result.FormScheduling;
                    foreach (var m in formscheduleobj)
                    {
                        if (m.FormName == "Housing")
                        {
                            var modifydate = patientdetailobj.PatientHousing.ModifiedDate;
                            if (modifydate != null)
                            {
                                var dt = patientdetailobj.PatientHousing.ModifiedDate.Value.ToShortDateString();

                                var t = "";
                                var currentdate = "";
                                var count = m.ForEvery;
                                var type = m.ForType;
                                if (type == "Days")
                                {
                                    var everyd = Convert.ToDouble(count);
                                    t = Convert.ToDateTime(dt).AddDays(everyd).ToShortDateString();
                                    currentdate = DateTime.Now.ToShortDateString();

                                }
                                else if (type == "Week")
                                {
                                    var everyw = Convert.ToDouble(7 * count);
                                    t = Convert.ToDateTime(dt).AddDays(everyw).ToShortDateString();
                                }
                                else if (type == "Month")
                                {
                                    var everym = Convert.ToInt16(count);
                                    t = Convert.ToDateTime(dt).AddMonths(everym).ToShortDateString();
                                }

                                var todaydate = DateTime.Now.ToShortDateString();
                                var houschedule = DateTime.Parse(t);
                                var today = DateTime.Parse(todaydate);
                                if (today > houschedule)
                                {

                                    sheduleobj.IsHousingDue = "Red";
                                    sub = (today - houschedule).TotalDays;
                                    sheduleobj.HousingNotification = (sub - 1).ToString();
                                }
                                else if (today <= houschedule)
                                {

                                    sub = (houschedule - today).TotalDays;
                                    if (sub >= 3 && sub < 7)
                                    {
                                        sheduleobj.IsHousingDue = "Green";
                                    }
                                    else if (sub >= 0 && sub < 3)
                                    {
                                        sheduleobj.IsHousingDue = "Orange";
                                    }
                                    sheduleobj.HousingNotification = (sub + 1).ToString();
                                }
                            }
                            else
                            {

                            }
                        }

                        else if (m.FormName == "Financial Security")
                        {
                            var modifydate = patientdetailobj.PatientFinancialSecurity.ModifiedDate;
                            if (modifydate != null)
                            {
                                var dt = patientdetailobj.PatientFinancialSecurity.ModifiedDate.Value.ToShortDateString();

                                var t = "";
                                var count = m.ForEvery;
                                var type = m.ForType;
                                if (type == "Days")
                                {
                                    var everyd = Convert.ToDouble(count);
                                    t = Convert.ToDateTime(dt).AddDays(everyd).ToShortDateString();
                                }
                                else if (type == "Week")
                                {
                                    var everyw = Convert.ToDouble(7 * count);
                                    t = Convert.ToDateTime(dt).AddDays(everyw).ToShortDateString();
                                }
                                else if (type == "Month")
                                {
                                    var everym = Convert.ToInt16(count);
                                    t = Convert.ToDateTime(dt).AddMonths(everym).ToShortDateString();
                                }

                                var todaydate = DateTime.Now.ToShortDateString();
                                var houschedule = DateTime.Parse(t);
                                var today = DateTime.Parse(todaydate);
                                if (today > houschedule)
                                {

                                    sheduleobj.IsFinancialDue = "Red";
                                    sub = (today - houschedule).TotalDays;
                                    sheduleobj.FinancialNotification = (sub - 1).ToString();
                                }
                                else if (today <= houschedule)
                                {

                                    sub = (houschedule - today).TotalDays;
                                    if (sub >= 3 && sub < 7)
                                    {
                                        sheduleobj.IsFinancialDue = "Green";
                                    }
                                    else if (sub >= 0 && sub < 3)
                                    {
                                        sheduleobj.IsFinancialDue = "Orange";
                                    }
                                    sheduleobj.FinancialNotification = (sub + 1).ToString();
                                }
                            }
                            else
                            {

                            }
                        }

                        else if (m.FormName == "Employment/Education")
                        {
                            var modifydate = patientdetailobj.PatientEmploymentEducation.ModifiedDate;
                            if (modifydate != null)
                            {
                                var dt = patientdetailobj.PatientEmploymentEducation.ModifiedDate.Value.ToShortDateString();

                                var t = "";
                                var count = m.ForEvery;
                                var type = m.ForType;
                                if (type == "Days")
                                {
                                    var everyd = Convert.ToDouble(count);
                                    t = Convert.ToDateTime(dt).AddDays(everyd).ToShortDateString();
                                }
                                else if (type == "Week")
                                {
                                    var everyw = Convert.ToDouble(7 * count);
                                    t = Convert.ToDateTime(dt).AddDays(everyw).ToShortDateString();
                                }
                                else if (type == "Month")
                                {
                                    var everym = Convert.ToInt16(count);
                                    t = Convert.ToDateTime(dt).AddMonths(everym).ToShortDateString();
                                }

                                var todaydate = DateTime.Now.ToShortDateString();
                                var houschedule = DateTime.Parse(t);
                                var today = DateTime.Parse(todaydate);
                                if (today > houschedule)
                                {

                                    sheduleobj.IsEmploymentDue = "Red";
                                    sub = (today - houschedule).TotalDays;
                                    sheduleobj.EmploymentNotification = (sub - 1).ToString();
                                }
                                else if (today <= houschedule)
                                {

                                    sub = (houschedule - today).TotalDays;
                                    if (sub >= 3 && sub < 7)
                                    {
                                        sheduleobj.IsEmploymentDue = "Green";
                                    }
                                    else if (sub >= 0 && sub < 3)
                                    {
                                        sheduleobj.IsEmploymentDue = "Orange";
                                    }
                                    sheduleobj.EmploymentNotification = (sub + 1).ToString();
                                }

                            }
                            else
                            {

                            }
                        }

                        else if (m.FormName == "Communication & Mobility")
                        {
                            var modifydate = patientdetailobj.PatientCommunicationAndMobility.ModifiedDate;
                            if (modifydate != null)
                            {
                                var dt = patientdetailobj.PatientCommunicationAndMobility.ModifiedDate.Value.ToShortDateString();

                                var t = "";
                                var count = m.ForEvery;
                                var type = m.ForType;
                                if (type == "Days")
                                {
                                    var everyd = Convert.ToDouble(count);
                                    t = Convert.ToDateTime(dt).AddDays(everyd).ToShortDateString();
                                }
                                else if (type == "Week")
                                {
                                    var everyw = Convert.ToDouble(7 * count);
                                    t = Convert.ToDateTime(dt).AddDays(everyw).ToShortDateString();
                                }
                                else if (type == "Month")
                                {
                                    var everym = Convert.ToInt16(count);
                                    t = Convert.ToDateTime(dt).AddMonths(everym).ToShortDateString();
                                }
                                //ViewBag.HouSchedule=t;
                                var todaydate = DateTime.Now.ToShortDateString();
                                var houschedule = DateTime.Parse(t);
                                var today = DateTime.Parse(todaydate);
                                if (today > houschedule)
                                {
                                    sheduleobj.IsCommunicationDue = "Red";
                                    sub = (today - houschedule).TotalDays;
                                    sheduleobj.CommunicationNotification = (sub - 1).ToString();
                                }
                                else if (today <= houschedule)
                                {

                                    sub = (houschedule - today).TotalDays;
                                    if (sub >= 3 && sub < 7)
                                    {
                                        sheduleobj.IsCommunicationDue = "Green";
                                    }
                                    else if (sub >= 0 && sub < 3)
                                    {
                                        sheduleobj.IsCommunicationDue = "Orange";
                                    }
                                    sheduleobj.CommunicationNotification = (sub + 1).ToString();
                                }

                            }
                            else
                            {

                            }
                        }

                        else if (m.FormName == "Healthcare")
                        {
                            var modifydate = patientdetailobj.PatientHealthcare.ModifiedDate;
                            if (modifydate != null)
                            {
                                var dt = patientdetailobj.PatientHealthcare.ModifiedDate.Value.ToShortDateString();

                                var t = "";
                                var count = m.ForEvery;
                                var type = m.ForType;
                                if (type == "Days")
                                {
                                    var everyd = Convert.ToDouble(count);
                                    t = Convert.ToDateTime(dt).AddDays(everyd).ToShortDateString();
                                }
                                else if (type == "Week")
                                {
                                    var everyw = Convert.ToDouble(7 * count);
                                    t = Convert.ToDateTime(dt).AddDays(everyw).ToShortDateString();
                                }
                                else if (type == "Month")
                                {
                                    var everym = Convert.ToInt16(count);
                                    t = Convert.ToDateTime(dt).AddMonths(everym).ToShortDateString();
                                }
                                //ViewBag.HouSchedule=t;
                                var todaydate = DateTime.Now.ToShortDateString();
                                var houschedule = DateTime.Parse(t);
                                var today = DateTime.Parse(todaydate);
                                if (today > houschedule)
                                {
                                    sheduleobj.IsHealthcareDue = "Red";
                                    sub = (today - houschedule).TotalDays;
                                    sheduleobj.HealthcareNotification = (sub - 1).ToString();
                                }
                                else if (today <= houschedule)
                                {

                                    sub = (houschedule - today).TotalDays;
                                    if (sub >= 3 && sub < 7)
                                    {
                                        sheduleobj.IsHealthcareDue = "Green";
                                    }
                                    else if (sub >= 0 && sub < 3)
                                    {
                                        sheduleobj.IsHealthcareDue = "Orange";
                                    }
                                    sheduleobj.HealthcareNotification = (sub + 1).ToString();
                                }

                            }
                            else
                            {

                            }
                        }

                        else if (m.FormName == "Social Supports and Safety")
                        {
                            var modifydate = patientdetailobj.PatientSocialSupport.ModifiedDate;
                            if (modifydate != null)
                            {
                                var dt = patientdetailobj.PatientSocialSupport.ModifiedDate.Value.ToShortDateString();

                                var t = "";
                                var count = m.ForEvery;
                                var type = m.ForType;
                                if (type == "Days")
                                {
                                    var everyd = Convert.ToDouble(count);
                                    t = Convert.ToDateTime(dt).AddDays(everyd).ToShortDateString();
                                }
                                else if (type == "Week")
                                {
                                    var everyw = Convert.ToDouble(7 * count);
                                    t = Convert.ToDateTime(dt).AddDays(everyw).ToShortDateString();
                                }
                                else if (type == "Month")
                                {
                                    var everym = Convert.ToInt16(count);
                                    t = Convert.ToDateTime(dt).AddMonths(everym).ToShortDateString();
                                }
                                //ViewBag.HouSchedule=t;
                                var todaydate = DateTime.Now.ToShortDateString();
                                var houschedule = DateTime.Parse(t);
                                var today = DateTime.Parse(todaydate);
                                if (today > houschedule)
                                {
                                    sheduleobj.IsSocialSupportsDue = "Red";
                                    sub = (today - houschedule).TotalDays;
                                    sheduleobj.SocialNotification = (sub - 1).ToString();
                                }
                                else if (today <= houschedule)
                                {

                                    sub = (houschedule - today).TotalDays;
                                    if (sub >= 3 && sub < 7)
                                    {
                                        sheduleobj.IsSocialSupportsDue = "Green";
                                    }
                                    else if (sub >= 0 && sub < 3)
                                    {
                                        sheduleobj.IsSocialSupportsDue = "Orange";
                                    }
                                    sheduleobj.SocialNotification = (sub + 1).ToString();
                                }

                            }
                            else
                            {

                            }
                        }

                        else if (m.FormName == "Legal Status")
                        {
                            var modifydate = patientdetailobj.PatientLegalStatus.ModifiedDate;
                            if (modifydate != null)
                            {
                                var dt = patientdetailobj.PatientLegalStatus.ModifiedDate.Value.ToShortDateString();

                                var t = "";

                                var count = m.ForEvery;
                                var type = m.ForType;
                                if (type == "Days")
                                {
                                    var everyd = Convert.ToDouble(count);
                                    t = Convert.ToDateTime(dt).AddDays(everyd).ToShortDateString();
                                }
                                else if (type == "Week")
                                {
                                    var everyw = Convert.ToDouble(7 * count);
                                    t = Convert.ToDateTime(dt).AddDays(everyw).ToShortDateString();
                                }
                                else if (type == "Month")
                                {
                                    var everym = Convert.ToInt16(count);
                                    t = Convert.ToDateTime(dt).AddMonths(everym).ToShortDateString();
                                }
                                //ViewBag.HouSchedule=t;
                                var todaydate = DateTime.Now.ToShortDateString();
                                var houschedule = DateTime.Parse(t);
                                var today = DateTime.Parse(todaydate);
                                if (today > houschedule)
                                {
                                    sheduleobj.IsLegalStatusDue = "Red";
                                    sub = (today - houschedule).TotalDays;
                                    sheduleobj.LegalNotification = (sub - 1).ToString();
                                }
                                else if (today <= houschedule)
                                {

                                    sub = (houschedule - today).TotalDays;
                                    if (sub >= 3 && sub < 7)
                                    {
                                        sheduleobj.IsLegalStatusDue = "Green";
                                    }
                                    else if (sub >= 0 && sub < 3)
                                    {
                                        sheduleobj.IsLegalStatusDue = "Orange";
                                    }
                                    sheduleobj.LegalNotification = (sub + 1).ToString();
                                }


                            }
                            else
                            {

                            }
                        }

                        else if (m.FormName == "Substance Use")
                        {
                            double subaudit = 0, subdast = 0;

                            var modifydateaudit = patientdetailobj.Audit.ModifiedDate;
                            var modifydatedast = patientdetailobj.Dast.ModifiedDate;


                            if (modifydatedast != null)
                            {

                                var dastdt = patientdetailobj.Dast.ModifiedDate.Value.ToShortDateString();
                                var tdast = "";
                                var count = m.ForEvery;
                                var type = m.ForType;
                                if (type == "Days")
                                {
                                    var everyd = Convert.ToDouble(count);
                                    tdast = Convert.ToDateTime(dastdt).AddDays(everyd).ToShortDateString();
                                }
                                else if (type == "Week")
                                {
                                    var everyw = Convert.ToDouble(7 * count);
                                    tdast = Convert.ToDateTime(dastdt).AddDays(everyw).ToShortDateString();
                                }
                                else if (type == "Month")
                                {
                                    var everym = Convert.ToInt16(count);
                                    tdast = Convert.ToDateTime(dastdt).AddMonths(everym).ToShortDateString();
                                }
                                //ViewBag.HouSchedule=t;
                                var todaydate = DateTime.Now.ToShortDateString();
                                var houscheduledast = DateTime.Parse(tdast);
                                var today = DateTime.Parse(todaydate);
                                if (today > houscheduledast)
                                {
                                    sheduleobj.IsDastDue = "Red";
                                    subdast = (today - houscheduledast).TotalDays;
                                    sheduleobj.DastNotification = (subdast - 1).ToString();
                                }
                                if (today <= houscheduledast)
                                {

                                    subdast = (houscheduledast - today).TotalDays;
                                    if (subdast >= 3 && subdast < 7)
                                    {
                                        sheduleobj.IsDastDue = "Green";
                                    }
                                    else if (subdast >= 0 && subdast < 3)
                                    {
                                        sheduleobj.IsDastDue = "Orange";
                                    }
                                    sheduleobj.DastNotification = (subdast + 1).ToString();
                                }
                            }

                            else
                            {

                            }
                            if (modifydateaudit != null)
                            {
                                var auditdt = patientdetailobj.Audit.ModifiedDate.Value.ToShortDateString();

                                var taudit = "";
                                var count = m.ForEvery;
                                var type = m.ForType;
                                if (type == "Days")
                                {
                                    var everyd = Convert.ToDouble(count);
                                    taudit = Convert.ToDateTime(auditdt).AddDays(everyd).ToShortDateString();
                                }
                                else if (type == "Week")
                                {
                                    var everyw = Convert.ToDouble(7 * count);
                                    taudit = Convert.ToDateTime(auditdt).AddDays(everyw).ToShortDateString();
                                }
                                else if (type == "Month")
                                {
                                    var everym = Convert.ToInt16(count);
                                    taudit = Convert.ToDateTime(auditdt).AddMonths(everym).ToShortDateString();
                                }
                                //ViewBag.HouSchedule=t;
                                var todaydate = DateTime.Now.ToShortDateString();
                                var houscheduleaudit = DateTime.Parse(taudit);
                                var today = DateTime.Parse(todaydate);

                                if (today > houscheduleaudit)
                                {
                                    sheduleobj.IsAuditDue = "Red";
                                    subaudit = (today - houscheduleaudit).TotalDays;
                                    sheduleobj.AuditNotification = (subaudit - 1).ToString();
                                }
                                if (today <= houscheduleaudit)
                                {
                                    subaudit = (houscheduleaudit - today).TotalDays;
                                    if (subaudit >= 3 && subaudit < 7)
                                    {
                                        sheduleobj.IsAuditDue = "Green";
                                    }
                                    else if (subaudit >= 0 && subaudit < 3)
                                    {
                                        sheduleobj.IsAuditDue = "Orange";
                                    }
                                    sheduleobj.AuditNotification = (subaudit + 1).ToString();
                                }


                            }

                            else
                            {

                            }
                        }

                        else if (m.FormName == "Mental Health")
                        {
                            var modifydate = patientdetailobj.PatientMentalHealth.ModifiedDate;
                            if (modifydate != null)
                            {
                                var dt = patientdetailobj.PatientMentalHealth.ModifiedDate.Value.ToShortDateString();

                                var t = "";
                                var count = m.ForEvery;
                                var type = m.ForType;
                                if (type == "Days")
                                {
                                    var everyd = Convert.ToDouble(count);
                                    t = Convert.ToDateTime(dt).AddDays(everyd).ToShortDateString();
                                }
                                else if (type == "Week")
                                {
                                    var everyw = Convert.ToDouble(7 * count);
                                    t = Convert.ToDateTime(dt).AddDays(everyw).ToShortDateString();
                                }
                                else if (type == "Month")
                                {
                                    var everym = Convert.ToInt16(count);
                                    t = Convert.ToDateTime(dt).AddMonths(everym).ToShortDateString();
                                }

                                var todaydate = DateTime.Now.ToShortDateString();
                                var houschedule = DateTime.Parse(t);
                                var today = DateTime.Parse(todaydate);
                                if (today > houschedule)
                                {
                                    sheduleobj.IsMentalHealthDue = "Red";
                                    sub = (today - houschedule).TotalDays;
                                    sheduleobj.MentalNotification = (sub - 1).ToString();
                                }
                                else if (today <= houschedule)
                                {

                                    sub = (houschedule - today).TotalDays;
                                    if (sub >= 3 && sub < 7)
                                    {
                                        sheduleobj.IsMentalHealthDue = "Green";
                                    }
                                    else if (sub >= 0 && sub < 3)
                                    {
                                        sheduleobj.IsMentalHealthDue = "Orange";
                                    }
                                    sheduleobj.MentalNotification = (sub + 1).ToString();
                                }

                            }
                            else
                            {

                            }
                        }

                        else if (m.FormName == "Food Access")
                        {
                            var modifydate = patientdetailobj.PatientFoodAccess.ModifiedDate;
                            if (modifydate != null)
                            {
                                var dt = patientdetailobj.PatientFoodAccess.ModifiedDate.Value.ToShortDateString();

                                var t = "";
                                var count = m.ForEvery;
                                var type = m.ForType;
                                if (type == "Days")
                                {
                                    var everyd = Convert.ToDouble(count);
                                    t = Convert.ToDateTime(dt).AddDays(everyd).ToShortDateString();
                                }
                                else if (type == "Week")
                                {
                                    var everyw = Convert.ToDouble(7 * count);
                                    t = Convert.ToDateTime(dt).AddDays(everyw).ToShortDateString();
                                }
                                else if (type == "Month")
                                {
                                    var everym = Convert.ToInt16(count);
                                    t = Convert.ToDateTime(dt).AddMonths(everym).ToShortDateString();
                                }

                                var todaydate = DateTime.Now.ToShortDateString();
                                var houschedule = DateTime.Parse(t);
                                var today = DateTime.Parse(todaydate);
                                if (today > houschedule)
                                {
                                    sheduleobj.IsFoodAccessDue = "Red";
                                    sub = (today - houschedule).TotalDays;
                                    sheduleobj.FoodNotification = (sub - 1).ToString();
                                }
                                else if (today <= houschedule)
                                {

                                    sub = (houschedule - today).TotalDays;
                                    if (sub >= 3 && sub < 7)
                                    {
                                        sheduleobj.IsFoodAccessDue = "Green";
                                    }
                                    else if (sub >= 0 && sub < 3)
                                    {
                                        sheduleobj.IsFoodAccessDue = "Orange";
                                    }
                                    sheduleobj.FoodNotification = (sub + 1).ToString();
                                }

                            }
                            else
                            {

                            }
                        }

                    }


                    patientdetailobj.ScheduleDate = sheduleobj;
                    objCommon.BindDBOptions(ref patientdetailobj);

                }
                else //web api sent error response 
                {
                    //log response status here..

                }
            }

            objCommon.BindDropDowns(ref patientdetailobj);
            HttpCookie PatientIdCookie = new HttpCookie("patientid");
            PatientIdCookie.Value = patientdetailobj.PatientMain.PatientID.ToString();
            Response.Cookies.Add(PatientIdCookie);
            Response.Cookies["patientid"].Expires = DateTime.Now.AddDays(1);
            return PartialView("~/Views/Shared/Client/_ClientDetail.cshtml", patientdetailobj);
        }

        [HttpPost]
        public ActionResult GetClientFormHtml(string PatientID,string pageName ="")
        {
            double sub;
            Common objCommon = new Common();
            PatientDetailBO patientdetailobj = new PatientDetailBO();
            List<FormSchedulingBO> formscheduleobj = new List<FormSchedulingBO>();
            ScheduleDateBO sheduleobj = new ScheduleDateBO();

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/GetDetailOfPatientForClientForm?patientid=" + PatientID);

                responseTask.Wait();

                var result = responseTask.Result;

                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<PatientAllDetailByIDBO>();
                    readTask.Wait();


                    patientdetailobj = readTask.Result.PatientDetail;
                    patientdetailobj.PatientScore = readTask.Result.PatientScore;
                    patientdetailobj.PatientSubstanceUse.Audit = patientdetailobj.Audit;
                    patientdetailobj.PatientSubstanceUse.Dast = patientdetailobj.Dast;
                    patientdetailobj.PatientMain.CareplanCount = patientdetailobj.CarePlanCount.CarePlanCount;
                    patientdetailobj.PatientMentalHealth.PHQ9 = patientdetailobj.PHQ9;
                    patientdetailobj.PatientProgram.ClinicOnly = patientdetailobj.ClinicOnly;
                    patientdetailobj.PatientProgram.DreamOnly = patientdetailobj.DreamOnly;
                    patientdetailobj.PatientProgram.OUOnly = patientdetailobj.OUOnly;
                    patientdetailobj.PatientProgram.PeraltaCollege = patientdetailobj.PeraltaCollege;
                    patientdetailobj.FormScheduling = readTask.Result.FormSchedulingResult;

                    ViewBag.PatientId = patientdetailobj.PatientMain.PatientID;
                    ViewBag.FirstName = patientdetailobj.PatientMain.FirstName + " " + patientdetailobj.PatientMain.MiddleName + " " + patientdetailobj.PatientMain.LastName;
                    ViewBag.DOB = patientdetailobj.PatientMain.DateOfBirth;
                    ViewBag.mentalPDOB = patientdetailobj.PatientMentalHealth.CreatedDate == null ? DateTime.Now.ToShortDateString() : patientdetailobj.PatientMentalHealth.CreatedDate.ToString();
                    ViewBag.SSNNumber = patientdetailobj.PatientMain.SocialSecurityNumber;



                    formscheduleobj = readTask.Result.FormScheduling;

                    patientdetailobj.ScheduleDate = sheduleobj;
                    objCommon.BindDBOptions(ref patientdetailobj);

                }
                else //web api sent error response 
                {
                    //log response status here..

                }
            }

            objCommon.BindDropDowns(ref patientdetailobj);
            HttpCookie PatientIdCookie = new HttpCookie("patientid");
            PatientIdCookie.Value = patientdetailobj.PatientMain.PatientID.ToString();
            Response.Cookies.Add(PatientIdCookie);
            Response.Cookies["patientid"].Expires = DateTime.Now.AddDays(1);
            if (pageName == "Info")
            {
                return PartialView("~/Views/Shared/Client/_ClientFormDetail.cshtml", patientdetailobj);
            }
            else
            {
                return PartialView("~/Views/Shared/Client/_ClientFormDetailForEditPage.cshtml", patientdetailobj);
            }

        }

        [HttpPost]
        public ActionResult GetClientFormPrograms(string PatientID)
        {
            Program programobj = new Program();

            List<PatientProgram> patientprograms = new List<PatientProgram>();
            List<AvailableProgram> availablePrograms = new List<AvailableProgram>();

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/GetPatientProgramsForClientForm?patientid=" + PatientID);
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<List<PatientProgram>>();
                    readTask.Wait();
                    patientprograms = readTask.Result;
                }
                else //web api sent error response 
                {
                    //log response status here..


                }
            }


            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/GetPatientAvailableProgramsForClientForm?PatientId=" + PatientID);
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<List<AvailableProgram>>();
                    readTask.Wait();
                    availablePrograms = readTask.Result;
                }
                else //web api sent error response 
                {
                    //log response status here..


                }
            }

            programobj.AvailablePrograms = availablePrograms;
            programobj.PatientPrograms = patientprograms;
            @ViewBag.TotalProgramCounts = availablePrograms.Count + patientprograms.Count;


            return PartialView("~/Views/Shared/Patient/_AddPatientPrograms.cshtml", programobj);


        }

        [HttpGet]
        public JsonResult GetClientFormTemplateByClientFormId(int ClientFormId)
        {
            if (ClientFormId == 0)
            {
                return Json(new
                {
                    html = "",
                    tableName = "",
                    TemplateId = ""
                }, JsonRequestBehavior.AllowGet);
            }
            string PathName = string.Empty;
            ClientFormtemplateBO data = new ClientFormtemplateBO();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/GetClientFormTemplateByClientFormId?ClientFormId=" + ClientFormId);
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<ClientFormtemplateBO>();
                    readTask.Wait();
                    data = readTask.Result;
                }
                else //web api sent error response 
                {
                    //log response status here..


                }
            }
            PathName = data.TemplatePath;
            if (PathName != "" && PathName != null)
            {
                var gethtml = System.IO.File.ReadAllText(Server.MapPath("~/App_Data/Templates/ClientFormTemplate/" + PathName));
                var jsonResult = new
                {
                    html = gethtml,
                    tableName = data.TemplateTable,
                    TemplateId = data.TemplateID
                };
                return Json(jsonResult, JsonRequestBehavior.AllowGet);
            }
            //var gethtml=   System.IO.File.ReadAllText(Server.MapPath("~/App_Data/data.html"));
            return Json(new
            {
                html = "",
                tableName = "",
                TemplateId = ""

            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetClientFormTemplateById(int TemplateId)
        {
            if (TemplateId != 0 && TemplateId != null)
            {
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri(WebApiKey);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    var responseTask = client.GetAsync("api/PatientMain/patientClientFormtemplatebyid?TemplateId=" + TemplateId);
                    responseTask.Wait();
                    var result = responseTask.Result;
                    if (result.IsSuccessStatusCode)
                    {
                        var data = result.Content.ReadAsAsync<ClientFormtemplateBO>();
                        if (data.Result != null && data.Result.TemplatePath != null)
                        {
                            var gethtml = System.IO.File.ReadAllText(Server.MapPath("~/App_Data/Templates/ClientFormTemplate/" + data.Result.TemplatePath));
                            var jsonResult = new
                            {
                                html = gethtml,
                                tableName = data.Result.TemplateTable
                            };
                            return Json(jsonResult, JsonRequestBehavior.AllowGet);
                        }
                        else
                        {
                            var jsonResult = new
                            {
                                html = "",
                                tableName = ""
                            };
                            return Json(jsonResult, JsonRequestBehavior.AllowGet);
                        }
                    }
                };
            }
            //var gethtml=   System.IO.File.ReadAllText(Server.MapPath("~/App_Data/data.html"));
            return Json("");
        }

        [HttpGet]
        public JsonResult GetClientFormHtmlById(int Id)
        {
            if (Id == 0)
            {
                return Json(new
                {
                    html = "",
                    IsActive = 0,
                    Isactivated = 0
                }, JsonRequestBehavior.AllowGet);
            }
            string PathName = string.Empty;
            ClientFormtemplateBO data = new ClientFormtemplateBO();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/GetClientFormTemplateByID?ID=" + Id);
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<ClientFormtemplateBO>();
                    readTask.Wait();
                    data = readTask.Result;
                }
                else //web api sent error response 
                {
                    //log response status here..


                }
            }
            PathName = data.TemplatePath;
            if (PathName != "" && PathName != null)
            {
                var gethtml = System.IO.File.ReadAllText(Server.MapPath("~/App_Data/Templates/ClientFormTemplate/" + PathName));
                var jsonResult = new
                {
                    html = gethtml,
                    IsActive = data.IsActive,
                    Isactivated = data.Isactivated
                };
                return Json(jsonResult, JsonRequestBehavior.AllowGet);
            }
            //var gethtml=   System.IO.File.ReadAllText(Server.MapPath("~/App_Data/data.html"));
            return Json(new
            {
                html = "",
                IsActive = 0,
                Isactivated = 0
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetAMDProfile(PatientMainBO Patient)
        {

            List<AmdProfileBO> AmdModel = null;
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/getamdprofileForClientForm?PatientId=" + Patient.PatientID);
                responseTask.Wait();

                var result = responseTask.Result;

                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<List<AmdProfileBO>>();
                    readTask.Wait();
                    AmdModel = readTask.Result;
                }

            }
            if (AmdModel == null || AmdModel.Count == 0)
            {
                return Content("0");
            }
            if (AmdModel.Count > 1)
            {
                return Content("1");
            }
            if (Patient.CellPhone != null)
            {
                Patient.CellPhone = Patient.CellPhone.Replace("(", "").Replace(")", "").Replace("-", "").Replace(" ", "");
            }
            if (AmdModel[0].SSN != null)
            {
                var SSNString = AmdModel[0].SSN.Replace("-", "").Replace(" ", "");
                if (SSNString.Length < 9)
                {
                    SSNString = SSNString.PadLeft(9, '0');
                }
                AmdModel[0].SSN = SSNString;
            }
            if (AmdModel[0].Gender != null)
            {
                AmdModel[0].Gender = AmdModel[0].Gender == "M" ? "Male" : "Female";
            }


            var CombineAMDAndPatient = System.Tuple.Create<AmdProfileBO, PatientMainBO>(AmdModel[0], Patient);
            return PartialView("~/Views/Shared/Patient/_AMDProfile.cshtml", CombineAMDAndPatient);


        }

        [HttpPost]
        public ActionResult UploadFiles()
        {
            string path = Server.MapPath("~/" + ProgramUploadPath);
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            HttpFileCollectionBase files = Request.Files;
            var filenames = Request["FileNames"];
            var savedfiles = Request["Files"];
            var controlid = Request["ControlId"];
            var ClientFormID = Request["ClientFormID"];
            var patientId = Request["PatientId"];
            var IsBaseField = Convert.ToBoolean(Request["IsBaseField"]);
            string guidName = "";
            List<string> FilesGuid = new List<string>();
            if (savedfiles.IndexOf(',') > 0)
            {
                var savedArr = savedfiles.Split(',');
                for (int i = 0; i < savedArr.Length; i++)
                {
                    FilesGuid.Add(savedArr[i]);
                }
            }
            else if (savedfiles.IndexOf('.') > 0)
            {
                FilesGuid.Add(savedfiles);
            }
            for (int i = 0; i < files.Count; i++)
            {
                HttpPostedFileBase file = files[i];
                guidName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                file.SaveAs(path + guidName);
                FilesGuid.Add(guidName);
            }
            using (var client = new HttpClient())
            {
                ClientFormFileBO model = new ClientFormFileBO()
                {
                    ClientFormID = Convert.ToInt32(ClientFormID),
                    ControlId = controlid,
                    Files = String.Join(",", FilesGuid),
                    FileNames = filenames,
                    PatientId = Convert.ToInt32(patientId)
                };
                client.BaseAddress = new Uri(WebApiKey);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var requestUrl = "";
                if (IsBaseField)
                {
                    requestUrl = "api/PatientMain/savebaseClientFormfiles";
                }
                else
                {
                    requestUrl = "api/PatientMain/saveClientFormfiles";
                }
                var responseTask = client.PostAsJsonAsync(requestUrl, model);
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {

                }
            }
            return Json(files.Count + " Files Uploaded!");
        }

        [HttpGet]
        public JsonResult isClientFormNameexist(string formName, int clientFormID)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var responseTask = client.GetAsync("api/PatientMain/isClientFormNameexist?formName=" + formName.Replace(" ", "") + "&&clientFormID=" + clientFormID);
                responseTask.Wait();
                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var data = result.Content.ReadAsStringAsync().Result;
                    if (data == "0")
                    {
                        var jsonResult = new
                        {
                            formNameExists = false
                        };
                        return Json(jsonResult, JsonRequestBehavior.AllowGet);
                    }
                    else
                    {
                        var jsonResult = new
                        {
                            formNameExists = true
                        };
                        return Json(jsonResult, JsonRequestBehavior.AllowGet);

                    }

                }
            };

            return Json("");
        }

        public JsonResult SaveClientFormTemplate(ClientFormtemplateBO Model, string htmlTemplate = null, string TemplatePath = null)
        {
            string TemplateName = "";
            string dataFile = "";
            string path = "";
            if (Model.IsBaseTemplate)
            {
                Model.formName = "BaseClientFormTemplate";
                TemplateName = Guid.NewGuid().ToString() + ".html";

                path = "~/App_Data/Templates/ClientFormTemplate/BaseTemplate";
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(Server.MapPath(path));
                }

                dataFile = Server.MapPath(path + "/" + TemplateName);
                System.IO.File.WriteAllText(@dataFile, htmlTemplate);
                Model.TemplatePath = "BaseTemplate/" + TemplateName;
                Model.TemplateTable = "tbl_" + Model.formName;
                Model.IsBaseTemplate = true;
            }
            else
            {

                if (htmlTemplate != null)
                {
                    path = "~/App_Data/Templates/ClientFormTemplate/" + Model.ClientFormID;
                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(Server.MapPath(path));
                    }
                    TemplateName = Guid.NewGuid().ToString() + ".html";
                    dataFile = Server.MapPath(path + "/" + TemplateName);
                    System.IO.File.WriteAllText(@dataFile, htmlTemplate);
                    Model.TemplatePath = Model.ClientFormID + "/" + TemplateName;
                }
                if (TemplatePath != null && htmlTemplate == null)
                {
                    Model.TemplatePath = TemplatePath;
                }


                if (!Model.IsModify)
                {
                    Model.TemplateTable = "tbl_" + Model.formName.Replace(" ", "") + "_ClientForm";
                }

            }
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var responseTask = client.PostAsJsonAsync("api/PatientMain/saveClientFormtemplate", Model);
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var data = result.Content.ReadAsStringAsync().Result;
                    if (data == "0")
                    {
                        return Json("0");
                    }
                    else
                    {

                        return Json(new
                        {
                            id = data,
                        });
                    }
                }
            }
            return Json("");
        }

        public JsonResult GetClientFormTemplateData(ClientFormtemplateBO Model)
        {
            Model.formName = Model.formName.TrimEnd();
            return Json(new
            {
                redirectUrl = Url.Action("ModifyClientFormTemplate", "Client", new { Model.TemplateID, Model.formName, Model.IsBaseTemplate, Model.IsModify, Model.TemplateTable, Model.ClientFormID, Model.TemplatePath }),
                isRedirect = true
            });
        }

        [Authorize(Roles = "navigator,supervisor")]
        public ActionResult ModifyClientFormTemplate(ClientFormtemplateBO data)
        {
            ViewBag.TemplateId = data.TemplateID;
            ViewBag.IsModify = data.IsModify;
            ViewBag.TemplateName = data.formName;
            ViewBag.IsBaseTemplate = data.IsBaseTemplate;
            ViewBag.IsBaseTemplate = data.IsBaseTemplate;
            ViewBag.TemplateTable = data.TemplateTable;
            ViewBag.ClientFormID = data.ClientFormID;
            ViewBag.TemplatePath = data.TemplatePath;
            return View();
        }

        [Authorize(Roles = "navigator,supervisor")]
        public ActionResult ClientFormBaseTemplate(int templateid, bool Status)
        {
            ViewBag.TemplateId = templateid;
            ViewBag.Status = Status;
            return View();
        }

        public JsonResult GetPatientClientForms(int ClientFormID)
        {
            var data = "";
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var responseTask = client.GetAsync("api/PatientMain/GetPatientClientForms?ClientFormID=" + ClientFormID);
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    data = result.Content.ReadAsStringAsync().Result;

                }
                var jsonResult = new
                {
                    data = data

                };
                return Json(jsonResult, JsonRequestBehavior.AllowGet);
            }

        }

        public JsonResult GetClientFormChildMenu(int ClientFormID,int patientID)
        {
            var data = "";
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var responseTask = client.GetAsync("api/PatientMain/GetClientFormChildMenu?ClientFormID=" + ClientFormID+"&&patientID=" + patientID);
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    data = result.Content.ReadAsStringAsync().Result;

                }
                var jsonResult = new
                {
                    data = data

                };
                return Json(jsonResult, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult getParentForm(int ClientFormID, int patientID)
        {
            var data = "";
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var responseTask = client.GetAsync("api/PatientMain/getParentForm?ClientFormID=" + ClientFormID + "&&patientID=" + patientID);
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    data = result.Content.ReadAsStringAsync().Result;

                }
                var jsonResult = new
                {
                    data = data

                };
                return Json(jsonResult, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult GetFormLogHistory(int formId, int clientid, bool isClientForm)
        {

            var LogList = new List<FormLogHistoryBO>();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/getClientHistoryLog?clientId=" + clientid + "&&formid=" + formId + "&&isClientForm=" + isClientForm);
                var result = responseTask.Result;

                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<List<FormLogHistoryBO>>();
                    readTask.Wait();
                    LogList = readTask.Result;
                }

            }
            return PartialView("~/Views/Shared/Client/_FormLogHistory.cshtml", LogList);
        }

        [HttpPost]
        public ActionResult UploadPotentialClientFile()
        {
            List<string> columnNames = new List<string>();
            List<string> listA = new List<string>();
            int TotalRecords = 0;
            var databaseColumns = new List<PotientialTableInfoBO>();
            try
            {
                var files = Request.Files;
                var fileName = Path.GetFileName(files[0].FileName);
                var fileExtension = Path.GetExtension(files[0].FileName);
                var directoryPath = "~/App_Data/PotentialClient";
                var path = Path.Combine(Server.MapPath(directoryPath), fileName);
                if (!Directory.Exists(directoryPath))
                {
                    Directory.CreateDirectory(Server.MapPath(directoryPath));
                }
                HttpPostedFileBase fileBase = files[0];
                fileBase.SaveAs(path);
                using (var stream = System.IO.File.Open(path, FileMode.Open, FileAccess.Read))
                {
                    IExcelDataReader excelReader = null;
                    if (fileExtension != ".csv")
                    {
                        if (fileExtension == ".xlsx")
                        {
                            XSSFWorkbook workbook = new XSSFWorkbook(Request.Files[0].InputStream);
                            var sheet = workbook.GetSheetAt(0);
                            TotalRecords = sheet.LastRowNum;
                            excelReader = ExcelReaderFactory.CreateOpenXmlReader(stream);
                        }
                        else
                        {
                            HSSFWorkbook workbook = new HSSFWorkbook(Request.Files[0].InputStream);
                            var sheet = workbook.GetSheetAt(0);
                            TotalRecords = sheet.LastRowNum;
                            excelReader = ExcelReaderFactory.CreateBinaryReader(stream);

                        }



                    }
                    else
                    {
                        excelReader = ExcelReaderFactory.CreateCsvReader(stream, new ExcelReaderConfiguration()
                        {
                            AutodetectSeparators = new char[] { ',', ';' },
                            AnalyzeInitialCsvRows = 0
                        });
                    }

                    var result = excelReader.AsDataSet(new ExcelDataSetConfiguration()
                    {
                        ConfigureDataTable = (_) => new ExcelDataTableConfiguration()
                        {
                            UseHeaderRow = true
                        }
                    });
                    TempData["PotentialClientFileDatatable"] = result.Tables[0];
                    var tables = result.Tables
                                       .Cast<DataTable>()
                                       .Select(t => new
                                       {
                                           TableName = t.TableName,
                                           Columns = t.Columns
                                           .Cast<DataColumn>()
                                           .Select(x => x.ColumnName)
                                           .ToList()
                                       });
                    columnNames = tables.First().Columns;

                };





                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri(WebApiKey);
                    //HTTP GET
                    var responseTask = client.GetAsync("/api/PatientMain/getpotentialclienttableinfo");
                    var result = responseTask.Result;

                    if (result.IsSuccessStatusCode)
                    {
                        var readTask = result.Content.ReadAsAsync<List<PotientialTableInfoBO>>();
                        readTask.Wait();
                        databaseColumns = readTask.Result;
                        databaseColumns = databaseColumns.Where(x => x.ColName.ToLower() != "othergender" && x.ColName.ToLower() != "otherrace"
                     && x.ColName.ToLower() != "othercontact" && x.ColName.ToLower() != "othermaritalstatus" && x.ColName.ToLower() != "otherlanguagespeak"
                     && x.ColName.ToLower() != "otherpronouns" && x.ColName.ToLower() != "otherthinkyourselfas"
                      && x.ColName.ToLower() != "datacamefrom" && x.ColName.ToLower() != "importnotes" && x.ColName.ToLower() != "importdate").ToList();
                    }

                }

            }
            catch (Exception ex)
            {
                new Common().LogExceptionToDb(ex);
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json("Upload failed");
            }

            return Json(new
            {
                filecolumns = columnNames,
                databaseColumns = databaseColumns,
                totalRecords = TotalRecords

            });
        }

        [HttpGet]
        [AllowAnonymous]
        public ActionResult Sharing(string shareId, string form)
        {

            var SharedFormData = new List<SharedFormDataBO>();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/getsharedforms?uniqueidentifier=" + shareId);
                var result = responseTask.Result;

                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<List<SharedFormDataBO>>();
                    readTask.Wait();
                    SharedFormData = readTask.Result;
                    ViewBag.ActiveFormName = form;
                    ViewBag.PatientId = SharedFormData.Count > 0 ? SharedFormData[0].ClientId : 0;
                }

            }
            return View(SharedFormData);
        }



        [HttpPost]
        public ActionResult GenerateSharedForms()
        {

            var clinicId = Session["ClinicID"];
            var SharedFormData = new List<SharedFormForExportBO>();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/getsharedformsforexport?clinicId=" + clinicId);
                var result = responseTask.Result;

                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<List<SharedFormForExportBO>>();
                    readTask.Wait();
                    SharedFormData = readTask.Result;
                    if (SharedFormData.Count == 0)
                    {
                        return new JsonResult()
                        {
                            Data = new
                            {
                                hasError = true
                            }

                        };
                    }
                }

            }





            using (MemoryStream output = new MemoryStream())
            {
                var workbook = new HSSFWorkbook();
                var sheet = workbook.CreateSheet("Form Sharing Export");
                var rownumber = 1;

                var headerRow = sheet.CreateRow(rownumber);
                headerRow.CreateCell(0).SetCellValue("Patient Id");
                headerRow.CreateCell(1).SetCellValue("First Name");
                headerRow.CreateCell(2).SetCellValue("Last Name");
                headerRow.CreateCell(3).SetCellValue("Date of Birth");
                headerRow.CreateCell(4).SetCellValue("Address");
                headerRow.CreateCell(5).SetCellValue("City");
                headerRow.CreateCell(6).SetCellValue("State");
                headerRow.CreateCell(7).SetCellValue("Postal Code");
                headerRow.CreateCell(8).SetCellValue("Mobile Number");
                headerRow.CreateCell(9).SetCellValue("Home Number");
                headerRow.CreateCell(10).SetCellValue("Email");
                headerRow.CreateCell(11).SetCellValue("Langauge");
                headerRow.CreateCell(12).SetCellValue("UniqueLink");


                foreach (var item in SharedFormData)
                {
                    rownumber = rownumber + 1;
                    var row1 = sheet.CreateRow(rownumber);
                    row1.CreateCell(0).SetCellValue(Common.ConvertValuesToExport(item.PatientId));
                    row1.CreateCell(1).SetCellValue(Common.ConvertValuesToExport(item.FirstName));
                    row1.CreateCell(2).SetCellValue(Common.ConvertValuesToExport(item.LastName));
                    row1.CreateCell(3).SetCellValue(Common.ConvertValuesToExport(item.DOB));
                    row1.CreateCell(4).SetCellValue(Common.ConvertValuesToExport(item.Address));
                    row1.CreateCell(5).SetCellValue(Common.ConvertValuesToExport(item.City));
                    row1.CreateCell(6).SetCellValue(Common.ConvertValuesToExport(item.State));
                    row1.CreateCell(7).SetCellValue(Common.ConvertValuesToExport(item.PostalCode));
                    row1.CreateCell(8).SetCellValue(Common.ConvertValuesToExport(item.MobilePhone));
                    row1.CreateCell(9).SetCellValue(Common.ConvertValuesToExport(item.HomePhone));
                    row1.CreateCell(10).SetCellValue(Common.ConvertValuesToExport(item.Email));
                    row1.CreateCell(11).SetCellValue(Common.ConvertValuesToExport(item.Language));
                    row1.CreateCell(12).SetCellValue(Common.ConvertValuesToExport(item.UniqueLink));
                }

                sheet.SetColumnWidth(0, 6000);
                sheet.SetColumnWidth(1, 6000);
                sheet.SetColumnWidth(2, 6000);
                sheet.SetColumnWidth(3, 6000);
                sheet.SetColumnWidth(4, 6000);
                sheet.SetColumnWidth(5, 6000);
                sheet.SetColumnWidth(6, 6000);
                sheet.SetColumnWidth(7, 6000);
                sheet.SetColumnWidth(8, 6000);
                sheet.SetColumnWidth(9, 6000);
                sheet.SetColumnWidth(10, 6000);
                sheet.SetColumnWidth(11, 6000);
                sheet.SetColumnWidth(12, 25000);

                workbook.Write(output);

                Session["GeneratedFile"] = output.ToArray();

                return new JsonResult()
                {
                    Data = new
                    {
                        hasError = false
                    }

                };
                //return File(output.ToArray(),   //The binary data of the XLS file
                //    "application/vnd.ms-excel", //MIME type of Excel files
                //    "FormSharing.xls");     //Suggested file name in the "Save as" dialog which will be displayed to the end user

            }
        }

        [HttpPost]
        public ActionResult DownloadExportFile()
        {
            if (Session["GeneratedFile"] != null)
            {
                byte[] data = Session["GeneratedFile"] as byte[];
                Session.Remove("GeneratedFile");  // Cleanup session data
                return File(data, "application/vnd.ms-excel", "FormSharing.xls");
            }
            else
            {
                // Log the error if you want
                return new EmptyResult();
            }
        }

        [HttpPost]
        public ActionResult SavePotentialClientData(string dbfields, string dataCameFrom, string importNotes, string importDate)
        {
            var result = 0;
            List<InvalidClientsDetail> InvalidClientsDetailList = new List<InvalidClientsDetail>();
            List<string> headerRow = new List<string>();
            try
            {
                Dictionary<string, string> dbFields = JsonConvert.DeserializeObject<Dictionary<string, string>>(dbfields);
                DateTime ImportDate;
                bool isSuccess = DateTime.TryParse(importDate, out ImportDate);
                if (!isSuccess)
                {
                    ImportDate = DateTime.Now;
                }
                var files = Request.Files;
                string fileName = Request.Files[0].FileName;
                var fileExtension = Path.GetExtension(files[0].FileName);

                if (fileExtension != ".csv")
                {
                    try
                    {
                        if (fileExtension == ".xls")
                        {
                            HSSFWorkbook workbook = new HSSFWorkbook(Request.Files[0].InputStream);
                            result = DataImportExcelOld(workbook, fileName, dbFields, dataCameFrom, importNotes, ImportDate);
                        }
                        else
                        {
                            XSSFWorkbook workbook = new XSSFWorkbook(Request.Files[0].InputStream);
                            result = DataImportExcelNew(workbook, fileName, dbFields, dataCameFrom, importNotes, ImportDate);
                        }

                    }
                    catch (IOException ex)
                    {
                        new Common().LogExceptionToDb(ex);
                        //not excel file

                    }
                }
               InvalidClientsDetailList = (List<InvalidClientsDetail>)TempData["InvalidClientsDetailList"];
                 headerRow = InvalidClientsDetailList.Where(x => x.RowNumber == 1).Select(y=> y.ColumnName).ToList();
                var InvalidList = InvalidClientsDetailList.Where(y => y.IsValid == false);
                var showPopup = InvalidList.Count() > 0;
                if (result > 0)
                {
                    return Json(new { Status = 1, showPopup= showPopup, Message = "Data saved Successfully " , InvalidClientsDetailList = InvalidClientsDetailList,tableColumns = headerRow });
                }
                else
                {
                    return Json(new { Status = 0, showPopup= showPopup, Message = "Error Occured ",InvalidClientsDetailList = InvalidClientsDetailList, tableColumns = headerRow });
                }


            }
            catch (Exception ex)
            {
                new Common().LogExceptionToDb(ex);
                return Json(new { Status = 0, Message = ex.Message, InvalidClientsDetailList = InvalidClientsDetailList, tableColumns = headerRow });
            }
        }
        public ActionResult SavePCFromUnorganisedExcel(string dbfields, int fileRange, string dataCameFrom, string importNotes, string importDate)
        {
            var result = 0;
            List<InvalidClientsDetail> InvalidClientsDetailList = new List<InvalidClientsDetail>();
            List<string> headerRow = new List<string>();
            try
            {
                Dictionary<string, string> databaseFields = JsonConvert.DeserializeObject<Dictionary<string, string>>(dbfields);
                DateTime ImportDate;
                bool isSuccess = DateTime.TryParse(importDate, out ImportDate);
                if (!isSuccess)
                {
                    ImportDate = DateTime.Now;
                }

                var files = Request.Files;
                string fileName = Request.Files[0].FileName;
                var fileExtension = Path.GetExtension(files[0].FileName);
                var directoryPath = "~/App_Data/PotentialClient";
                var path = Path.Combine(Server.MapPath(directoryPath), fileName);
                if (!Directory.Exists(directoryPath))
                {
                    Directory.CreateDirectory(Server.MapPath(directoryPath));
                }
                HttpPostedFileBase fileBase = files[0];
                fileBase.SaveAs(path);
                if (fileExtension != ".csv")
                {
                    List<PotientialPatientBO> allowedPatientList = new List<PotientialPatientBO>();

                    var databaseColumns = new List<PotientialTableInfoBO>();
                    using (var client = new HttpClient())
                    {
                        client.BaseAddress = new Uri(WebApiKey);
                        //HTTP GET
                        var responseTask = client.GetAsync("/api/PatientMain/getpotentialclienttableinfo");
                        var responseresult = responseTask.Result;

                        if (responseresult.IsSuccessStatusCode)
                        {
                            var readTask = responseresult.Content.ReadAsAsync<List<PotientialTableInfoBO>>();
                            readTask.Wait();
                            databaseColumns = readTask.Result;
                        }

                    }
                    for (var i = 0; i < fileRange; i++)
                    {
                        PotientialPatientBO patient = new PotientialPatientBO();
                        allowedPatientList.Add(patient);
                    }
                    using (SpreadsheetDocument spreadsheetDocument = SpreadsheetDocument.Open(path, false))
                    {

                        S sheets = spreadsheetDocument.WorkbookPart.Workbook.Sheets;
                        // Retrieve a reference to the workbook part.
                        WorkbookPart wbPart = spreadsheetDocument.WorkbookPart;
                        // For each sheet
                        foreach (E sheet in sheets)
                        {

                            string sheetname = null;

                            foreach (A attr in sheet.GetAttributes())
                            {
                                if (attr.LocalName == "name")
                                {
                                    sheetname = attr.Value;
                                }
                            }


                            Sheet theSheet = wbPart.Workbook.Descendants<Sheet>().Where(s => s.Name == sheetname).FirstOrDefault();

                            // if there is no sheet.
                            if (theSheet == null)
                            {
                                break;
                            }

                            // Retrieve a reference to the worksheet part.
                            WorksheetPart wsPart = (WorksheetPart)(wbPart.GetPartById(theSheet.Id));



                            foreach (var dfield in databaseFields)
                            {
                               
                                var dbCurrentfield = databaseColumns.Where(x => x.ColName.ToLower() == dfield.Key.ToLower()).FirstOrDefault();
                                string range = dfield.Value.Replace(",", ":");
                                string[] rangeDiff = range.Split(':');

                                var i = 0;
                                if (range == "" || range == ":" || rangeDiff[0] == "" || rangeDiff[1] == "")
                                {
                                    for (var z = 0; z < fileRange; z++)
                                    {
                                        InvalidClientsDetail invalidClient2 = new InvalidClientsDetail();
                                        invalidClient2.RowNumber = z;
                                        invalidClient2.ColumnName = dbCurrentfield.ColName;
                                        invalidClient2.ColumnValue = "";
                                        invalidClient2.IsValid = true;
                                        InvalidClientsDetailList.Add(invalidClient2);
                                    }
                                   
                                    continue;
                                }


                                var rangeElement = Regex.Replace(rangeDiff[0], @"[\d-]", string.Empty);
                                var currRangeStart = Convert.ToInt32(Regex.Replace(rangeDiff[0], @"[\D+]", string.Empty));
                                var currRangeEnd = Convert.ToInt32(Regex.Replace(rangeDiff[1], @"[\D+]", string.Empty));
                                List<string> currFieldRange = new List<string>();
                                for (var k = currRangeStart; k <= currRangeEnd; k++)
                                {
                                    currFieldRange.Add(rangeElement + k);
                                }
                                foreach (var item in currFieldRange)
                                {
                                    InvalidClientsDetail invalidClient = new InvalidClientsDetail();
                                    string cellvalue = null;
                                    // Use its Worksheet property to get a reference to the cell 
                                    // whose address matches the address you supplied.
                                    Cell theCell = wsPart.Worksheet.Descendants<Cell>().Where(c => c.CellReference == item).FirstOrDefault();
                                    if (theCell == null)
                                    {
                                        invalidClient.RowNumber = i;
                                        invalidClient.ColumnName = dbCurrentfield.ColName;
                                        invalidClient.ColumnValue = "";
                                        invalidClient.IsValid = true;
                                        InvalidClientsDetailList.Add(invalidClient);
                                        i++;
                                        continue;
                                    }
                                    // If the cell does not exist, return an empty string.
                                    if (theCell.InnerText.Length > 0)
                                    {
                                        cellvalue = theCell.InnerText;

                                        // If the cell represents an integer number, you are done. 
                                        // For dates, this code returns the serialized value that 
                                        // represents the date. The code handles strings and 
                                        // Booleans individually. For shared strings, the code 
                                        // looks up the corresponding value in the shared string 
                                        // table. For Booleans, the code converts the value into 
                                        // the words TRUE or FALSE.
                                        if (theCell.DataType != null)
                                        {
                                            switch (theCell.DataType.Value)
                                            {
                                                case CellValues.SharedString:

                                                    // For shared strings, look up the value in the
                                                    // shared strings table.
                                                    var stringTable =
                                                        wbPart.GetPartsOfType<SharedStringTablePart>()
                                                        .FirstOrDefault();

                                                    // If the shared string table is missing, something 
                                                    // is wrong. Return the index that is in
                                                    // the cell. Otherwise, look up the correct text in 
                                                    // the table.
                                                    if (stringTable != null)
                                                    {
                                                        cellvalue =
                                                            stringTable.SharedStringTable
                                                            .ElementAt(int.Parse(cellvalue)).InnerText;
                                                    }
                                                    break;

                                                case CellValues.Boolean:
                                                    switch (cellvalue)
                                                    {
                                                        case "0":
                                                            cellvalue = "FALSE";
                                                            break;
                                                        default:
                                                            cellvalue = "TRUE";
                                                            break;
                                                    }
                                                    break;
                                            }
                                        }
                                        else if (theCell.DataType == null) // number & dates.
                                        {
                                            if (theCell.StyleIndex != null)
                                            {
                                                int styleIndex = (int)theCell.StyleIndex.Value;
                                                CellFormat cellFormat = spreadsheetDocument.WorkbookPart.WorkbookStylesPart.Stylesheet.CellFormats.ChildElements[int.Parse(theCell.StyleIndex.InnerText)] as CellFormat;
                                                uint formatId = cellFormat.NumberFormatId.Value;

                                                if (formatId == (uint)Formats.DateShort || formatId == (uint)Formats.DateLong)
                                                {
                                                    double oaDate;
                                                    if (double.TryParse(theCell.InnerText, out oaDate))
                                                    {
                                                        cellvalue = DateTime.FromOADate(oaDate).ToShortDateString();
                                                    }
                                                }
                                                else
                                                {
                                                    cellvalue = theCell.InnerText;
                                                }
                                            }
                                            else
                                            {
                                                cellvalue = theCell.InnerText;
                                            }

                                        }
                                    }

                                    var value = cellvalue;
                                    var unsavedValue = cellvalue;
                                    if (value == null)
                                    {
                                        invalidClient.RowNumber = i;
                                        invalidClient.ColumnName = dbCurrentfield.ColName;
                                        invalidClient.ColumnValue = "";
                                        invalidClient.IsValid = true;
                                        InvalidClientsDetailList.Add(invalidClient);
                                        i++;
                                        continue;
                                    }
                                    if (dbCurrentfield.ColName.ToLower() == "gender")
                                    {
                                        switch (value.ToLower())
                                        {
                                            case "male":
                                                value = "Male";
                                                break;
                                            case "female":
                                                value = "Female";
                                                break;
                                            default:
                                                allowedPatientList[i].OtherGender = value;
                                                value = "Other";
                                                break;
                                        }



                                    }
                                    else if (dbCurrentfield.ColName.ToLower() == "raceethnicity")
                                    {
                                        string[] options = value.Split(',');
                                        var raceEthnicity = "";
                                        var otherRace = "";
                                        foreach (var race in options)
                                        {
                                            switch (race.ToLower().Trim())
                                            {
                                                case "black/african/african-american":
                                                    raceEthnicity += "Black/African/African-American,";
                                                    break;
                                                case "latino/hispanic":
                                                    raceEthnicity += "Latino/Hispanic,";
                                                    break;
                                                case "white/caucasian":
                                                    raceEthnicity += "White/Caucasian,";
                                                    break;
                                                case "asian":
                                                    raceEthnicity += "Asian,";
                                                    break;
                                                case "native hawaiian/pacific islander":
                                                    raceEthnicity += "Native Hawaiian/Pacific Islander,";
                                                    break;
                                                case "native american/alaskan":
                                                    raceEthnicity += "Native American/Alaskan,";
                                                    break;
                                                default:
                                                    otherRace += race;
                                                    break;
                                            }
                                        }
                                        if (otherRace != "")
                                        {
                                            raceEthnicity += "Other";
                                        }
                                        value = raceEthnicity;
                                        allowedPatientList[i].OtherRace = otherRace;

                                    }
                                    else if (dbCurrentfield.ColName.ToLower() == "ispermanentaddress" || dbCurrentfield.ColName.ToLower() == "everbeensmoker"
                                        || dbCurrentfield.ColName.ToLower() == "quitsmoking" || dbCurrentfield.ColName.ToLower() == "evermemberofusarmedforces")
                                    {
                                        switch (value.ToLower())
                                        {
                                            case "yes":
                                            case "1":
                                                value = "1";
                                                break;
                                            case "no":
                                            case "0":
                                                value = "0";
                                                break;
                                            default:
                                                break;
                                        }
                                    }
                                    else if (dbCurrentfield.ColName.ToLower() == "waytocontact")
                                    {
                                        switch (value.ToLower())
                                        {
                                            case "home":
                                                value = "Home";
                                                break;
                                            case "cell":
                                                value = "Cell";
                                                break;
                                            case "email":
                                                value = "Email";
                                                break;
                                            default:
                                                allowedPatientList[i].OtherContact = value;
                                                value = "Other";
                                                break;
                                        }
                                    }
                                    else if (dbCurrentfield.ColName.ToLower() == "maritalstatus")
                                    {
                                        switch (value.ToLower())
                                        {
                                            case "married":
                                                value = "Married";
                                                break;
                                            case "single":
                                                value = "Single";
                                                break;
                                            case "domestic partnership":
                                                value = "Domestic Partnership";
                                                break;
                                            case "divorced":
                                                value = "Divorced";
                                                break;
                                            case "separated":
                                                value = "Separated";
                                                break;
                                            case "widowed":
                                                value = "Widowed";
                                                break;
                                            default:
                                                allowedPatientList[i].OtherMaritalStatus = value;
                                                value = "Other";
                                                break;
                                        }
                                    }
                                    else if (dbCurrentfield.ColName.ToLower() == "languagesspeak")
                                    {
                                        string[] options = value.Split(',');
                                        var language = "";
                                        var OtherLanguage = "";
                                        foreach (var lang in options)
                                        {
                                            switch (lang.ToLower())
                                            {
                                                case "english":
                                                    language += "English,";
                                                    break;
                                                case "spanish":
                                                    language += "Spanish,";
                                                    break;
                                                case "arabic":
                                                    language += "Arabic,";
                                                    break;
                                                case "amharic":
                                                    language += "Amharic,";
                                                    break;
                                                case "tigrinya":
                                                    language += "Tigrinya,";
                                                    break;
                                                default:
                                                    OtherLanguage += lang;
                                                    break;
                                            }
                                        }
                                        if (OtherLanguage != "")
                                        {
                                            language += "Other";
                                        }
                                        value = language;
                                        allowedPatientList[i].OtherLanguageSpeak = OtherLanguage;

                                    }
                                    else if (dbCurrentfield.ColName.ToLower() == "preferredpronouns")
                                    {
                                        switch (value.ToLower())
                                        {
                                            case "she/her":
                                            case "she":
                                            case "her":
                                                value = "She/Her";
                                                break;
                                            case "he/him":
                                            case "he":
                                            case "him":
                                                value = "He/Him";
                                                break;
                                            case "they/them":
                                            case "they":
                                            case "them":
                                                value = "They/Them";
                                                break;
                                            default:
                                                allowedPatientList[i].OtherPronouns = value;
                                                value = "Other";
                                                break;
                                        }
                                    }
                                    else if (dbCurrentfield.ColName.ToLower() == "thinkyourselfas")
                                    {
                                        switch (value.ToLower())
                                        {
                                            case "straight or heterosexual":
                                            case "straight":
                                            case "heterosexual":
                                                value = "Straight or Heterosexual";
                                                break;
                                            case "lesbian":
                                                value = "Lesbian";
                                                break;
                                            case "gay":
                                                value = "Gay";
                                                break;
                                            case "bisexual":
                                                value = "Bisexual";
                                                break;
                                            case "queer":
                                                value = "Queer";
                                                break;
                                            case "questioning":
                                                value = "Questioning";
                                                break;
                                            default:
                                                allowedPatientList[i].OtherThinkYourselfAs = value;
                                                value = "Unspecified/Other";
                                                break;
                                        }
                                    }
                                    else if (dbCurrentfield.ColName.ToLower() == "patientchildrensages")
                                    {
                                        char[] stringSeparators = new char[] { ',', ':', '-', '/' };
                                        string resul = "";
                                        string[] patientages = value.Split(',');
                                        var childrencounter = 0;
                                        foreach (string pat in patientages)
                                        {
                                            var age = pat.Split(stringSeparators);
                                            if (age.Length > 1)
                                            {
                                                resul += age[0] + ":" + age[1] + ",";
                                                childrencounter++;
                                            }

                                        }
                                        value = resul;
                                        allowedPatientList[i].PatientChildren = childrencounter;
                                    }

                                    if (dbCurrentfield.ColType == "bit")
                                    {

                                        if (value == "1")
                                        {
                                            allowedPatientList[i].GetType().GetProperty(dfield.Key).SetValue(allowedPatientList[i], true, null);
                                            invalidClient.RowNumber = i;
                                            invalidClient.ColumnName = dbCurrentfield.ColName;
                                            invalidClient.ColumnValue = unsavedValue;
                                            invalidClient.IsValid = true;
                                        }
                                        else if(value =="0")
                                        {
                                            allowedPatientList[i].GetType().GetProperty(dfield.Key).SetValue(allowedPatientList[i], false, null);
                                            invalidClient.RowNumber = i;
                                            invalidClient.ColumnName = dbCurrentfield.ColName;
                                            invalidClient.ColumnValue = unsavedValue;
                                            invalidClient.IsValid = true;
                                        }
                                        else
                                        {
                                            invalidClient.RowNumber = i;
                                            invalidClient.ColumnName = dbCurrentfield.ColName;
                                            invalidClient.ColumnValue = unsavedValue;
                                            invalidClient.IsValid = false;
                                        }


                                    }
                                    else if (dbCurrentfield.ColType == "int")
                                    {
                                        if (dbCurrentfield.ColLength != null && dbCurrentfield.ColLength != -1)
                                        {
                                            var fieldLength = value.ToString().Length;
                                            if (fieldLength > dbCurrentfield.ColLength)
                                            {
                                                value = value.Substring(0, dbCurrentfield.ColLength ?? 0);
                                            }
                                        }
                                        int intval;
                                        if (Int32.TryParse(value, out intval))
                                        {
                                            allowedPatientList[i].GetType().GetProperty(dfield.Key).SetValue(allowedPatientList[i], intval, null);
                                            invalidClient.RowNumber = i;
                                            invalidClient.ColumnName = dbCurrentfield.ColName;
                                            invalidClient.ColumnValue = unsavedValue;
                                            invalidClient.IsValid = true;
                                        }
                                        else
                                        {
                                            // skip 
                                            invalidClient.RowNumber = i;
                                            invalidClient.ColumnName = dbCurrentfield.ColName;
                                            invalidClient.ColumnValue = unsavedValue;
                                            invalidClient.IsValid = false;
                                        }
                                    }
                                    else if (dbCurrentfield.ColType == "nvarchar")
                                    {
                                        if (dbCurrentfield.ColLength != null && dbCurrentfield.ColLength != -1)
                                        {
                                            var fieldLength = value.ToString().Length;
                                            if (fieldLength > dbCurrentfield.ColLength)
                                            {
                                                value = value.Substring(0, dbCurrentfield.ColLength ?? 0);
                                            }
                                           
                                        }
                                        if (dbCurrentfield.ColName.ToLower() == "dateofbirth")
                                        {
                                            Boolean isValidValue = false;
                                            DateTime dateValue;

                                            if (!DateTime.TryParse(value, out dateValue))
                                            {
                                                value = "";
                                                isValidValue = false;
                                            }
                                            else
                                            {
                                                isValidValue = true;
                                            }

                                            allowedPatientList[i].GetType().GetProperty(dfield.Key).SetValue(allowedPatientList[i], value, null);
                                            invalidClient.RowNumber = i;
                                            invalidClient.ColumnName = dbCurrentfield.ColName;
                                            invalidClient.ColumnValue = unsavedValue;
                                            invalidClient.IsValid = isValidValue;
                                        }
                                        else
                                        {
                                            allowedPatientList[i].GetType().GetProperty(dfield.Key).SetValue(allowedPatientList[i], value.ToString(), null);
                                            invalidClient.RowNumber = i;
                                            invalidClient.ColumnName = dbCurrentfield.ColName;
                                            invalidClient.ColumnValue = unsavedValue;
                                            invalidClient.IsValid = true;
                                        }


                                    }
                                    allowedPatientList[i].DataCameFrom = dataCameFrom;
                                    allowedPatientList[i].ImportNotes = importNotes;
                                    allowedPatientList[i].ImportDate = ImportDate;

                                    InvalidClientsDetailList.Add(invalidClient);
                                    i++;
                                }
                            }

                        }


                    }

                    #region Save allowed potentialPatients to DB

                    foreach (var patient in allowedPatientList)
                    {
                        if (!patient.GetType().GetProperties().Where(x=> x.Name != "PatientID").Select(pi => pi.GetValue(patient)).Any(value => value != null))
                        {
                            continue;
                        }
                        using (var client = new HttpClient())
                        {
                            client.BaseAddress = new Uri(WebApiKey);
                            client.DefaultRequestHeaders.Accept.Clear();
                            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                            var responseTask = client.PostAsJsonAsync("/api/PatientMain/savePotentialclient", patient);
                            responseTask.Wait();

                            var resultresponse = responseTask.Result;
                            if (resultresponse.IsSuccessStatusCode)
                            {
                                var data = resultresponse.Content.ReadAsStringAsync().Result;
                                if (data == "1")
                                {
                                    result++;
                                }
                            }
                        }
                    }
                    #endregion

                }
                 headerRow = InvalidClientsDetailList.Where(x => x.RowNumber == 0).Select(y => y.ColumnName).ToList();
                var InvalidList = InvalidClientsDetailList.Where(y => y.IsValid == false);
                var showPopup = InvalidList.Count() > 0;
                if (result > 0)
                {
                    return Json(new { Status = 1,showPopUp = showPopup, Message = "Data saved Successfully ", InvalidClientsDetailList = InvalidClientsDetailList, tableColumns = headerRow });
                }
                else
                {
                    return Json(new { Status = 0, showPopup= showPopup, Message = "Error Occured ", InvalidClientsDetailList = InvalidClientsDetailList, tableColumns = headerRow });
                }
            }
            catch (Exception ex)
            {
                new Common().LogExceptionToDb(ex);
                return Json(new { Status = 0, Message = ex.Message, InvalidClientsDetailList = InvalidClientsDetailList, tableColumns = headerRow });
            }
        }
        private bool IsRowEmpty(IRow row)
        {
            bool ret = false;
            if (row == null)
                ret = true;
            else if (row.FirstCellNum == -1 && row.LastCellNum == -1)
                ret = true;

            return ret;
        }
        public int DataImportExcelOld(HSSFWorkbook workbook, string fileName, Dictionary<string, string> dbFields, string dataCameFrom, string importNotes, DateTime importDate)
        {
           List<InvalidClientsDetail> InvalidClientsDetailList = new List<InvalidClientsDetail>();
            var sheet = workbook.GetSheetAt(0);
            if (sheet == null)
            {
                //no 'Potential Client Data' sheet
                return 0;
            }

            // formatter to get string data from any type of fields
            HSSFDataFormatter formatter = new HSSFDataFormatter();
            var headerRow = sheet.GetRow(0);
            if (IsRowEmpty(headerRow))
            {
                //inconsistent structure of the file
                return 0;
            }
            Dictionary<string, int> columnNames = new Dictionary<string, int>();
            for (int i = headerRow.FirstCellNum; i < headerRow.LastCellNum; i++)
            {
                string value = formatter.FormatCellValue(headerRow.GetCell(i)).Trim();
                if (!columnNames.ContainsKey(value))
                    columnNames.Add(value, i);
            }



            var databaseColumns = new List<PotientialTableInfoBO>();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/getpotentialclienttableinfo");
                var result = responseTask.Result;

                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<List<PotientialTableInfoBO>>();
                    readTask.Wait();
                    databaseColumns = readTask.Result;
                }

            }
            List<PotientialPatientBO> allowedPatientList = new List<PotientialPatientBO>();
            //check for necessary columns
            //if (!IsAllNecessaryColumnsExist(dbFields, necessaryColumnsForPotentialClient))
            //{
            //    //inconsistent structure of the file
            //    return 0;
            //}
            #region Check every row in import file
            //loop for all rows
            for (int i = sheet.FirstRowNum + 1; i <= sheet.LastRowNum; i++)
            {
                var currentRow = sheet.GetRow(i);
                if (IsRowEmpty(currentRow))
                {
                    // skip empty rows
                    continue;
                }
                PotientialPatientBO currentPatient = new PotientialPatientBO();

                foreach (var field in dbFields)
                {
                    InvalidClientsDetail invalidClient = new InvalidClientsDetail();
                    if (field.Value == null)
                    {
                        continue;
                    }
                    var dbCurrentfield = databaseColumns.Where(x => x.ColName.ToLower() == field.Key.ToLower()).FirstOrDefault();

                    var cellNo = columnNames.Where(x => x.Key.ToLower() == field.Value.ToLower()).Select(x => x.Value).FirstOrDefault();
                    string value;
                    var currentCell = currentRow.GetCell(cellNo);
                    var unsavedValue = formatter.FormatCellValue(currentCell).Trim();

                    value = formatter.FormatCellValue(currentCell).Trim();
                    if (currentCell != null && currentCell.CellType == NPOI.SS.UserModel.CellType.Numeric)
                    {
                        if (HSSFDateUtil.IsCellDateFormatted(currentCell))
                        {
                            value = currentCell.DateCellValue.ToShortDateString();
                        }
                    }
                    if (dbCurrentfield.ColName.ToLower() == "gender")
                    {
                        switch (value.ToLower())
                        {
                            case "male":
                                value = "Male";
                                break;
                            case "female":
                                value = "Female";
                                break;
                            default:
                                currentPatient.OtherGender = value;
                                value = "Other";
                                break;
                        }



                    }
                    else if (dbCurrentfield.ColName.ToLower() == "raceethnicity")
                    {
                        string[] options = value.Split(',');
                        var raceEthnicity = "";
                        var otherRace = "";
                        foreach (var race in options)
                        {
                            switch (race.ToLower().Trim())
                            {
                                case "black/african/african-american":
                                    raceEthnicity += "Black/African/African-American,";
                                    break;
                                case "latino/hispanic":
                                    raceEthnicity += "Latino/Hispanic,";
                                    break;
                                case "white/caucasian":
                                    raceEthnicity += "White/Caucasian,";
                                    break;
                                case "asian":
                                    raceEthnicity += "Asian,";
                                    break;
                                case "native hawaiian/pacific islander":
                                    raceEthnicity += "Native Hawaiian/Pacific Islander,";
                                    break;
                                case "native american/alaskan":
                                    raceEthnicity += "Native American/Alaskan,";
                                    break;
                                default:
                                    otherRace += race;
                                    break;
                            }
                        }
                        if (otherRace != "")
                        {
                            raceEthnicity += "Other";
                        }
                        value = raceEthnicity;
                        currentPatient.OtherRace = otherRace;

                    }
                    else if (dbCurrentfield.ColName.ToLower() == "ispermanentaddress" || dbCurrentfield.ColName.ToLower() == "everbeensmoker"
                        || dbCurrentfield.ColName.ToLower() == "quitsmoking" || dbCurrentfield.ColName.ToLower() == "evermemberofusarmedforces")
                    {
                        switch (value.ToLower())
                        {
                            case "yes":
                            case "1":
                                value = "1";
                                break;
                            case "no":
                            case "0":
                                value = "0";
                                break;
                            default:
                                break;
                        }
                    }
                    else if (dbCurrentfield.ColName.ToLower() == "waytocontact")
                    {
                        switch (value.ToLower())
                        {
                            case "home":
                                value = "Home";
                                break;
                            case "cell":
                                value = "Cell";
                                break;
                            case "email":
                                value = "Email";
                                break;
                            default:
                                currentPatient.OtherContact = value;
                                value = "Other";
                                break;
                        }
                    }
                    else if (dbCurrentfield.ColName.ToLower() == "maritalstatus")
                    {
                        switch (value.ToLower())
                        {
                            case "married":
                                value = "Married";
                                break;
                            case "single":
                                value = "Single";
                                break;
                            case "domestic partnership":
                                value = "Domestic Partnership";
                                break;
                            case "divorced":
                                value = "Divorced";
                                break;
                            case "separated":
                                value = "Separated";
                                break;
                            case "widowed":
                                value = "Widowed";
                                break;
                            default:
                                currentPatient.OtherMaritalStatus = value;
                                value = "Other";
                                break;
                        }
                    }
                    else if (dbCurrentfield.ColName.ToLower() == "languagesspeak")
                    {
                        string[] options = value.Split(',');
                        var language = "";
                        var OtherLanguage = "";
                        foreach (var lang in options)
                        {
                            switch (lang.ToLower())
                            {
                                case "english":
                                    language += "English,";
                                    break;
                                case "spanish":
                                    language += "Spanish,";
                                    break;
                                case "arabic":
                                    language += "Arabic,";
                                    break;
                                case "amharic":
                                    language += "Amharic,";
                                    break;
                                case "tigrinya":
                                    language += "Tigrinya,";
                                    break;
                                default:
                                    OtherLanguage += lang;
                                    break;
                            }
                        }
                        if (OtherLanguage != "")
                        {
                            language += "Other";
                        }
                        value = language;
                        currentPatient.OtherLanguageSpeak = OtherLanguage;

                    }
                    else if(dbCurrentfield.ColName.ToLower() == "preferredpronouns")
                    {
                        switch (value.ToLower())
                        {
                            case "she/her":
                            case "she":
                            case "her":
                                value = "She/Her";
                                break;
                            case "he/him":
                            case "he":
                            case "him":
                                value = "He/Him";
                                break;
                            case "they/them":
                            case "they":
                            case "them":
                                value = "They/Them";
                                break;
                            default:
                                currentPatient.OtherPronouns = value;
                                value = "Other";
                                break;
                        }
                    }
                    else if (dbCurrentfield.ColName.ToLower() == "thinkyourselfas")
                    {
                        switch (value.ToLower())
                        {
                            case "straight or heterosexual":
                            case "straight":
                            case "heterosexual":
                                value = "Straight or Heterosexual";
                                break;
                            case "lesbian":
                                value = "Lesbian";
                                break;
                            case "gay":
                                value = "Gay";
                                break;
                            case "bisexual":
                                value = "Bisexual";
                                break;
                            case "queer":
                                value = "Queer";
                                break;
                            case "questioning":
                                value = "Questioning";
                                break;
                            default:
                                currentPatient.OtherThinkYourselfAs = value;
                                value = "Unspecified/Other";
                                break;
                        }
                    }
                    else if (dbCurrentfield.ColName.ToLower() == "patientchildrensages")
                    {
                        char[] stringSeparators = new char[] { ',',':','-','/' };
                        string resul = "";
                        string[] patientages = value.Split(',');
                        var childrencounter = 0;
                        foreach(string pat in patientages)
                        {
                            var age = pat.Split(stringSeparators);
                            if (age.Length > 1)
                            {
                                resul += age[0] + ":" + age[1] + ",";
                                childrencounter++;
                            }
                            
                        }
                        value = resul;
                        currentPatient.PatientChildren = childrencounter;
                    }
                    try
                    {
                        if (currentCell != null)
                        {
                            if (dbCurrentfield.ColType == "bit")
                            {
                                if (value =="1")
                                {
                                    currentPatient.GetType().GetProperty(field.Key).SetValue(currentPatient, true, null);
                                    invalidClient.RowNumber = i;
                                    invalidClient.ColumnName = dbCurrentfield.ColName;
                                    invalidClient.ColumnValue = unsavedValue;
                                    invalidClient.IsValid = true;
                                }
                                else if (value == "0")
                                {
                                    currentPatient.GetType().GetProperty(field.Key).SetValue(currentPatient, false, null);
                                    invalidClient.RowNumber = i;
                                    invalidClient.ColumnName = dbCurrentfield.ColName;
                                    invalidClient.ColumnValue = unsavedValue;
                                    invalidClient.IsValid = true;
                                }
                                else
                                {
                                    invalidClient.RowNumber = i;
                                    invalidClient.ColumnName = dbCurrentfield.ColName;
                                    invalidClient.ColumnValue = unsavedValue;
                                    invalidClient.IsValid = false;
                                }


                            }
                            else if (dbCurrentfield.ColType == "int")
                            {
                                if (dbCurrentfield.ColLength != null && dbCurrentfield.ColLength != -1)
                                {
                                    var fieldLength = value.ToString().Length;
                                    if (fieldLength > dbCurrentfield.ColLength)
                                    {
                                        value = value.Substring(0, dbCurrentfield.ColLength ?? 0);
                                    }
                                }
                                int intval;
                                if (Int32.TryParse(value, out intval))
                                {
                                    currentPatient.GetType().GetProperty(field.Key).SetValue(currentPatient, intval, null);
                                    invalidClient.RowNumber = i;
                                    invalidClient.ColumnName = dbCurrentfield.ColName;
                                    invalidClient.ColumnValue = unsavedValue;
                                    invalidClient.IsValid = true;
                                }
                                else
                                {
                                    // skip 

                                    invalidClient.RowNumber = i;
                                    invalidClient.ColumnName = dbCurrentfield.ColName;
                                    invalidClient.ColumnValue = unsavedValue;
                                    invalidClient.IsValid = false;

                                }
                            }
                            else if (dbCurrentfield.ColType == "nvarchar")
                            {
                                if (dbCurrentfield.ColLength != null && dbCurrentfield.ColLength != -1)
                                {
                                    var fieldLength = value.ToString().Length;
                                    if (fieldLength > dbCurrentfield.ColLength)
                                    {
                                        value = value.Substring(0, dbCurrentfield.ColLength ?? 0);
                                    }
                                }


                                if (currentCell.CellType != NPOI.SS.UserModel.CellType.Boolean)
                                {
                                    if (dbCurrentfield.ColName.ToLower() == "dateofbirth")
                                    {
                                        Boolean isValidValue = false;
                                        DateTime dateValue;

                                        if (!DateTime.TryParse(value, out dateValue))
                                        {
                                            value = "";
                                            isValidValue = false;
                                        }
                                        else
                                        {
                                            isValidValue = true;
                                        }

                                        currentPatient.GetType().GetProperty(field.Key).SetValue(currentPatient, value, null);
                                        invalidClient.RowNumber = i;
                                        invalidClient.ColumnName = dbCurrentfield.ColName;
                                        invalidClient.ColumnValue = unsavedValue;
                                        invalidClient.IsValid = isValidValue;
                                    }
                                    else
                                    {
                                        currentPatient.GetType().GetProperty(field.Key).SetValue(currentPatient, value, null);
                                        invalidClient.RowNumber = i;
                                        invalidClient.ColumnName = dbCurrentfield.ColName;
                                        invalidClient.ColumnValue = unsavedValue;
                                        invalidClient.IsValid = true;
                                    }
                                 
                                }
                                else
                                {
                                    // skip

                                    invalidClient.RowNumber = i;
                                    invalidClient.ColumnName = dbCurrentfield.ColName;
                                    invalidClient.ColumnValue = unsavedValue;
                                    invalidClient.IsValid = false;

                                }
                            }
                        }
                        else
                        {
                            invalidClient.RowNumber = i;
                            invalidClient.ColumnName = dbCurrentfield.ColName;
                            invalidClient.ColumnValue = "";
                            invalidClient.IsValid = true;
                        }
                        InvalidClientsDetailList.Add(invalidClient);
                    }
                    catch (Exception ex)
                    {
                        new Common().LogExceptionToDb(ex);
                    }

                }
                currentPatient.DataCameFrom = dataCameFrom;
                currentPatient.ImportNotes = importNotes;
                currentPatient.ImportDate = importDate;


                if (CheckObjectHasValue(currentPatient))
                {
                    allowedPatientList.Add(currentPatient);
                }
            }
            int savedCount=0;
            #endregion
            #region Save allowed potentialPatients to DB

            foreach (var patient in allowedPatientList)
            {

                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri(WebApiKey);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    var responseTask = client.PostAsJsonAsync("/api/PatientMain/savePotentialclient", patient);
                    responseTask.Wait();

                    var result = responseTask.Result;
                    if (result.IsSuccessStatusCode)
                    {
                        var data = result.Content.ReadAsStringAsync().Result;
                        if (data == "1")
                        {
                            savedCount++;
                        }
                    }
                }
            }
            #endregion
            TempData["InvalidClientsDetailList"] = InvalidClientsDetailList;
            return savedCount;
        }
        public int DataImportExcelNew(XSSFWorkbook workbook, string fileName, Dictionary<string, string> dbFields, string dataCameFrom, string importNotes, DateTime importDate)
        {
            List<InvalidClientsDetail> InvalidClientsDetailList = new List<InvalidClientsDetail>();
            var sheet = workbook.GetSheetAt(0);
            if (sheet == null)
            {
                //no 'Potential Client Data' sheet
                return 0;
            }

            // formatter to get string data from any type of fields
            HSSFDataFormatter formatter = new HSSFDataFormatter();
            var headerRow = sheet.GetRow(0);
            if (IsRowEmpty(headerRow))
            {
                //inconsistent structure of the file
                return 0;
            }
            Dictionary<string, int> columnNames = new Dictionary<string, int>();
            for (int i = headerRow.FirstCellNum; i < headerRow.LastCellNum; i++)
            {
                string value = formatter.FormatCellValue(headerRow.GetCell(i)).Trim();
                if (!columnNames.ContainsKey(value))
                    columnNames.Add(value, i);
            }



            var databaseColumns = new List<PotientialTableInfoBO>();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/getpotentialclienttableinfo");
                var result = responseTask.Result;

                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<List<PotientialTableInfoBO>>();
                    readTask.Wait();
                    databaseColumns = readTask.Result;
                }

            }
            List<PotientialPatientBO> allowedPatientList = new List<PotientialPatientBO>();
            //check for necessary columns
            //if (!IsAllNecessaryColumnsExist(dbFields, necessaryColumnsForPotentialClient))
            //{
            //    //inconsistent structure of the file
            //    return 0;
            //}
            #region Check every row in import file
            //loop for all rows
            for (int i = sheet.FirstRowNum + 1; i <= sheet.LastRowNum; i++)
            {
                var currentRow = sheet.GetRow(i);
                if (IsRowEmpty(currentRow))
                {
                    // skip empty rows
                    continue;
                }
                PotientialPatientBO currentPatient = new PotientialPatientBO();

                foreach (var field in dbFields)
                {
                    InvalidClientsDetail invalidClient = new InvalidClientsDetail();
                    if (field.Value == null)
                    {
                        continue;
                    }
                    var dbCurrentfield = databaseColumns.Where(x => x.ColName.ToLower() == field.Key.ToLower()).FirstOrDefault();

                    var cellNo = columnNames.Where(x => x.Key.ToLower() == field.Value.ToLower()).Select(x => x.Value).FirstOrDefault();
                    string value;
                    var currentCell = currentRow.GetCell(cellNo);
                    var unsavedValue = formatter.FormatCellValue(currentCell).Trim();
                    value = formatter.FormatCellValue(currentCell).Trim();
                    if (currentCell != null && currentCell.CellType == NPOI.SS.UserModel.CellType.Numeric)
                    {
                        if (HSSFDateUtil.IsCellDateFormatted(currentCell))
                        {
                            value = currentCell.DateCellValue.ToShortDateString();
                        }
                    }

                    if (dbCurrentfield.ColName.ToLower() == "gender")
                    {
                        switch (value.ToLower())
                        {
                            case "male":
                                value = "Male";
                                break;
                            case "female":
                                value = "Female";
                                break;
                            default:
                                currentPatient.OtherGender = value;
                                value = "Other";
                                break;
                        }

                    }
                    else if (dbCurrentfield.ColName.ToLower() == "raceethnicity")
                    {

                        string[] options = value.Split(',');
                        var raceEthnicity = "";
                        var otherRace = "";
                        foreach (var race in options)
                        {
                            switch (race.ToLower().Trim())
                            {
                                case "black/african/african-american":
                                    raceEthnicity += "Black/African/African-American,";
                                    break;
                                case "latino/hispanic":
                                    raceEthnicity += "Latino/Hispanic,";
                                    break;
                                case "white/caucasian":
                                    raceEthnicity += "White/Caucasian,";
                                    break;
                                case "asian":
                                    raceEthnicity += "Asian,";
                                    break;
                                case "native hawaiian/pacific islander":
                                    raceEthnicity += "Native Hawaiian/Pacific Islander,";
                                    break;
                                case "native american/alaskan":
                                    raceEthnicity += "Native American/Alaskan,";
                                    break;
                                default:
                                    otherRace += race;
                                    break;
                            }
                        }
                        if (otherRace != "")
                        {
                            raceEthnicity += "Other";
                        }
                        value = raceEthnicity;
                        currentPatient.OtherRace = otherRace;
                    }
                    else if (dbCurrentfield.ColName.ToLower() == "ispermanentaddress" || dbCurrentfield.ColName.ToLower() == "everbeensmoker"
                        || dbCurrentfield.ColName.ToLower() == "quitsmoking" || dbCurrentfield.ColName.ToLower() == "evermemberofusarmedforces")
                    {
                        switch (value.ToLower())
                        {
                            case "yes":
                            case "1":
                                value = "1";
                                break;
                            case "no":
                            case "0":
                                value = "0";
                                break;
                            default:
                                break;
                        }
                    }
                    else if (dbCurrentfield.ColName.ToLower() == "waytocontact")
                    {
                        switch (value.ToLower())
                        {
                            case "home":
                                value = "Home";
                                break;
                            case "cell":
                                value = "Cell";
                                break;
                            case "email":
                                value = "Email";
                                break;
                            default:
                                currentPatient.OtherContact = value;
                                value = "Other";
                                break;
                        }
                    }
                    else if (dbCurrentfield.ColName.ToLower() == "maritalstatus")
                    {
                        switch (value.ToLower())
                        {
                            case "married":
                                value = "Married";
                                break;
                            case "single":
                                value = "Single";
                                break;
                            case "domestic partnership":
                                value = "Domestic Partnership";
                                break;
                            case "divorced":
                                value = "Divorced";
                                break;
                            case "separated":
                                value = "Separated";
                                break;
                            case "widowed":
                                value = "Widowed";
                                break;
                            default:
                                currentPatient.OtherMaritalStatus = value;
                                value = "Other";
                                break;
                        }
                    }
                    else if (dbCurrentfield.ColName.ToLower() == "languagesspeak")
                    {
                        string[] options = value.Split(',');
                        var language = "";
                        var OtherLanguage = "";
                        foreach (var lang in options)
                        {
                            switch (lang.ToLower())
                            {
                                case "english":
                                    language += "English,";
                                    break;
                                case "spanish":
                                    language += "Spanish,";
                                    break;
                                case "arabic":
                                    language += "Arabic,";
                                    break;
                                case "amharic":
                                    language += "Amharic,";
                                    break;
                                case "tigrinya":
                                    language += "Tigrinya,";
                                    break;
                                default:
                                    OtherLanguage += lang;
                                    break;
                            }
                        }
                        if (OtherLanguage != "")
                        {
                            language += "Other";
                        }
                        value = language;
                        currentPatient.OtherLanguageSpeak = OtherLanguage;

                    }
                    else if (dbCurrentfield.ColName.ToLower() == "preferredpronouns")
                    {
                        switch (value.ToLower())
                        {
                            case "she/her":
                            case "she":
                            case "her":
                                value = "She/Her";
                                break;
                            case "he/him":
                            case "he":
                            case "him":
                                value = "He/Him";
                                break;
                            case "they/them":
                            case "they":
                            case "them":
                                value = "They/Them";
                                break;
                            default:
                                currentPatient.OtherPronouns = value;
                                value = "Other";
                                break;
                        }
                    }
                    else if (dbCurrentfield.ColName.ToLower() == "thinkyourselfas")
                    {
                        switch (value.ToLower())
                        {
                            case "straight or heterosexual":
                            case "straight":
                            case "heterosexual":
                                value = "Straight or Heterosexual";
                                break;
                            case "lesbian":
                                value = "Lesbian";
                                break;
                            case "gay":
                                value = "Gay";
                                break;
                            case "bisexual":
                                value = "Bisexual";
                                break;
                            case "queer":
                                value = "Queer";
                                break;
                            case "questioning":
                                value = "Questioning";
                                break;
                            default:
                                currentPatient.OtherThinkYourselfAs = value;
                                value = "Unspecified/Other";
                                break;
                        }
                    }
                    else if (dbCurrentfield.ColName.ToLower() == "patientchildrensages")
                    {
                        char[] stringSeparators = new char[] { ',', ':', '-', '/' };
                        string resul = "";
                        string[] patientages = value.Split(',');
                        var childrencounter = 0;
                        foreach (string pat in patientages)
                        {
                            var age = pat.Split(stringSeparators);
                            if (age.Length > 1)
                            {
                                resul += age[0] + ":" + age[1] + ",";
                                childrencounter++;
                            }
                            
                            
                        }
                        value = resul;
                        currentPatient.PatientChildren = childrencounter;
                    }
                    try
                    {
                        if (currentCell != null)
                        {
                            if (dbCurrentfield.ColType == "bit")
                            {
                                if (value == "1")
                                {
                                    currentPatient.GetType().GetProperty(field.Key).SetValue(currentPatient, true, null);
                                    invalidClient.RowNumber = i;
                                    invalidClient.ColumnName = dbCurrentfield.ColName;
                                    invalidClient.ColumnValue = unsavedValue;
                                    invalidClient.IsValid = true;
                                }
                                else if (value == "0")
                                {
                                    currentPatient.GetType().GetProperty(field.Key).SetValue(currentPatient, false, null);
                                    invalidClient.RowNumber = i;
                                    invalidClient.ColumnName = dbCurrentfield.ColName;
                                    invalidClient.ColumnValue = unsavedValue;
                                    invalidClient.IsValid = true;
                                }
                                else
                                {
                                    invalidClient.RowNumber = i;
                                    invalidClient.ColumnName = dbCurrentfield.ColName;
                                    invalidClient.ColumnValue = unsavedValue;
                                    invalidClient.IsValid = false;
                                }


                            }
                            else if (dbCurrentfield.ColType == "int")
                            {
                                if (dbCurrentfield.ColLength != null && dbCurrentfield.ColLength != -1)
                                {
                                    var fieldLength = value.ToString().Length;
                                    if (fieldLength > dbCurrentfield.ColLength)
                                    {
                                        value = value.Substring(0, dbCurrentfield.ColLength ?? 0);
                                    }
                                }
                                int intval;
                                if (Int32.TryParse(value, out intval))
                                {
                                    currentPatient.GetType().GetProperty(field.Key).SetValue(currentPatient, intval, null);
                                    invalidClient.RowNumber = i;
                                    invalidClient.ColumnName = dbCurrentfield.ColName;
                                    invalidClient.ColumnValue = unsavedValue;
                                    invalidClient.IsValid = true;
                                }
                                else
                                {
                                    // skip 

                                    invalidClient.RowNumber = i;
                                    invalidClient.ColumnName = dbCurrentfield.ColName;
                                    invalidClient.ColumnValue = unsavedValue;
                                    invalidClient.IsValid = false;

                                }
                            }
                            else if (dbCurrentfield.ColType == "nvarchar")
                            {
                                if (dbCurrentfield.ColLength != null && dbCurrentfield.ColLength != -1)
                                {
                                    var fieldLength = value.ToString().Length;
                                    if (fieldLength > dbCurrentfield.ColLength)
                                    {
                                        value = value.Substring(0, dbCurrentfield.ColLength ?? 0);
                                    }
                                }


                                if (currentCell.CellType != NPOI.SS.UserModel.CellType.Boolean)
                                {
                                    if (dbCurrentfield.ColName.ToLower() == "dateofbirth")
                                    {
                                        Boolean isValidValue = false;
                                        DateTime dateValue;

                                        if (!DateTime.TryParse(value, out dateValue))
                                        {
                                            value = "";
                                            isValidValue = false;
                                        }
                                        else
                                        {
                                            isValidValue = true;
                                        }

                                        currentPatient.GetType().GetProperty(field.Key).SetValue(currentPatient, value, null);
                                        invalidClient.RowNumber = i;
                                        invalidClient.ColumnName = dbCurrentfield.ColName;
                                        invalidClient.ColumnValue = unsavedValue;
                                        invalidClient.IsValid = isValidValue;
                                    }
                                    else
                                    {
                                        currentPatient.GetType().GetProperty(field.Key).SetValue(currentPatient, value, null);
                                        invalidClient.RowNumber = i;
                                        invalidClient.ColumnName = dbCurrentfield.ColName;
                                        invalidClient.ColumnValue = unsavedValue;
                                        invalidClient.IsValid = true;
                                    }

                                }
                                else
                                {
                                    // skip

                                    invalidClient.RowNumber = i;
                                    invalidClient.ColumnName = dbCurrentfield.ColName;
                                    invalidClient.ColumnValue = unsavedValue;
                                    invalidClient.IsValid = false;

                                }
                            }
                        }
                        else
                        {
                            invalidClient.RowNumber = i;
                            invalidClient.ColumnName = dbCurrentfield.ColName;
                            invalidClient.ColumnValue = "";
                            invalidClient.IsValid = true;
                        }
                        InvalidClientsDetailList.Add(invalidClient);
                    }
                    catch (Exception ex)
                    {
                        new Common().LogExceptionToDb(ex);
                    }

                }
                currentPatient.DataCameFrom = dataCameFrom;
                currentPatient.ImportNotes = importNotes;
                currentPatient.ImportDate = importDate;
                if (CheckObjectHasValue(currentPatient))
                {
                    allowedPatientList.Add(currentPatient);
                }
              
            }
            int savedCount = 0;
            #endregion
            #region Save allowed potentialPatients to DB

            foreach (var patient in allowedPatientList)
            {

                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri(WebApiKey);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    var responseTask = client.PostAsJsonAsync("/api/PatientMain/savePotentialclient", patient);
                    responseTask.Wait();

                    var result = responseTask.Result;
                    if (result.IsSuccessStatusCode)
                    {
                        var data = result.Content.ReadAsStringAsync().Result;
                        if (data == "1")
                        {
                            savedCount++;
                        }
                    }
                }
            }
            #endregion
            TempData["InvalidClientsDetailList"] = InvalidClientsDetailList;
            return savedCount;
        }
        private bool IsAllNecessaryColumnsExist(Dictionary<string, string> columns, string[] necessaryColumns)
        {
            bool result = true;

            foreach (var item in necessaryColumns)
            {
                if (!columns.ContainsKey(item))
                    result = false;
            }

            return result;
        }

        [HttpPost]
        public ActionResult GenerateSampleExcelFile()
        {
            var databaseColumns = new List<PotientialTableInfoBO>();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/getpotentialclienttableinfo");
                var result = responseTask.Result;

                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<List<PotientialTableInfoBO>>();
                    readTask.Wait();
                    databaseColumns = readTask.Result;
                    databaseColumns = databaseColumns.Where(x => x.ColName.ToLower() != "othergender" && x.ColName.ToLower() != "otherrace"
                     && x.ColName.ToLower() != "othercontact" && x.ColName.ToLower() != "othermaritalstatus" && x.ColName.ToLower() != "otherlanguagespeak"
                     && x.ColName.ToLower() != "otherpronouns" && x.ColName.ToLower() != "otherthinkyourselfas"
                     && x.ColName.ToLower() != "datacamefrom" && x.ColName.ToLower() != "importnotes" && x.ColName.ToLower() != "importdate").ToList();
                }

            }
            foreach (var item in databaseColumns)
            {
                switch (item.ColName)
                {
                    case "FirstName":
                        item.ColName = "First Name";
                        break;
                    case "LastName":
                        item.ColName = "Last Name";
                        break;
                    case "MiddleName":
                        item.ColName = "Middle Name";
                        break;
                    case "Gender":
                        item.ColName = "Which gender do you identify as";
                        break;
                    case "DateOfBirth":
                        item.ColName = "Date Of Birth";
                        break;
                    case "SocialSecurityNumber":
                        item.ColName = "Social Security Number";
                        break;
                    case "RaceEthnicity":
                        item.ColName = "Race/Ethnicity";
                        break;
                    case "IsPermanentAddress":
                        item.ColName = "Is Permanent Address";
                        break;
                    case "PermanentAddress":
                        item.ColName = "Permanent Address";
                        break;
                    case "EmailAddress":
                        item.ColName = "Email Address";
                        break;
                    case "HomePhone":
                        item.ColName = "Home Phone";
                        break;
                    case "CellPhone":
                        item.ColName = "Cell Phone";
                        break;
                    case "WayToContact":
                        item.ColName = "Best way to contact you";
                        break;
                    case "PatientChildren":
                        item.ColName = "Patient Children";
                        break;
                    case "PatientChildrensAges":
                        item.ColName = "Patient Childrens Ages";
                        break;
                    case "ChildrenUnder18":
                        item.ColName = "Children Under 18";
                        break;
                    case "Adults18to65":
                        item.ColName = "Adults 18-65";
                        break;
                    case "Adults65Plus":
                        item.ColName = "Adults 65+";
                        break;
                    case "PreferredPharmacyName":
                        item.ColName = "Preferred Pharmacy Name";
                        break;
                    case "PreferredPharmacyLocation":
                        item.ColName = "Preferred Pharmacy Location";
                        break;
                    case "EverMemberOfUSArmedForces":
                        item.ColName = "Are you now or were you ever a member of the U.S. Armed Forces?";
                        break;
                    case "MaritalStatus":
                        item.ColName = "Marital Status";
                        break;
                    case "LanguagesSpeak":
                        item.ColName = "Which languages do you speak comfortably?";
                        break;
                    case "EverBeenSmoker":
                        item.ColName = "Have you ever been a smoker";
                        break;
                    case "QuitSmoking":
                        item.ColName = "Have you Quit?";
                        break;
                    case "SmokingQuitDate":
                        item.ColName = "Quit Date";
                        break;
                    case "PreferredPronouns":
                        item.ColName = "What are your preferred pronouns";
                        break;
                    case "ThinkYourselfAs":
                        item.ColName = "Do you think of yourself as";
                        break;
                    case "EmergencyContact1Name":
                        item.ColName = "Emergency Contact1 Name";
                        break;
                    case "EmergencyContact1Address":
                        item.ColName = "Emergency Contact1 Address";
                        break;
                    case "EmergencyContact1EmailAddress":
                        item.ColName = "Emergency Contact1 Email Address";
                        break;
                    case "EmergencyContact1Relationship":
                        item.ColName = "Emergency Contact1 Relationship";
                        break;
                    case "EmergencyContact2Name":
                        item.ColName = "Emergency Contact2 Name";
                        break;
                    case "EmergencyContact2Address":
                        item.ColName = "Emergency Contact2 Address";
                        break;
                    case "EmergencyContact2EmailAddress":
                        item.ColName = "Emergency Contact2 Email Address";
                        break;
                    case "EmergencyContact2Relationship":
                        item.ColName = "Emergency Contact2 Relationship";
                        break;
                    case "LastTimeYouSmoked":
                        item.ColName = "When was the last time you smoked?";
                        break;
                    case "EmergencyContact1City":
                        item.ColName = "Emergency Contact1 City";
                        break;
                    case "EmergencyContact1State":
                        item.ColName = "Emergency Contact1 State";
                        break;
                    case "EmergencyContact1Zip":
                        item.ColName = "Emergency Contact1 Zip";
                        break;
                    case "EmergencyContact2City":
                        item.ColName = "Emergency Contact2 City";
                        break;
                    case "EmergencyContact2State":
                        item.ColName = "Emergency Contact2 State";
                        break;
                    case "EmergencyContact2Zip":
                        item.ColName = "Emergency Contact2 Zip";
                        break;
                    case "LocalMedicalRecordNumber":
                        item.ColName = "Local Medical Record Number";
                        break;
                    case "AmdMedicalRecordNumber":
                        item.ColName = "Amd Medical Record Number";
                        break;
                    default:
                        break;

                }
            }

            using (MemoryStream output = new MemoryStream())
            {
                var workbook = new XSSFWorkbook();
                var sheet = workbook.CreateSheet("Sample File Export");
                var rownumber = 0;

                var headerRow = sheet.CreateRow(rownumber);
                for (var i = 0; i < databaseColumns.Count; i++)
                {
                    headerRow.CreateCell(i).SetCellValue(databaseColumns[i].ColName);
                    sheet.SetColumnWidth(i, 6000);
                }


                workbook.Write(output);

                return File(output.ToArray(),   //The binary data of the XLS file
                     "application/vnd.ms-excel", //MIME type of Excel files
                    "Sample.xlsx");     //Suggested file name in the "Save as" dialog which will be displayed to the end user

            }
        }
        public ActionResult GetDuplicatePatientsDetails(long patientId)
        {
            List<DuplicatePatientsInfo> duplicates = new List<DuplicatePatientsInfo>();
            List<DuplicatePatientsInfo> duplicateresult = new List<DuplicatePatientsInfo>();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/GetDuplicatePatientDetails?patientId=" + patientId);
                var result = responseTask.Result;

                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<List<DuplicatePatientsInfo>>();
                    readTask.Wait();
                    duplicates = readTask.Result;
                }

            }
            foreach (var duplicate in duplicates)
            {
                duplicate.PatientID = duplicate.PatientID;
                duplicate.DateOfBirth = duplicates.Where(x => x.PatientID == duplicate.PatientID && x.DateOfBirth != null).Select(x => x.DateOfBirth).FirstOrDefault();
                duplicate.CellPhone = duplicates.Where(x => x.PatientID == duplicate.PatientID && x.CellPhone != null).Select(x => x.CellPhone).FirstOrDefault();
                duplicate.HomePhone = duplicates.Where(x => x.PatientID == duplicate.PatientID && x.HomePhone != null).Select(x => x.HomePhone).FirstOrDefault();
                duplicate.EmailAddress = duplicates.Where(x => x.PatientID == duplicate.PatientID && x.EmailAddress != null).Select(x => x.EmailAddress).FirstOrDefault();
                duplicate.SocialSecurityNumber = duplicates.Where(x => x.PatientID == duplicate.PatientID && x.SocialSecurityNumber != null).Select(x => x.SocialSecurityNumber).FirstOrDefault();
                if (!duplicateresult.Any(x => x.PatientID == duplicate.PatientID))
                {
                    duplicateresult.Add(duplicate);
                }

            }

            return Json(duplicateresult, JsonRequestBehavior.AllowGet);
        }
        bool CheckObjectHasValue(object obj)
        {
            foreach (PropertyInfo pi in obj.GetType().GetProperties())
            {
                if (pi.PropertyType == typeof(string))
                {
                    string value = (string)pi.GetValue(obj);
                    if (!string.IsNullOrEmpty(value) && pi.Name.ToLower() != "datacamefrom" && pi.Name.ToLower() != "importnotes")
                    {
                        return true;
                    }
                }
            }
            return false;
        }
    }
}


