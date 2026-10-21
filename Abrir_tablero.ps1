$ErrorActionPreference = 'Stop'
$taskFolder = Split-Path -Parent $MyInvocation.MyCommand.Path
$taskReady = $false
try { $taskReady = (Invoke-RestMethod 'http://127.0.0.1:8766/health').ok } catch {}
if (-not $taskReady) {
  $taskNode = (Get-Command node.exe).Source
  Start-Process -FilePath $taskNode -ArgumentList ('"' + (Join-Path $taskFolder 'servidor-tablero.cjs') + '"') -WorkingDirectory $taskFolder -WindowStyle Hidden
  for ($taskAttempt = 0; $taskAttempt -lt 30; $taskAttempt++) {
    Start-Sleep -Milliseconds 200
    try { if ((Invoke-RestMethod 'http://127.0.0.1:8766/health').ok) { $taskReady = $true; break } } catch {}
  }
}
if (-not $taskReady) { throw 'No fue posible iniciar el tablero en el puerto 8766.' }
Start-Process 'http://127.0.0.1:8766/'
