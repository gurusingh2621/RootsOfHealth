using RootsOfHealth.Commom;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RootsOfHealth.CustomFilters
{
    public class CustomErrorFilter : FilterAttribute, IExceptionFilter
    {
        public void OnException(ExceptionContext filterContext)
        {
            new Common().LogExceptionToDb(filterContext.Exception);
            filterContext.Result = new ViewResult
            {
               ViewName = "Error"
            };
            filterContext.ExceptionHandled = true;
        }
    }
    public class SessionTimeoutAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            HttpContext ctx = HttpContext.Current;
            if (HttpContext.Current.Session["userid"] == null)
            {
                filterContext.Result = new RedirectResult("~/Account/Login");
                return;
            }
            base.OnActionExecuting(filterContext);
        }
    }
}