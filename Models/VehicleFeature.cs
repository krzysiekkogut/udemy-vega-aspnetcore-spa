using System.ComponentModel.DataAnnotations.Schema;

namespace udemy_vega_aspnetcore_spa.Models
{
  [Table("VehicleFeatures")]
  public class VehicleFeature
  {
    public int VehicleId { get; set; }
    public Vehicle Vehicle { get; set; }
    public int FeatureId { get; set; }
    public Feature Feature { get; set; }
  }
}