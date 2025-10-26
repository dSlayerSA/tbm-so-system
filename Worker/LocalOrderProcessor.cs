using Microsoft.EntityFrameworkCore;
using Worker.Data;

namespace Worker
{
    public class LocalOrderProcessor : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<LocalOrderProcessor> _logger;

    public LocalOrderProcessor(
        IServiceScopeFactory scopeFactory,
        ILogger<LocalOrderProcessor> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessPendingOrders(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing pending orders");
            }

            // Poll a cada 2 segundos
            await Task.Delay(TimeSpan.FromSeconds(2), stoppingToken);
        }
    }

    private async Task ProcessPendingOrders(CancellationToken stoppingToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<OrdersDbContext>();

        var pendingOrders = await db.Orders
            .Where(o => o.Status == "Pendente")
            .ToListAsync(stoppingToken);

        foreach (var order in pendingOrders)
        {
            _logger.LogInformation("Processando pedido {OrderId}", order.Id);
            
            // Atualizar para Processando
            order.Status = "Processando";
            await db.SaveChangesAsync(stoppingToken);

            // Simular processamento
            await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);

            // Atualizar para Finalizado
            order.Status = "Finalizado";
            await db.SaveChangesAsync(stoppingToken);

            _logger.LogInformation("Pedido {OrderId} finalizado", order.Id);
        }
    }
}}