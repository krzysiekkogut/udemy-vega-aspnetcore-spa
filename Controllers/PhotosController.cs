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

namespace UdemyVega_AspNetCore_Spa.Controllers
{
  [Route("/api/vehicles/{vehicleId}/photos")]
  public class PhotosController : Controller
  {
    private readonly IWebHostEnvironment host;
    private readonly IVehicleRepository vehicleRepository;
    private readonly IPhotoRepository photoRepository;
    private readonly IMapper mapper;
    private readonly IPhotoService photoService;
    private readonly PhotoSettings photoSettings;

    public PhotosController(
      IWebHostEnvironment host,
      IVehicleRepository vehicleRepository,
      IPhotoRepository photoRepository,
      IMapper mapper,
      IPhotoService photoService,
      IOptionsSnapshot<PhotoSettings> options)
    {
      this.host = host;
      this.vehicleRepository = vehicleRepository;
      this.photoRepository = photoRepository;
      this.mapper = mapper;
      this.photoService = photoService;
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
      var photo = await photoService.UploadPhoto(vehicle, file, uploadsFolderPath);

      return Ok(mapper.Map<PhotoResource>(photo));
    }

    [HttpDelete]
    [Route("{id}")]
    public async Task<IActionResult> DeletePhoto(int vehicleId, int id)
    {
      var photo = await photoRepository.GetPhoto(id);
      if (photo == null)
      {
        return NotFound();
      }

      var uploadsFolderPath = Path.Combine(host.WebRootPath, "uploads");
      await photoService.DeletePhoto(uploadsFolderPath, photo);
      return Ok();
    }
  }
}