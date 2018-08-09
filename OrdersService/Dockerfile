FROM microsoft/dotnet:2.1-aspnetcore-runtime AS base
WORKDIR /app
EXPOSE 80

FROM microsoft/dotnet:2.1-sdk AS build
WORKDIR /src
COPY OrdersService.csproj ./
COPY ../Messages/Messages.csproj ../Messages/
RUN dotnet restore /OrdersService.csproj
COPY . .
WORKDIR /src/
RUN dotnet build OrdersService.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish OrdersService.csproj -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "OrdersService.dll"]
