using RootsOfHealth.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;
namespace RootsOfHealth.Controllers
{    [Authorize]
    public class CarePlanController : Controller
    {
        string WebApiKey = WebConfigurationManager.AppSettings["WebApi"];
        // GET: CarePlan
       [Authorize(Roles = "navigator,supervisor")]
        public ActionResult CreateCareForm()
        {
            return View();
        }
        public JsonResult SaveFormTemplate(string htmlTemplate, CarePlantemplateBO Model,string ProgramName)
        {
            string TemplateName = ProgramName + "_CarePlan" + DateTime.Now.ToString("dd_MM_yyyy_hh_mm_ss");
            var dataFile = Server.MapPath("~/App_Data/"+ TemplateName + ".html");
            System.IO.File.WriteAllText(@dataFile, htmlTemplate);
            Model.TemplatePath = TemplateName;
            Model.TemplateTable ="tbl_"+ProgramName+ "_CarePlan";
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var responseTask = client.PostAsJsonAsync("api/PatientMain/savecareplantemplate", Model);
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
                        return Json(new {
                            id=data,
                            tablename= Model.TemplateTable
                        });
                    }
                    
                }
            }
                    return Json("");
        }
        public JsonResult SaveFormDraftTemplate(string htmlTemplate, CarePlantemplateBO Model, string ProgramName)
        {
            string TemplateName = ProgramName + "_CarePlan" + DateTime.Now.ToString("dd_MM_yyyy_hh_mm_ss");
            var dataFile = Server.MapPath("~/App_Data/" + TemplateName + ".html");
            System.IO.File.WriteAllText(@dataFile, htmlTemplate);
            Model.TemplatePath = TemplateName;
            Model.TemplateTable = "tbl_" + ProgramName + "_CarePlan";
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var responseTask = client.PostAsJsonAsync("api/PatientMain/savecareplandrafttemplate", Model);
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
                            tablename = Model.TemplateTable
                        });
                    }

                }
            }
            return Json("");
        }
        [Authorize(Roles = "navigator,supervisor")]
        public ActionResult DynamicCareForm()
        {
            return View();
        }
        public ActionResult List()
        {
            return View();
        }
        public ActionResult ModifyTemplate(int TemplateId,int ProgramId,string Template=null)
        {
            string ProgramName = "";
            switch (ProgramId)
            {
                case 1:
                    ProgramName = "Clinic";
                    break;
                case 2:
                    ProgramName = "Dream";
                    break;
                case 3:
                    ProgramName = "OU";
                    break;
                case 4:
                    ProgramName = "Peralta College";
                    break;

            }
            ViewBag.ProgramId = ProgramId;
            ViewBag.ProgramName = ProgramName;
            ViewBag.TemplateId = TemplateId;
            ViewBag.TemplatePath = Template;
            return View();
        }

        [HttpGet]
        public JsonResult GetFormHtmlByPath(string PathName)
        {
            if (PathName != "")
            {
                var gethtml = System.IO.File.ReadAllText(Server.MapPath("~/App_Data/" + PathName + ".html"));
                var jsonResult = new
                {
                    html = gethtml,
                };
                return Json(jsonResult, JsonRequestBehavior.AllowGet);
            }
            //var gethtml=   System.IO.File.ReadAllText(Server.MapPath("~/App_Data/data.html"));
            return Json("", JsonRequestBehavior.AllowGet);
        }
    }
}