using System.Linq;
using AutoMapper;
using UdemyVega_AspNetCore_Spa.Controllers.Resources;
using UdemyVega_AspNetCore_Spa.Core.Models;

namespace UdemyVega_AspNetCore_Spa.Mapping
{
  public class MappingProfile : Profile
  {
    public MappingProfile()
    {
      // Domain -> API
      CreateMap<Make, SimpleMakeResource>();
      CreateMap<Make, MakeResource>();
      CreateMap<Model, ModelResource>();
      CreateMap<Feature, FeatureResource>();
      CreateMap<Vehicle, VehicleResource>()
        .ForMember(
          res => res.Make,
          opt => opt.MapFrom(v => v.Model.Make)
        )
        .ForMember(
          res => res.Contact,
          opt => opt.MapFrom(
            v => new ContactResource
            {
              Name = v.ContactName,
              Phone = v.ContactPhone,
              Email = v.ContactEmail
            })
          )
        .ForMember(
          res => res.Features,
          opt => opt.MapFrom(
            v => v.Features.Select(vf => new FeatureResource { Id = vf.Feature.Id, Name = vf.Feature.Name }))
        );
      CreateMap(typeof(QueryResult<>), typeof(QueryResultResource<>));

      // API => Domain
      CreateMap<SaveVehicleResource, Vehicle>()
        .ForMember(v => v.Id, opt => opt.Ignore())
        .ForMember(v => v.ContactName, opt => opt.MapFrom(res => res.Contact.Name))
        .ForMember(v => v.ContactPhone, opt => opt.MapFrom(res => res.Contact.Phone))
        .ForMember(v => v.ContactEmail, opt => opt.MapFrom(res => res.Contact.Email))
        .ForMember(v => v.Features, opt => opt.Ignore())
        .AfterMap((res, v) =>
        {
          // Remove unselected features
          var removedFeatures = v.Features
          .Where(f => !res.Features.Contains(f.FeatureId))
          .ToList();
          foreach (var f in removedFeatures)
          {
            v.Features.Remove(f);
          }

          // Add selected features
          var addedFeatures = res.Features
          .Where(id => !v.Features.Any(f => f.FeatureId == id))
          .Select(id => new VehicleFeature { FeatureId = id })
          .ToList();
          foreach (var f in addedFeatures)
          {
            v.Features.Add(f);
          }
        });
      CreateMap<VehicleQueryResource, VehicleQuery>();
    }
  }
}