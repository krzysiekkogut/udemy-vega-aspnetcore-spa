using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using udemy_vega_aspnetcore_spa.ApiDtos;
using udemy_vega_aspnetcore_spa.Persistance;

namespace udemy_vega_aspnetcore_spa.Controllers
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
    public async Task<IEnumerable<FeatureApiDto>> GetFeatures()
    {
      var features = await context.Features.ToListAsync();
      return mapper.Map<List<FeatureApiDto>>(features);
    }
  }
}