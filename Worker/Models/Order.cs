using System.Text.Json.Serialization;

namespace Worker.Models
{
    public class Order
    {
        [JsonPropertyName("OrderId")]
        public Guid Id { get; set; }

        [JsonPropertyName("Cliente")]
        public string Cliente { get; set; } = default!;

        [JsonPropertyName("Produto")]
        public string Produto { get; set; } = default!;

        [JsonPropertyName("Valor")]
        public decimal Valor { get; set; }

        [JsonPropertyName("Status")]
        public string Status { get; set; } = "Pendente";

        [JsonPropertyName("DataCriacao")]
        public DateTime DataCriacao { get; set; }
    }
}
