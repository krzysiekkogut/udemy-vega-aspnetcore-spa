using System.Collections.Generic;
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
      CreateMap<Make, MakeApiDto>();
      CreateMap<Model, ModelApiDto>();
      CreateMap<Feature, FeatureApiDto>();
      CreateMap<Vehicle, VehicleApiDto>()
        .ForMember(
          vApiDto => vApiDto.Contact,
          opt => opt.MapFrom(
            v => new ContactApiDto
            {
              Name = v.ContactName,
              Phone = v.ContactPhone,
              Email = v.ContactEmail
            }
            )
          )
          .ForMember(
            vApiDto => vApiDto.Features,
            opt => opt.MapFrom(v => v.Features.Select(f => f.FeatureId))
          );

      // API => Domain
      CreateMap<VehicleApiDto, Vehicle>()
        .ForMember(v => v.Id, opt => opt.Ignore())
        .ForMember(v => v.ContactName, opt => opt.MapFrom(vApiDto => vApiDto.Contact.Name))
        .ForMember(v => v.ContactPhone, opt => opt.MapFrom(vApiDto => vApiDto.Contact.Phone))
        .ForMember(v => v.ContactEmail, opt => opt.MapFrom(vApiDto => vApiDto.Contact.Email))
        .ForMember(v => v.Features, opt => opt.Ignore())
        .AfterMap((vApiDto, v) =>
        {
          // Remove unselected features
          var removedFeatures = v.Features
            .Where(f => !vApiDto.Features.Contains(f.FeatureId))
            .ToList();
          foreach (var f in removedFeatures)
          {
            v.Features.Remove(f);
          }

          // Add selected features
          var addedFeatures = vApiDto.Features
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