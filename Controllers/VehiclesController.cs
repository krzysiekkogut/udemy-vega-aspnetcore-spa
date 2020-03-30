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
    private readonly IVehicleRepository repository;

    public VehiclesController(UdemyVegaDbContext context, IMapper mapper, IVehicleRepository repository)
    {
      this.context = context;
      this.mapper = mapper;
      this.repository = repository;
    }

    [HttpPost]
    public async Task<IActionResult> CreateVehicle([FromBody] SaveVehicleApiDto saveVehicleApiDto)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      var vehicle = mapper.Map<Vehicle>(saveVehicleApiDto);
      vehicle.LastUpdate = DateTime.UtcNow;
      await repository.AddAsync(vehicle);
      await context.SaveChangesAsync();

      vehicle = await repository.GetAsync(vehicle.Id);

      var vehicleResponse = mapper.Map<VehicleApiDto>(vehicle);
      return Ok(vehicleResponse);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateVehicle(int id, [FromBody] SaveVehicleApiDto saveVehicleApiDto)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      var vehicle = await repository.GetAsync(id);
      if (vehicle == null)
      {
        return NotFound();
      }

      mapper.Map<SaveVehicleApiDto, Vehicle>(saveVehicleApiDto, vehicle);
      vehicle.LastUpdate = DateTime.UtcNow;
      await context.SaveChangesAsync();

      vehicle = await repository.GetAsync(id);
      var vehicleResponse = mapper.Map<VehicleApiDto>(vehicle);
      return Ok(vehicleResponse);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVehicle(int id)
    {
      var vehicle = await repository.GetAsync(id, includeRelated: false);
      if (vehicle == null)
      {
        return NotFound();
      }

      repository.Remove(vehicle);
      await context.SaveChangesAsync();
      return Ok(id);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetVehicle(int id)
    {
      var vehicle = await repository.GetAsync(id);
      if (vehicle == null)
      {
        return NotFound();
      }

      var vehicleResponse = mapper.Map<VehicleApiDto>(vehicle);
      return Ok(vehicleResponse);
    }
  }
}