$ErrorActionPreference = 'Stop'
$webDirectory = Join-Path $PSScriptRoot 'build\web-mobile'
$indexFile = Join-Path $webDirectory 'index.html'
$gameUrl = 'http://127.0.0.1:5000/'

if (-not (Test-Path -LiteralPath $indexFile)) {
    throw "找不到 Web 建置檔案：$indexFile。請先在 Cocos Creator 建置 Web Mobile。"
}

$alreadyRunning = $false
try {
    $response = Invoke-WebRequest -Uri $gameUrl -TimeoutSec 2
    if ($response.Content -match '<title>快樂小雞農場</title>') {
        $alreadyRunning = $true
    } else {
        throw '連接埠 5000 已被其他網站使用。'
    }
} catch [System.Net.WebException] {
    # No server is listening yet; start the local game server below.
} catch {
    if ($_.Exception.Message -match '已被其他網站使用') { throw }
}

if (-not $alreadyRunning) {
    $pythonLauncher = (Get-Command py.exe -ErrorAction Stop).Source
    $serverScript = Join-Path $PSScriptRoot 'tools\serve_nocache.py'
    $serverArguments = '"' + $serverScript + '" 5000 "' + $webDirectory + '"'
    $server = Start-Process -FilePath $pythonLauncher -ArgumentList $serverArguments -WindowStyle Hidden -PassThru

    $ready = $false
    for ($attempt = 0; $attempt -lt 30; $attempt++) {
        Start-Sleep -Milliseconds 300
        try {
            $response = Invoke-WebRequest -Uri $gameUrl -TimeoutSec 1
            if ($response.Content -match '<title>快樂小雞農場</title>') {
                $ready = $true
                break
            }
        } catch {
            # Wait for Python's HTTP server to bind the port.
        }
    }
    if (-not $ready) {
        if (-not $server.HasExited) { Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue }
        throw '本機網站未能在 5000 埠啟動。'
    }
}

Start-Process $gameUrl
