using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UdemyVega_AspNetCore_Spa.Controllers.Resources;
using UdemyVega_AspNetCore_Spa.Core.Models;
using UdemyVega_AspNetCore_Spa.Persistance;

namespace UdemyVega_AspNetCore_Spa.Controllers
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
    public async Task<IEnumerable<MakeResource>> GetMakes()
    {
      var makes = await context.Makes.Include(m => m.Models).ToListAsync();
      return mapper.Map<List<MakeResource>>(makes);
    }
  }
}