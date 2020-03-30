using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using udemy_vega_aspnetcore_spa.Models;

namespace udemy_vega_aspnetcore_spa.Persistance
{
  public class VehicleRepository : IVehicleRepository
  {
    private readonly UdemyVegaDbContext context;

    public VehicleRepository(UdemyVegaDbContext context)
    {
      this.context = context;
    }

    public Task<Vehicle> GetAsync(int id, bool includeRelated = true)
    {
      if (!includeRelated)
      {
        return context.Vehicles.FindAsync(id).AsTask();
      }

      return context.Vehicles
        .Include(v => v.Features)
        .ThenInclude(vf => vf.Feature)
        .Include(v => v.Model)
        .ThenInclude(m => m.Make)
        .SingleOrDefaultAsync(v => v.Id == id);
    }

    public async Task AddAsync(Vehicle vehicle)
    {
      await context.AddAsync(vehicle);
    }

    public void Remove(Vehicle vehicle)
    {
      context.Remove(vehicle);
    }
  }
}