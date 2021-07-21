using RootsOfHealth.Commom;
using RootsOfHealth.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;

namespace RootsOfHealth.Controllers
{
    [Authorize]
    public class DashBoardController : Controller
    {
        string WebApiKey = WebConfigurationManager.AppSettings["WebApiForBackend"];

        // GET: DashBoard
        public ActionResult Index(int patientid=0)
        {
            
            ViewBag.PatientID = patientid;
            return View();
        }

        public ActionResult Display()
        {
            return View();
        }

        [HttpPost]
        public ActionResult GetPatientDetail(string PatientID)
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
                    var responseTask = client.GetAsync("/api/PatientMain/GetDetailOfPatient?patientid=" + PatientID);
                    

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

                        patientdetailobj.PatientMentalHealth.PHQ9 = patientdetailobj.PHQ9;
                         patientdetailobj.PatientProgram.ClinicOnly = patientdetailobj.ClinicOnly;
                        patientdetailobj.PatientProgram.DreamOnly = patientdetailobj.DreamOnly;
                        patientdetailobj.PatientProgram.OUOnly = patientdetailobj.OUOnly;
                        patientdetailobj.PatientProgram.PeraltaCollege = patientdetailobj.PeraltaCollege;


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

                objCommon.BindDropDowns(ref patientdetailobj);

                HttpCookie PatientIdCookie = new HttpCookie("patientid");
                PatientIdCookie.Value = patientdetailobj.PatientMain.PatientID.ToString();
                Response.Cookies.Add(PatientIdCookie);
                Response.Cookies["patientid"].Expires = DateTime.Now.AddDays(1);
                return PartialView("~/Views/Shared/Patient/_PatientDetail.cshtml", patientdetailobj);
            }
        

        [HttpGet]
        public ActionResult GetRecentPatients()
        {

           List<PatientMainBO> patientdetailobj = new List<PatientMainBO>();

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/GetRecentPatients?clinicid="+ Session["ClinicID"]);
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
        public ActionResult GetPatientPrograms(string PatientID)
        {
            Program programobj = new Program();

            List<PatientProgram> patientprograms = new List<PatientProgram> ();
            List<AvailableProgram> availablePrograms = new List<AvailableProgram>();

            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/GetPatientPrograms?patientid=" + PatientID);
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
                var responseTask = client.GetAsync("/api/PatientMain/GetPatientAvailablePrograms?PatientId=" + PatientID);
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
            @ViewBag.TotalProgramCounts =availablePrograms.Count + patientprograms.Count;


             return PartialView("~/Views/Shared/Patient/_AddPatientPrograms.cshtml", programobj);
           

        }

        [HttpPost]
        public ActionResult GetAMDProfile(PatientMainBO Patient)
        {

            List<AmdProfileBO> AmdModel = null;
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/getamdprofile?PatientId=" + Patient.PatientID);
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
    }
}