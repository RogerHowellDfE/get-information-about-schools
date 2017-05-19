﻿using System.Security.Principal;
using System.Threading.Tasks;
using Edubase.Services.Domain;
using System;
using Edubase.Services.Groups.Search;

namespace Edubase.Services.Groups.Downloads
{
    public interface IGroupDownloadService
    {
        Task<DownloadDto> DownloadGroupHistory(int groupUid, DownloadType downloadType, IPrincipal principal);
        Task<SearchDownloadGenerationProgressDto> GetDownloadGenerationProgressAsync(Guid taskId, IPrincipal principal);
        Task<Guid> SearchWithDownloadGenerationAsync(SearchDownloadDto<GroupSearchPayload> payload, IPrincipal principal);
    }
}