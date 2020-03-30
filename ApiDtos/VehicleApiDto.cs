using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace udemy_vega_aspnetcore_spa.ApiDtos
{
  public class VehicleApiDto
  {
    public int Id { get; set; }

    public ModelApiDto Model { get; set; }

    public SimpleMakeApiDto Make { get; set; }

    public bool IsRegistered { get; set; }

    public ContactApiDto Contact { get; set; }

    public DateTime LastUpdate { get; set; }

    public ICollection<FeatureApiDto> Features { get; set; }

    public VehicleApiDto()
    {
      Features = new Collection<FeatureApiDto>();
    }
  }
}