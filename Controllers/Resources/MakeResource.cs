using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace UdemyVega_AspNetCore_Spa.Controllers.Resources
{
  public class MakeResource : SimpleMakeResource
  {
    public ICollection<ModelResource> Models { get; set; }

    public MakeResource()
    {
      Models = new Collection<ModelResource>();
    }
  }
}