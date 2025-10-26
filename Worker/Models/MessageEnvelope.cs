using System.Text.Json;
using System.Text.Json.Serialization;

namespace Worker.Models
{
    public class MessageEnvelope
    {
        [JsonPropertyName("correlationId")]
        public string CorrelationId { get; set; } = default!;

        [JsonPropertyName("eventType")]
        public string EventType { get; set; } = default!;

        [JsonPropertyName("data")]
        public JsonElement Data { get; set; } = default!;
    }
}