using System.ComponentModel.DataAnnotations;

namespace OrdersApi.Models
{
    public class Order
    {
        [Key]
        public Guid Id { get; set; }
        public string Cliente { get; set; } = default!;
        public string Produto { get; set; } = default!;
        public decimal Valor { get; set; }
        public string Status { get; set; } = "Pendente"; // Pendente, Processando, Finalizado
        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
    }
}
