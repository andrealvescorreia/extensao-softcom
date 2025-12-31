# Script para empacotar a extensão Chrome em arquivo .crx
# Uso: .\build.ps1

Write-Host "=== Empacotando Extensão Chrome ===" -ForegroundColor Cyan

# Configurações
$chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$extensionDir = $PSScriptRoot
$keyPath = "$PSScriptRoot\extension.pem"
$outputDir = "$PSScriptRoot\dist"
$manifestPath = "$PSScriptRoot\manifest.json"

# Verificar se o Chrome existe
if (-not (Test-Path $chromePath)) {
    Write-Host "Chrome não encontrado em: $chromePath" -ForegroundColor Red
    Write-Host "Procurando em locais alternativos..." -ForegroundColor Yellow
    
    $altPaths = @(
        "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
    )
    
    foreach ($path in $altPaths) {
        if (Test-Path $path) {
            $chromePath = $path
            Write-Host "Chrome encontrado em: $chromePath" -ForegroundColor Green
            break
        }
    }
    
    if (-not (Test-Path $chromePath)) {
        Write-Host "Chrome não encontrado. Instale o Google Chrome." -ForegroundColor Red
        exit 1
    }
}

# Ler versão do manifest.json
if (Test-Path $manifestPath) {
    $manifest = Get-Content $manifestPath | ConvertFrom-Json
    $version = $manifest.version
    Write-Host "Versão da extensão: $version" -ForegroundColor Green
} else {
    Write-Host "manifest.json não encontrado!" -ForegroundColor Red
    exit 1
}

# Criar diretório de saída se não existir
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
    Write-Host "Diretório dist/ criado" -ForegroundColor Green
}

# Gerar chave privada se não existir
if (-not (Test-Path $keyPath)) {
    Write-Host "Gerando nova chave privada (extension.pem)..." -ForegroundColor Yellow
    Write-Host "IMPORTANTE: Guarde este arquivo para manter o mesmo ID da extensão!" -ForegroundColor Yellow
}

# Empacotar extensão
Write-Host "Empacotando extensão..." -ForegroundColor Cyan
$packArgs = @(
    "--pack-extension=`"$extensionDir`""
)

if (Test-Path $keyPath) {
    $packArgs += "--pack-extension-key=`"$keyPath`""
}

$process = Start-Process -FilePath $chromePath -ArgumentList $packArgs -PassThru -Wait -NoNewWindow

# Verificar se o .crx foi gerado
$parentDir = Split-Path $extensionDir -Parent
$crxFile = "$parentDir\extensao-softcom.crx"

if (Test-Path $crxFile) {
    # Mover para pasta dist com versão
    $outputFile = "$outputDir\extensao-softcom-v$version.crx"
    Move-Item -Path $crxFile -Destination $outputFile -Force
    
    Write-Host "`n=== Empacotamento Concluído! ===" -ForegroundColor Green
    Write-Host "Arquivo: $outputFile" -ForegroundColor Green
    
    # Mostrar tamanho do arquivo
    $fileSize = (Get-Item $outputFile).Length / 1KB
    Write-Host "Tamanho: $([math]::Round($fileSize, 2)) KB" -ForegroundColor Cyan
    
    # Mover .pem se foi gerado
    $pemFile = "$parentDir\extensao-softcom.pem"
    if ((Test-Path $pemFile) -and (-not (Test-Path $keyPath))) {
        Move-Item -Path $pemFile -Destination $keyPath -Force
        Write-Host "Chave privada salva em: $keyPath" -ForegroundColor Yellow
    }
} else {
    Write-Host "`nErro: Arquivo .crx não foi gerado" -ForegroundColor Red
    Write-Host "Verifique se há erros no manifest.json ou nos arquivos da extensão" -ForegroundColor Yellow
    exit 1
}

Write-Host "`nPara instalar:" -ForegroundColor Cyan
Write-Host "1. Abra chrome://extensions/" -ForegroundColor White
Write-Host "2. Arraste o arquivo .crx para a janela" -ForegroundColor White
Write-Host "   OU" -ForegroundColor White
Write-Host "   Distribua o arquivo para outros usuários" -ForegroundColor White