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
    [Authorize]
    public class ProgramController : Controller
    {

         string WebApiKey = WebConfigurationManager.AppSettings["WebApi"];
        string ProgramUploadPath = WebConfigurationManager.AppSettings["ProgramUploadPath"];

        // GET: Program
        public ActionResult List()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetProgramTemplateById(int TemplateId)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var responseTask = client.GetAsync("api/PatientMain/patientprogramtemplatebyid?TemplateId=" + TemplateId);
                responseTask.Wait();
                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var data = result.Content.ReadAsAsync<ProgramtemplateBO>();
                    if (data.Result != null && data.Result.TemplatePath != null)
                    {
                        var gethtml = System.IO.File.ReadAllText(Server.MapPath("~/App_Data/Templates/ProgramsTemplate/" + data.Result.TemplatePath));
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
        public JsonResult GetProgramTemplateData(ProgramtemplateBO Model)
        {
            Model.ProgramName = Model.ProgramName.TrimEnd();
            return Json(new
            {
                redirectUrl = Url.Action("ModifyProgramTemplate", "Program", new { Model.TemplateID, Model.ProgramName, Model.IsBaseTemplate, Model.IsModify, Model.TemplateTable, Model.ProgramID,Model.TemplatePath}),
                isRedirect = true
            });
        }


        [Authorize(Roles = "navigator,supervisor")]
        public ActionResult ModifyProgramTemplate(ProgramtemplateBO data)
         {
            ViewBag.TemplateId = data.TemplateID;
            ViewBag.IsModify = data.IsModify;
            ViewBag.TemplateName = data.ProgramName;
            ViewBag.IsBaseTemplate = data.IsBaseTemplate;
            ViewBag.IsBaseTemplate = data.IsBaseTemplate;
            ViewBag.TemplateTable = data.TemplateTable;
            ViewBag.ProgramID = data.ProgramID;
            ViewBag.TemplatePath = data.TemplatePath;
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
            ProgramtemplateBO data = new ProgramtemplateBO();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/GetProgramTemplateByID?ID=" + Id);
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<ProgramtemplateBO>();
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
                var gethtml = System.IO.File.ReadAllText(Server.MapPath("~/App_Data/Templates/ProgramsTemplate/" + PathName));
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

        public JsonResult SaveFormTemplate( ProgramtemplateBO Model,string htmlTemplate=null,string TemplatePath=null)
        {
            string TemplateName = "";
            string dataFile = "";
            string path = "";
            if (Model.IsBaseTemplate)
            {
                Model.ProgramName = "BaseProgramTemplate";
                TemplateName = Guid.NewGuid().ToString() + ".html";

                path = "~/App_Data/Templates/ProgramsTemplate/BaseTemplate";
                 if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(Server.MapPath(path));
                }
               
                dataFile = Server.MapPath(path + "/" + TemplateName);
                System.IO.File.WriteAllText(@dataFile, htmlTemplate);
                Model.TemplatePath =  "BaseTemplate/" + TemplateName;
                Model.TemplateTable = "tbl_" + Model.ProgramName;
                Model.IsBaseTemplate = true;
            }
            else
            {
                
                if (htmlTemplate != null) {
                    path = "~/App_Data/Templates/ProgramsTemplate/" + Model.ProgramID;
                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(Server.MapPath(path));
                    }
                TemplateName = Guid.NewGuid().ToString() + ".html";
                dataFile = Server.MapPath(path + "/" + TemplateName);
                System.IO.File.WriteAllText(@dataFile, htmlTemplate);
                Model.TemplatePath = Model.ProgramID + "/" + TemplateName;
                }
                if(TemplatePath!=null && htmlTemplate == null)
                {
                    Model.TemplatePath = TemplatePath;
                }
           
               
                if (!Model.IsModify)
                {
                    Model.TemplateTable = "tbl_" + Model.ProgramName.Replace(" ", "") + "_Program";
                }
             
            }
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var responseTask = client.PostAsJsonAsync("api/PatientMain/saveprogramtemplate", Model);
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


        [Authorize(Roles = "navigator,supervisor")]
        public ActionResult ProgramBaseTemplate(int templateid, bool Status)
        {
            ViewBag.TemplateId = templateid;
            ViewBag.Status = Status;
            return View();
        }

        [HttpGet]
        public JsonResult IsProgramExist(string ProgramName,int ProgramId)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var responseTask = client.GetAsync("api/PatientMain/isprogramexist?ProgramName=" + ProgramName.Replace(" ","")+ "&&ProgramId=" + ProgramId);
                responseTask.Wait();
                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var data = result.Content.ReadAsStringAsync().Result;
                    if (data == "0")
                    {
                        var jsonResult = new
                        {
                            programExists = false
                        };
                        return Json(jsonResult, JsonRequestBehavior.AllowGet);
                    }
                else
                    {
                        var jsonResult = new
                        {
                            programExists = true
                        };
                        return Json(jsonResult, JsonRequestBehavior.AllowGet);

                    }
                   
                }
            };

            return Json("");
        }

        [HttpGet]
        public JsonResult GetProgramTemplateByProgramId(int ProgramId)
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
            ProgramtemplateBO data = new ProgramtemplateBO();
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri(WebApiKey);
                //HTTP GET
                var responseTask = client.GetAsync("/api/PatientMain/GetProgramTemplateByProgramId?ProgramId=" + ProgramId);
                responseTask.Wait();

                var result = responseTask.Result;
                if (result.IsSuccessStatusCode)
                {
                    var readTask = result.Content.ReadAsAsync<ProgramtemplateBO>();
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
                var gethtml = System.IO.File.ReadAllText(Server.MapPath("~/App_Data/Templates/ProgramsTemplate/" + PathName));
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
            var ProgramId = Request["ProgramId"];
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
                ProgramFileBO model = new ProgramFileBO()
                {
                    ProgramId = Convert.ToInt32(ProgramId),
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
                    requestUrl = "api/PatientMain/savebaseprogramfiles";
                }
                else
                {
                    requestUrl = "api/PatientMain/saveprogramfiles";
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
            for (int i = 0; i < filesArray.Length; i++)
            {
                path = Path.Combine("/", "Content/ProgramUpload/" + filesArray[i]);
                Paths.Add(path);
            }
            return Json(Paths);
        }
    }



}