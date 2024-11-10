Dim count, shell, packagePath, npmCommand, i

If WScript.Arguments.Count > 0 Then
  Dim arg
  arg = WScript.Arguments(0)
    
  If Left(arg, 9) = "--amount=" Then
    count = Mid(arg, 10)
  Else
    count = ""
  End If
Else
  count = InputBox("Enter the number of ghost updates to publish:", "Ghost Updates")
End If

If Not IsNumeric(count) Or count <= 0 Then
  MsgBox "Please enter a valid positive number."
  WScript.Quit
End If

packagePath = CreateObject("Scripting.FileSystemObject").GetAbsolutePathName(".")

Set shell = CreateObject("WScript.Shell")

For i = 1 To CInt(count)
  shell.CurrentDirectory = packagePath
  npmCommand = "npm version patch --no-git-tag-version"
  shell.Run "cmd.exe /c " & npmCommand, 0, True
  npmCommand = "npm publish --access public"
  shell.Run "cmd.exe /c " & npmCommand, 0, True
  WScript.Sleep 2000
Next

MsgBox "All ghost updates published."

Set shell = Nothing