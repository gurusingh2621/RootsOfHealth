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
}