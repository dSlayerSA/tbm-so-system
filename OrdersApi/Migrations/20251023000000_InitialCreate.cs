using Microsoft.EntityFrameworkCore.Migrations;

namespace OrdersApi.Migrations;

public partial class InitialCreate : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Orders",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                Cliente = table.Column<string>(type: "text", nullable: false),
                Produto = table.Column<string>(type: "text", nullable: false),
                Valor = table.Column<decimal>(type: "numeric", nullable: false),
                Status = table.Column<string>(type: "text", nullable: false, defaultValue: "Pendente"),
                DataCriacao = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Orders", x => x.Id);
            });
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(
            name: "Orders");
    }
}