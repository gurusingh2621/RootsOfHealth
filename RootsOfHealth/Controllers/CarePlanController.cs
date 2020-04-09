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
{
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
            Model.TemplatePath = dataFile;
            Model.TemplateTable = TemplateName;
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
                    return Json(TemplateName);
                }
            }
                    return Json("");
        }
        [Authorize(Roles = "navigator,supervisor")]
        public ActionResult DynamicCareForm()
        {
            return View();
        }
    }
}