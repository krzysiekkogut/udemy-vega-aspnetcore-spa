using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace udemy_vega_aspnetcore_spa.ApiDtos
{
  public class MakeApiDto
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public ICollection<ModelApiDto> Models { get; set; }

    public MakeApiDto()
    {
      Models = new Collection<ModelApiDto>();
    }
  }
}