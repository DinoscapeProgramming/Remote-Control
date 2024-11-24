Set objNetwork = CreateObject("WScript.Network")
Dim userName
userName = objNetwork.UserName

Set objShell = CreateObject("WScript.Shell")
Set objShellApp = CreateObject("Shell.Application")

If Not WScript.Arguments.Named.Exists("elevated") Then
  objShellApp.ShellExecute "wscript.exe", Chr(34) & WScript.ScriptFullName & Chr(34) & " /elevated", "", "runas", 1
  WScript.Quit
End If

Dim objFSO
Set objFSO = CreateObject("Scripting.FileSystemObject")

Dim programPath
programPath = "C:\Users\" & userName & "\AppData\Local\Programs\Remote Control"
Dim uninstallerPath
uninstallerPath = programPath & "\Uninstall Remote Control.exe"

CloseApplication "Remote Control.exe"
WaitForProcess "Remote Control.exe"

If objFSO.FileExists(uninstallerPath) Then
  objShell.Run Chr(34) & uninstallerPath & Chr(34) & " /S", 0, True
End If

Dim clientDir
clientDir = objFSO.GetParentFolderName(objFSO.GetParentFolderName(objFSO.GetParentFolderName(WScript.ScriptFullName))) & "\client"

If objFSO.FolderExists(clientDir) Then
  objShell.CurrentDirectory = clientDir
Else
  WScript.Quit
End If

Dim nodeModulesPath
nodeModulesPath = clientDir & "\node_modules"

If Not(objFSO.FolderExists(nodeModulesPathDir)) Then
  objShell.Run "cmd /c npm install", 0, True
End If

Dim buildPath
buildPath = clientDir & "\build"

If objFSO.FolderExists(buildPath) Then
  For Each file In objFSO.GetFolder(buildPath).Files
    If LCase(objFSO.GetExtensionName(file.Name)) = "exe" Then
      file.Delete True
    End If
  Next
End If

objShell.Run "cmd /c npm run buildWindows --prod", 0, True

Dim exePath
exePath = buildPath & "\Remote Control Setup 1.0.0.exe"

If objFSO.FileExists(exePath) Then
    objShell.Run "cmd /c " & Chr(34) & exePath & Chr(34) & " /S", 0, True
End If

Sub WaitForProcess(processName)
  Dim objWMIService, colProcesses
  Set objWMIService = GetObject("winmgmts:\\.\root\CIMV2")

  Do
    Set colProcesses = objWMIService.ExecQuery("SELECT * FROM Win32_Process WHERE Name = '" & processName & "'")
    WScript.Sleep 100
  Loop While colProcesses.Count > 0
End Sub

Sub CloseApplication(appName)
  Dim objWMIService, colProcesses, objProcess
  Set objWMIService = GetObject("winmgmts:\\.\root\CIMV2")
  Set colProcesses = objWMIService.ExecQuery("SELECT * FROM Win32_Process WHERE Name = '" & appName & "'")

  If colProcesses.Count = 0 Then
    Exit Sub
  Else
    For Each objProcess In colProcesses
      On Error Resume Next
      objProcess.Terminate
      On Error GoTo 0
    Next
  End If
End Sub

If objFSO.FileExists(programPath & "\Remote Control.exe") Then
  objShell.Run Chr(34) & programPath & "\Remote Control.exe", 0, False
End If

Set objShell = Nothing
Set objFSO = Nothing
Set objNetwork = Nothing
Set objShellApp = Nothing