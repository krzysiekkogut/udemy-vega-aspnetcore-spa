using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using UdemyVega_AspNetCore_Spa.Core;
using UdemyVega_AspNetCore_Spa.Core.Models;
using UdemyVega_AspNetCore_Spa.Extensions;

namespace UdemyVega_AspNetCore_Spa.Persistance
{
  public class VehicleRepository : IVehicleRepository
  {
    private readonly UdemyVegaDbContext context;

    public VehicleRepository(UdemyVegaDbContext context)
    {
      this.context = context;
    }

    public async Task<QueryResult<Vehicle>> GetAllAsync(VehicleQuery queryObj)
    {
      var result = new QueryResult<Vehicle>();
      var query = context.Vehicles
        .Include(v => v.Features)
        .ThenInclude(vf => vf.Feature)
        .Include(v => v.Model)
        .ThenInclude(m => m.Make)
        .AsQueryable();

      if (queryObj.MakeId.HasValue)
      {
        query = query.Where(v => v.Model.MakeId == queryObj.MakeId);
      }

      if (queryObj.ModelId.HasValue)
      {
        query = query.Where(v => v.ModelId == queryObj.ModelId);
      }

      var columnsMap = new Dictionary<string, Expression<Func<Vehicle, object>>>
      {
        ["make"] = v => v.Model.Make.Name,
        ["model"] = v => v.Model.Name,
        ["contactName"] = v => v.ContactName,
        ["id"] = v => v.Id
      };

      query = query.ApplyOrdering(queryObj, columnsMap);

      result.TotalCount = await query.CountAsync();
      query = query.ApplyPaging(queryObj);
      result.Items = await query.ToListAsync();
      return result;
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