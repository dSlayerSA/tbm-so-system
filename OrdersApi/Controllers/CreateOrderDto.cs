namespace OrdersApi.Controllers
{
    public class CreateOrderDto
    {
        public string Cliente { get; set; } = default!;
        public string Produto { get; set; } = default!;
        public decimal Valor { get; set; }
    }
}
