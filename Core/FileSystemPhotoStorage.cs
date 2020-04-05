using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace UdemyVega_AspNetCore_Spa.Core
{
  public class FileSystemPhotoStorage : IPhotoStorage
  {
    public async Task<string> StorePhoto(string path, IFormFile file)
    {
      if (!Directory.Exists(path))
      {
        Directory.CreateDirectory(path);
      }

      var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
      var filePath = Path.Combine(path, fileName);

      using (var stream = new FileStream(filePath, FileMode.CreateNew))
      {
        await file.CopyToAsync(stream);
      }

      return fileName;
    }

    public void DeletePhoto(string path)
    {
      File.Delete(path);
    }
  }
}