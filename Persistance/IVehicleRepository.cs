using System.Threading.Tasks;
using udemy_vega_aspnetcore_spa.Models;

namespace udemy_vega_aspnetcore_spa.Persistance
{
  public interface IVehicleRepository
  {
    Task<Vehicle> GetAsync(int id, bool includeRelated = true);
    Task AddAsync(Vehicle vehicle);
    void Remove(Vehicle vehicle);
  }
}