using Microsoft.EntityFrameworkCore;
using Worker.Data;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Worker;

var builder = Host.CreateDefaultBuilder(args)
    .ConfigureServices((context, services) =>
    {
        services.AddDbContext<OrdersDbContext>(options =>
            options.UseNpgsql(context.Configuration.GetConnectionString("DefaultConnection")));

        // Add the Service Bus processor as a hosted service
        services.AddHostedService<ServiceBusOrderProcessor>();
    })
    .UseConsoleLifetime();

var host = builder.Build();
await host.RunAsync();
