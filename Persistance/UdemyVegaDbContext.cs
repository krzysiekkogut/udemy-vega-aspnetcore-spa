using Microsoft.EntityFrameworkCore;
using udemy_vega_aspnetcore_spa.Models;

namespace udemy_vega_aspnetcore_spa.Persistance
{
  public class UdemyVegaDbContext : DbContext
  {
    public DbSet<Make> Makes { get; set; }
    public DbSet<Model> Models { get; set; }
    public DbSet<Feature> Features { get; set; }
    public DbSet<Vehicle> Vehicles { get; set; }

    public UdemyVegaDbContext(DbContextOptions<UdemyVegaDbContext> options)
    : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
      modelBuilder.Entity<VehicleFeature>().HasKey(vf => new { vf.VehicleId, vf.FeatureId });
    }
  }
}