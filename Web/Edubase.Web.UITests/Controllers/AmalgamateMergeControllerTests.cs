using Edubase.Web.UI.Controllers;
using System.Web.Mvc;
using Edubase.Services.Establishments;
using Edubase.Services.Lookup;
using Moq;
using Xunit;
using System.Threading.Tasks;
using System.Security.Principal;
using Edubase.Services.Domain;
using Edubase.Services.Establishments.Models;
using System.Collections.Generic;
using Edubase.Web.UI.Models.Tools;
using Edubase.Web.UI.Models;

namespace Edubase.Web.UI.Controllers.Tests
{
    public class AmalgamateMergeControllerTests
    {
        private readonly Mock<IEstablishmentReadService> mockEstablishmentReadService = new Mock<IEstablishmentReadService>();
        private readonly Mock<IEstablishmentWriteService> mockEstablishmentWriteService = new Mock<IEstablishmentWriteService>();
        private readonly Mock<ICachedLookupService> mockCachedLookupService = new Mock<ICachedLookupService>();

        private readonly AmalgamateMergeController controller;
        private readonly ServiceResultDto<EstablishmentModel> establishmentServiceResultNull =
            new ServiceResultDto<EstablishmentModel>(eServiceResultStatus.Success);
        private readonly ServiceResultDto<EstablishmentModel> establishmentServiceResultTestEstablishement =
            new ServiceResultDto<EstablishmentModel>(eServiceResultStatus.Success)
            {
                ReturnValue = new EstablishmentModel()
                {
                    Name = "test establishment"
                }
            };

        private ApiResponse<AmalgamateMergeResult, AmalgamateMergeValidationEnvelope[]> amalgamateMergeApiResponse =
            new ApiResponse<AmalgamateMergeResult, AmalgamateMergeValidationEnvelope[]>(true);

        public AmalgamateMergeControllerTests()
        {
            controller = new AmalgamateMergeController(
                mockEstablishmentReadService.Object, mockEstablishmentWriteService.Object, mockCachedLookupService.Object);


            mockEstablishmentReadService.Setup(x => x.GetAsync(It.IsAny<int>(), It.IsAny<IPrincipal>()))
                .ReturnsAsync(establishmentServiceResultNull);
            mockEstablishmentReadService.Setup(x => x.GetAsync(It.IsInRange<int>(100, 110, Range.Inclusive), It.IsAny<IPrincipal>()))
                .ReturnsAsync(establishmentServiceResultTestEstablishement);
            mockEstablishmentWriteService.Setup(x => x.AmalgamateOrMergeAsync(It.IsAny<AmalgamateMergeRequest>(), It.IsAny<IPrincipal>()))
                .ReturnsAsync(amalgamateMergeApiResponse);
        }

        [Fact()]
        public void AmalgamateMergeControllerTest()
        {
            Assert.NotNull(controller);
        }

        [Theory()]
        [InlineData("Merger", "MergeEstablishments")]
        [InlineData("Amalgamation", "AmalgamateEstablishments")]
        public void SelectMergerTypeTest_Redirections(string mergerType, string expectedAction)
        {
            var result = controller.SelectMergerType(mergerType) as RedirectToRouteResult;
            var action = result.RouteValues["action"];

            Assert.NotNull(result);
            Assert.Equal(expectedAction, action);
        }

        [Theory()]
        [InlineData(null)]
        [InlineData("")]
        [InlineData(" ")]
        [InlineData("something-unlikely")]
        public void SelectMergerTypeTest_ErrorAddedIfNotMergerOrAmalagamation(string mergerType)
        {
            var result = controller.SelectMergerType(mergerType) as ViewResult;

            Assert.NotNull(result);
            Assert.True(result.ViewData.ModelState.TryGetValue("MergerType", out var modelState));
            Assert.True(modelState.Errors.Count > 0);
        }

        [Fact()]
        public void AmalgamateEstablishmentsTest()
        {
            var result = controller.AmalgamateEstablishments();
            Assert.IsType<ViewResult>(result);
        }

        [Fact()]
        public void MergeEstablishmentsTest()
        {
            var result = controller.MergeEstablishments();
            Assert.IsType<ViewResult>(result);
        }

        [Theory()]
        [MemberData(nameof(GetProcessMergeEstablishmentsAsyncTestData))]
        public async Task ProcessMergeEstablishmentsAsyncTestAsync(
            bool leadUrnHasErrors,
            bool est1HasErrors,
            bool est2HasErrors,
            bool est3HasErrors,
            int? leadUrn,
            int? est1Urn,
            int? est2Urn,
            int? est3Urn,
            bool successExpected
            )
        {
            var expectedViewName =
                successExpected ? @"~/Views/Tools/Mergers/ConfirmMerger.cshtml" : @"~/Views/Tools/Mergers/MergeEstablishments.cshtml";

            if (leadUrnHasErrors)
            {
                controller.ViewData.ModelState.AddModelError("LeadEstablishmentUrn", "TEST ERROR");
            }

            if (est1HasErrors)
            {
                controller.ViewData.ModelState.AddModelError("Establishment1Urn", "TEST ERROR");
            }

            if (est2HasErrors)
            {
                controller.ViewData.ModelState.AddModelError("Establishment2Urn", "TEST ERROR");
            }

            if (est3HasErrors)
            {
                controller.ViewData.ModelState.AddModelError("Establishment3Urn", "TEST ERROR");
            }

            var model = new MergeEstablishmentsModel()
            {
                LeadEstablishmentUrn = leadUrn,
                Establishment1Urn = est1Urn,
                Establishment2Urn = est2Urn,
                Establishment3Urn = est3Urn
            };

            var result = await controller.ProcessMergeEstablishmentsAsync(model) as ViewResult;
            Assert.NotNull(result);
            Assert.Equal(expectedViewName, result.ViewName);
            Assert.True(successExpected == result.ViewData.ModelState.IsValid);
        }

        public static IEnumerable<object[]> GetProcessMergeEstablishmentsAsyncTestData()
        {
            var allData = new List<object[]>
            {
                new object[] { false, false, false, true, 101, 102, 103, 104, false},
                new object[] { false, false, true, false, 101, 102, 103, 104, false},
                new object[] { false, true, false, false, 101, 102, 103, 104, false},
                new object[] { true, false, false, false, 101, 102, 103, 104, false},
                new object[] { true, true, false, false, 101, 102, 103, 104, false},
                new object[] { true, false, true, false, 101, 102, 103, 104, false},
                new object[] { true, false, false, true, 101, 102, 103, 104, false},
                new object[] { false, true, true, false, 101, 102, 103, 104, false},
                new object[] { false, true, false, true, 101, 102, 103, 104, false},
                new object[] { false, false, true, true, 101, 102, 103, 104, false},
                new object[] { true, true, true, false, 101, 102, 103, 104, false},
                new object[] { true, true, false, true, 101, 102, 103, 104, false},
                new object[] { true, false, true, true, 101, 102, 103, 104, false},
                new object[] { false, true, true, true, 101, 102, 103, 104, false},
                new object[] { true, true, true, true, 101, 102, 103, 104, false},
                new object[] { false, false, false, false, null, null, null, null, false},
                new object[] { false, false, false, false, null, 102, 103, 104, false},
                new object[] { false, false, false, false, 101, null, null, null, false},
                new object[] { false, false, false, false, 1, 2, 3, 4, false},
                new object[] { false, false, false, false, 1, 102, 103, 104, false},
                new object[] { false, false, false, false, 101, 2, 103, 104, false},
                new object[] { false, false, false, false, 101, 102, 3, 104, false},
                new object[] { false, false, false, false, 101, 102, 103, 4, false},
                new object[] { false, false, false, false, 101, 101, 101, 101, false},
                new object[] { false, false, false, false, 101, 101, 103, 104, false},
                new object[] { false, false, false, false, 101, 102, 101, 104, false},
                new object[] { false, false, false, false, 101, 102, 103, 101, false},
                new object[] { false, false, false, false, 101, 102, 102, 104, false},
                new object[] { false, false, false, false, 101, 102, 103, 102, false},
                new object[] { false, false, false, false, 101, 102, 103, 103, false},
                new object[] { false, false, false, false, 101, 102, null, null, true},
                new object[] { false, false, false, false, 101, null, 103, null, true},
                new object[] { false, false, false, false, 101, null, null, 104, true},
                new object[] { false, false, false, false, 101, 102, 103, null, true},
                new object[] { false, false, false, false, 101, null, 103, 104, true},
                new object[] { false, false, false, false, 101, 102, 103, 104, true}
            };
            return allData;
        }

        [Theory()]
        [MemberData(nameof(GetProcessMergeAsyncTestData))]
        public async Task ProcessMergeAsyncTestAsync(
            int? year,
            int? month,
            int? day,
            bool includeLeadEstablishmentUrn,
            bool includeUrns,
            bool errorsInApiResponse,
            bool successExpected)
        {
            var model = new MergeEstablishmentsModel();

            if (year == 0 || month == 0 || day == 0)
            {
                model.MergeDate = new DateTimeViewModel();
            }
            else if (year != null && month != null && day != null)
            {
                model.MergeDate = new DateTimeViewModel { Year = year, Month = month, Day = day, };
            }

            if (includeLeadEstablishmentUrn)
            {
                model.LeadEstablishmentUrn = 100;
            }

            if (includeUrns)
            {
                model.Establishment1Urn = 1;
                model.Establishment2Urn = 2;
                model.Establishment3Urn = 3;
            }

            if (errorsInApiResponse)
            {

                var errors = new List<ApiError> { new ApiError { Code = "T35T", Message = "TEST", Fields = "TESTFIELD" } };
                amalgamateMergeApiResponse.Errors = errors.ToArray();
            }

            var expectedViewName = successExpected ? @"~/Views/Tools/Mergers/MergerComplete.cshtml" : @"~/Views/Tools/Mergers/ConfirmMerger.cshtml";

            var result = await controller.ProcessMergeAsync(model) as ViewResult;

            Assert.NotNull(result);
            Assert.Equal(expectedViewName, result.ViewName);
            Assert.True(successExpected == result.ViewData.ModelState.IsValid);
        }

        public static IEnumerable<object[]> GetProcessMergeAsyncTestData()
        {
            var allData = new List<object[]>
            {
                new object[] { null, null, null, false,  false, false, false },
                new object[] { 0, 0, 0, true, true, false, false },
                new object[] { 2020, 02, 31, true, true, false, false },
                new object[] { 2021, 05, 06, true, false, false, false },
                new object[] { 2021, 05, 06, false, true, false, false },
                new object[] { 2021, 05, 06, true, true, true, false },
                new object[] { 2021, 05, 06, true, true, false, true },
            };
            return allData;
        }

        //[Theory()]
        //public void ProcessAmalgamationEstablishmentsAsyncTest()
        //{
        //    Assert.True(false, "This test needs an implementation");
        //}
    }
}
