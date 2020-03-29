using System;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      // Could be removed as only client of API is React App.
      // It stays, however, to demo custom model validation.
      var model = await context.Models.FindAsync(vehicleApiDto.ModelId);
      if (model == null)
      {
        ModelState.AddModelError("ModelId", "Invalid model ID");
        return BadRequest(ModelState);
      }

      var vehicle = mapper.Map<Vehicle>(vehicleApiDto);
      vehicle.LastUpdate = DateTime.UtcNow;
      await context.Vehicles.AddAsync(vehicle);
      await context.SaveChangesAsync();
      var vehicleResponse = mapper.Map<VehicleApiDto>(vehicle);
      return Ok(vehicleResponse);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateVehicle(int id, [FromBody] VehicleApiDto vehicleApiDto)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      var vehicle = await context.Vehicles.Include(v => v.Features).SingleOrDefaultAsync(v => v.Id == id);

      if (vehicle == null)
      {
        return NotFound();
      }

      mapper.Map<VehicleApiDto, Vehicle>(vehicleApiDto, vehicle);
      vehicle.LastUpdate = DateTime.UtcNow;
      await context.SaveChangesAsync();
      var vehicleResponse = mapper.Map<VehicleApiDto>(vehicle);
      return Ok(vehicleResponse);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVehicle(int id)
    {
      var vehicle = await context.Vehicles.FindAsync(id);
      if (vehicle == null)
      {
        return NotFound();
      }

      context.Remove(vehicle);
      await context.SaveChangesAsync();
      return Ok(id);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetVehicle(int id)
    {
      var vehicle = await context.Vehicles.Include(v => v.Features).SingleOrDefaultAsync(v => v.Id == id);
      if (vehicle == null)
      {
        return NotFound();
      }

      var vehicleResponse = mapper.Map<VehicleApiDto>(vehicle);
      return Ok(vehicleResponse);
    }
  }
}