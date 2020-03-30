using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;

namespace UdemyVega_AspNetCore_Spa.Controllers.Resources
{
  public class SaveVehicleResource
  {
    public int Id { get; set; }

    public int ModelId { get; set; }

    public bool IsRegistered { get; set; }

    [Required]
    public ContactResource Contact { get; set; }

    public ICollection<int> Features { get; set; }
    public SaveVehicleResource()
    {
      Features = new Collection<int>();
    }
  }
}