using System.Linq;
using AutoMapper;
using udemy_vega_aspnetcore_spa.ApiDtos;
using udemy_vega_aspnetcore_spa.Models;

namespace udemy_vega_aspnetcore_spa.Mapping
{
  public class MappingProfile : Profile
  {
    public MappingProfile()
    {
      // Domain -> API
      CreateMap<Make, SimpleMakeApiDto>();
      CreateMap<Make, MakeApiDto>();
      CreateMap<Model, ModelApiDto>();
      CreateMap<Feature, FeatureApiDto>();
      CreateMap<Vehicle, VehicleApiDto>()
        .ForMember(
          dto => dto.Make,
          opt => opt.MapFrom(v => v.Model.Make)
        )
        .ForMember(
          dto => dto.Contact,
          opt => opt.MapFrom(
            v => new ContactApiDto
            {
              Name = v.ContactName,
              Phone = v.ContactPhone,
              Email = v.ContactEmail
            })
          )
        .ForMember(
          dto => dto.Features,
          opt => opt.MapFrom(
            v => v.Features.Select(vf => new FeatureApiDto { Id = vf.Feature.Id, Name = vf.Feature.Name }))
        );

      // API => Domain
      CreateMap<SaveVehicleApiDto, Vehicle>()
        .ForMember(v => v.Id, opt => opt.Ignore())
        .ForMember(v => v.ContactName, opt => opt.MapFrom(dto => dto.Contact.Name))
        .ForMember(v => v.ContactPhone, opt => opt.MapFrom(dto => dto.Contact.Phone))
        .ForMember(v => v.ContactEmail, opt => opt.MapFrom(dto => dto.Contact.Email))
        .ForMember(v => v.Features, opt => opt.Ignore())
        .AfterMap((dto, v) =>
        {
          // Remove unselected features
          var removedFeatures = v.Features
          .Where(f => !dto.Features.Contains(f.FeatureId))
          .ToList();
          foreach (var f in removedFeatures)
          {
            v.Features.Remove(f);
          }

          // Add selected features
          var addedFeatures = dto.Features
          .Where(id => !v.Features.Any(f => f.FeatureId == id))
          .Select(id => new VehicleFeature { FeatureId = id })
          .ToList();
          foreach (var f in addedFeatures)
          {
            v.Features.Add(f);
          }
        });
    }
  }
}