<#
.SYNOPSIS
    Bharat Translator - Native Windows PowerShell Web & API Proxy Server
.DESCRIPTION
    Runs an HTTP web server and API proxy on localhost without requiring Node.js.
    Reads .env for API keys and provides /api/translate proxying with UTF-8 encoding.
#>

param(
    [int]$Port = 3000
)

$ErrorActionPreference = "Stop"

# Ensure UTF-8 Console and Output encoding
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# Load .env
$envVars = @{}
$envFile = Join-Path $PSScriptRoot ".env"
if (Test-Path $envFile) {
    Get-Content $envFile -Encoding UTF8 | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#")) {
            $parts = $line.Split('=', 2)
            if ($parts.Length -eq 2) {
                $envVars[$parts[0].Trim()] = $parts[1].Trim()
            }
        }
    }
}

if ($envVars.ContainsKey("PORT") -and $envVars["PORT"]) {
    $Port = [int]$envVars["PORT"]
}

$MimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".ico"  = "image/x-icon"
}

$ItcCodes = @{
    "as" = "as-t-i0-und"; "bn" = "bn-t-i0-und"; "brx" = "hi-t-i0-und"; "doi" = "hi-t-i0-und"
    "gu" = "gu-t-i0-und"; "hi" = "hi-t-i0-und"; "kn" = "kn-t-i0-und"; "ks" = "ur-t-i0-und"
    "kok" = "mr-t-i0-und"; "mai" = "hi-t-i0-und"; "ml" = "ml-t-i0-und"; "mni" = "bn-t-i0-und"
    "mr" = "mr-t-i0-und"; "ne" = "ne-t-i0-und"; "or" = "or-t-i0-und"; "pa" = "pa-t-i0-und"
    "sa" = "sa-t-i0-und"; "sat" = "hi-t-i0-und"; "sd" = "sd-t-i0-und"; "ta" = "ta-t-i0-und"
    "te" = "te-t-i0-und"; "ur" = "ur-t-i0-und"
}

function Invoke-Transliterate($text, $sourceLang) {
    if ($sourceLang -eq "en" -or -not ($text -match "[a-zA-Z]")) { return $text }
    if (-not $ItcCodes.ContainsKey($sourceLang)) { return $text }
    try {
        $itc = $ItcCodes[$sourceLang]
        $encoded = [System.Uri]::EscapeDataString($text)
        $url = "https://inputtools.google.com/request?text=$encoded&itc=$itc&num=1"
        $req = [System.Net.HttpWebRequest]::Create($url)
        $req.Timeout = 5000
        $resp = $req.GetResponse()
        $reader = New-Object System.IO.StreamReader($resp.GetResponseStream(), [System.Text.Encoding]::UTF8)
        $raw = $reader.ReadToEnd()
        $reader.Close()
        $resp.Close()

        $parsed = $raw | ConvertFrom-Json
        if ($parsed[0] -eq "SUCCESS" -and $parsed[1][0][1][0]) {
            return $parsed[1][0][1][0]
        }
    } catch {}
    return $text
}

# Free Google GTX Translation Function with UTF-8 stream decoding
function Invoke-FreeTranslate($text, $sourceLang, $targetLang) {
    try {
        $encoded = [System.Uri]::EscapeDataString($text)
        $url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=$sourceLang&tl=$targetLang&dt=t&q=$encoded"
        
        $req = [System.Net.HttpWebRequest]::Create($url)
        $req.UserAgent = "Mozilla/5.0"
        $req.Timeout = 8000
        $resp = $req.GetResponse()
        $reader = New-Object System.IO.StreamReader($resp.GetResponseStream(), [System.Text.Encoding]::UTF8)
        $rawJson = $reader.ReadToEnd()
        $reader.Close()
        $resp.Close()

        $parsed = $rawJson | ConvertFrom-Json
        $trans = ""
        foreach ($item in $parsed[0]) {
            if ($item[0]) { $trans += $item[0] }
        }

        if ($trans -and $trans.Trim() -ne $text.Trim()) {
            return @{ translatedText = $trans.Trim(); provider = "cloud-gtx" }
        }
    } catch {
        Write-Warning "Free translate failed: $_"
    }
    return $null
}

# Google Cloud Translation
function Invoke-GoogleTranslate($text, $sourceLang, $targetLang, $apiKey) {
    try {
        $url = "https://translation.googleapis.com/language/translate/v2?key=$apiKey"
        $body = @{
            q = $text
            source = $sourceLang
            target = $targetLang
            format = "text"
        } | ConvertTo-Json

        $req = [System.Net.HttpWebRequest]::Create($url)
        $req.Method = "POST"
        $req.ContentType = "application/json; charset=utf-8"
        $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)
        $req.ContentLength = $bodyBytes.Length
        $st = $req.GetRequestStream()
        $st.Write($bodyBytes, 0, $bodyBytes.Length)
        $st.Close()

        $resp = $req.GetResponse()
        $reader = New-Object System.IO.StreamReader($resp.GetResponseStream(), [System.Text.Encoding]::UTF8)
        $resJson = $reader.ReadToEnd() | ConvertFrom-Json
        $reader.Close()
        $resp.Close()

        if ($resJson.data.translations -and $resJson.data.translations.Count -gt 0) {
            return @{ translatedText = $resJson.data.translations[0].translatedText; provider = "google-cloud" }
        }
    } catch {
        Write-Warning "Google Translate failed: $_"
    }
    return $null
}

# Start HTTP Listener
$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    Write-Host "Failed to start on $prefix, trying 127.0.0.1..."
    try { $listener.Close() } catch {}
    $prefix = "http://127.0.0.1:$Port/"
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($prefix)
    $listener.Start()
}

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "Bharat Translator Web Server Running!" -ForegroundColor Yellow
Write-Host "Access URL: $prefix" -ForegroundColor Cyan
Write-Host "API Keys Loaded from .env" -ForegroundColor Gray
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor DarkGray
Write-Host "==========================================================" -ForegroundColor Green

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        try {
            # Add CORS Headers
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            $response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")

            if ($request.HttpMethod -eq "OPTIONS") {
                $response.StatusCode = 204
                $response.Close()
                continue
            }

            # API Route: POST /api/open-chrome
            if ($request.HttpMethod -eq "POST" -and $request.Url.AbsolutePath -eq "/api/open-chrome") {
                $chromePath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
                if (-not (Test-Path $chromePath)) {
                    $chromePath = "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
                }
                if (Test-Path $chromePath) {
                    Start-Process -FilePath $chromePath -ArgumentList "http://localhost:$Port/"
                    $resBytes = [System.Text.Encoding]::UTF8.GetBytes('{"status":"ok","message":"Chrome launched successfully"}')
                } else {
                    $resBytes = [System.Text.Encoding]::UTF8.GetBytes('{"status":"error","message":"Google Chrome not found on system"}')
                }
                $response.ContentType = "application/json; charset=utf-8"
                $response.StatusCode = 200
                $response.OutputStream.Write($resBytes, 0, $resBytes.Length)
                $response.Close()
                continue
            }

            # API Route: POST /api/log
            if ($request.HttpMethod -eq "POST" -and $request.Url.AbsolutePath -eq "/api/log") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $rawBody = $reader.ReadToEnd()
                Add-Content -Path (Join-Path $PSScriptRoot "debug_log.txt") -Value $rawBody -Encoding UTF8
                $okBytes = [System.Text.Encoding]::UTF8.GetBytes('{"status":"ok"}')
                $response.ContentType = "application/json; charset=utf-8"
                $response.StatusCode = 200
                $response.OutputStream.Write($okBytes, 0, $okBytes.Length)
                $response.Close()
                continue
            }

            # API Route: POST /api/translate
            if ($request.HttpMethod -eq "POST" -and $request.Url.AbsolutePath -eq "/api/translate") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $rawBody = $reader.ReadToEnd()
                
                try {
                    $payload = $rawBody | ConvertFrom-Json
                } catch {
                    $errBytes = [System.Text.Encoding]::UTF8.GetBytes('{"error":"Invalid JSON"}')
                    $response.ContentType = "application/json; charset=utf-8"
                    $response.StatusCode = 400
                    $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
                    $response.Close()
                    continue
                }

                $text = $payload.text
                $sourceLang = $payload.sourceLang
                $targetLang = $payload.targetLang

                # 0. Transliterate English slang if source is Indian language (e.g. nuvvu -> నువ్వు)
                $nativeSource = Invoke-Transliterate $text $sourceLang
                $queryText = $nativeSource

                $result = $null

                # If source and target are the same, return pure native script
                if ($sourceLang -eq $targetLang) {
                    $result = @{ translatedText = $nativeSource; sourceTransliterated = $nativeSource; provider = "phonetic-transliteration" }
                } else {
                    # 1. Google Translate API if key provided
                    if ($envVars.ContainsKey("GOOGLE_TRANSLATE_API_KEY") -and $envVars["GOOGLE_TRANSLATE_API_KEY"]) {
                        $result = Invoke-GoogleTranslate $queryText $sourceLang $targetLang $envVars["GOOGLE_TRANSLATE_API_KEY"]
                    }

                    # 2. Free Cloud Fallback (GTX)
                    if (-not $result) {
                        $result = Invoke-FreeTranslate $queryText $sourceLang $targetLang
                    }

                    if ($result) {
                        $result["sourceTransliterated"] = $nativeSource
                    }
                }

                if ($result) {
                    $jsonStr = $result | ConvertTo-Json
                    $jsonBytes = [System.Text.Encoding]::UTF8.GetBytes($jsonStr)
                    $response.ContentType = "application/json; charset=utf-8"
                    $response.StatusCode = 200
                    $response.OutputStream.Write($jsonBytes, 0, $jsonBytes.Length)
                } else {
                    $errBytes = [System.Text.Encoding]::UTF8.GetBytes('{"error":"Translation failed"}')
                    $response.ContentType = "application/json; charset=utf-8"
                    $response.StatusCode = 502
                    $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
                }
                $response.Close()
                continue
            }

            # Static File Route
            $localPath = $request.Url.AbsolutePath.TrimStart('/')
            if (-not $localPath) { $localPath = "index.html" }
            $filePath = Join-Path $PSScriptRoot $localPath

            if (Test-Path $filePath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $mime = "application/octet-stream"
                if ($MimeTypes.ContainsKey($ext)) { $mime = $MimeTypes[$ext] }

                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentType = $mime
                $response.StatusCode = 200
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $response.StatusCode = 404
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 File Not Found")
                $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
            }
            $response.Close()
        } catch {
            Write-Warning "Request processing error: $_"
            try {
                $response.StatusCode = 500
                $response.Close()
            } catch {}
        }
    }
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
}
