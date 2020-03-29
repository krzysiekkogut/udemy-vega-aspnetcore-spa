using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using udemy_vega_aspnetcore_spa.ApiDtos;
using udemy_vega_aspnetcore_spa.Models;
using udemy_vega_aspnetcore_spa.Persistance;

namespace udemy_vega_aspnetcore_spa.Controllers
{
  [Route("/api/vehicles")]
  public class VehiclesController : Controller
  {
    private readonly UdemyVegaDbContext context;
    private readonly IMapper mapper;

    public VehiclesController(UdemyVegaDbContext context, IMapper mapper)
    {
      this.context = context;
      this.mapper = mapper;
    }

    [HttpPost]
    public async Task<IActionResult> CreateVehicle([FromBody] VehicleApiDto vehicleApiDto)
    {
      var vehicle = mapper.Map<Vehicle>(vehicleApiDto);
      vehicle.LastUpdate = DateTime.UtcNow;
      await context.Vehicles.AddAsync(vehicle);
      await context.SaveChangesAsync();
      var vehicleResponse = mapper.Map<VehicleApiDto>(vehicle);
      return Ok(vehicleResponse);
    }
  }
}