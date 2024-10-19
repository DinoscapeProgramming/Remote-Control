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
Dim clientDir
clientDir = objFSO.GetParentFolderName(objFSO.GetParentFolderName(objFSO.GetParentFolderName(WScript.ScriptFullName))) & "\server"

If objFSO.FolderExists(clientDir) Then
    objShell.CurrentDirectory = clientDir
Else
    WScript.Quit
End If

Dim buildPath
buildPath = clientDir & "\build"
Dim exePath
exePath = buildPath & "\Remote Control Setup 1.0.0.exe"

If objFSO.FileExists(exePath) Then
  objShell.Run "cmd /c " & Chr(34) & exePath & Chr(34) & " /S", 0, True
End If

If objFSO.FileExists(programPath & "\Remote Control.exe") Then
  objShell.Run Chr(34) & programPath & "\Remote Control.exe", 0, False
End If

Set objShell = Nothing
Set objFSO = Nothing
Set objNetwork = Nothing
Set objShellApp = Nothing