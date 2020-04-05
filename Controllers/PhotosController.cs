using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using UdemyVega_AspNetCore_Spa.Controllers.Resources;
using UdemyVega_AspNetCore_Spa.Core;
using UdemyVega_AspNetCore_Spa.Core.Models;
using FileIO = System.IO.File;

namespace UdemyVega_AspNetCore_Spa.Controllers
{
  [Route("/api/vehicles/{vehicleId}/photos")]
  public class PhotosController : Controller
  {
    private readonly IWebHostEnvironment host;
    private readonly IVehicleRepository vehicleRepository;
    private readonly IPhotoRepository photoRepository;
    private readonly IUnitOfWork unitOfWork;
    private readonly IMapper mapper;
    private readonly PhotoSettings photoSettings;

    public PhotosController(
      IWebHostEnvironment host,
      IVehicleRepository vehicleRepository,
      IPhotoRepository photoRepository,
      IUnitOfWork unitOfWork,
      IMapper mapper,
      IOptionsSnapshot<PhotoSettings> options)
    {
      this.host = host;
      this.vehicleRepository = vehicleRepository;
      this.photoRepository = photoRepository;
      this.unitOfWork = unitOfWork;
      this.mapper = mapper;
      this.photoSettings = options.Value;
    }

    [HttpGet]
    public async Task<IEnumerable<PhotoResource>> GetPhotos(int vehicleId)
    {
      var photos = await photoRepository.GetPhotos(vehicleId);
      return mapper.Map<IEnumerable<PhotoResource>>(photos);
    }

    [HttpPost]
    public async Task<IActionResult> Upload(int vehicleId, IFormFile file)
    {
      var vehicle = await vehicleRepository.GetAsync(vehicleId, includeRelated: false);
      if (vehicle == null)
      {
        return NotFound();
      }

      if (file == null || file.Length == 0)
      {
        return BadRequest("Please provide a non empty file.");
      }

      if (file.Length > photoSettings.MaxFileSize)
      {
        return BadRequest("Maximum file size exceeded.");
      }

      if (!photoSettings.IsSupported(file.FileName))
      {
        return BadRequest("Invalid file type.");
      }

      var uploadsFolderPath = Path.Combine(host.WebRootPath, "uploads");
      if (!Directory.Exists(uploadsFolderPath))
      {
        Directory.CreateDirectory(uploadsFolderPath);
      }

      var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
      var filePath = Path.Combine(uploadsFolderPath, fileName);

      using (var stream = new FileStream(filePath, FileMode.CreateNew))
      {
        await file.CopyToAsync(stream);
      }

      var photo = new Photo { FileName = fileName };
      vehicle.Photos.Add(photo);
      await unitOfWork.CompleteAsync();

      return Ok(mapper.Map<PhotoResource>(photo));
    }

    [HttpDelete]
    [Route("{id}")]
    public async Task<IActionResult> DeleteImage(int vehicleId, int id)
    {
      var photo = await photoRepository.GetPhoto(id);
      if (photo == null)
      {
        return NotFound();
      }

      var uploadsFolderPath = Path.Combine(host.WebRootPath, "uploads");
      var filePath = Path.Combine(uploadsFolderPath, photo.FileName);

      photoRepository.Remove(photo);
      await unitOfWork.CompleteAsync();

      FileIO.Delete(filePath);

      return Ok();
    }
  }
}