using Microsoft.EntityFrameworkCore.Migrations;

namespace udemy_vega_aspnetcore_spa.Migrations
{
  public partial class AddFeaturesModel : Migration
  {
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.CreateTable(
          name: "Features",
          columns: table => new
          {
            Id = table.Column<int>(nullable: false)
                  .Annotation("SqlServer:Identity", "1, 1"),
            Name = table.Column<string>(maxLength: 255, nullable: false)
          },
          constraints: table =>
          {
            table.PrimaryKey("PK_Features", x => x.Id);
          });

      migrationBuilder.InsertData("Features", "Name", "Cruise Control");
      migrationBuilder.InsertData("Features", "Name", "Adaptive Cruise Control");
      migrationBuilder.InsertData("Features", "Name", "A/C");
      migrationBuilder.InsertData("Features", "Name", "Auto Dual A/C");
      migrationBuilder.InsertData("Features", "Name", "Android Auto & Apple Car Play");
      migrationBuilder.InsertData("Features", "Name", "Lane Assist");
      migrationBuilder.InsertData("Features", "Name", "Keyless Access");
      migrationBuilder.InsertData("Features", "Name", "Auto Hold");
      migrationBuilder.InsertData("Features", "Name", "HUD");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.DropTable(
          name: "Features");
    }
  }
}
