using System.ComponentModel.DataAnnotations;

namespace UdemyVega_AspNetCore_Spa.Controllers.Resources
{
  public class ContactResource
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