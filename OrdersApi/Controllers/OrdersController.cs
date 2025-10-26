using Microsoft.AspNetCore.Mvc;
using OrdersApi.Models;
using OrdersApi.Services;
using OrdersApi.Messaging;

namespace OrdersApi.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IMessagePublisher _publisher;
        private readonly ILogger<OrdersController> _logger;

        public OrdersController(IOrderService orderService, IMessagePublisher publisher, ILogger<OrdersController> logger)
        {
            _orderService = orderService;
            _publisher = publisher;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateOrderDto dto)
        {
            var order = new Order
            {
                Cliente = dto.Cliente,
                Produto = dto.Produto,
                Valor = dto.Valor
            };

            try
            {
                var created = await _orderService.CreateAsync(order);

                var payload = new
                {
                    OrderId = created.Id,
                    created.Cliente,
                    created.Produto,
                    created.Valor,
                    created.Status,
                    created.DataCriacao
                };

                _logger.LogInformation("Publishing OrderCreated event for {OrderId}", created.Id);
                await _publisher.PublishOrderCreatedAsync(created.Id, new { CorrelationId = created.Id, EventType = "OrderCreated", Data = payload });
                _logger.LogInformation("Publish call completed for {OrderId}", created.Id);

                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating order");
                return Problem("Could not create order");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _orderService.GetAllAsync();
            return Ok(list);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var order = await _orderService.GetByIdAsync(id);
            if (order == null) return NotFound();
            return Ok(order);
        }
    }
}
