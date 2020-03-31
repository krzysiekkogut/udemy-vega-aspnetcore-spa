namespace UdemyVega_AspNetCore_Spa.Controllers.Resources
{
  public class VehicleQueryResource
  {
    public int? MakeId { get; set; }
    public int? ModelId { get; set; }
    public string SortBy { get; set; }
    public bool IsSortDescending { get; set; }
  }
}