using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using UdemyVega_AspNetCore_Spa.Controllers.Resources;
using UdemyVega_AspNetCore_Spa.Core;
using UdemyVega_AspNetCore_Spa.Core.Models;

namespace UdemyVega_AspNetCore_Spa.Controllers
{
  [Route("/api/vehicles")]
  public class VehiclesController : Controller
  {
    private readonly IUnitOfWork unitOfWork;
    private readonly IMapper mapper;
    private readonly IVehicleRepository repository;

    public VehiclesController(
      IMapper mapper,
      IVehicleRepository repository,
      IUnitOfWork unitOfWork)
    {
      this.mapper = mapper;
      this.repository = repository;
      this.unitOfWork = unitOfWork;
    }

    [HttpPost]
    public async Task<IActionResult> CreateVehicle([FromBody] SaveVehicleResource saveVehicleResource)
    {
      if (!ModelState.IsValid)
      {
        return BadRequest(ModelState);
      }

      var vehicle = mapper.Map<Vehicle>(saveVehicleResource);
      vehicle.LastUpdate = DateTime.UtcNow;
      await repository.AddAsync(vehicle);
      await unitOfWork.CompleteAsync();

      vehicle = await repository.GetAsync(vehicle.Id);

      var vehicleResponse = mapper.Map<VehicleResource>(vehicle);
      return Ok(vehicleResponse);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateVehicle(int id, [FromBody] SaveVehicleResource saveVehicleResource)
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

      mapper.Map<SaveVehicleResource, Vehicle>(saveVehicleResource, vehicle);
      vehicle.LastUpdate = DateTime.UtcNow;
      await unitOfWork.CompleteAsync();

      vehicle = await repository.GetAsync(id);
      var vehicleResponse = mapper.Map<VehicleResource>(vehicle);
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
      await unitOfWork.CompleteAsync();
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

      var vehicleResponse = mapper.Map<VehicleResource>(vehicle);
      return Ok(vehicleResponse);
    }

    [HttpGet]
    public async Task<IActionResult> GetVehicles()
    {
      var vehicles = await repository.GetAllAsync();
      var vehiclesResponse = mapper.Map<ICollection<VehicleResource>>(vehicles);
      return Ok(vehiclesResponse);
    }
  }
}