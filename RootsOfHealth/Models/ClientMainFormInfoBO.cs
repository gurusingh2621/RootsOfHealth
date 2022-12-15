using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RootsOfHealth.Models
{
    public class ClientMainFormInfoBO
    {
        public int ClientMainFormId { get; set; }
        public string FormHtml { get; set; }
        public string TableName { get; set; }
        public int TemplateId { get; set; }
        
    }
}