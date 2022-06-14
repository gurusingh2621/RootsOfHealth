using RootsOfHealth.CustomFilters;
using RootsOfHealth.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;
namespace RootsOfHealth.Controllers
{
    [SessionTimeout]
    [Authorize]
    [CustomErrorFilter]
    public class CarePlanController : Controller
    {
        string WebApiKey = WebConfigurationManager.AppSettings["WebApiForBackend"];
        string CarePlanUploadPath= WebConfigurationManager.AppSettings["CarePlanUploadPath"];
        // GET: CarePlan
        #region[CarePlanTemplate]     
        public JsonResult SaveFormTemplate(string htmlTemplate, CarePlantemplateBO Model,string ProgramName)
        {
            string TemplateName = "";
            string dataFile = "";
            string path = "";
            if (Model.ProgramID == 0)
            { 
                path= "~/App_Data/Templates/CarePlansTemplate/BaseTemplate";
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(Server.MapPath(path));
                }
                ProgramName = "BaseTemplate";
                TemplateName =Guid.NewGuid().ToString() + ".html";
                dataFile = Server.MapPath(path + "/" + TemplateName);             
                System.IO.File.WriteAllText(@dataFile, htmlTemplate);
                Model.TemplatePath = "BaseTemplate/" + TemplateName;
                Model.TemplateTable = "tbl_" + ProgramName;
                Model.IsBaseTemplate = true;
            }
            else
            {
                path = "~/App_Data/Templates/CarePlansTemplate/" + Model.ProgramID;
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(Server.MapPath(path));
                }
                ProgramName = ProgramName.Replace(" ", "");
                TemplateName = Guid.NewGuid().ToString() + ".html";
                dataFile = Server.MapPath(path + "/" + TemplateName);
                System.IO.File.WriteAllText(@dataFile, htmlTemplate);
                Model.TemplatePath = Model.ProgramID + "/" + TemplateName;
                if (Model.TemplateID<=0)
                {Model.TemplateTable = "tbl_" + ProgramName + "_CarePlan"; }
            }
            
            
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
                            tablename= Model.TemplateTable,
                            TemplateName=Model.TemplatePath
                        });
                    }
                    
                }
            }
                    return Json("");
        }           
        public ActionResult List()
        {
            return View();
        }
        [HttpPost]
        public ActionResult GetCarePlanTemplateList()
        {
            string draw = Request.Form.GetValues("draw")[0];
            string sortBy = Request.Form.GetValues("order[0][column]")[0];
            string sortDir = Request.Form.GetValues("order[0][dir]")[0];
            int skipRecords = Convert.ToInt32(Request.Form.GetValues("start")[0]);

            int pageSize = Convert.ToInt32(Request.Form.GetValues("length")[0]);
            var searchTerm = Request.Form.GetValues("search[value]").FirstOrDefault();

            List<CarePlanTemplateListInfoBO> carePlanTemplateList = new List<CarePlanTemplateListInfoBO>();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/gettemplatelist?skipRecords=" + skipRecords + "&pageSize=" + pageSize +  "&sortby=" + sortBy + "&sortDir=" + sortDir + "&search=" + searchTerm);
                var result = responseTask.Result;

                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<List<CarePlanTemplateListInfoBO>>();
                    readTask.Wait();
                    carePlanTemplateList = readTask.Result;
                }

            }
            var TotalCount = 0;
            if (carePlanTemplateList.Count > 0)
            {
                TotalCount = carePlanTemplateList[0].TotalCount ?? 0;
            }
            return Json(new
            {
                draw = Convert.ToInt32(draw),
                recordsTotal = TotalCount,
                recordsFiltered = TotalCount,
                data = carePlanTemplateList
            });
        }
        [HttpPost]
        public JsonResult GetTemplateData(CarePlantemplateBO Model)
        {
            Model.TemplateName= Model.TemplateName.TrimEnd();
            return Json(new
            {
                redirectUrl = Url.Action("ModifyTemplate", "CarePlan",new {Model.TemplateID,Model.TemplateName,Model.ProgramID,Model.IsBaseTemplate,Model.IsModify,Model.ProgramName,Model.TemplateTable }),
                isRedirect = true
            });
        }
        [Authorize(Roles = "navigator,supervisor")]
        public ActionResult ModifyTemplate(CarePlantemplateBO data)
        {
            ViewBag.ProgramId = data.ProgramID;
            ViewBag.ProgramName = data.ProgramName;
            ViewBag.TemplateId = data.TemplateID;
            ViewBag.IsModify = data.IsModify;
            ViewBag.TemplateName = data.TemplateName;
            ViewBag.IsBaseTemplate = data.IsBaseTemplate;
            ViewBag.TemplateTable = data.TemplateTable;
            return View();
        }

        [HttpGet]
        public JsonResult GetFormHtmlById(int Id)
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
            CarePlantemplateBO data = new CarePlantemplateBO();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/GetCarePlanTemplateByID?ID=" + Id);
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<CarePlantemplateBO>();
                    readTask.Wait();
                    data = readTask.Result;
                }
                else //web api sent error response 
                {
                    //log response status here..


                }
            }
            PathName = data.TemplatePath;
            if (PathName != "" && PathName!= null)
            {
                var gethtml = System.IO.File.ReadAllText(Server.MapPath("~/App_Data/Templates/CarePlansTemplate/" + PathName));
                var jsonResult = new
                {
                    html = gethtml,
                    IsActive=data.IsActive,
                    Isactivated = data.Isactivated
                };
                return Json(jsonResult, JsonRequestBehavior.AllowGet);
            }
            //var gethtml=   System.IO.File.ReadAllText(Server.MapPath("~/App_Data/data.html"));
            return Json(new
            {
                html ="",
                IsActive = 0,
                Isactivated=0
            }, JsonRequestBehavior.AllowGet);
        }
        [Authorize(Roles = "navigator,supervisor")]
        public ActionResult BaseTemplate(int templateid,bool Status)
        {
            ViewBag.TemplateId = templateid;
            ViewBag.Status = Status;
            return View();
        }
        #endregion

        #region[PatientCarePlan]
        [HttpGet]
        public JsonResult GetCarePlanTemplateByProgramId(int ProgramId)
        {
            if (ProgramId == 0)
            {
                return Json(new
                {
                    html = "",
                    tableName = "",
                    TemplateId = ""
                }, JsonRequestBehavior.AllowGet);
            }
            string PathName = string.Empty;
            CarePlantemplateBO data = new CarePlantemplateBO();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/getcareplantemplatebyprogramid?ProgramId=" + ProgramId);
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<CarePlantemplateBO>();
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
                var gethtml = System.IO.File.ReadAllText(Server.MapPath("~/App_Data/Templates/CarePlansTemplate/" + PathName));
                var jsonResult = new
                {
                    html = gethtml,
                    tableName=data.TemplateTable,
                    TemplateId = data.TemplateID
                };
                return Json(jsonResult, JsonRequestBehavior.AllowGet);
            }
            //var gethtml=   System.IO.File.ReadAllText(Server.MapPath("~/App_Data/data.html"));
            return Json(new
            {
                html = "",
                tableName="",
                TemplateId = ""

            }, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult GetCarePlanTemplateById(int TemplateId)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var responseTask = client.GetAsync("api/PatientMain/patientcareplantemplatebyid?TemplateId=" + TemplateId);
                responseTask.Wait();
                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var data = result.Content.ReadAsAsync<CarePlantemplateBO>();
                    if (data.Result != null && data.Result.TemplatePath != null)
                    {
                        var gethtml = System.IO.File.ReadAllText(Server.MapPath("~/App_Data/Templates/CarePlansTemplate/" + data.Result.TemplatePath));
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

            //var gethtml=   System.IO.File.ReadAllText(Server.MapPath("~/App_Data/data.html"));
            return Json("");
        }
        [HttpPost]
        public ActionResult UploadFiles()
        {         
            string path = Server.MapPath("~/"+ CarePlanUploadPath);
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            HttpFileCollectionBase files = Request.Files;           
            var filenames= Request["FileNames"];
            var savedfiles = Request["Files"];
            var controlid = Request["ControlId"];
            var carePlanId = Request["CarePlanId"];
            var patientId= Request["PatientId"];
            var IsBaseField= Convert.ToBoolean(Request["IsBaseField"]);
            string guidName = "";          
            List<string> FilesGuid = new List<string>();
            if (savedfiles.IndexOf(',') > 0)
            {
                var savedArr = savedfiles.Split(',');
                for(int i = 0; i < savedArr.Length; i++)
                {
                    FilesGuid.Add(savedArr[i]);
                }
            }else if (savedfiles.IndexOf('.') > 0)
            {
                FilesGuid.Add(savedfiles);
            }
            for (int i = 0; i < files.Count; i++)
            {
                HttpPostedFileBase file = files[i];
               guidName= Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                file.SaveAs(path + guidName);
                FilesGuid.Add(guidName);
            }
            using (var client = new HttpClient())
            {
                CareplanFileBO model = new CareplanFileBO()
                {
                    CareplanId = Convert.ToInt32(carePlanId),
                    ControlId = controlid,
                    Files = String.Join(",", FilesGuid),
                    FileNames= filenames,
                    PatientId= Convert.ToInt32(patientId)                    
                };
                client.BaseAddress = new Uri(WebApiKey);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var requestUrl = "";
                if (IsBaseField)
                {
                    requestUrl = "api/PatientMain/savebasecareplanfiles";
                }
                else
                {
                    requestUrl = "api/PatientMain/savecareplanfiles";
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
        [HttpPost]
        public ActionResult GetFiles(string files)
        {
            List<string> Paths = new List<string>();
            string path = "";
            var filesArray = files.Split(',');
            for(int i = 0; i < filesArray.Length; i++)
            {
             path=Path.Combine("/","Content/CarePlanUpload/" + filesArray[i]);
             Paths.Add(path);
            }           
            return Json(Paths);
        }
        #endregion

        public ActionResult Requests()
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var responseTask = client.GetAsync("api/PatientMain/isusercareplanapproval?userid=" + @Session["userid"].ToString());
                responseTask.Wait();
                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var data = result.Content.ReadAsAsync<bool>();
                    data.Wait();
                    var res = data.Result;
                    @Session["IsCarePlanApprover"] = res;
                    if (!res)
                    {
                      return  Content("you not have permission for that page");
                    }
                }
            };

            return View();
        }
    }
}