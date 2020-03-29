using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using udemy_vega_aspnetcore_spa.ApiDtos;
using udemy_vega_aspnetcore_spa.Models;
using udemy_vega_aspnetcore_spa.Persistance;

namespace udemy_vega_aspnetcore_spa.Controllers
{
  public class MakesController : Controller
  {
    private readonly UdemyVegaDbContext context;
    private readonly IMapper mapper;

    public MakesController(UdemyVegaDbContext context, IMapper mapper)
    {
      this.context = context;
      this.mapper = mapper;
    }

    [HttpGet("/api/makes")]
    public async Task<IEnumerable<MakeApiDto>> GetMakes()
    {
      var makes = await context.Makes.Include(m => m.Models).ToListAsync();
      return mapper.Map<List<MakeApiDto>>(makes);
    }
  }
}