' Ayurvedic Healthcare Dashboard - Auto-Restart Watchdog
' Pings http://127.0.0.1:4500 every 30s; if the server is down it kills stray node
' and relaunches node server.js in the project folder. Runs hidden at login.

Dim WshShell, Http, Url, Port, AppDir, logFile
Port = 4500
Url = "http://127.0.0.1:" & Port & "/"
AppDir = "D:\ayurvedic-healthcare-dashboard"
logFile = AppDir & "\watchdog.log"
Set WshShell = CreateObject("WScript.Shell")

Sub Log(msg)
  On Error Resume Next
  Dim fso, ts
  Set fso = CreateObject("Scripting.FileSystemObject")
  Set ts = fso.OpenTextFile(logFile, 8, True)
  ts.WriteLine(Now & " - " & msg)
  ts.Close
End Sub

Function IsUp()
  IsUp = False
  On Error Resume Next
  Set Http = CreateObject("MSXML2.XMLHTTP")
  Http.Open "GET", Url, False
  Http.Send
  If Err.Number = 0 Then
    If Http.Status = 200 Then IsUp = True
  End If
  On Error GoTo 0
End Function

Sub StartServer()
  ' Kill any stray/ghost node that is not holding the port
  WshShell.Run "cmd /c taskkill /F /IM node.exe", 0, True
  WshShell.Sleep 2000
  Log "Starting server..."
  WshShell.Run "cmd /c cd /d " & AppDir & " && node server.js", 0, False
  WshShell.Sleep 4000
End Sub

Log "Watchdog started (port " & Port & ")"

' Initial start if not already up
If Not IsUp() Then
  StartServer()
End If

Do
  WshShell.Sleep 30000
  If Not IsUp() Then
    Log "Server DOWN - restarting"
    StartServer()
  End If
Loop
