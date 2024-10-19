Set objShell = CreateObject("WScript.Shell")
Set objShellApp = CreateObject("Shell.Application")

If Not WScript.Arguments.Named.Exists("elevated") Then
  objShellApp.ShellExecute "wscript.exe", Chr(34) & WScript.ScriptFullName & Chr(34) & " /elevated", "", "runas", 1
  WScript.Quit
End If

Dim objFSO
Set objFSO = CreateObject("Scripting.FileSystemObject")
Dim serverDir
serverDir = objFSO.GetParentFolderName(objFSO.GetParentFolderName(objFSO.GetParentFolderName(WScript.ScriptFullName))) & "\server"

If objFSO.FolderExists(serverDir) Then
  objShell.CurrentDirectory = serverDir
Else
  WScript.Quit
End If

objShell.Run "cmd /c npm install", 0, True
objShell.Run "cmd /c node . ", 0, True

Set objShell = Nothing
Set objFSO = Nothing
Set objShellApp = Nothing