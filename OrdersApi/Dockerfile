FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["OrdersApi/OrdersApi.csproj", "OrdersApi/"]
RUN dotnet restore "OrdersApi/OrdersApi.csproj"
COPY . .
RUN dotnet publish "OrdersApi/OrdersApi.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS="http://+:5000"
EXPOSE 5000
ENTRYPOINT ["dotnet", "OrdersApi.dll"]
