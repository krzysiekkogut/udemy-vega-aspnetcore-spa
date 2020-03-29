using Microsoft.EntityFrameworkCore;
using udemy_vega_aspnetcore_spa.Models;

namespace udemy_vega_aspnetcore_spa.Persistance
{
  public class UdemyVegaDbContext : DbContext
  {
    public UdemyVegaDbContext(DbContextOptions<UdemyVegaDbContext> options)
    : base(options) { }

    public DbSet<Make> Makes { get; set; }

    public DbSet<Feature> Features { get; set; }
  }
}