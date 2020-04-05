using System.Collections.Generic;
using System.Threading.Tasks;
using UdemyVega_AspNetCore_Spa.Core.Models;

namespace UdemyVega_AspNetCore_Spa.Core
{
  public interface IPhotoRepository
  {
    Task<IEnumerable<Photo>> GetPhotos(int vehicleId);
  }
}