using System.Threading.Tasks;
using UdemyVega_AspNetCore_Spa.Core.Models;

namespace UdemyVega_AspNetCore_Spa.Core
{
  public interface IVehicleRepository
  {
    Task<Vehicle> GetAsync(int id, bool includeRelated = true);
    Task AddAsync(Vehicle vehicle);
    void Remove(Vehicle vehicle);
  }
}