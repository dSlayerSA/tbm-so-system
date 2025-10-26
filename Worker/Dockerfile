FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Worker/Worker.csproj", "Worker/"]
COPY ["OrdersApi/OrdersApi.csproj", "OrdersApi/"]
RUN dotnet restore "Worker/Worker.csproj"
COPY . .
RUN dotnet publish "Worker/Worker.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/runtime:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "Worker.dll"]
