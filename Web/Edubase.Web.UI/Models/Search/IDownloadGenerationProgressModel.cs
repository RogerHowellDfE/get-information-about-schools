﻿using Edubase.Services.Domain;
using Edubase.Services.Enums;

namespace Edubase.Web.UI.Models.Search
{
    public interface IDownloadGenerationProgressModel
    {
        int Step { get; }
        int TotalSteps { get; }
        string DownloadName { get; }
        eFileFormat FileFormat { get; }
        SearchDownloadGenerationProgressDto Progress { get; }
    }
}
