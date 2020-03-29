using System.ComponentModel.DataAnnotations;

namespace udemy_vega_aspnetcore_spa.ApiDtos
{
  public class ContactApiDto
  {
    [Required]
    [StringLength(255)]

    public string Name { get; set; }

    [Required]
    [StringLength(255)]
    public string Phone { get; set; }

    [StringLength(255)]
    public string Email { get; set; }
  }
}