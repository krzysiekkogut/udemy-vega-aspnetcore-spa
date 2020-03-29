using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace udemy_vega_aspnetcore_spa.Models
{
  [Table("Features")]
  public class Feature
  {
    public int Id { get; set; }

    [Required]
    [StringLength(255)]
    public string Name { get; set; }
  }
}