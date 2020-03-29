using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;

namespace udemy_vega_aspnetcore_spa.ApiDtos
{
  public class VehicleApiDto
  {
    public int Id { get; set; }

    public int ModelId { get; set; }

    public bool IsRegistered { get; set; }

    [Required]
    public ContactApiDto Contact { get; set; }

    public ICollection<int> Features { get; set; }
    public VehicleApiDto()
    {
      Features = new Collection<int>();
    }
  }
}