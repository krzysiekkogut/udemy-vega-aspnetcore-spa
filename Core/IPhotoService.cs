using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using UdemyVega_AspNetCore_Spa.Core.Models;

namespace UdemyVega_AspNetCore_Spa.Core
{
  public interface IPhotoService
  {
    Task<Photo> UploadPhoto(Vehicle vehicle, IFormFile file, string uploadsFolderPath);
    Task DeletePhoto(string uploadsFolderPath, Photo photo);
  }
}