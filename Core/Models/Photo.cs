using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UdemyVega_AspNetCore_Spa.Core.Models
{
  [Table("Photos")]
  public class Photo
  {
    public int Id { get; set; }

    [Required]
    public string FileName { get; set; }
  }
}