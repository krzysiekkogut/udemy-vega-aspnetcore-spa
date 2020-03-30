using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UdemyVega_AspNetCore_Spa.Controllers.Resources;
using UdemyVega_AspNetCore_Spa.Persistance;

namespace UdemyVega_AspNetCore_Spa.Controllers
{
  public class FeaturesController : Controller
  {
    private readonly IMapper mapper;
    private readonly UdemyVegaDbContext context;

    public FeaturesController(UdemyVegaDbContext context, IMapper mapper)
    {
      this.context = context;
      this.mapper = mapper;
    }

    [HttpGet("api/features")]
    public async Task<IEnumerable<FeatureResource>> GetFeatures()
    {
      var features = await context.Features.ToListAsync();
      return mapper.Map<List<FeatureResource>>(features);
    }
  }
}