using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using UdemyVega_AspNetCore_Spa.Core.Models;

namespace UdemyVega_AspNetCore_Spa.Core
{
  public class PhotoService : IPhotoService
  {
    private readonly IPhotoRepository photoRepository;
    private readonly IPhotoStorage photoStorage;
    private readonly IUnitOfWork unitOfWork;
    public PhotoService(IPhotoRepository photoRepository, IPhotoStorage photoStorage, IUnitOfWork unitOfWork)
    {
      this.photoRepository = photoRepository;
      this.photoStorage = photoStorage;
      this.unitOfWork = unitOfWork;
    }

    public async Task<Photo> UploadPhoto(Vehicle vehicle, IFormFile file, string uploadsFolderPath)
    {
      var fileName = await photoStorage.StorePhoto(uploadsFolderPath, file);
      var photo = new Photo { FileName = fileName };
      vehicle.Photos.Add(photo);
      await unitOfWork.CompleteAsync();

      return photo;
    }


    public async Task DeletePhoto(string uploadsFolderPath, Photo photo)
    {
      var filePath = Path.Combine(uploadsFolderPath, photo.FileName);

      photoRepository.Remove(photo);
      await unitOfWork.CompleteAsync();

      photoStorage.DeletePhoto(filePath);
    }
  }
}