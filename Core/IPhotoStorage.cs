using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace UdemyVega_AspNetCore_Spa.Core
{
  public interface IPhotoStorage
  {
    Task<string> StorePhoto(string path, IFormFile file);
    void DeletePhoto(string path);
  }
}