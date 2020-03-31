using UdemyVega_AspNetCore_Spa.Extensions;

namespace UdemyVega_AspNetCore_Spa.Core.Models
{
  public class VehicleQuery : IQueryObject
  {
    public int? MakeId { get; set; }
    public int? ModelId { get; set; }
    public string SortBy { get; set; }
    public bool IsSortDescending { get; set; }
  }
}