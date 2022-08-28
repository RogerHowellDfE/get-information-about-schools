using System.Collections.Generic;
using Edubase.Services.Enums;

namespace Edubase.Web.UI.Models.Guidance
{
    public class GuidanceLaNameCodeViewModel
    {
        public string DownloadType { get; set; }
        // public string DownloadName { get; set; } = "guidance";
        public eFileFormat? FileFormat { get; set; }
        public List<LaNameCodes> EnglishLas { get; set; }
        public List<LaNameCodes> WelshLas { get; set; }
        public List<LaNameCodes> OtherLas { get; set; }
    }
}
