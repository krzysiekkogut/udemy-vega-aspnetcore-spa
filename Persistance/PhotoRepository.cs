using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using UdemyVega_AspNetCore_Spa.Core;
using UdemyVega_AspNetCore_Spa.Core.Models;

namespace UdemyVega_AspNetCore_Spa.Persistance
{
  public class PhotoRepository : IPhotoRepository
  {
    private readonly UdemyVegaDbContext context;

    public PhotoRepository(UdemyVegaDbContext context)
    {
      this.context = context;
    }
    public async Task<IEnumerable<Photo>> GetPhotos(int vehicleId)
    {
      return await context.Photos.Where(p => p.VehicleId == vehicleId).ToListAsync();
    }
  }
}