using System.Linq;
using UdemyVega_AspNetCore_Spa.Core.Models;

namespace UdemyVega_AspNetCore_Spa.Persistance
{
  public static class IQueryableVehicleExtensions
  {
    public static IQueryable<Vehicle> ApplyFiltering(this IQueryable<Vehicle> query, VehicleQuery queryObj)
    {

      if (queryObj.MakeId.HasValue)
      {
        query = query.Where(v => v.Model.MakeId == queryObj.MakeId);
      }

      if (queryObj.ModelId.HasValue)
      {
        query = query.Where(v => v.ModelId == queryObj.ModelId);
      }

      return query;
    }
  }
}