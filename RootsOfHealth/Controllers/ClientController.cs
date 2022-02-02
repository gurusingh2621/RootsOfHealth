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
 

namespace RootsOfHealth.Controllers
{
    public class ClientController : Controller
    {
        string WebApiKey = WebConfigurationManager.AppSettings["WebApiForBackend"];
        string ProgramUploadPath = WebConfigurationManager.AppSettings["ProgramUploadPath"];
        // GET: Client
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ClientsFormList()
        {
            return View();
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


            var CombineAMDAndPatient = Tuple.Create<AmdProfileBO, PatientMainBO>(AmdModel[0], Patient);
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
                var responseTask = client.GetAsync("api/PatientMain/GetClientFormChildMenu?ClientFormID=" + ClientFormID+"&&patientID="+patientID);
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
        public ActionResult GetFormLogHistory(int formId,int clientid,bool isClientForm)
        {

            var LogList = new List<FormLogHistoryBO>();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/getClientHistoryLog?clientId=" + clientid + "&&formid="+ formId+ "&&isClientForm=" + isClientForm);
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
                       

                        excelReader = ExcelReaderFactory.CreateOpenXmlReader(stream);
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
                                       .Select(t => new {
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
                    }

                }

            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json("Upload failed");
            }
            
            return Json(new {
                filecolumns = columnNames,
                databaseColumns = databaseColumns

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
        public ActionResult ExportSharedForms(FormCollection form)
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

                   

                    return File(output.ToArray(),   //The binary data of the XLS file
                        "application/vnd.ms-excel", //MIME type of Excel files
                        "FormSharing.xls");     //Suggested file name in the "Save as" dialog which will be displayed to the end user




                }
            }
           
        }

       

  }

    
